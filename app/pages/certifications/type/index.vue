<template>
    <section class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Types de certification</h1>
        <NuxtLink
          to="/certifications/type/create"
          class="bg-[#10b481] text-white px-4 py-2 rounded"
        >
          + Nouveau type
        </NuxtLink>
      </div>
  
      <div class="overflow-x-auto bg-white rounded shadow">
        <table class="w-full border">
          <thead class="bg-gray-100">
            <tr>
              <th class="th">Nom</th>
              <th class="th">Description</th>
              <th class="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="type in types" :key="type.uuid" class="border-t">
              <td class="td">{{ type.name }}</td>
              <td class="td">{{ type.description || "-" }}</td>
              <td class="td flex gap-2">
                <NuxtLink
                  :to="`/certifications/type/${type.uuid}`"
                  class="text-blue-600"
                >
                  Voir
                </NuxtLink>
                <NuxtLink
                  :to="`/certifications/type/edit/${type.uuid}`"
                  class="text-green-600"
                >
                  Éditer
                </NuxtLink>
                <button
                  @click="deleteType(type.uuid)"
                  class="text-red-600"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: "dashboard" })
  
  import { ref, onMounted } from "vue"
  import { API_URL } from "~/config"
  
  const types = ref<any[]>([])
  
  const fetchTypes = async () => {
    const token = sessionStorage.getItem("token") || ""
    const res = await fetch(`${API_URL}/api/suivi-evaluation/certification-types/`, {
      headers: { Authorization: `Token ${token}` },
    })
    types.value = await res.json()
  }
  
  const deleteType = async (uuid: string) => {
    if (!confirm("Supprimer ce type ?")) return
    const token = sessionStorage.getItem("token") || ""
    await fetch(`${API_URL}/api/suivi-evaluation/certification-types/${uuid}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    })
    fetchTypes()
  }
  
  onMounted(fetchTypes)
  </script>
  
  <style scoped>
  .th { padding: 10px; text-align: left; }
  .td { padding: 10px; }
  </style>
  