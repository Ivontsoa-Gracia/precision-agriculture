<template>
  <div class="p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-3">
      <i class='bx bx-bar-chart text-4xl text-[#10b481] animate-pulse'></i>
      New Yield Record
    </h2>


    <form @submit.prevent="createYieldRecord" class="space-y-4">

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
          <label class="block mb-1 font-medium text-gray-700">Area</label>
          <input v-model.number="form.area" type="number" class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]" required />
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label class="block mb-1 font-medium text-gray-700">Notes</label>
        <textarea v-model="form.notes" class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]"></textarea>
      </div>

      <!-- Parcel Crop -->
      <div>
        <label class="block mb-1 font-medium text-gray-700">Parcel Crop</label>
        <select v-model.number="form.parcelCrop" class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]">
          <option disabled value="">-- Select --</option>
          <option v-for="crop in parcelCrops" :key="crop.id" :value="crop.id">
            {{ crop.crop.name }} - {{ crop.crop.variety }}
          </option>
        </select>
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

const router = useRouter()
const parcelCrops = ref([])

const form = ref({
  date: '',
  yield_amount: null,
  area: null,
  notes: '',
  parcelCrop: null
})

let token = null

// Charger sessionStorage et ParcelCrops côté client
onMounted(async () => {
  if (!process.client) return

  token = sessionStorage.getItem('token')
  const uuid = sessionStorage.getItem('uuid')

  if (!uuid || !token) {
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
    parcelCrops.value = await res.json()
  } catch (err) {
    console.error('Erreur chargement ParcelCrops:', err)
  }
}

async function createYieldRecord() {
  if (!token) return

  try {
    const res = await fetch('https://mvp-dvws.onrender.com/api/yield-records/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify(form.value)
    })

    if (!res.ok) {
      const error = await res.json()
      console.error('Erreur création YieldRecord:', error)
      return
    }

    const data = await res.json()
    console.log('YieldRecord créé avec succès:', data)

    // Rediriger vers la liste des yields
    router.push('/yield-records')
  } catch (err) {
    console.error('Erreur réseau:', err)
  }
}
</script>
