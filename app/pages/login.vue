<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center" style="background: #212121;">
    <AuthForm
      title="Login"
      buttonText="Se connecter"
      :fields="['username','password']"
      passwordLabel="Password"
      @submit="handleLogin"
    >
      <template #footer-links>
        <NuxtLink to="/signup" class="text-white-600 hover:underline mr-4">Sign Up</NuxtLink>
        <!-- <NuxtLink to="/reset-password" class="text-white-600 hover:underline">Forgot Password?</NuxtLink> -->
      </template>
    </AuthForm>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthForm from '~/components/AuthForm.vue'

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

const handleLogin = async (formData: { username: string; password: string }) => {
  if (!formData.username || !formData.password) {
    alert("Veuillez remplir tous les champs")
    return
  }

  isLoading.value = true 
  try {
    const response = await fetch('https://previson-agriculture.onrender.com/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!response.ok) {
      showNotification(data.detail ? data.detail : JSON.stringify(data))

      return
    }

    // Login réussi
    sessionStorage.setItem('token', data.token)
    sessionStorage.setItem('uuid', data.user.uuid)
    showNotification('Signup successful!', 'success')
    window.location.href = '/dashboard'

  } catch (error) {
    console.error('Erreur réseau:', error)
    showNotification('Network error, please check your server', 'error')
  } finally {
    isLoading.value = false 
  }
}
</script>
