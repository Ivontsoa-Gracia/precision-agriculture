<template>
    <div class="p-6">
      <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2">
        <i class='bx bx-box text-3xl text-[#10b481]'></i>
        Parcel Crops List
      </h2>
  
      <!-- Add ParcelCrop Button -->
      <div class="flex justify-end mb-4">
        <NuxtLink 
          to="/parcel-crops/create" 
          class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white rounded-lg hover:bg-[#0da06a] transition"
        >
          <i class='bx bx-plus text-lg'></i> Add Parcel Crop
        </NuxtLink>
      </div>
  
      <!-- Table -->
      <div class="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table class="min-w-full text-left border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-2 border-b">Parcel</th>
              <th class="px-6 py-2 border-b">Crop</th>
              <th class="px-6 py-2 border-b">Planting Date</th>
              <th class="px-6 py-2 border-b">Harvest Date</th>
              <th class="px-6 py-2 border-b">Area (m²)</th>
              <th class="px-6 py-2 border-b">Status</th>
              <th class="px-6 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pc in paginatedParcelCrops" :key="pc.id" class="hover:bg-gray-50">
              <td class="px-6 py-2 border-b">{{ pc.parcel_name || pc.parcel }}</td>
              <td class="px-6 py-2 border-b">{{ pc.crop?.name || '-' }}</td>
              <td class="px-6 py-2 border-b">{{ pc.planting_date }}</td>
              <td class="px-6 py-2 border-b">{{ pc.harvest_date || '-' }}</td>
              <td class="px-6 py-2 border-b">{{ pc.area }}</td>
              <td class="px-6 py-2 border-b">
                <span
                  v-if="pc.status?.name"
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    statusClasses(pc.status.name)
                  ]"
                >
                  {{ pc.status.name }}
                </span>
                <span v-else>-</span>
              </td>

              <td class="p-3 border-b text-center flex justify-center gap-2">
                <button @click="showParcelCrop(pc.id)" class="p-2 rounded-full hover:bg-[#10b481]/20">
                  <i class="bx bx-show text-[#10b481] text-xl"></i>
                </button>
                <button @click="editParcelCrop(pc.id)" class="p-2 rounded-full hover:bg-[#f4a261]/10">
                  <i class="bx bx-edit text-[#f4a261] text-xl"></i>
                </button>
                <button @click="deleteParcelCrop(pc.id)" class="p-2 rounded-full hover:bg-[#e63946]/10">
                  <i class="bx bx-trash text-[#e63946] text-xl"></i>
                </button>
              </td>
            </tr>
            <tr v-if="paginatedParcelCrops.length === 0">
              <td colspan="8" class="p-6 text-center text-gray-500">No parcel crops found.</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4 mb-2">
          <button @click="prevPage" :disabled="currentPage === 1" class="flex items-center px-3 py-1 rounded disabled:opacity-50">
            <i class="bx bx-chevron-left"></i> Prev
          </button>
    
          <div class="flex items-center space-x-2">
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" 
              :class="['px-3 py-1 rounded', currentPage === page ? 'bg-[#10b481] text-white' : 'bg-gray-100 hover:bg-gray-200']" v-if="page !== '...'">
              {{ page }}
            </button>
            <span v-else class="px-2">...</span>
          </div>
    
          <button @click="nextPage" :disabled="currentPage === totalPages" class="flex items-center px-3 py-1 rounded disabled:opacity-50">
            Next <i class="bx bx-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: 'dashboard' })
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { API_URL } from '~/config'

  
  const router = useRouter()
  const parcelCrops = ref<any[]>([])
  const parcelCache: Record<string, string> = {} // pour éviter de re-appeler plusieurs fois le même parcel

  async function parcelName(id: string): Promise<string> {
    // Retourne directement si déjà en cache
    if (parcelCache[id]) return parcelCache[id]

    const token = sessionStorage.getItem('token')
    if (!token) return id // fallback à l'ID si pas de token

    try {
      const res = await fetch(`${API_URL}/api/parcels/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      })
      if (!res.ok) throw new Error('Parcel API error')
      const data = await res.json()
      parcelCache[id] = data.parcel_name
      return data.parcel_name
    } catch (err) {
      console.error('Erreur récupération parcel:', err)
      return id // fallback à l'ID en cas d'erreur
    }
  }


  const statusClasses = (statusName: string) => {
  switch (statusName) {
    case 'Planned':
      return 'bg-[#219ebc]/10 text-[#219ebc] border border-[#219ebc]/50' // bleu (info)
    case 'Planted':
      return 'bg-[#10b481]/10 text-[#10b481] border border-[#10b481]/50' // vert succès
    case 'Germinated':
      return 'bg-[#5fd4a2]/10 text-[#0c9069] border border-[#0c9069]/40' // vert clair
    case 'Growing':
      return 'bg-[#c99383]/10 text-[#c99383] border border-[#c99383]/50' // saumon
    case 'Flowering':
      return 'bg-[#f4a261]/10 text-[#f4a261] border border-[#f4a261]/50' // orange
    case 'Fruiting':
      return 'bg-[#6d4c41]/10 text-[#6d4c41] border border-[#6d4c41]/40' // brun
    case 'Mature':
      return 'bg-[#10b481]/10 text-[#0c9069] border border-[#10b481]/40' // vert foncé
    case 'Harvested':
      return 'bg-[#222831]/10 text-[#222831] border border-[#222831]/40' // neutre foncé
    case 'Post-Harvest':
      return 'bg-[#7a7a7a]/10 text-[#7a7a7a] border border-[#7a7a7a]/40' // gris neutre
    case 'Failed':
      return 'bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/50' // rouge
    default:
      return 'bg-gray-100 text-gray-600 border border-gray-300'
  }
}

  
  // Pagination
  const itemsPerPage = 4
  const currentPage = ref(1)
  const paginatedParcelCrops = ref<any[]>([])
  const totalPages = computed(() => Math.ceil(parcelCrops.value.length / itemsPerPage))
  const visiblePages = computed(() => {
    const pages = []
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
    return pages
  })
  const updatePaginated = () => {
    const start = (currentPage.value - 1) * itemsPerPage
    paginatedParcelCrops.value = parcelCrops.value.slice(start, start + itemsPerPage)
  }
  watch([parcelCrops, currentPage], updatePaginated, { immediate: true })
  
  // Load parcel crops
  onMounted(async () => {
    const token = sessionStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    try {
      const res = await fetch(`${API_URL}/api/parcel-crops/`, {
        headers: { Authorization: `Token ${token}` }
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      parcelCrops.value = await res.json()
      for (const crop of parcelCrops.value) {
      if (crop.parcel) {
        crop.parcel_name = await parcelName(crop.parcel)
      }
    }
    } catch (err) {
      console.error(err)
    }
  })
  
  // Actions
  const deleteParcelCrop = async (id: number) => {
    if (!confirm("Are you sure you want to delete this parcel crop?")) return
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch(`${API_URL}/api/parcel-crops/${id}/`, { method: 'DELETE', headers: { Authorization: `Token ${token}` }})
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      parcelCrops.value = parcelCrops.value.filter(pc => pc.id !== id)
      updatePaginated()
      alert("✅ Parcel crop deleted")
    } catch (err) { console.error(err); alert("❌ Failed to delete") }
  }
  
  const editParcelCrop = (id: number) => router.push(`/parcel-crops/edit/${id}`)
  const showParcelCrop = (id: number) => router.push(`/parcel-crops/show/${id}`)
  
  const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
  const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
  const goToPage = (page: number) => { currentPage.value = page }
  </script>
  