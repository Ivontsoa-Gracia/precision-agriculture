<template>
  <div class="p-6 flex flex-col h-full space-y-6">
    <div class="flex items-center mb-4">
      <h2 class="t flex items-center gap-3">
        {{ t("helpcenter") }}
      </h2>
    </div>

    <div
      class="bg-white p-6 rounded-2xl border border-gray-200 flex items-start gap-4 hover:shadow-md transition"
    >

      <div>
        <h3 class="subtitle mb-2">
          {{ t("welcomehelp") }}
        </h3>
        <p class="content leading-relaxed">
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

    <div class="bg-white p-6 rounded-2xl border border-gray-200">
      <h3 class="subtitle mb-4">
        {{ t("howitworks") }}
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ContentItem
          number="1"
          :title="t('step1title')"
          icon="bx-user-plus"
          :text="t('step1text')"
        />
        <ContentItem
          number="2"
          :title="t('step2title')"
          icon="bx-cloud-download"
          :text="t('step2text')"
        />
        <ContentItem
          number="3"
          :title="t('step3title')"
          icon="bx-bar-chart-alt-2"
          :text="t('step3text')"
        />
        <ContentItem
          number="4"
          :title="t('step4title')"
          icon="bx-task"
          :text="t('step4text')"
        />
        <ContentItem
          number="5"
          :title="t('step5title')"
          icon="bx-show"
          :text="t('step5text')"
        />
        <ContentItem
          number="6"
          :title="t('step6title')"
          icon="bx-file-blank"
          :text="t('step6text')"
        />
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl border border-gray-200">
      <h3 class="subtitle mb-3">
        {{ t("needhelp") }}
      </h3>
      <p class="content mb-6">{{ t("contactteam") }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- WhatsApp -->
        <div
          class="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 transition"
        >
          <div
            class="w-10 h-10 bg-[#10b481]/10 p-4 rounded flex items-center justify-center text-[#10b481] font-bold text-lg"
          >
            <i class="bx bx-message-circle-plus"></i>
          </div>
          <a
            href="https://wa.me/261327114865"
            target="_blank"
            class="content"
          >
            +261 32 71 148 65
          </a>
        </div>

        <!-- Email -->
        <div
          class="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 transition"
        >
          <div
            class="w-10 h-10 bg-[#10b481]/10 p-4 rounded flex items-center justify-center text-[#10b481] font-bold text-lg"
          >
            <i class="bx bx-envelope"></i>
          </div>
          <a
            href="mailto:contact@smart-saha.com"
            class="content"
          >
            contact@smart-saha.com
          </a>
        </div>

        <!-- Location -->
        <div
          class="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 transition"
        >
          <div
            class="w-10 h-10 bg-[#10b481]/10 p-4 rounded flex items-center justify-center text-[#10b481] font-bold text-lg"
          >
            <i class="bx bx-location-plus"></i>
          </div>
          <span class="content">
            {{ t("location") }}
          </span>
        </div>
      </div>
    </div>
    <div class="bg-white p-6 rounded shadow-sm border border-gray-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          class="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 transition"
        >
          <div
            class="w-10 h-10 bg-[#10b481]/10 p-4 rounded flex items-center justify-center text-[#10b481] font-bold text-lg"
          >
            <i class="bx bx-shield-quarter"></i>
          </div>
          <a
            href="/conditions/privacy-policy"
            class="content"
          >
            {{ t("policy") }}
          </a>
        </div>

        <div
          class="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 transition"
        >
          <div
            class="w-10 h-10 bg-[#10b481]/10 p-4 rounded flex items-center justify-center text-[#10b481] font-bold text-lg"
          >
            <i class="bx bx-file"></i>
          </div>
          <a
            href="/conditions/terms-of-service"
            class="content"
          >
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
</script>
