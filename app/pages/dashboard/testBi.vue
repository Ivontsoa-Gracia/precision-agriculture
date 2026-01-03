<template>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Dashboard BI</h1>
  
      <div v-if="loading" class="text-gray-500">Chargement des données...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <!-- Organisation -->
        <div class="mb-6 p-4 border rounded-lg shadow-sm bg-white">
          <h2 class="text-xl font-semibold mb-2">Organisation</h2>
          <p><strong>Nom :</strong> {{ dashboard.organisation.name }}</p>
          <p>
            <strong>Conformité :</strong>
            <span
              :class="dashboard.organisation.conformite === 'CONFORME' ? 'text-green-600' : 'text-red-600'"
            >
              {{ dashboard.organisation.conformite }}
            </span>
          </p>
        </div>
  
        <!-- KPIs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="kpi in dashboard.kpis"
            :key="kpi.code"
            class="p-4 border rounded-lg shadow-sm bg-white flex flex-col justify-between"
          >
            <h3 class="text-lg font-medium">{{ kpi.indicator }}</h3>
            <p class="text-2xl font-bold mt-2">{{ kpi.value }} {{ kpi.unit }}</p>
            <span>{{ kpi.evolution_percent }}</span>
            <span>{{ kpi.period }}</span>
            <span>{{ kpi.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { API_URL } from "~/config";
  
  // état
  const dashboard = ref<any>(null)
  const loading = ref(true)
  const error = ref('')
  
  // fonction fetch
  const fetchDashboard = async () => {
    const token = sessionStorage.getItem("token") || ""
    loading.value = true
    error.value = ''
    try {
      const res = await axios.get(`${API_URL}/api/suivi-evaluation/dashboard-bi/`, {
        headers: { Authorization: `Token ${token}` },
      })
      dashboard.value = res.data
      console.log("Dashboard Bi JSON:", JSON.stringify(dashboard.value, null, 2));

    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur lors du chargement du dashboard'
    } finally {
      loading.value = false
    }
  }
  
  // fetch au montage
  onMounted(() => {
    fetchDashboard()
  })
  </script>
  
  <style scoped>
  /* simple styling */
  body {
    background-color: #f9fafb;
  }
  </style>
  