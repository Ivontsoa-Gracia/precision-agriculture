<template>
    <div class="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 class="text-3xl font-bold mb-6 text-[#10b481] flex items-center gap-2">
        <i class='bx bx-task text-3xl text-[#212121]'></i>
        New Task
      </h2>

  
      <form @submit.prevent="submitTask" class="space-y-4">
  
        <!-- Nom & Date côte à côte -->
        <div class="flex gap-4">
          <div class="flex-1 flex flex-col">
            <label class="block font-medium">Task Name *</label>
            <input v-model="form.name" type="text" required class="w-full border p-2 rounded focus:ring-[#212121]" />
          </div>
  
          <div class="flex-1 flex flex-col">
            <label class="block font-medium">Due Date *</label>
            <input v-model="form.due_date" type="date" required class="w-full border p-2 rounded focus:ring-[#212121]" />
          </div>
        </div>
  
        <!-- Description (full width) -->
        <div class="flex flex-col">
          <label class="block font-medium">Description *</label>
          <textarea v-model="form.description" required class="w-full border p-2 rounded focus:ring-[#212121]"></textarea>
        </div>
  
        <!-- ParcelCrop & Priority côte à côte -->
        <div class="flex gap-4">
          <div class="flex-1 flex flex-col">
            <label class="block font-medium">Parcel Crop</label>
            <select v-model="form.parcelCrop" class="w-full border p-2 rounded focus:ring-[#212121]">
              <option v-for="crop in parcelCrops" :key="crop.id" :value="crop.id">
                {{ crop.crop?.name }} ({{ crop.crop?.variety?.name }})
              </option>
            </select>
          </div>
  
          <div class="flex-1 flex flex-col">
            <label class="block font-medium">Priority</label>
            <select v-model="form.priority" class="w-full border p-2 rounded focus:ring-[#212121]">
              <option v-for="p in priorities" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>
        </div>
  
        <!-- Status (full width) -->
        <div class="flex flex-col">
          <label class="block font-medium">Status</label>
          <select v-model="form.status" class="w-full border p-2 rounded focus:ring-[#212121]">
            <option v-for="s in statuses" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
        </div>
  
        <!-- Button -->
        <button 
          type="submit" 
          class="w-full bg-gradient-to-r from-[#10b481] to-[#0a8f6e] text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Create Task
        </button>

  
      </form>
    </div>
  </template>

<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard'
  })

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Champs du formulaire
const form = ref({
  name: '',
  description: '',
  due_date: '',
  parcelCrop: null,
  priority: null,
  status: null,
})

// Options dynamiques
const priorities = ref<any[]>([])
const statuses = ref<any[]>([])
const parcelCrops = ref<any[]>([])

// Chargement de l'utilisateur (redirige si pas connecté)
onMounted(async () => {
  const uuid = sessionStorage.getItem('uuid')
  const token = sessionStorage.getItem('token')

  if (!uuid || !token) {
    router.push('/login')
    return
  }

  try {
    // Charger les priorités
    const priRes = await fetch('https://mvp-dvws.onrender.com/api/task-priority/', {
      headers: { Authorization: `Token ${token}` }
    })
    priorities.value = await priRes.json()

    // Charger les statuts
    const staRes = await fetch('https://mvp-dvws.onrender.com/api/task-status/', {
      headers: { Authorization: `Token ${token}` }
    })
    statuses.value = await staRes.json()

    // Charger les parcelCrops
    const cropRes = await fetch('https://mvp-dvws.onrender.com/api/parcel-crops/', {
      headers: { Authorization: `Token ${token}` }
    })
    parcelCrops.value = await cropRes.json()
  } catch (err) {
    console.error("Erreur lors du chargement des options:", err)
  }
})

// Soumission du formulaire
const submitTask = async () => {
  const token = sessionStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const res = await fetch('https://mvp-dvws.onrender.com/api/tasks/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value)
    })

    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status}`)
    }

    const data = await res.json()
    console.log("Tâche créée avec succès:", data)
    alert("✅ Tâche créée avec succès !")
    router.push('/tasks') // redirection après création
  } catch (err) {
    console.error("Erreur création tâche:", err)
    alert("❌ Impossible de créer la tâche")
  }
}
</script>