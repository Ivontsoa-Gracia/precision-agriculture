<template>
    <section class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Éditer le type de certification</h1>
  
      <form @submit.prevent="updateType" class="space-y-4">
        <div>
          <label class="block mb-1">Nom *</label>
          <input v-model="form.name" type="text" required maxlength="100"
            class="w-full border px-3 py-2 rounded"/>
        </div>
  
        <div>
          <label class="block mb-1">Description</label>
          <textarea v-model="form.description" class="w-full border px-3 py-2 rounded"></textarea>
        </div>
  
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
          Sauvegarder
        </button>
  
        <p v-if="error" class="text-red-600">{{ error }}</p>
        <p v-if="success" class="text-green-600">{{ success }}</p>
      </form>
    </section>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: "dashboard" })
  import { ref, onMounted } from "vue"
  import { useRouter, useRoute } from "vue-router"
  import { API_URL } from "~/config"
  
  const router = useRouter()
  const route = useRoute()
  const form = ref({ name: "", description: "" })
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)
  
  const fetchType = async () => {
    const token = sessionStorage.getItem("token") || ""
    const res = await fetch(`${API_URL}/api/suivi-evaluation/certification-types/${route.params.id}/`, {
      headers: { Authorization: `Token ${token}` },
    })
    form.value = await res.json()
  }
  
  const updateType = async () => {
    error.value = null
    success.value = null
    try {
      const token = sessionStorage.getItem("token") || ""
      const res = await fetch(`${API_URL}/api/suivi-evaluation/certification-types/${route.params.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify(form.value),
      })
      if (!res.ok) throw new Error("Erreur lors de la mise à jour")
      success.value = "Type mis à jour avec succès"
      setTimeout(() => router.push(`/certifications/type/${route.params.id}`), 1000)
    } catch (err: any) {
      error.value = err.message
    }
  }
  
  onMounted(fetchType)
  </script>
  