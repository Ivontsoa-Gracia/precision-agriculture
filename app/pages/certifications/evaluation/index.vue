<template>
  <section class="p-6">

    <div class="flex items-center justify-between mb-16">
      <h2
        class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2"
      >
      Évaluations / Certifications
      </h2>

      <NuxtLink
        to="/certifications/evaluation/create"
        class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white text-sm rounded hover:bg-[#0da06a] transition"
      >
        <i class="bx bx-plus"></i>
        {{ t("add") }}
      </NuxtLink>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 flex items-center justify-between mb-6">
      <nav class="flex space-x-8">
        <a
          href="#"
          @click.prevent="activeTab = 'certificat'"
          :class="[
            'border-b-2 py-4 px-1 font-medium text-sm',
            activeTab === 'certificat'
              ? 'text-[#10b481] border-[#10b481]'
              : 'border-transparent text-gray-500 hover:text-[#10b481] hover:border-[#10b481]'
          ]"
        >
          Certification
        </a>
        <a
          href="#"
          @click.prevent="activeTab = 'historique'"
          :class="[
            'border-b-2 py-4 px-1 font-medium text-sm',
            activeTab === 'historique'
              ? 'text-[#10b481] border-[#10b481]'
              : 'border-transparent text-gray-500 hover:text-[#10b481] hover:border-[#10b481]'
          ]"
        >
          Historique des changements
        </a>
      </nav>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white">
      <table class="min-w-[700px] w-full text-left border-collapse">
        <thead class="bg-[#FAFAF9]">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Type de certification</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Émis par</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Date d’émission</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Date d’expiration</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Statut</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="evaluation in paginatedEvaluations" :key="evaluation.uuid" class="border-t hover:bg-[#FAFAF9]">
            <td class="px-6 py-2 border-b text-sm text-gray-900">{{ evaluation.cert_type_detail?.name }}</td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">{{ evaluation.issued_by }}</td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">{{ evaluation.issued_at }}</td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">{{ evaluation.expires_at }}</td>
            <td class="px-6 py-2 border-b text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs border font-semibold',
                  evaluation.status === 'VALID' ? 'text-green-600 border-green-600 bg-green-100' :
                  evaluation.status === 'EXPIRED' ? 'text-red-600 border-red-600 bg-red-100' :
                  evaluation.status === 'REVOKED' ? 'text-yellow-600 border-yellow-600 bg-yellow-100' :
                  evaluation.status === 'PENDING' ? 'text-blue-600 border-blue-600 bg-blue-100' : ''
                ]"
              >
                {{ evaluation.status.charAt(0) + evaluation.status.slice(1).toLowerCase() }}
              </span>
            </td>

            <td class="p-3 border-b text-center flex justify-center items-center gap-2">
              <NuxtLink
                :to="`/certifications/evaluation/${evaluation.uuid}`"
                class="p-1 px-2 rounded hover:bg-[#10b481]/20"
              >
                <i class="bx bx-show text-[#10b481] text-lg"></i>
              </NuxtLink>

              <NuxtLink
                :to="`/certifications/evaluation/edit/${evaluation.uuid}`"
                class="p-1 px-2 rounded hover:bg-[#f4a261]/10"
              >
                <i class="bx bx-edit text-[#f4a261] text-lg"></i>
              </NuxtLink>

              <button
                @click="deleteEvaluation(evaluation.uuid)"
                class="p-1 px-2 rounded hover:bg-[#e63946]/10"
              >
                <i class="bx bx-trash text-[#e63946] text-lg"></i>
              </button>
            </td>
          </tr>

          <tr v-if="evaluations.length === 0">
            <td colspan="6" class="text-center py-4 text-gray-500">Aucune évaluation trouvée</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="bg-white px-4 py-3 flex items-center justify-between sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">{{ t("prev") }}</button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">{{ t("next") }}</button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            {{ t('affichage') }} <span class="font-medium">{{ currentPage }}</span> {{ t('a') }}
            <span class="font-medium">{{ totalPages }}</span> {{ t('sur') }}
            <span class="font-medium">{{ evaluations.length }}</span> {{ t('résultats') }}
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span class="sr-only">{{ t("prev") }}</span>
              <i class="bx bx-chevron-left"></i>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                currentPage === page
                  ? 'z-10 bg-[#10b481]/10 border-[#10b481] text-[#10b481]'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>

            <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span class="sr-only">{{ t("next") }}</span>
              <i class="bx bx-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" })
import { ref, computed, onMounted, watch } from "vue"
import { API_URL } from "~/config"
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;

const evaluations = ref<any[]>([])
const activeTab = ref("certificat")
const itemsPerPage = 4
const currentPage = ref(1)
const paginatedEvaluations = ref<any[]>([])

const totalPages = computed(() => Math.ceil(evaluations.value.length / itemsPerPage))
const visiblePages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const updatePaginated = () => {
  const start = (currentPage.value - 1) * itemsPerPage
  paginatedEvaluations.value = evaluations.value.slice(start, start + itemsPerPage)
}
watch([evaluations, currentPage], updatePaginated, { immediate: true })

const fetchEvaluations = async () => {
  const token = sessionStorage.getItem("token") || ""
  const res = await fetch(`${API_URL}/api/suivi-evaluation/evaluation/`, {
    headers: { Authorization: `Token ${token}` },
  })
  evaluations.value = await res.json()
}

const deleteEvaluation = async (uuid: string) => {
  if (!confirm("Supprimer cette évaluation ?")) return
  const token = sessionStorage.getItem("token") || ""
  await fetch(`${API_URL}/api/suivi-evaluation/evaluation/${uuid}/`, {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` },
  })
  fetchEvaluations()
}

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const goToPage = (page: number) => { currentPage.value = page }

onMounted(fetchEvaluations)
</script>
