<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center" style="background: #212121;">
    <AuthForm
      title="Créer un compte"
      buttonText="S'inscrire"
      :fields="['first_name','last_name','email','password']"
      passwordLabel="Password"
      @submit="handleSignup"
    >
      <template #footer-links>
        <NuxtLink to="/login" class="text-white-600 hover:underline">Already have an account? Log in</NuxtLink>
      </template>
    </AuthForm>
  </div>
  <div v-if="isLoading" class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl">
      <div class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"></div>
  </div>
  <!-- Notification -->
  <transition name="fade">
      <div 
        v-if="notification.visible" 
        :class="['fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold', 
                 notification.type === 'success' ? 'bg-green-500' : 'bg-red-500']">
        {{ notification.message }}
      </div>
    </transition>
</template>

<script setup lang="ts">
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

const handleSignup = async (formData: {
  email: string
  first_name?: string
  last_name?: string
  password: string
}) => {
  if (!formData.email || !formData.password) {
    alert("Veuillez remplir tous les champs obligatoires")
    return
  }

  isLoading.value = true 
  try {
    const response = await fetch('https://previson-agriculture.onrender.com/api/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.first_name,
        email: formData.email,
        first_name: formData.first_name || "",
        last_name: formData.last_name || "",
        password: formData.password
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log('Erreur signup:', data)
      // Affichage des messages d'erreur renvoyés par l'API
      const errors = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n')
      alert(errors)
      return
    }

    console.log('Inscription réussie:', data)
    showNotification('Signup successful!', 'success')


    window.location.href = '/login'

  } catch (error) {
    console.error('Erreur réseau:', error)
    showNotification('Network error, please check your server', 'error')
  }
  finally {
    isLoading.value = false 
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
