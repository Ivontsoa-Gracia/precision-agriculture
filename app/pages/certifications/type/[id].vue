<template>
    <section class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-4">{{ type.name }}</h1>
  
      <div class="space-y-2 text-gray-700">
        <p><strong>Description :</strong> {{ type.description || "-" }}</p>
        <p class="text-sm text-gray-400">
          Créé le {{ formatDate(type.created_at) }}
        </p>
      </div>
  
      <div class="mt-6 flex gap-4">
        <NuxtLink
          :to="`/certifications/type/edit/${type.uuid}`"
          class="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Éditer
        </NuxtLink>
        <NuxtLink
          to="/certifications/type"
          class="bg-gray-200 px-4 py-2 rounded"
        >
          Retour
        </NuxtLink>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: "dashboard" })
  
  import { ref, onMounted } from "vue"
  import { useRoute } from "vue-router"
  import { API_URL } from "~/config"
  
  const route = useRoute()
  const type = ref<any>({})
  
  const fetchType = async () => {
    const token = sessionStorage.getItem("token") || ""
    const res = await fetch(
      `${API_URL}/api/suivi-evaluation/certification-types/${route.params.id}/`,
      { headers: { Authorization: `Token ${token}` } }
    )
    type.value = await res.json()
  }
  
  const formatDate = (d: string) => new Date(d).toLocaleDateString()
  
  onMounted(fetchType)
  </script>
  