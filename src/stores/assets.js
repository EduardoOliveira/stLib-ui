import { defineStore } from "pinia";
import axios from "axios";

export const useAssetsStore = defineStore({
  id: "assets",
  state: () => ({
    selectedAsset: {
        asset_type: "",
        name: "",
        sha1: "",
    },
  }),
  getters: {
    getSelectedAsset: (state) => state.selectedAsset,
  },
  actions: {
    setSelectedAsset(asset) {
      this.selectedAsset = asset;
    },
    async deleteAsset(sha1){
      const response = await axios.post(`/assets/${sha1}/delete`);
      //let p = response.data;
    },
    async saveAsset(asset){
      console.log(asset);
      const response = await axios.post(`/assets/${asset.sha1}`, asset);
      //let p = response.data;
    }
  },
});
