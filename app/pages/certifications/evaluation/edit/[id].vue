<template>
    <section class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Éditer une évaluation</h1>
  
      <form @submit.prevent="updateEvaluation" class="space-y-4">
        <div>
          <label>Type de certification *</label>
          <select v-model="form.cert_type" required class="w-full border px-3 py-2 rounded">
            <option value="" disabled>Choisir un type</option>
            <option v-for="type in certTypes" :key="type.uuid" :value="type.uuid">{{ type.name }}</option>
          </select>
        </div>
  
        <div>
          <label>Émis par *</label>
          <input v-model="form.issued_by" type="text" required class="w-full border px-3 py-2 rounded"/>
        </div>
  
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label>Date d’émission *</label>
            <input v-model="form.issued_at" type="date" required class="w-full border px-3 py-2 rounded"/>
          </div>
          <div>
            <label>Date d’expiration *</label>
            <input v-model="form.expires_at" type="date" required class="w-full border px-3 py-2 rounded"/>
          </div>
        </div>
  
        <div>
          <label>Statut *</label>
          <select v-model="form.status" required class="w-full border px-3 py-2 rounded">
            <option value="ACTIVE">ACTIVE</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="REVOKED">REVOKED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
  
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Sauvegarder</button>
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
  const form = ref({ cert_type: "", issued_by: "", issued_at: "", expires_at: "", status: "ACTIVE" })
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)
  const certTypes = ref<any[]>([])
  
  const fetchCertTypes = async () => {
    const token = sessionStorage.getItem("token") || ""
    const res = await fetch(`${API_URL}/api/suivi-evaluation/certification-types/`, {
      headers: { Authorization: `Token ${token}` },
    })
    certTypes.value = await res.json()
  }
  
  const fetchEvaluation = async () => {
    const token = sessionStorage.getItem("token") || ""
    const res = await fetch(`${API_URL}/api/suivi-evaluation/evaluation/${route.params.id}/`, {
      headers: { Authorization: `Token ${token}` },
    })
    const data = await res.json()
    form.value = {
      cert_type: data.cert_type.uuid,
      issued_by: data.issued_by,
      issued_at: data.issued_at,
      expires_at: data.expires_at,
      status: data.status,
    }
  }
  
  const updateEvaluation = async () => {
    error.value = null
    success.value = null
    try {
      const token = sessionStorage.getItem("token") || ""
      const res = await fetch(`${API_URL}/api/suivi-evaluation/evaluation/${route.params.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify(form.value),
      })
      if (!res.ok) throw new Error("Erreur lors de la mise à jour")
      success.value = "Évaluation mise à jour"
      setTimeout(() => router.push(`/certifications/evaluation/${route.params.id}`), 1000)
    } catch (err: any) {
      error.value = err.message
    }
  }
  
  onMounted(() => {
    fetchCertTypes()
    fetchEvaluation()
  })
  </script>
  