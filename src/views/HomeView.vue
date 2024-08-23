<template>
  <div>
    <SpinnerComponentVue :show="loading" />
    <header>
      <h1>Vendedores ¡a correr!</h1>
    </header>
    <main>
      <div v-if="!gameStarted" class="start-screen">
        <h2>¿Ayudanos a encontrar las imagenes más interesantes de la web!</h2>
        <p>Ingresa una palabra para comenzar a buscar imágenes.</p>
        <p>
          Nuestros vendedores te mostraran algunas imagenes respecto a tu
          busqueda, <b>¡Elije tu favorita!</b>
        </p>
        <div class="search-container">
          <input
            v-model="searchTerm"
            @keyup.enter="startGame"
            placeholder="Ingresa una palabra para buscar imágenes"
          />
          <button @click="startGame" :disabled="!searchTerm">
            Iniciar Juego
          </button>
        </div>
      </div>

      <div v-if="gameStarted" class="game-container">
        <div v-if="showSearchInput && !winner" class="search-container">
          <input
            v-model="searchTerm"
            @keyup.enter="searchImages"
            placeholder="Ingresa una nueva palabra para buscar"
          />
          <button @click="searchImages" :disabled="!searchTerm">Buscar</button>
        </div>

        <transition-group name="image-list" tag="div" class="image-container">
          <ImageCard
            v-for="(seller, index) in sellers"
            v-show="!winner || winner == seller.id"
            :key="seller.id"
            :sellerId="seller.id"
            :sellerName="seller.name"
            :imageUrl="images[index]?.link"
            :altText="images[index]?.title"
            :isSelected="selectedImage === seller.id"
            :disabled="!!winner || showSearchInput"
            @select-image="selectFavoriteImage"
          />
        </transition-group>

        <div v-if="winner" class="winner-info">
          <h2>
            ¡Felicidades {{ sellerStore.getSellerNameById(winner) }}! Has ganado
            con esta imagen.
          </h2>
          <p>Puntuación final: {{ totalScore }} puntos</p>
          <button @click="handleInvoice" class="reset-button">
            Generar Factura
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ImageCard from "@/components/ImageCard.vue";
import SpinnerComponentVue from "@/components/SpinnerComponent.vue";
import confetti from "canvas-confetti";
import { mapState } from "pinia";
import { useImageStore } from "@/stores/imageStore";
import { useSellerStore } from "@/stores/sellerStore";
import { createInvoice } from "@/services";

export default {
  name: "HomeView",
  components: {
    ImageCard,
    SpinnerComponentVue,
  },
  created() {
    this.sellerStore.getSellers();
  },
  data() {
    return {
      loading: false,
      searchTerm: "",
      selectedImage: null,
      winner: null,
      gameStarted: false,
      showSearchInput: false,
      imageStore: useImageStore(),
      sellerStore: useSellerStore(),
      invoce: {
        client: null,
        date: null,
        dueDate: null,
        items: [],
        seller: null,
        paymentMethod: "cash",
      },
    };
  },
  computed: {
    ...mapState(useImageStore, {
      images: "images",
      imageCount: "imageCount",
    }),
    ...mapState(useSellerStore, {
      sellers: "sellers",
      sellersCount: "sellersCount",
      totalScore: "totalScore",
    }),
  },
  methods: {
    async startGame() {
      if (this.searchTerm) {
        await this.searchImages();
        this.gameStarted = true;
      }
    },
    async searchImages() {
      this.loading = true;
      await this.imageStore.getImages(this.searchTerm, this.sellersCount);
      if (this.imageCount == 0 || this.sellersCount == 0)
        this.$router.push({ name: "error" });
      this.showSearchInput = false;
      this.selectedImage = null;
      this.loading = false;
    },
    selectFavoriteImage(sellerId, score) {
      this.selectedImage = sellerId;
      this.searchTerm = "";
      this.sellerStore.updateSellerScore(sellerId, score);

      if (score >= process.env.VUE_APP_POINTS_TO_WIN) {
        this.winner = sellerId;
        this.triggerWinnerConfetti();
      } else {
        this.showSearchInput = true;
      }
    },
    triggerWinnerConfetti() {
      confetti({
        particleCount: 200,
        spread: 70,
      });
    },
    resetGame() {
      this.searchTerm = "";
      this.images = [];
      this.selectedImage = null;
      this.winner = null;
      this.gameStarted = false;
      this.showSearchInput = false;
      this.sellerStore.resetAllScores();
    },
    getFormattedDate(date) {
      let year = date.getFullYear();
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = ("0" + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    async handleInvoice() {
      this.loading = true;
      const today = new Date();
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 1);
      this.invoce.date = this.getFormattedDate(today);
      this.invoce.dueDate = this.getFormattedDate(dueDate);
      this.invoce.client = 2;
      this.invoce.items = [
        {
          id: 1,
          price: this.totalScore,
          quantity: 1,
          name: "Premio imagenes del mundo",
        },
      ];
      this.invoce.seller = this.winner;

      const res = await createInvoice(this.invoce);

      this.sellerStore.setInvoice(res);
      this.$router.push({ name: "about" });
      this.loading = false;
    },
  },
};
</script>

<style>
body {
  font-family: "Arial", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #2c3e50;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.start-screen {
  text-align: center;
  color: white;
  background-color: rgba(7, 194, 177, 0.8);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

input {
  padding: 10px 15px;
  font-size: 1em;
  border: none;
  border-radius: 25px 0 0 25px;
  width: 300px;
  outline: none;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 0 25px 25px 0;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.reset-button {
  margin-top: 20px;
  border-radius: 25px;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  position: relative;
}

.image-list-enter-active,
.image-list-leave-active {
  transition: opacity 1s ease, transform 0.8s ease;
}

.image-list-enter-from,
.image-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.image-list-enter-to,
.image-list-leave-from {
  opacity: 1;
  transform: scale(1);
}

.image-list-move {
  transition: transform 0.8s ease;
}

.winner-info {
  text-align: center;
  margin-top: 20px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards 0.5s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.winner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 30px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.winner-container h2 {
  margin-top: 20px;
  color: #2c3e50;
}

.winner-container p {
  font-size: 1.2em;
  color: #34495e;
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  .search-container {
    flex-direction: column;
    align-items: center;
  }

  input,
  button {
    width: 100%;
    max-width: 300px;
    border-radius: 25px;
    margin-bottom: 10px;
  }
}
</style>
