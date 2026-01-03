<template>
  <div class="w-full md:w-2/3 mx-auto mt-12">
    <button
      @click="goBack"
      class="text-[#222831] hover:underline text-sm font-medium mb-4 inline-flex items-center gap-1"
    >
      <i class="bx bx-arrow-left"></i> {{ t("back") }}
    </button>

    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
        Report
      </h2>
      <button
        @click="goToEdit"
        class="text-[#222831] hover:text-[#10b481] text-2xl flex items-center"
        title="Edit"
      >
        <i class="bx bx-edit-alt"></i>
      </button>
    </div>

    <div
      v-if="loading"
      class="p-6 bg-white rounded-xl shadow text-gray-500"
    >
      Chargement du report…
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">Nom</p>
          <p class="font-medium text-gray-800 text-sm">{{ report.name }}</p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">Organisation</p>
          <p class="font-medium text-gray-800 text-sm">{{ organisation?.name }}</p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">Type</p>
          <p class="font-medium text-gray-800 text-sm">{{ report.type }}</p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">Statut</p>
          <p class="font-medium text-gray-800 text-sm">
            <slot>{{ report.status }}</slot>
          </p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">Periode</p>
          <p class="font-medium text-gray-800 text-sm">
            {{ formatDate(report.period_start) }} → {{ formatDate(report.period_end) }}
          </p>
        </div>
      </div>
    </div>
  </div>

      <!-- Error -->
      <p v-if="errorMessage" class="text-red-600">
        {{ errorMessage }}
      </p>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API_URL } from '~/config'
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();

const t = (key) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);


const route = useRoute()
const router = useRouter()

const report = ref<any>({})
const organisation = ref<any>(null)

const loading = ref(true)
const errorMessage = ref('')

// -------- helpers --------
const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString() : '—'

const statusClass = computed(() => {
  switch (report.value.status) {
    case 'APPROVED':
      return 'badge bg-green-100 text-green-700'
    case 'SUBMITTED':
      return 'badge bg-blue-100 text-blue-700'
    default:
      return 'badge bg-gray-100 text-gray-700'
  }
})

// -------- API --------
const fetchOrganisation = async (orgId: string) => {
  const token = sessionStorage.getItem('token') || ''
  const res = await fetch(`${API_URL}/api/groups/organisations/${orgId}/`, {
    headers: { Authorization: `Token ${token}` }
  })

  if (res.ok) {
    organisation.value = await res.json()
  }
}

const fetchReport = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const token = sessionStorage.getItem('token') || ''
    const res = await fetch(
      `${API_URL}/api/suivi-evaluation/reporting/${route.params.id}/`,
      { headers: { Authorization: `Token ${token}` } }
    )

    if (!res.ok) throw new Error('Impossible de récupérer le report')

    report.value = await res.json()
    console.log("Report", JSON.stringify(report.value, null, 2));


    if (report.value.organisation_id) {
      await fetchOrganisation(report.value.organisation_id)
    }
  } catch (err: any) {
    console.error(err)
    errorMessage.value = err.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const deleteReport = async () => {
  if (!confirm('Voulez-vous vraiment supprimer ce report ?')) return

  try {
    const token = sessionStorage.getItem('token') || ''
    const res = await fetch(
      `${API_URL}/api/suivi-evaluation/reporting/${route.params.id}/`,
      {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` }
      }
    )

    if (!res.ok) throw new Error('Impossible de supprimer le report')

    router.push('/reporting')
  } catch (err: any) {
    console.error(err)
    errorMessage.value = err.message || 'Erreur lors de la suppression'
  }
}

function goBack() {
  router.push("/reporting");
}

function goToEdit() {
  router.push("/reporting/edit/${report.uuid}")
}

onMounted(fetchReport)
</script>

