import { defineStore } from "pinia";
import { getSellers } from "@/services";

export const useSellerStore = defineStore("sellerStore", {
  state: () => ({
    sellers: [],
    invoice: {},
  }),
  actions: {
    async getSellers() {
      this.sellers = await getSellers();
    },
    updateSellerScore(sellerId, newScore) {
      const seller = this.sellers.find((seller) => seller.id === sellerId);
      if (seller) {
        seller.score = newScore;
      }
    },
    resetAllScores() {
      this.sellers.forEach((seller) => {
        seller.score = 0;
      });
    },
    getSellerNameById(sellerId) {
      const seller = this.sellers.find((seller) => seller.id === sellerId);
      return seller ? seller.name : null;
    },
    setInvoice(invoice) {
      this.invoice = invoice;
    },
  },
  getters: {
    sellersCount: (state) => state.sellers.length,
    totalScore: (state) => {
      return state.sellers.reduce(
        (total, seller) => total + (seller.score || 0),
        0
      );
    },
  },
});
