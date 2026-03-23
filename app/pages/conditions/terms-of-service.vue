<template>
  <div class="min-h-screen py-6 sm:py-14 px-2 sm:px-6 md:px-20">
    <div class="max-w-5xl mx-auto p-8 md:p-12 bg-white border border-gray-200 rounded-2xl">
      <router-link
        to="/help"
        class="inline-block mb-6 menu-item hover:underline"
      >
        ← {{ t("back") }}
      </router-link>

      <h2 class=" mb-2">{{ t("terms") }}</h2>
      <p class="text-gray-400 small text-sm mb-10">{{ t("termsDate") }}</p>

      <section class="mb-10" v-for="i in 7" :key="i">
        <h3
          class="subtitle mb-3"
          v-html="t(`terms${i}Title`)"
        ></h3>
        <p
          class="leading-relaxed content"
          v-html="t(`terms${i}Text`)"
        ></p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);
</script>
