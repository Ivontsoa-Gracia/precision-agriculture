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
    <div v-if="isLoading" class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl">
        <div class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"></div>
    </div>
      <!-- Notification -->
    <transition name="fade">
      <div 
        v-if="notification.visible" 
        :class="['fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold', 
                 notification.type === 'success' ? 'bg-[#10b481]' : 'bg-red-500']">
        {{ notification.message }}
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: 'dashboard' })
  
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const isLoading = ref(false)

  // Notification state
  const notification = ref({
    visible: false,
    message: '',
    type: 'success' // 'success' | 'error'
  })

  const showNotification = (message: string, type: 'success' | 'error' = 'success', duration = 3000) => {
    notification.value.message = message
    notification.value.type = type
    notification.value.visible = true
    setTimeout(() => notification.value.visible = false, duration)
  }
  
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
      const res = await fetch('https://previson-agriculture.onrender.com/api/varieties/', {
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

    isLoading.value = true 
    try {
      const res = await fetch('https://previson-agriculture.onrender.com/api/crops/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.value)
      })
  
      if (!res.ok) throw new Error(`API error: ${res.status}`)
  
      await res.json()
      showNotification('Crop created successfully!', 'success')
      router.push('/parcel-crops/create')
    } catch (err) {
      console.error(err)
      showNotification('Network error, please check your server', 'error')
    }
      finally {
      isLoading.value = false 
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
  