<template>
  <div
    class="image-card"
    :class="{ selected: isSelected, disabled: disabled }"
    @click="selectImage"
    ref="card"
  >
    <div class="image-wrapper">
      <img :src="imageUrl" :alt="altText" />
    </div>
    <div class="info-container">
      <div class="seller-info">
        <span class="seller-name">{{ sellerName }}</span>
        <span class="seller-id">ID: {{ sellerId }}</span>
      </div>
      <div class="score-container">
        <div class="score">Puntos: {{ score }}</div>
        <div class="points-to-win">Faltan: {{ remainingPoints }} pts</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageCard",
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    sellerId: {
      type: Number,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      default: "Imagen",
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    score: 0,
  }),
  computed: {
    remainingPoints() {
      return Math.max(
        0,
        Number.parseInt(process.env.VUE_APP_POINTS_TO_WIN) - this.score
      );
    },
  },
  methods: {
    addScore() {
      this.score += Number.parseInt(process.env.VUE_APP_POINTS_PER_ROUND);
    },
    selectImage() {
      if (!this.disabled) {
        this.addScore();
        this.$emit("select-image", this.sellerId, this.score);
      }
    },
  },
};
</script>

<style scoped>
.image-card {
  width: 250px;
  height: 350px;
  display: flex;
  flex-direction: column;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 15px;
  margin: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.image-card::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: transparent;
  border-radius: 14px;
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  opacity: 0;
  transition: all 0.3s ease;
}

.image-card.selected::before {
  opacity: 1;
  animation: glow 1s ease-in-out;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.7);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.image-card:hover:not(.disabled):not(.selected) {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f0f0f0;
}

.image-card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
}

.image-card:hover:not(.disabled):not(.selected) img {
  transform: scale(1.05);
}

.info-container {
  margin-top: 10px;
}

.seller-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.seller-name {
  font-weight: bold;
  font-size: 0.9em;
}

.seller-id {
  font-size: 0.8em;
  color: #666;
}

.score-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score,
.points-to-win {
  font-weight: bold;
  text-align: center;
  background-color: #f0f0f0;
  padding: 5px;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.points-to-win {
  background-color: #e0e0e0;
}

.image-card:hover:not(.disabled):not(.selected) .score,
.image-card:hover:not(.disabled):not(.selected) .points-to-win {
  background-color: #4caf50;
  color: white;
}

.image-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.image-card.disabled:hover {
  transform: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.image-card.selected {
  opacity: 1;
  box-shadow: 0 0 0 3px gold, 0 0 20px 5px rgba(255, 215, 0, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 3px gold, 0 0 20px 5px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px gold, 0 0 25px 8px rgba(255, 215, 0, 0.5);
  }
  100% {
    box-shadow: 0 0 0 3px gold, 0 0 20px 5px rgba(255, 215, 0, 0.5);
  }
}
</style>
