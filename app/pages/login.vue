<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center" style="background: #212121;">
    <AuthForm
      title="Login"
      buttonText="Se connecter"
      :fields="['username','password']"
      passwordLabel="Mot de passe"
      @submit="handleLogin"
    >
      <template #footer-links>
        <NuxtLink to="/signup" class="text-white-600 hover:underline mr-4">S'inscrire</NuxtLink>
        <NuxtLink to="/reset-password" class="text-white-600 hover:underline">Mot de passe oublié ?</NuxtLink>
      </template>
    </AuthForm>
  </div>
</template>

<script setup lang="ts">
import AuthForm from '~/components/AuthForm.vue'

// handleLogin reçoit un objet contenant username et password
const handleLogin = async (formData: { username: string; password: string }) => {
  if (!formData.username || !formData.password) {
    alert("Veuillez remplir tous les champs")
    return
  }

  try {
    const response = await fetch('https://mvp-dvws.onrender.com/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log('Erreur login:', data)
      alert(
        data.detail ? data.detail : JSON.stringify(data)
      )
      return
    }

    // Login réussi
    // console.log('Login réussi:', data)
    sessionStorage.setItem('token', data.token)
    sessionStorage.setItem('uuid', data.user.uuid)
    alert('Connexion réussie !')

    // Redirection vers le dashboard
    window.location.href = '/dashboard'

  } catch (error) {
    console.error('Erreur réseau:', error)
    alert('Erreur réseau, vérifie ton serveur')
  }
}
</script>
