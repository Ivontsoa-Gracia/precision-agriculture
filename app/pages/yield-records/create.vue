<template>
  <div class="p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-3">
      <i class='bx bx-bar-chart text-4xl text-[#10b481] animate-pulse'></i>
      New Yield Record
    </h2>

    <form @submit.prevent="createYieldRecord" class="space-y-4">

      <!-- Parcel Crop -->
      <div>
        <label class="block mb-1 font-medium text-gray-700">Parcel Crop</label>
        <select v-model="form.parcelCrop" @change="onParcelCropChange" class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]" required>
          <option disabled value="">-- Select --</option>
          <option v-for="crop in parcelCrops" :key="crop.id" :value="crop.id">
            {{ crop.parcel.parcel_name }} - {{ crop.crop.name }}
          </option>
        </select>
      </div>

      <!-- Inputs en ligne pour desktop -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block mb-1 font-medium text-gray-700">Date</label>
          <input v-model="form.date" type="date" class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]" required />
        </div>

        <div>
          <label class="block mb-1 font-medium text-gray-700">Yield Amount</label>
          <input v-model.number="form.yield_amount" type="number" class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]" required />
        </div>

        <div>
          <label class="block mb-1 font-medium text-gray-700">Area (ha)</label>
          <input 
            v-model.number="form.area" 
            type="number" 
            :max="maxArea" 
            step="0.01"
            @input="checkArea"
            class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]" 
            required
          />
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label class="block mb-1 font-medium text-gray-700">Notes</label>
        <textarea v-model="form.notes" class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]"></textarea>
      </div>

      <!-- Submit Button -->
      <div class="text-right">
        <button type="submit" 
          class="bg-gradient-to-r from-[#10b481] to-[#0a8f6e] text-white px-6 py-2 rounded-lg font-bold shadow hover:shadow-lg transition transform hover:-translate-y-0.5">
          Create
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as turf from '@turf/turf'

const router = useRouter()
const parcelCrops = ref([])
const maxArea = ref(null)

const form = ref({
  date: '',
  yield_amount: null,
  area: null,
  notes: '',
  parcelCrop: null
})

let token = null

onMounted(async () => {
  if (!process.client) return

  token = sessionStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  await loadParcelCrops()
})

async function loadParcelCrops() {
  try {
    const res = await fetch('https://mvp-dvws.onrender.com/api/parcel-crops/', {
      headers: { Authorization: `Token ${token}` }
    })
    const data = await res.json()

    // Pour chaque parcelCrop, récupérer le parcel complet si nécessaire
    for (const pc of data) {
      if (pc.parcel) {
        const resParcel = await fetch(`https://mvp-dvws.onrender.com/api/parcels/${pc.parcel}/`, {
          headers: { Authorization: `Token ${token}` }
        })
        pc.parcel = await resParcel.json()
      }
    }

    parcelCrops.value = data
  } catch (err) {
    console.error(err)
  }
}

function calculateParcelArea(points) {
  if (!points || points.length < 3) return 0
  const coords = points.map(p => [p.lng, p.lat])
  coords.push([points[0].lng, points[0].lat])
  const polygon = turf.polygon([coords])
  const areaM2 = turf.area(polygon)
  return areaM2 / 10000 // hectares
}

function onParcelCropChange() {
  const selected = parcelCrops.value.find(pc => pc.id === form.value.parcelCrop)
  if (selected?.parcel?.points) {
    const area = calculateParcelArea(selected.parcel.points)
    maxArea.value = area.toFixed(2)
    form.value.area = maxArea.value
  } else {
    maxArea.value = null
    form.value.area = null
  }
}

// Empêcher l'utilisateur de dépasser l'aire calculée
function checkArea() {
  if (maxArea.value && form.value.area > maxArea.value) {
    form.value.area = maxArea.value
  }
}

async function createYieldRecord() {
  if (!token) return
  try {
    const res = await fetch('https://mvp-dvws.onrender.com/api/yield-records/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      body: JSON.stringify(form.value)
    })
    if (!res.ok) throw new Error('Erreur création YieldRecord')
    router.push('/yield-records')
  } catch (err) {
    console.error(err)
  }
}
</script>
