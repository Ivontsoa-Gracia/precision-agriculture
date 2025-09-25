<template>
  <div class="p-6 flex flex-col h-full space-y-6 bg-[#f9f9f9]">

    <!-- Header -->
    <div class="flex items-center mb-6">
      <h2 class="text-3xl font-bold text-[#212121] flex items-center gap-3">
        <i class='bx bx-help-circle text-3xl text-[#10b481]'></i>
        SmartSaha – Help Center
      </h2>
    </div>

    <!-- Introduction -->
    <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-start space-x-4">
      <div class="w-12 h-12 flex items-center justify-center bg-[#10b481] text-white rounded-full text-xl font-bold">
        <i class="bx bx-question-mark text-xl"></i>
      </div>
      <div>
        <h3 class="text-xl font-semibold text-[#212121] mb-2">Welcome to SmartSaha Guide</h3>
        <p class="text-gray-700">
          SmartSaha is a <strong>Precision Agriculture</strong> platform designed to help farmers plan, monitor, 
          and optimize their crops using reliable data and intelligent analytics. Learn more at 
          <a href="https://www.smart-saha.com" target="_blank" class="text-[#10b481] underline">www.smart-saha.com</a>.
        </p>
      </div>
    </div>

    <!-- How it works -->
    <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 class="text-xl font-semibold text-[#212121] mb-4">How SmartSaha Works</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <ContentItem number="1" title="Sign Up & Setup"
          icon="bx-user-plus"
          text="Create an account and register your farm plots to start receiving personalized recommendations." />

        <ContentItem number="2" title="Data Collection"
          icon="bx-cloud-download"
          text="Weather, soil, and crop data are collected through sensors, satellites, and field surveys." />

        <ContentItem number="3" title="Smart Analysis"
          icon="bx-bar-chart-alt-2"
          text="Our system analyzes the data to determine the precise needs of each plot: irrigation, fertilization, and crop protection." />

        <ContentItem number="4" title="Recommendations & Action Plan"
          icon="bx-task"
          text="Receive tailored recommendations along with a detailed work plan for each plot." />

        <ContentItem number="5" title="Monitoring & Optimization"
          icon="bx-show"
          text="Track crop progress in real time and adjust actions to maximize yield and sustainability." />

        <ContentItem number="6" title="Reports & Decision Making"
          icon="bx-file-blank"
          text="Get comprehensive reports to make informed decisions and improve overall farm performance." />

      </div>
    </div>

    <!-- Contact -->
    <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 class="text-xl font-semibold text-[#212121] mb-2">Need Further Assistance?</h3>
      <p class="text-gray-700 mb-2">Reach out to our support team:</p>
      <ul class="space-y-3">
        <ContactItem icon="bx-envelope" text="contact@smart-saha.com" href="mailto:contact@smart-saha.com" />
        <!-- <ContactItem icon="bx-phone" text="+261 34 12 345 67" /> -->
        <ContactItem icon="bx-map" text="Antananarivo, Madagascar" />
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

// Components
import ContentItem from '@/components/ContentItem.vue'
import ContactItem from '@/components/ContactItem.vue'
</script>
