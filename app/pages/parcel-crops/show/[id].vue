<template>
  <div class="p-6 flex justify-center items-start">
    <div class="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 mt-2">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <i class="bx bx-box text-4xl text-[#10b481] animate-pulse"></i>
        <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight relative">
          Parcel Crop Details
          <span class="block w-24 h-1 bg-gradient-to-r from-[#10b481] to-[#0a8f6e] rounded-full mt-1"></span>
        </h2>
      </div>

      <!-- Parcel Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <DetailItem label="Parcel" :value="parcelCrop.parcel_name"/>
        <DetailItem label="Crop" :value="parcelCrop.crop?.name + ' (' + (parcelCrop.crop?.variety?.name || '-') + ')'"/>
        <DetailItem label="Planting Date" :value="parcelCrop.planting_date"/>
        <DetailItem label="Harvest Date" :value="parcelCrop.harvest_date || '-'"/>
        <DetailItem label="Area (ha)" :value="parcelCrop.area"/>
        <DetailItem label="Status" :value="parcelCrop.status?.name || '-'"/>
        <DetailItem label="Created At" :value="parcelCrop.created_at"/>

      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex justify-end gap-4">
        <NuxtLink
          :to="`/parcel-crops/edit/${parcelCrop.id}`"
          class="px-6 py-3 bg-gradient-to-r from-[#10b481] to-[#0a8f6e] text-white rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition transform flex items-center gap-2"
        >
          <i class="bx bx-edit-alt"></i> Edit
        </NuxtLink>

        <NuxtLink
          to="/parcel-crops"
          class="px-6 py-3 bg-gray-50 text-gray-800 rounded-2xl font-semibold shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">
          <i class="bx bx-arrow-back"></i> Back
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DetailItem from '~/components/DetailItem.vue'

const route = useRoute()
const router = useRouter()
const parcelCrop = ref<any>({})

onMounted(async () => {
  const token = sessionStorage.getItem('token')
  if (!token) { router.push('/login'); return }

  try {
    const res = await fetch(`https://mvp-dvws.onrender.com/api/parcel-crops/${route.params.id}/`, {
      headers: { Authorization: `Token ${token}` }
    })
    if (!res.ok) throw new Error("Failed to load parcel crop")
    const data = await res.json()

    const resParcel = await fetch(`https://mvp-dvws.onrender.com/api/parcels/`, { headers: { Authorization: `Token ${token}` } })
    const parcels = await resParcel.json()
    const parcel = parcels.find((p:any) => p.uuid === data.parcel)

    parcelCrop.value = { ...data, parcel_name: parcel?.parcel_name || data.parcel }
  } catch (err) {
    console.error(err)
    alert("❌ Failed to load data")
  }
})
</script>
