<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg mt-10">
    <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2">
      <i class='bx bx-edit text-3xl text-[#10b481]'></i>
      Edit Parcel
    </h2>

    <form @submit.prevent="submitParcel" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <!-- Owner (UUID -> Nom complet, readonly) -->
        <div class="flex flex-col">
          <label class="font-semibold mb-1">Owner</label>
          <input v-model="ownerName" type="text" readonly
            class="px-3 py-2 rounded-lg border bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#10b481]" />
        </div>

        <!-- Parcel Name -->
        <div class="flex flex-col">
          <label class="font-semibold mb-1">Parcel Name *</label>
          <input v-model="form.parcel_name" type="text" required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#10b481]" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Latitude -->
        <div class="flex flex-col">
          <label class="font-semibold mb-1">Latitude *</label>
          <input v-model.number="form.latitude" type="number" step="any" required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#10b481]" />
        </div>

        <!-- Longitude -->
        <div class="flex flex-col">
          <label class="font-semibold mb-1">Longitude *</label>
          <input v-model.number="form.longitude" type="number" step="any" required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#10b481]" />
        </div>
      </div>

      <button type="submit"
        class="w-full bg-[#10b481] hover:bg-[#0c9069] transition-colors py-3 rounded-xl text-white text-lg flex justify-center items-center gap-2">
        <i class='bx bx-save text-xl'></i>
        Save Parcel
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const form = ref({
  parcel_name: '',
  latitude: 0,
  longitude: 0
})

const ownerUUID = ref('')   // UUID du owner
const ownerName = ref('')   // Nom complet récupéré depuis UUID

onMounted(async () => {
  const token = sessionStorage.getItem('token')
  if (!token) { router.push('/login'); return }

  try {
    // 1️⃣ Récupérer le parcel
    const res = await fetch(`https://mvp-dvws.onrender.com/api/parcels/${id}/`, { 
      headers: { Authorization: `Token ${token}` } 
    })
    const data = await res.json()
    console.log("Parcel", data)

    ownerUUID.value = data.owner

    form.value = {
      parcel_name: data.parcel_name || '',
      latitude: data.parcel_points?.[0]?.latitude ?? 0,
      longitude: data.parcel_points?.[0]?.longitude ?? 0
    }

    // 2️⃣ Récupérer le nom du owner via son UUID
    if (data.owner) {
      const ownerRes = await fetch(`https://mvp-dvws.onrender.com/api/users/${data.owner}/`, { 
        headers: { Authorization: `Token ${token}` } 
      })
      if (ownerRes.ok) {
        const ownerData = await ownerRes.json()
        ownerName.value = `${ownerData.first_name || ''} ${ownerData.last_name || ''}`.trim() || data.owner
      } else {
        ownerName.value = data.owner
      }
    }

  } catch (err) {
    console.error(err)
    alert("❌ Failed to load parcel data")
  }
})

const submitParcel = async () => {
  const token = sessionStorage.getItem('token')
  if (!token) { router.push('/login'); return }

  try {
    const payload = {
      owner: ownerUUID.value,        // UUID requis
      parcel_name: form.value.parcel_name,
      parcel_points: [{
        latitude: form.value.latitude,
        longitude: form.value.longitude,
        order: 1
      }]
    }

    const res = await fetch(`https://mvp-dvws.onrender.com/api/parcels/${id}/`, {
      method: 'PUT',
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    alert("✅ Parcel updated successfully!")
    router.push('/parcels')
  } catch (err) {
    console.error(err)
    alert("❌ Failed to update parcel")
  }
}
</script>
