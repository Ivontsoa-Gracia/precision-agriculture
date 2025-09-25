<template>
    <div class="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2">
        <i class='bx bx-edit text-3xl text-[#212121]'></i>
        Edit Task
      </h2>
  
      <form @submit.prevent="submitTask" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <!-- Name -->
          <div class="flex flex-col">
            <label class="font-semibold mb-1">Task Name *</label>
            <input v-model="form.name" type="text" required
              class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]" />
          </div>
  
          <!-- Due Date -->
          <div class="flex flex-col">
            <label class="font-semibold mb-1">Due Date *</label>
            <input v-model="form.due_date" type="date" required
              class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]" />
          </div>
        </div>
  
        <!-- Description -->
        <div class="flex flex-col">
          <label class="font-semibold mb-1">Description *</label>
          <textarea v-model="form.description" required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"></textarea>
        </div>
  
        <div class="grid grid-cols-2 gap-4">
          <!-- Parcel Crop -->
          <div class="flex flex-col">
            <label class="font-semibold mb-1">Parcel Crop</label>
            <select v-model="form.parcelCrop"
              class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]">
              <option v-for="crop in parcelCrops" :key="crop.id" :value="crop.id">
                {{ crop.name }}
              </option>
            </select>
          </div>
  
          <!-- Priority -->
          <div class="flex flex-col">
            <label class="font-semibold mb-1">Priority</label>
            <select v-model="form.priority"
              class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]">
              <option v-for="p in priorities" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
        </div>
  
        <div class="gap-4">
          <!-- Status -->
          <div class="flex flex-col">
            <label class="font-semibold mb-1">Status</label>
            <select v-model="form.status"
              class="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]">
              <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
        </div>
  
        <button type="submit"
          class="w-full bg-[#10b481] hover:bg-[#0da06a] transition-colors py-3 rounded-xl text-white text-lg flex justify-center items-center gap-2">
          <i class='bx bx-save text-xl'></i>
          Save Task
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
    name: '',
    description: '',
    due_date: '',
    parcelCrop: null,
    priority: null,
    status: null
  })
  
  const priorities = ref<any[]>([])
  const statuses = ref<any[]>([])
  const parcelCrops = ref<any[]>([])
  
  onMounted(async () => {
    const token = sessionStorage.getItem('token')
    if (!token) { router.push('/login'); return }
  
    try {
      // Load task
      const res = await fetch(`https://mvp-dvws.onrender.com/api/tasks/${id}/`, { headers: { Authorization: `Token ${token}` } })
      const data = await res.json()
      form.value = {
        name: data.name,
        description: data.description,
        due_date: data.due_date,
        parcelCrop: data.parcelCrop,
        priority: data.priority,
        status: data.status
      }
  
      // Load dynamic options
      const [priRes, staRes, cropRes] = await Promise.all([
        fetch('https://mvp-dvws.onrender.com/api/task-priority/', { headers: { Authorization: `Token ${token}` } }),
        fetch('https://mvp-dvws.onrender.com/api/task-status/', { headers: { Authorization: `Token ${token}` } }),
        fetch('https://mvp-dvws.onrender.com/api/parcel-crops/', { headers: { Authorization: `Token ${token}` } })
      ])
      priorities.value = await priRes.json()
      statuses.value = await staRes.json()
      parcelCrops.value = await cropRes.json()
    } catch (err) {
      console.error(err)
      alert("Failed to load data")
    }
  })
  
  const submitTask = async () => {
    const token = sessionStorage.getItem('token')
    if (!token) { router.push('/login'); return }
  
    try {
      const res = await fetch(`https://mvp-dvws.onrender.com/api/tasks/${id}/`, {
        method: 'PUT',
        headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      alert("✅ Task updated successfully!")
      router.push('/tasks')
    } catch (err) {
      console.error(err)
      alert("❌ Failed to update task")
    }
  }
  </script>
  