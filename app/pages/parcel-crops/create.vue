<template>
    <div class="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <div class="flex justify-between items-center mb-6 ">

        <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2">
          <i class='bx bx-box text-3xl text-[#10b481]'></i>
          {{ t('newparcelcrop') }}
        </h2>
  
        <!-- Add Crop Button -->
        <NuxtLink 
          to="/crops/create" 
          class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white rounded-lg hover:bg-[#0da06a] transition"
        >
          <i class='bx bx-plus text-lg'></i> {{ t('btnaddcrop') }}
        </NuxtLink>
      </div>
  
      <form @submit.prevent="submitParcelCrop" class="space-y-5">
        <!-- Parcel & Crop side by side -->
        <div class="flex gap-4">
          <div class="flex-1 flex flex-col">
            <label class="block font-medium">{{ t('parcel') }} *</label>
            <select v-model="form.parcel" required class="w-full border p-2 rounded focus:ring-[#212121]">
              <option v-for="p in parcels" :key="p.uuid" :value="p.uuid">
                {{ p.parcel_name }}
              </option>
            </select>
          </div>
  
          <div class="flex-1 flex flex-col">
            <label class="block font-medium">{{ t('crop') }} *</label>
            <select v-model="form.crop_id" required class="w-full border p-2 rounded focus:ring-[#212121]">
              <option v-for="c in crops" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.variety?.name }})
              </option>
            </select>
          </div>
        </div>
  
        <!-- Planting & Harvest Date side by side -->
        <div class="flex gap-4">
          <div class="flex-1 flex flex-col">
            <label class="block font-medium">{{ t('plantingdate') }} *</label>
            <input v-model="form.planting_date" type="date" required class="w-full border p-2 rounded focus:ring-[#212121]" />
          </div>
  
          <div class="flex-1 flex flex-col">
            <label class="block font-medium">{{ t('harvestdate') }}</label>
            <input v-model="form.harvest_date" type="date" class="w-full border p-2 rounded focus:ring-[#212121]" />
          </div>
        </div>
  
        <!-- Area & Status side by side -->
        <div class="flex gap-4">
          <div class="flex-1 flex flex-col">
            <label class="block font-medium">{{ t('area') }} (m²) *</label>
            <input 
              v-model.number="form.area" 
              type="number" 
              step="1" 
              :max="areaInM2(calculatedArea)" 
              required 
              placeholder="Enter area in m²" 
              class="w-full border p-2 rounded focus:ring-[#212121]" 
              @input="onAreaInput"
            />
            <small class="text-gray-500 text-sm">
              Max: {{ formatM2(calculatedArea) }}
            </small>
          </div>

          
          <div class="flex-1 flex flex-col">
            <label class="block font-medium">{{ t('status') }} *</label>
            <select v-model="form.status_id" required class="w-full border p-2 rounded focus:ring-[#212121]">
              <option 
                v-for="s in statuses" 
                :key="s.id" 
                :value="s.id"
              >
                {{ t(cropStatusKeyMap[s.name]) }}
              </option>
            </select>
          </div>
        </div>
  
        <!-- Submit Button -->
        <button type="submit" class="w-full bg-[#10b481] hover:bg-[#0da06a] transition-colors py-3 rounded-xl text-white text-lg flex justify-center items-center gap-2">
          <i class='bx bx-plus text-xl'></i>
          {{ t('btnsaveparcelcrop') }}
        </button>
      </form>
    </div>
    <div v-if="isLoading" class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl">
        <div class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"></div>
    </div>
      <!-- Notification -->
    <transition name="fade">
      <div 
        v-if="notification.visible" 
        :class="['fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold', 
                 notification.type === 'success' ? 'bg-[#10b481]' : 'bg-red-500']">
        {{ notification.message }}
      </div>
    </transition>
  </template>
  
  
  <script setup lang="ts">
  definePageMeta({ layout: 'dashboard' })
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { watch } from 'vue'
  import * as turf from '@turf/turf'
  import { API_URL } from '~/config'

  import { useLanguageStore } from '~/stores/language'
  import { translate } from '~/utils/translate'

  const languageStore = useLanguageStore()

  const t = (key: string) => translate[languageStore.lang][key] || key

  const currentLocale = computed(() => languageStore.lang)

  const cropStatusKeyMap: Record<string, string> = {
    Planned: "cropStatusPlanned",
    Planted: "cropStatusPlanted",
    Germinated: "cropStatusGerminated",
    Growing: "cropStatusGrowing",
    Flowering: "cropStatusFlowering",
    Fruiting: "cropStatusFruiting",
    Mature: "cropStatusMature",
    Harvested: "cropStatusHarvested",
    "Post-Harvest": "cropStatusPostHarvest",
    Failed: "cropStatusFailed"
  }

  const isLoading = ref(false)

  // Notification state
  const notification = ref({
    visible: false,
    message: '',
    type: 'success' // 'success' | 'error'
  })

  const showNotification = (message: string, type: 'success' | 'error' = 'success', duration = 3000) => {
    notification.value.message = message
    notification.value.type = type
    notification.value.visible = true
    setTimeout(() => notification.value.visible = false, duration)
  }

  const router = useRouter()
  const form = ref({
    parcel: '',
    crop_id: null,
    planting_date: '',
    harvest_date: '',
    area: null,
    status_id: null
  })
  
  const parcels = ref<any[]>([])
  const crops = ref<any[]>([])
  const statuses = ref<any[]>([])
  
  const calculatedArea = ref<number>(0) // <-- ici le ref global

  function calculateParcelArea(points: { lat: number; lng: number }[]) {
    if (points.length < 3) return 0
    const coords = points.map(p => [p.lng, p.lat])
    coords.push([points[0].lng, points[0].lat]) // fermer le polygone
    const polygon = turf.polygon([coords])
    const areaM2 = turf.area(polygon)
    return areaM2 / 10000 // hectares
  }

  // watch sur le parcel choisi
  watch(() => form.value.parcel, (parcelId) => {
    const selectedParcel = parcels.value.find(p => p.uuid === parcelId)
    if (selectedParcel?.points?.length) {
      const area = calculateParcelArea(selectedParcel.points)
      calculatedArea.value = Number(area.toFixed(2))
      form.value.area = areaInM2(calculatedArea.value)
    } else {
      calculatedArea.value = 0
      form.value.area = null
    }
  })

  const onAreaInput = () => {
    if (form.value.area > areaInM2(calculatedArea.value)) {
      form.value.area = areaInM2(calculatedArea.value);
    } else if (form.value.area < 0) {
      form.value.area = 0;
    }
  };

  onMounted(async () => {
    const token = sessionStorage.getItem('token')
    if (!token) { router.push('/login'); return }
  
    try {
      // Load parcels
      const resParcels = await fetch(`${API_URL}/api/parcels/`, { headers: { Authorization: `Token ${token}` } })
      parcels.value = await resParcels.json()
  
      // Load crops
      const resCrops = await fetch(`${API_URL}/api/crops/`, { headers: { Authorization: `Token ${token}` } })
      crops.value = await resCrops.json()
  
      // Load status-crops
      const resStatus = await fetch(`${API_URL}/api/status-crops/`, { headers: { Authorization: `Token ${token}` } })
      statuses.value = await resStatus.json()
      // console.log("status", statuses)
  
    } catch (err) {
      console.error(err)
      alert("Failed to load data")
    }
  })
  
  const submitParcelCrop = async () => {
    const token = sessionStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    isLoading.value = true 
    try {
      const res = await fetch(`${API_URL}/api/parcel-crops/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
  
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      showNotification('Parcel Crop created successfully!', 'success')
      router.push('/parcel-crops')
    } catch (err) {
      console.error(err)
      showNotification('Failed to create parcel crop', 'error')
    } finally {
      isLoading.value = false 
    }
  }

  const formatM2 = (areaInHa) => {
    if (!areaInHa) return "0 m²";
    return `${(areaInHa * 10000).toLocaleString()} m²`;
  };

  const areaInM2 = (areaInHa: number) => {
    if (!areaInHa) return 0;
    return areaInHa * 10000;
  }

  </script>
  
  <style scoped>
  input::placeholder,
  select::placeholder {
    color: rgba(255,255,255,0.6);
  }
  </style>
  