<template>
  <div class="p-6 flex flex-col h-full space-y-6 bg-[#f9f9f9]">

    <!-- Header -->
    <div class="flex items-center mb-6">
      <h2 class="text-3xl font-bold text-[#212121] flex items-center gap-3">
        <i class='bx bx-help-circle text-3xl text-[#10b481]'></i>
        {{ t('helpcenter') }}
      </h2>
    </div>

    <!-- Introduction -->
    <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-start space-x-4">
      <div class="w-12 h-12 flex items-center justify-center bg-[#10b481] text-white rounded-full text-xl font-bold">
        <i class="bx bx-question-mark text-xl"></i>
      </div>
      <div>
        <h3 class="text-xl font-semibold text-[#212121] mb-2">{{ t('welcomehelp') }}</h3>
        <p class="text-gray-700">
          {{ t('introhelp') }}
          <a href="https://www.smart-saha.com" target="_blank" class="text-[#10b481] underline">www.smart-saha.com</a>.
        </p>
      </div>
    </div>

    <!-- How it works -->
    <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 class="text-xl font-semibold text-[#212121] mb-4">{{ t('howitworks') }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ContentItem number="1" :title="t('step1title')" icon="bx-user-plus" :text="t('step1text')" />
        <ContentItem number="2" :title="t('step2title')" icon="bx-cloud-download" :text="t('step2text')" />
        <ContentItem number="3" :title="t('step3title')" icon="bx-bar-chart-alt-2" :text="t('step3text')" />
        <ContentItem number="4" :title="t('step4title')" icon="bx-task" :text="t('step4text')" />
        <ContentItem number="5" :title="t('step5title')" icon="bx-show" :text="t('step5text')" />
        <ContentItem number="6" :title="t('step6title')" icon="bx-file-blank" :text="t('step6text')" />
      </div>
    </div>

    <!-- Contact -->
    <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 class="text-xl font-semibold text-[#212121] mb-2">{{ t('needhelp') }}</h3>
      <p class="text-gray-700 mb-2">{{ t('contactteam') }}</p>
      <ul class="space-y-3">
        <ContactItem icon="bx-envelope" text="contact@smart-saha.com" href="mailto:contact@smart-saha.com" />
        <ContactItem icon="bx-map" :text="t('location')" />
      </ul>
    </div>

  </div>
</template>


<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
import { useLanguageStore } from '~/stores/language'
import { translate } from '~/utils/translate'

const languageStore = useLanguageStore()

const t = (key: string) => translate[languageStore.lang][key] || key

const currentLocale = computed(() => languageStore.lang)
import ContentItem from '@/components/ContentItem.vue'
import ContactItem from '@/components/ContactItem.vue'
</script>
