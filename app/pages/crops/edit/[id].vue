<template>
    <div class="bg-[#f9f9f9] shadow p-6 space-y-4 rounded-lg">
      <h2 class="text-3xl font-extrabold text-[#222831] mb-4">
        <i class='bx bx-edit text-3xl'></i>
        Edit Crop
      </h2>
  
      <form @submit.prevent="submitCrop" class="space-y-5">
        <!-- Crop Name -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium mb-1">Crop Name *</label>
          <input 
            v-model="form.name" 
            type="text" 
            placeholder="Enter crop name"
            required
            class="w-full p-2 border rounded bg-gray-100"
          />
        </div>
  
        <!-- Variety -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium mb-1">Variety *</label>
          <select 
            v-model="form.variety_id" 
            required
            class="w-full p-2 border rounded bg-gray-100"
          >
            <option v-for="v in varieties" :key="v.id" :value="v.id">
              {{ v.name }}
            </option>
          </select>
        </div>
  
        <!-- Submit -->
        <button 
          type="submit" 
          class="w-full bg-[#10b481] hover:bg-[#0da06a] transition-colors py-3 rounded-xl font-semibold text-white text-lg flex justify-center items-center gap-2"
        >
          <i class='bx bx-save text-xl'></i>
          Save Changes
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: 'dashboard'
  })
  
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  
  const router = useRouter()
  const route = useRoute()
  const cropId = route.params.id
  
  // Form data
  const form = ref({
    name: '',
    variety_id: null
  })
  
  // Varieties
  const varieties = ref<any[]>([])
  
  // Load varieties
  onMounted(async () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
  
    try {
      const res = await fetch('https://previson-agriculture.onrender.com/api/varieties/', {
        headers: { Authorization: `Token ${token}` }
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      varieties.value = await res.json()
    } catch (err) {
      console.error("Failed to load varieties:", err)
    }
  })
  
  // Load crop data
  onMounted(async () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
  
    try {
      const res = await fetch(`https://previson-agriculture.onrender.com/api/crops/${cropId}/`, {
        headers: { Authorization: `Token ${token}` }
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      form.value.name = data.name
      form.value.variety_id = data.variety_id
    } catch (err) {
      console.error("Failed to load crop:", err)
    }
  })
  
  // Submit update
  const submitCrop = async () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
  
    try {
      const res = await fetch(`https://previson-agriculture.onrender.com/api/crops/${cropId}/`, {
        method: 'PUT', // ou PATCH si tu veux partial update
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.value)
      })
  
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      alert("✅ Crop updated successfully!")
      router.push('/crops')
    } catch (err) {
      console.error(err)
      alert("❌ Failed to update crop")
    }
  }
  </script>
  
  <style scoped>
  input::placeholder,
  select::placeholder {
    color: rgba(255,255,255,0.6);
  }
  </style>
  