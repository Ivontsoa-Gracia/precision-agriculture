<template>
    <div class="p-6 max-w-5xl mx-auto bg-[#f9f9f9] rounded-2xl shadow-lg">
      <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2">
        <i class='bx bx-leaf text-3xl text-[#10b481]'></i>
        Crops List
      </h2>
  
      <!-- Add Crop Button -->
      <div class="flex justify-end mb-4">
        <NuxtLink 
          to="/crops/create" 
          class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white rounded-lg hover:bg-[#0da06a] transition"
        >
          <i class='bx bx-plus text-lg'></i> Add Crop
        </NuxtLink>
      </div>
  
      <!-- Table -->
      <div class="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table class="min-w-full text-left border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-2 border-b">Crop Name</th>
              <th class="px-6 py-2 border-b">Variety</th>
              <th class="px-6 py-2 border-b">Created At</th>
              <th class="px-6 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="crop in paginatedCrops" :key="crop.id" class="hover:bg-gray-50">
              <td class="px-6 py-2 border-b">{{ crop.name }}</td>
              <td class="px-6 py-2 border-b">{{ crop.variety?.name || "-" }}</td>
              <td class="px-6 py-2 border-b">{{ new Date(crop.created_at).toLocaleDateString() }}</td>
              <td class="p-3 border-b text-center flex justify-center gap-2">
                <button 
                  @click="editCrop(crop.id)" 
                  class="p-2 rounded-full hover:bg-[#10b481]/20"
                >
                  <i class="bx bx-edit text-[#10b481] text-xl"></i>
                </button>
                <button 
                  @click="deleteCrop(crop.id)" 
                  class="p-2 rounded-full hover:bg-red-100"
                >
                  <i class="bx bx-trash text-red-500 text-xl"></i>
                </button>
              </td>
            </tr>
            <tr v-if="paginatedCrops.length === 0">
              <td colspan="5" class="p-6 text-center text-gray-500">No crops found.</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4 mb-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="flex items-center px-3 py-1 rounded disabled:opacity-50"
        >
          <i class="bx bx-chevron-left"></i> Prev
        </button>
  
        <div class="flex items-center space-x-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 rounded',
              currentPage === page ? 'bg-[#10b481] text-white' : 'bg-gray-100 hover:bg-gray-200',
            ]"
            v-if="page !== '...'"
          >
            {{ page }}
          </button>
          <span v-else class="px-2">...</span>
        </div>
  
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="flex items-center px-3 py-1 rounded disabled:opacity-50"
        >
          Next <i class="bx bx-chevron-right"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: 'dashboard' })
  
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const crops = ref<any[]>([])
  
  // Pagination
  const itemsPerPage = 8
  const currentPage = ref(1)
  const paginatedCrops = ref<any[]>([])
  
  const totalPages = computed(() => Math.ceil(crops.value.length / itemsPerPage))
  const visiblePages = computed(() => {
    const pages = []
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
    return pages
  })
  
  const updatePaginated = () => {
    const start = (currentPage.value - 1) * itemsPerPage
    paginatedCrops.value = crops.value.slice(start, start + itemsPerPage)
  }
  
  watch([crops, currentPage], updatePaginated, { immediate: true })
  
  // Fetch crops
  onMounted(async () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
  
    try {
      const res = await fetch('https://previson-agriculture.onrender.com/api/crops/', {
        headers: { Authorization: `Token ${token}` }
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      crops.value = await res.json()
    } catch (err) {
      console.error("Failed to load crops:", err)
    }
  })
  
  // Actions
  const deleteCrop = async (id: number) => {
    const token = sessionStorage.getItem('token')
    if (!token) { router.push('/login'); return }
  
    if (!confirm("Are you sure you want to delete this crop?")) return
  
    try {
      const res = await fetch(`https://previson-agriculture.onrender.com/api/crops/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` }
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      crops.value = crops.value.filter(c => c.id !== id)
      updatePaginated()
      alert("✅ Crop deleted successfully")
    } catch (err) {
      console.error(err)
      alert("❌ Failed to delete crop")
    }
  }
  
  const editCrop = (id: number) => {
    router.push(`/crops/edit/${id}`)
  }
  
  const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
  const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
  const goToPage = (page: number) => { currentPage.value = page }
  </script>
  