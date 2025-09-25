<template>
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-3">
        <i class='bx bx-leaf text-3xl text-[#10b481]'></i>
        New Crop
      </h2>

  
      <form @submit.prevent="submitCrop" class="space-y-5">
        <!-- Crop Name -->
        <div class="flex flex-col">
          <label class="block font-medium">Crop Name *</label>
          <input 
            v-model="form.name" 
            type="text" 
            placeholder="Enter crop name"
            required
            class="w-full border p-2 rounded focus:ring-[#212121]"
          />
        </div>
  
        <!-- Variety -->
        <div class="flex flex-col">
          <label class="block font-medium">Variety *</label>
          <select 
            v-model="form.variety_id" 
            required
            class="w-full border p-2 rounded focus:ring-[#212121]"
          >
            <option v-for="v in varieties" :key="v.id" :value="v.id">
              {{ v.name }}
            </option>
          </select>
        </div>
  
        <!-- Submit -->
        <button 
          type="submit" 
          class="w-full bg-[#10b481] hover:bg-[#0da06a] transition-colors py-3 rounded-xl text-white text-lg flex justify-center items-center gap-2"
        >
          <i class='bx bx-plus text-xl'></i>
          Add Crop
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: 'dashboard' })
  
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // Form
  const form = ref({
    name: '',
    variety_id: null
  })
  
  // Varieties
  const varieties = ref<any[]>([])
  
  onMounted(async () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
  
    try {
      const res = await fetch('https://mvp-dvws.onrender.com/api/varieties/', {
        headers: { Authorization: `Token ${token}` }
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      varieties.value = await res.json()
    } catch (err) {
      console.error("Failed to load varieties:", err)
    }
  })
  
  // Submit
  const submitCrop = async () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
  
    try {
      const res = await fetch('https://mvp-dvws.onrender.com/api/crops/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.value)
      })
  
      if (!res.ok) throw new Error(`API error: ${res.status}`)
  
      await res.json()
      alert("✅ Crop created successfully!")
      router.push('/crops')
    } catch (err) {
      console.error(err)
      alert("❌ Failed to create crop")
    }
  }
  </script>
  
  <style scoped>
  /* Placeholder text gris clair pour inputs et select */
  input::placeholder,
  select::placeholder {
    color: rgba(33,33,33,0.5);
  }
  </style>
  