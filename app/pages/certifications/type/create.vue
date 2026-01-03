<template>
    <section class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Créer un type de certification</h1>
  
      <form @submit.prevent="createType" class="space-y-4">
        <div>
          <label class="block mb-1">Nom *</label>
          <input v-model="form.name" type="text" required maxlength="100"
            class="w-full border px-3 py-2 rounded"/>
        </div>
  
        <div>
          <label class="block mb-1">Description</label>
          <textarea v-model="form.description" class="w-full border px-3 py-2 rounded"></textarea>
        </div>
  
        <button type="submit" class="bg-[#10b481] text-white px-4 py-2 rounded">
          Créer
        </button>
  
        <p v-if="error" class="text-red-600">{{ error }}</p>
        <p v-if="success" class="text-green-600">{{ success }}</p>
      </form>
    </section>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: "dashboard" })
  import { ref } from "vue"
  import { useRouter } from "vue-router"
  import { API_URL } from "~/config"
  
  const router = useRouter()
  const form = ref({ name: "", description: "" })
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)
  
  const createType = async () => {
    error.value = null
    success.value = null
    try {
      const token = sessionStorage.getItem("token") || ""
      const res = await fetch(`${API_URL}/api/suivi-evaluation/certification-types/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify(form.value),
      })
      if (!res.ok) throw new Error("Erreur lors de la création")
      success.value = "Type créé avec succès"
      setTimeout(() => router.push("/certifications/type"), 1000)
    } catch (err: any) {
      error.value = err.message
    }
  }
  </script>
  