<template>
    <div class="max-w-md mx-auto py-10 px-6">
      <h2 class="text-2xl font-bold mb-6">Ajouter une catégorie d'indicateur</h2>
  
      <form @submit.prevent="createCategory" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Nom de la catégorie</label>
          <input
            v-model="name"
            type="text"
            placeholder="Ex: Production"
            class="w-full border rounded-lg p-3"
            required
          />
        </div>
  
        <div>
          <label class="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            v-model="description"
            placeholder="Description de la catégorie"
            class="w-full border rounded-lg p-3"
            rows="3"
          ></textarea>
        </div>
  
        <button
          type="submit"
          class="w-full bg-green-600 text-white py-3 rounded-xl mt-4 hover:bg-green-700 transition"
        >
          Ajouter
        </button>
      </form>
  
      <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
definePageMeta({ layout: "dashboard" });

  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { API_URL } from '~/config'
  
  const router = useRouter()


  
  const name = ref('')
  const description = ref('')
  const successMessage = ref('')
  const errorMessage = ref('')
  
  const token = sessionStorage.getItem('token') || ''
  
  async function createCategory() {
    successMessage.value = ''
    errorMessage.value = ''
  
    try {
      const res = await $fetch(`${API_URL}/api/suivi-evaluation/indicator-categories/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
        body: { name: name.value, description: description.value }
      })
  
      successMessage.value = `Catégorie "${res.name}" ajoutée avec succès !`
      name.value = ''
      description.value = ''
    } catch (err: any) {
      console.error(err)
      errorMessage.value = err?.data?.detail || 'Erreur lors de la création de la catégorie.'
    }
  }
  </script>
  