import { defineStore } from "pinia";
import { getImages } from "@/services";

export const useImageStore = defineStore("imageStore", {
  state: () => ({
    images: [],
  }),
  actions: {
    async getImages(query, number) {
      this.images = await getImages(query, number);
    },
  },
  getters: {
    imageCount: (state) => state.images.length,
  },
});
