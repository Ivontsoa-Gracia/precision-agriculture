// stores/language.ts
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    lang: 'en' as string, // langue par défaut
  }),
  actions: {
    setLang(newLang: string) {
      this.lang = newLang
    },
  },
})
