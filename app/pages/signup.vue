<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center" style="background: #212121;">
    <AuthForm
      title="Créer un compte"
      buttonText="S'inscrire"
      :fields="['username','email','first_name','last_name','password']"
      passwordLabel="Mot de passe"
      @submit="handleSignup"
    >
      <template #footer-links>
        <NuxtLink to="/login" class="text-white-600 hover:underline">Déjà un compte ? Connectez-vous</NuxtLink>
      </template>
    </AuthForm>
  </div>
</template>

<script setup lang="ts">
import AuthForm from '~/components/AuthForm.vue'

// Fonction handleSignup qui récupère les données du formulaire
const handleSignup = async (formData: {
  username: string
  email: string
  first_name?: string
  last_name?: string
  password: string
}) => {
  // Vérification des champs obligatoires
  if (!formData.username || !formData.email || !formData.password) {
    alert("Veuillez remplir tous les champs obligatoires")
    return
  }

  try {
    const response = await fetch('https://mvp-dvws.onrender.com/api/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
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
    alert('Inscription réussie !')

    // Redirection vers la page de login
    window.location.href = '/login'

  } catch (error) {
    console.error('Erreur réseau:', error)
    alert('Erreur réseau, vérifie ton serveur')
  }
}
</script>
