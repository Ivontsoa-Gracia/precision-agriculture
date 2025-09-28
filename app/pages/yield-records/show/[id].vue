<template>
  <div class="p-6 flex justify-center items-start">
    <div class="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 mt-2">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <i class="bx bx-bar-chart text-4xl text-[#10b481] animate-pulse"></i>
        <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight relative">
          Yield Record Detail
          <span class="block w-24 h-1 bg-gradient-to-r from-[#10b481] to-[#0a8f6e] rounded-full mt-1"></span>
        </h1>
      </div>

      <!-- Yield Info Grid -->
      <div v-if="yieldRecord" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem label="Date" :value="yieldRecord.date" />
        <DetailItem label="Yield (kg)" :value="yieldRecord.yield_amount" />
        <DetailItem label="Area (ha)" :value="yieldRecord.area" />
        <DetailItem 
          label="Parcel Crop" 
          :value="parcelCropData && parcelData 
                  ? `${parcelData.parcel_name} - ${parcelCropData.crop.name}` 
                  : '-'" 
        />

        <div class="col-span-1 md:col-span-2 flex flex-col gap-1">
          <span class="font-semibold text-[#10b481]">Notes</span>
          <p class="mt-1 text-gray-700 bg-gray-50 p-4 rounded-md border">{{ yieldRecord.notes }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex justify-end gap-4">
        <button @click="goToEdit"
          class="px-6 py-3 bg-gradient-to-r from-[#10b481] to-[#0a8f6e] text-white rounded-2xl font-bold shadow-md hover:shadow-xl hover:scale-105 transition transform">
          <i class="bx bx-edit-alt"></i> Edit
        </button>
        <button @click="goBack" 
          class="px-6 py-3 bg-gray-50 text-gray-800 rounded-2xl font-semibold shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">
          <i class="bx bx-arrow-back"></i> Back
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import DetailItem from '~/components/DetailItem.vue'

const route = useRoute();
const router = useRouter();
const yieldRecord = ref(null);

const parcelCropData = ref(null);
const parcelData = ref(null); // pour stocker le parcel complet

async function fetchYield() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    // 1️⃣ Récupérer le YieldRecord
    const res = await axios.get(
      `https://previson-agriculture.onrender.com/api/yield-records/${route.params.id}/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    yieldRecord.value = res.data;

    // 2️⃣ Récupérer le parcelCrop complet
    if (yieldRecord.value.parcelCrop) {
      const resParcelCrop = await axios.get(
        `https://previson-agriculture.onrender.com/api/parcel-crops/${yieldRecord.value.parcelCrop}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      parcelCropData.value = resParcelCrop.data;

      // 3️⃣ Récupérer le parcel complet pour avoir le parcel_name
      if (parcelCropData.value.parcel) {
        const resParcel = await axios.get(
          `https://previson-agriculture.onrender.com/api/parcels/${parcelCropData.value.parcel}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        parcelData.value = resParcel.data; // { parcel_name, points, ... }
      }
    }

    console.log("YieldRecord:", yieldRecord.value);
    console.log("ParcelCropData:", parcelCropData.value);
    console.log("ParcelData:", parcelData.value);

  } catch (err) {
    console.error(err);
  }
}



function goToEdit() {
  router.push(`/yield-records/edit/${route.params.id}`);
}

function goBack() {
  router.push('/yield-records');
}

onMounted(fetchYield);
</script>
