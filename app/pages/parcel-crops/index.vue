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
              <th class="px-6 py-2 border-b">ID</th>
              <th class="px-6 py-2 border-b">Parcel</th>
              <th class="px-6 py-2 border-b">Crop</th>
              <th class="px-6 py-2 border-b">Planting Date</th>
              <th class="px-6 py-2 border-b">Harvest Date</th>
              <th class="px-6 py-2 border-b">Area (ha)</th>
              <th class="px-6 py-2 border-b">Status</th>
              <th class="px-6 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pc in paginatedParcelCrops" :key="pc.id" class="hover:bg-gray-50">
              <td class="px-6 py-2 border-b">{{ pc.id }}</td>
              <td class="px-6 py-2 border-b">{{ pc.parcel_name || pc.parcel }}</td>
              <td class="px-6 py-2 border-b">{{ pc.crop?.name || '-' }}</td>
              <td class="px-6 py-2 border-b">{{ pc.planting_date }}</td>
              <td class="px-6 py-2 border-b">{{ pc.harvest_date || '-' }}</td>
              <td class="px-6 py-2 border-b">{{ pc.area }}</td>
              <td class="px-6 py-2 border-b">{{ pc.status?.name || '-' }}</td>
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
  
  const router = useRouter()
  const parcelCrops = ref<any[]>([])
  
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
      const res = await fetch('https://mvp-dvws.onrender.com/api/parcel-crops/', {
        headers: { Authorization: `Token ${token}` }
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      parcelCrops.value = await res.json()
    } catch (err) {
      console.error(err)
    }
  })
  
  // Actions
  const deleteParcelCrop = async (id: number) => {
    if (!confirm("Are you sure you want to delete this parcel crop?")) return
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch(`https://mvp-dvws.onrender.com/api/parcel-crops/${id}/`, { method: 'DELETE', headers: { Authorization: `Token ${token}` }})
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
  