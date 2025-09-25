<template>
    <div class="p-6 mx-auto">
      <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2">
        <i class='bx bx-task text-3xl text-[#10b481]'></i>
        Tasks List
      </h2>
  
      <!-- Add Task Button -->
      <div class="flex justify-end mb-4">
        <NuxtLink
          to="/tasks/create"
          class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white rounded-lg hover:bg-[#0da06a] transition"
        >
          <i class='bx bx-plus text-lg'></i> Add Task
        </NuxtLink>
      </div>
  
      <!-- Table -->
      <div class="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table class="min-w-full text-left border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-2 border-b">ID</th>
              <th class="px-6 py-2 border-b">Name</th>
              <th class="px-6 py-2 border-b">Due Date</th>
              <th class="px-6 py-2 border-b">Parcel Crop</th>
              <th class="px-6 py-2 border-b">Priority</th>
              <th class="px-6 py-2 border-b">Status</th>
              <th class="px-6 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in paginatedTasks" :key="task.id" class="hover:bg-gray-50">
              <td class="px-6 py-2 border-b">{{ task.id }}</td>
              <td class="px-6 py-2 border-b">{{ task.name }}</td>
              <td class="px-6 py-2 border-b">{{ new Date(task.due_date).toLocaleDateString() }}</td>
              <td class="px-6 py-2 border-b">{{ task.parcelCrop || '-' }}</td>
              <td class="px-6 py-2 border-b">{{ task.priority || '-' }}</td>
              <td class="px-6 py-2 border-b">{{ task.status || '-' }}</td>
              <td class="p-3 border-b text-center flex justify-center gap-2">
                <button @click="showTask(task.id)" class="p-2 rounded-full hover:bg-[#10b481]/20">
                  <i class="bx bx-show text-[#10b481] text-xl"></i>
                </button>
                <button @click="editTask(task.id)" class="p-2 rounded-full hover:bg-[#f4a261]/10">
                  <i class="bx bx-edit text-[#f4a261] text-xl"></i>
                </button>
                <button @click="deleteTask(task.id)" class="p-2 rounded-full hover:bg-[#e63946]/10">
                  <i class="bx bx-trash text-[#e63946] text-xl"></i>
                </button>
              </td>
            </tr>
            <tr v-if="paginatedTasks.length === 0">
              <td colspan="7" class="p-6 text-center text-gray-500">No tasks found.</td>
            </tr>
          </tbody>
        </table>

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
            >
              {{ page }}
            </button>
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
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: 'dashboard' })
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const tasks = ref<any[]>([])
  
  // Pagination
  const itemsPerPage = 8
  const currentPage = ref(1)
  const paginatedTasks = ref<any[]>([])
  
  const totalPages = computed(() => Math.ceil(tasks.value.length / itemsPerPage))
  const visiblePages = computed(() => {
    const pages = []
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
    return pages
  })
  
  const updatePaginated = () => {
    const start = (currentPage.value - 1) * itemsPerPage
    paginatedTasks.value = tasks.value.slice(start, start + itemsPerPage)
  }
  
  watch([tasks, currentPage], updatePaginated, { immediate: true })
  
  // Fetch tasks
  onMounted(async () => {
    const token = sessionStorage.getItem('token')
    if (!token) { router.push('/login'); return }
  
    try {
      const res = await fetch('https://mvp-dvws.onrender.com/api/tasks/', {
        headers: { Authorization: `Token ${token}` }
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      tasks.value = await res.json()
    } catch (err) {
      console.error("Failed to load tasks:", err)
    }
  })
  
  // Actions
  const deleteTask = async (id: number) => {
    const token = sessionStorage.getItem('token')
    if (!token) { router.push('/login'); return }
  
    if (!confirm("Are you sure you want to delete this task?")) return
  
    try {
      const res = await fetch(`https://mvp-dvws.onrender.com/api/tasks/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` }
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      tasks.value = tasks.value.filter(t => t.id !== id)
      updatePaginated()
      alert("✅ Task deleted successfully")
    } catch (err) {
      console.error(err)
      alert("❌ Failed to delete task")
    }
  }
  
  const editTask = (id: number) => router.push(`/tasks/edit/${id}`)
  const showTask = (id: number) => router.push(`/tasks/show/${id}`)
  const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
  const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
  const goToPage = (page: number) => { currentPage.value = page }
  </script>
  