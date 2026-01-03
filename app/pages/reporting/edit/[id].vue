<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Modifier le report</h1>
      <router-link
        to="/reporting"
        class="text-sm text-gray-600 hover:underline"
      >
        ← Retour à la liste
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500"></div>

    <!-- Form -->
    <form v-else @submit.prevent="updateReport" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nom -->
        <div>
          <label class="text-gray-700 text-sm font-medium mb-1">Nom du report</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border p-2 rounded bg-transparent text-sm"
            required
          />
        </div>

        <!-- Type -->
        <div>
          <label class="text-gray-700 text-sm font-medium mb-1">Type</label>
          <select v-model="form.type" class="w-full border p-2 rounded bg-transparent text-sm">
            <option value="AUDIT">Audit</option>
            <option value="PROGRESS">Progress</option>
            <option value="FINANCIAL">Financial</option>
            <option value="IMPACT">Impact</option>
          </select>
        </div>

        <!-- Organisation -->
        <div>
          <label class="text-gray-700 text-sm font-medium mb-1">Organisation</label>
          <select v-model="form.organisation_id" class="w-full border p-2 rounded bg-transparent text-sm">
            <option disabled value="">-- Choisir une organisation --</option>
            <option
              v-for="org in organisations"
              :key="org.uuid"
              :value="org.uuid"
            >
              {{ org.name }}
            </option>
          </select>
        </div>

        <!-- Statut -->
        <div>
          <label class="text-gray-700 text-sm font-medium mb-1">Statut</label>
          <select v-model="form.status" class="w-full border p-2 rounded bg-transparent text-sm">
            <option value="DRAFT">Brouillon</option>
            <option value="SUBMITTED">Soumis</option>
            <option value="APPROVED">Validé</option>
          </select>
        </div>

        <!-- Date début -->
        <div>
          <label class="text-gray-700 text-sm font-medium mb-1">Date début</label>
          <input
            type="date"
            v-model="form.period_start"
            class="w-full border p-2 rounded bg-transparent text-sm"
          />
        </div>

        <!-- Date fin -->
        <div>
          <label class="text-gray-700 text-sm font-medium mb-1">Date fin</label>
          <input
            type="date"
            v-model="form.period_end"
            class="w-full border p-2 rounded bg-transparent text-sm"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4 pt-4">
        <button
          type="submit"
          class="w-full bg-[#10b481] hover:bg-[#0da06a] transition-colors py-3 rounded text-white text-sm flex justify-center items-center gap-2"
        >
          Enregistrer
        </button>

      </div>

      <!-- Error -->
      <p v-if="errorMessage" class="text-red-600 mt-2">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API_URL } from '~/config'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const errorMessage = ref('')

const organisations = ref<any[]>([])

const form = ref({
  name: '',
  type: '',
  organisation_id: '',
  period_start: '',
  period_end: '',
  status: ''
})

/* ------------------ FETCH REPORT ------------------ */
const fetchReport = async () => {
  const token = sessionStorage.getItem('token') || ''
  const res = await fetch(
    `${API_URL}/api/suivi-evaluation/reporting/${route.params.id}/`,
    { headers: { Authorization: `Token ${token}` } }
  )

  if (!res.ok) throw new Error('Impossible de charger le report')
  const data = await res.json()

  form.value = {
    name: data.name,
    type: data.type,
    organisation_id: data.organisation_id || '',
    period_start: data.period_start,
    period_end: data.period_end,
    status: data.status
  }
}

/* ------------------ FETCH ORGANISATIONS ------------------ */
const fetchOrganisations = async () => {
  const token = sessionStorage.getItem('token') || ''
  const res = await fetch(
    `${API_URL}/api/groups/organisations/`,
    { headers: { Authorization: `Token ${token}` } }
  )

  if (res.ok) {
    organisations.value = await res.json()
  }
}

/* ------------------ UPDATE ------------------ */
const updateReport = async () => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const res = await fetch(
      `${API_URL}/api/suivi-evaluation/reporting/${route.params.id}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.value)
      }
    )

    if (!res.ok) throw new Error('Échec de la mise à jour')

    router.push(`/reporting/${route.params.id}`)
  } catch (err: any) {
    errorMessage.value = err.message || 'Erreur inconnue'
  }
}

onMounted(async () => {
  try {
    await fetchOrganisations()
    await fetchReport()
  } catch (e: any) {
    errorMessage.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #374151;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
</style>
