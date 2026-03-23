<template>
  <div class="min-h-screen py-6 sm:py-14 px-2 sm:px-6 md:px-20">
    <div class="max-w-5xl mx-auto p-8 md:p-12 bg-white border border-gray-200 rounded-2xl">
      <router-link
        to="/help"
        class="inline-block mb-6 menu-item hover:underline"
      >
        ← {{ t("back") }}
      </router-link>

      <h2 class=" mb-2">{{ t("policy") }}</h2>
      <p class="text-gray-400 small text-sm mb-10">{{ t("policyDate") }}</p>

      <section class="mb-10" v-for="i in 7" :key="i">
        <h2
          class="subtitle mb-3"
          v-html="t(`policy${i}Title`)"
        ></h2>
        <p
          class="leading-relaxed content"
          v-html="t(`policy${i}Text`)"
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
