<template>
  <div class="p-6 flex flex-col h-full space-y-6">

    <!-- HEADER -->
    <div class="flex items-center mb-4">
      <h2 class="text-3xl font-bold text-[#212121] flex items-center gap-3">
        <i class="bx bx-help-circle text-3xl text-[#10b481]"></i>
        {{ t("helpcenter") }}
      </h2>
    </div>

    <!-- INTRO CARD -->
    <div
      class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition"
    >
      <div
        class="w-12 h-12 flex items-center justify-center bg-[#10b481] text-white rounded-full text-2xl"
      >
        <i class="bx bx-info-circle"></i>
      </div>

      <div>
        <h3 class="text-xl font-semibold text-[#212121] mb-2">
          {{ t("welcomehelp") }}
        </h3>
        <p class="text-gray-600 leading-relaxed">
          {{ t("introhelp") }}
          <a
            href="https://www.smart-saha.com"
            target="_blank"
            class="text-[#10b481] font-medium underline"
          >
            www.smart-saha.com
          </a>
          .
        </p>
      </div>
    </div>

    <!-- HOW IT WORKS -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 class="text-xl font-semibold text-[#212121] mb-4">
        {{ t("howitworks") }}
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ContentItem number="1" :title="t('step1title')" icon="bx-user-plus" :text="t('step1text')" />
        <ContentItem number="2" :title="t('step2title')" icon="bx-cloud-download" :text="t('step2text')" />
        <ContentItem number="3" :title="t('step3title')" icon="bx-bar-chart-alt-2" :text="t('step3text')" />
        <ContentItem number="4" :title="t('step4title')" icon="bx-task" :text="t('step4text')" />
        <ContentItem number="5" :title="t('step5title')" icon="bx-show" :text="t('step5text')" />
        <ContentItem number="6" :title="t('step6title')" icon="bx-file-blank" :text="t('step6text')" />
      </div>
    </div>

    <!-- CONTACT SECTION -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
  <h3 class="text-xl font-semibold text-[#212121] mb-3">
    {{ t("needhelp") }}
  </h3>
  <p class="text-gray-600 mb-6">{{ t("contactteam") }}</p>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <!-- PHONE -->
    <div
      class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
    >
      <i class="bx bx-phone text-2xl text-[#10b481]"></i>
      <a href="tel:03397797000" class="text-gray-800 font-medium">
        033 977 970 00
      </a>
    </div>

    <!-- WHATSAPP -->
    <div
      class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
    >
      <i class="bx bx-message-circle-plus text-2xl text-[#10b481]"></i>
      <a href="https://wa.me/261327114865" target="_blank" class="text-gray-800 font-medium">
        +261 32 71 148 65
      </a>
    </div>

    <!-- EMAIL -->
    <div
      class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
    >
      <i class="bx bx-envelope text-2xl text-[#10b481]"></i>
      <a href="mailto:contact@smart-saha.com" class="text-gray-800 font-medium">
        contact@smart-saha.com
      </a>
    </div>

        <!-- LOCATION -->
    <div
      class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
    >
      <i class="bx bx-location-plus text-2xl text-[#10b481]"></i>
      <span class="text-gray-800 font-medium">
        {{ t("location") }}
      </span>
    </div>

    <!-- PRIVACY POLICY -->
    <div
      class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
    >
      <i class="bx bx-shield-quarter text-2xl text-[#10b481]"></i>
      <a href="/conditions/privacy-policy" class="text-gray-800 font-medium">
        {{ t("policy") }}
      </a>
    </div>

    <!-- TERMS OF SERVICE -->
    <div
      class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
    >
      <i class="bx bx-file text-2xl text-[#10b481]"></i>
      <a href="/conditions/terms-of-service" class="text-gray-800 font-medium">
        {{ t("terms") }}
      </a>
    </div>

  </div>
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

import ContentItem from "@/components/ContentItem.vue";
import ContactItem from "@/components/ContactItem.vue";
</script>
