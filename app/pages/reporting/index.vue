<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-16">
      <h2
        class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2"
      >
        Liste des Reports
      </h2>

      <button
        @click="goToCreate"
        class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white text-sm rounded hover:bg-[#0da06a] transition"
      >
        <i class="bx bx-plus"></i>
        Add
      </button>
    </div>

    <div
      class="flex items-center gap-3 border border-gray-200 rounded px-3 py-2 bg-white mb-4"
    >
      <!-- Filtre Nom -->
      <div class="relative flex-1">
        <i
          class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        ></i>
        <input
          v-model="search"
          type="text"
          class="w-full pl-10 pr-3 py-2 text-sm bg-transparent focus:outline-none"
          placeholder="Filtrer par nom"
        />
      </div>
      <div class="w-px h-6 bg-gray-200"></div>

      <select
        v-model="orgFilter"
        class="text-sm text-gray-700 bg-transparent focus:outline-none"
      >
        <option value="">Tous les organisations</option>
        <option v-for="type in orgs" :key="type.value" :value="type.value">
          {{ type.label }}
        </option>
      </select>

      <div class="w-px h-6 bg-gray-200"></div>

      <select
        v-model="typeFilter"
        class="text-sm text-gray-700 bg-transparent focus:outline-none"
      >
        <option value="">Tous les types</option>
        <option
          v-for="type in reportTypes"
          :key="type.value"
          :value="type.value"
        >
          {{ type.label }}
        </option>
      </select>

      <div class="w-px h-6 bg-gray-200"></div>

      <!-- Filtre Statut -->
      <select
        v-model="statusFilter"
        class="text-sm text-gray-700 bg-transparent focus:outline-none"
      >
        <option value="">Tous les statuts</option>
        <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
      </select>

      <div class="w-px h-6 bg-gray-200"></div>

      <!-- Filtre Période -->
      <input
        type="date"
        v-model="startDate"
        class="text-sm text-gray-700 bg-transparent focus:outline-none"
      />
      <span>→</span>
      <input
        type="date"
        v-model="endDate"
        class="text-sm text-gray-700 bg-transparent focus:outline-none"
      />

      <div class="w-px h-6 bg-gray-200"></div>

      <button
        @click="resetFilters"
        class="text-sm text-gray-500 hover:text-gray-900 transition"
      >
        Reset
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white">
      <table class="min-w-[700px] w-full text-left border-collapse">
        <thead class="bg-[#FAFAF9]">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              Nom
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              Organisation
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              Type
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              Période
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              Statut
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="report in paginatedReports"
            :key="report.uuid"
            class="hover:bg-[#FAFAF9]"
          >
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ report.name }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ organisations[report.organisation_id]?.name || "—" }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ report.type }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ report.period_start }} → {{ report.period_end }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ report.status }}
            </td>
            <td
              class="p-3 border-b text-center flex justify-center items-center gap-2"
            >
              <button
                @click="goToDetail(report.uuid)"
                class="p-1 px-2 rounded hover:bg-[#10b481]/20"
              >
                <i class="bx bx-show text-[#10b481] text-lg"></i>
              </button>
              <button
                @click="goToEdit(report.uuid)"
                class="p-1 px-2 rounded hover:bg-[#f4a261]/10"
              >
                <i class="bx bx-edit text-[#f4a261] text-lg"></i>
              </button>
              <button class="p-1 px-2 rounded hover:bg-[#e63946]/10">
                <i class="bx bx-trash text-[#e63946] text-lg"></i>
              </button>
            </td>
          </tr>

          <tr v-if="filteredReports.length === 0">
            <td colspan="6" class="text-center py-4 text-gray-500">
              Aucun report trouvé
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bg-white px-4 py-3 flex items-center justify-between sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          {{ t("prev") }}
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          {{ t("next") }}
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            {{ t("affichage") }}
            <span class="font-medium">{{ currentPage }}</span> {{ t("a") }}
            <span class="font-medium">{{ totalPages }}</span> {{ t("sur") }}
            <span class="font-medium">{{ result }}</span> {{ t("résultats") }}
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
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
              v-if="page !== '...'"
            >
              {{ page }}
            </button>
            <span v-else class="px-2">...</span>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="sr-only">{{ t("next") }}</span>
              <i class="bx bx-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;

definePageMeta({ layout: "dashboard" });

const router = useRouter();

// State
const reports = ref<any[]>([]);
const organisations = ref<Record<string, any>>({});

// Pagination
const itemsPerPage = 4;
const currentPage = ref(1);

// Filtres
const search = ref("");
const orgFilter = ref("");
const statusFilter = ref("");
const startDate = ref("");
const endDate = ref("");
const typeFilter = ref("");

// Organisation types & statuts
const orgs = [
  { label: "Gouvernement", value: "GOVERNMENT" },
  { label: "ONG", value: "NGO" },
  { label: "Privé", value: "PRIVATE" },
  { label: "Coopérative", value: "COOP" },
  { label: "Autre", value: "OTHER" },
];
const statuses = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"];

const reportTypes = [
  { label: "Rapport d’avancement", value: "PROGRESS" },
  { label: "Rapport financier", value: "FINANCIAL" },
  { label: "Rapport d’impact", value: "IMPACT" },
  { label: "Audit", value: "AUDIT" },
];

// Navigation
const goToCreate = () => router.push("/reporting/add");
const goToDetail = (uuid: string) => router.push(`/reporting/${uuid}`);
const goToEdit = (uuid: string) => router.push(`/reporting/edit/${uuid}`);

// Fetch organisation
const fetchOrganisation = async (orgId: string) => {
  if (!orgId || organisations.value[orgId]) return;
  const token = sessionStorage.getItem("token") || "";
  const res = await fetch(`${API_URL}/api/groups/organisations/${orgId}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (res.ok) organisations.value[orgId] = await res.json();
};

// Fetch reports
const fetchReports = async () => {
  const token = sessionStorage.getItem("token") || "";
  const res = await fetch(`${API_URL}/api/suivi-evaluation/reporting/`, {
    headers: { Authorization: `Token ${token}` },
  });
  reports.value = await res.json();
  for (const report of reports.value)
    await fetchOrganisation(report.organisation_id);
};

// Filtrage
const filteredReports = computed(() => {
  let data = [...reports.value];

  if (search.value)
    data = data.filter((r) =>
      r.name.toLowerCase().includes(search.value.toLowerCase())
    );
  if (orgFilter.value)
    data = data.filter(
      (r) =>
        organisations.value[r.organisation_id]?.org_type === orgFilter.value
    );
  if (typeFilter.value) data = data.filter((r) => r.type === typeFilter.value);
  if (statusFilter.value)
    data = data.filter((r) => r.status === statusFilter.value);
  if (startDate.value)
    data = data.filter((r) => r.period_start >= startDate.value);
  if (endDate.value) data = data.filter((r) => r.period_end <= endDate.value);

  return data;
});

// Pagination calculée
const result = computed(() => filteredReports.value.length);
const totalPages = computed(() =>
  Math.ceil(filteredReports.value.length / itemsPerPage)
);
const visiblePages = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1)
);
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredReports.value.slice(start, start + itemsPerPage);
});

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const goToPage = (page: number) => {
  currentPage.value = page;
};

// Reset filtres
const resetFilters = () => {
  search.value = "";
  orgFilter.value = "";
  statusFilter.value = "";
  startDate.value = "";
  endDate.value = "";
  currentPage.value = 1;
};

// On mounted
onMounted(fetchReports);
</script>
