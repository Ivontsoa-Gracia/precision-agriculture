<template>
  <div class="min-h-screen text-[#141414]/90 py-6 sm:py-14 px-2 sm:px-6 md:px-20">
    <div class="max-w-5xl mx-auto p-8 md:p-12 bg-white">
      <router-link
        to="/help"
        class="inline-block mb-6 text-[#10b481] hover:underline"
      >
        ← {{ t("back") }}
      </router-link>

      <h1 class="text-4xl font-bold text-[#10b481] mb-2">{{ t("policy") }}</h1>
      <p class="text-gray-400 mb-10">{{ t("policyDate") }}</p>

      <section class="mb-10" v-for="i in 7" :key="i">
        <h2
          class="text-xl font-semibold text-[#141414] mb-3"
          v-html="t(`policy${i}Title`)"
        ></h2>
        <p
          class="leading-relaxed text-gray-600"
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
