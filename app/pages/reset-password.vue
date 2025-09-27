<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center" style="background: #212121;">
    <AuthForm
      title="Réinitialiser le mot de passe"
      buttonText="Envoyer lien"
      :fields="['email']"
      :showPassword="false"
      @submit="handleForgotPassword"
    >
      <template #footer-links>
        <NuxtLink to="/login" class="text-white-600 hover:underline">Retour à la connexion</NuxtLink>
      </template>
    </AuthForm>
  </div>
</template>

<script setup lang="ts">
import AuthForm from '~/components/AuthForm.vue'

const handleForgotPassword = async (formData: { email: string }) => {
  if (!formData.email) {
    alert("Veuillez entrer votre email")
    return
  }

  try {
    const response = await fetch('https://mvp-dvws.onrender.com/api/forgot-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email })
    })

    const data = await response.json()

    if (!response.ok) {
      console.log('Erreur forgot password:', data)
      // Affiche les erreurs spécifiques renvoyées par l'API
      const errors = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n')
      alert(errors)
      return
    }

    console.log('Lien de réinitialisation envoyé:', data)
    alert('Un lien de réinitialisation a été envoyé à votre email !')

  } catch (error) {
    console.error('Erreur réseau:', error)
    alert('Erreur réseau, vérifie ton serveur')
  }
}
</script>
