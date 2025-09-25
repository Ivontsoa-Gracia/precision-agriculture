<template>
  <div class="flex h-full">
    <!-- Left panel -->
    <div class="w-2/5 p-4 rounded-lg space-y-4">
      <div class="flex bg-gray-50 rounded overflow-hidden mb-16">
        <button 
          @click="mode='polygon'" 
          :class="[mode==='polygon'? activeBtn : inactiveBtn, 'flex-1 rounded-l-lg']"
        >
          Polygon
        </button>
        <button 
          @click="mode='point'" 
          :class="[mode==='point'? activeBtn : inactiveBtn, 'flex-1 rounded-r-lg']"
        >
          Point
        </button>
      </div>

      <!-- Formulaire -->
      <form class="space-y-4">
        <!-- <div v-if="mode==='polygon'">
          <label class="block text-sm font-medium mb-1">Search location</label>
          <input v-model="form.search" type="text" class="w-full p-2 border rounded" placeholder="Search on map">
          <p class="text-xs text-gray-500">Cliquez sur la carte pour tracer votre polygon</p>
        </div> -->

        <div v-if="mode==='polygon'" class="flex flex-col relative w-full">
          <!-- Icône de recherche -->
          <i class="bx bx-search absolute left-3 top-6 -translate-y-1/2 text-gray-400 pointer-events-none text-lg"></i>

          <!-- Input -->
          <input 
            v-model="form.search"
            type="text"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#212121] transition"
            placeholder="Search on map"
            @input="onSearchInput"
          >

          <!-- Description -->
          <p class="text-xs text-gray-500 mt-1">Cliquez sur la carte pour tracer votre polygon</p>
        </div>




        <div v-else class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Latitude</label>
            <input v-model="form.latitude" type="text" class="w-full p-2 border rounded" placeholder="Latitude">
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Longitude</label>
            <input v-model="form.longitude" type="text" class="w-full p-2 border rounded" placeholder="Longitude">
          </div>
        </div>

        <div class="bg-[#f9f9f9] shadow p-6 space-y-4 rounded-lg">
          <h2 class="text-3xl font-extrabold text-[#222831] mb-4">Save field parcel</h2>
          
          <div>
            <label class="block text-sm font-medium mb-1">Owner</label>
            <input v-model="user.username" type="text" class="w-full p-2 border rounded bg-gray-100" readonly>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Parcel Name</label>
            <input v-model="form.parcel" type="text" class="w-full p-2 border rounded" placeholder="Parcel name">
          </div>

          <button 
            type="button" 
            class="bg-[#10b481] text-white px-4 py-2 rounded shadow hover:bg-[#0da06a] w-full" 
            @click="submitForm"
          >
            Save parcel
          </button>
        </div>
      </form>
    </div>

    <!-- Map -->
    <div class="flex-1 ml-4 bg-gray-200 rounded-lg shadow">
      <div id="map" class="h-full w-full rounded-lg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

definePageMeta({ layout: 'dashboard' })

const mode = ref<'polygon' | 'point'>('polygon')
const activeBtn = 'bg-[#10b481] text-white px-4 py-2 rounded shadow'
const inactiveBtn = 'bg-gray-100 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-200'

const form = reactive({
  parcel: '',
  search: '',
  latitude: '',
  longitude: '',
  points: [] as { lat: number, lng: number, order: number }[]
})

const user = reactive<{ uuid: string, username: string }>({ uuid: '', username: '' })

let map: any
let drawnPolygon: any = null
let marker: any = null

let searchTimeout: any = null

function onSearchInput() {
  // On attend 500ms après la dernière frappe pour lancer la recherche
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchLocation()
  }, 500)
}


onMounted(async () => {
  if (!process.client) return

  // Import Leaflet seulement côté client
  const L = await import('leaflet')
  await import('leaflet/dist/leaflet.css')

  // Init map
  map = L.map('map').setView([-18.8792, 47.5079], 6)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Gestion clics
  map.on('click', (e: any) => {
    if (mode.value === 'point') {
      form.latitude = e.latlng.lat.toFixed(6)
      form.longitude = e.latlng.lng.toFixed(6)

      if (marker) map.removeLayer(marker)
      marker = L.marker(e.latlng).addTo(map)
    } else if (mode.value === 'polygon') {
      const order = form.points.length + 1
      form.points.push({ lat: e.latlng.lat, lng: e.latlng.lng, order })

      if (drawnPolygon) map.removeLayer(drawnPolygon)
      drawnPolygon = L.polygon(form.points.map(p => [p.lat, p.lng]), { color: 'blue' }).addTo(map)
    }
  })

  // Récupération user
  const uuid = sessionStorage.getItem("uuid")
  const token = sessionStorage.getItem("token")
  if (!uuid || !token) {
    alert("Vous devez être connecté")
    return
  }

  try {
    const response = await fetch(`https://mvp-dvws.onrender.com/api/users/${uuid}/`, {
      headers: { "Authorization": `Token ${token}` }
    })
    const data = await response.json()
    user.uuid = data.uuid
    user.username = data.username
  } catch (err) {
    console.error("Erreur récupération user:", err)
  }
})

async function searchLocation() {
  if (!form.search) return

  try {
    // Appel à l'API Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.search)}`
    )
    const results = await response.json()
    if (!results || results.length === 0) {
      alert("Lieu introuvable")
      return
    }

    // Prend le premier résultat
    const place = results[0]
    const lat = parseFloat(place.lat)
    const lon = parseFloat(place.lon)

    // Recentre la carte et zoom
    map.setView([lat, lon], 14)

    // Supprime l'ancien marker si présent
    if (marker) map.removeLayer(marker)

    // Optionnel : ajouter un marker temporaire pour indiquer le centre
    marker = L.marker([lat, lon]).addTo(map)
  } catch (err) {
    console.error("Erreur recherche:", err)
    alert("Erreur lors de la recherche")
  }
}


async function submitForm() {
  try {
    const token = sessionStorage.getItem("token")
    if (!token) {
      alert("Vous devez être connecté pour créer une parcelle")
      return
    }

    let parcel_points = []
    if (mode.value === 'point') {
      parcel_points = [
        { latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), order: 1 }
      ]
    } else {
      parcel_points = form.points.map(p => ({
        latitude: p.lat,
        longitude: p.lng,
        order: p.order
      }))
    }

    const payload = {
      owner: user.uuid,
      parcel_name: form.parcel,
      parcel_points
    }

    const response = await fetch("https://mvp-dvws.onrender.com/api/parcels/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    if (!response.ok) {
      console.error("Erreur API:", data)
      alert("Erreur: " + JSON.stringify(data))
      return
    }

    console.log("Parcel créé:", data)
    alert("Parcelle enregistrée avec succès !")
  } catch (err) {
    console.error("Erreur réseau:", err)
    alert("Erreur réseau")
  }
}


</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
