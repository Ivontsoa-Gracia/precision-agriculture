<template>
  <section class="p-6">
    <div class="flex items-center justify-between mb-16">
      <h2
        class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2"
      >
        Organisations
      </h2>

      <NuxtLink
        to="/organisations/create"
        class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white text-sm rounded hover:bg-[#0da06a] transition"
      >
        <i class="bx bx-plus"></i>
        Add
      </NuxtLink>
    </div>

    <div
      class="flex items-center gap-3 border border-gray-200 rounded px-3 py-2 bg-white mb-4"
    >
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
        v-model="orgType"
        class="text-sm text-gray-700 bg-transparent focus:outline-none"
      >
        <option value="">Tous les types</option>
        <option v-for="type in orgTypes" :key="type.value" :value="type.value">
          {{ type.label }}
        </option>
      </select>

      <div class="w-px h-6 bg-gray-200"></div>

      <button
        @click="resetFilters"
        class="text-sm text-gray-500 hover:text-gray-900 transition"
      >
        Reset
      </button>
    </div>

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
              Type
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              Téléphone
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
            v-for="org in paginatedOrganisations"
            :key="org.uuid"
            class="hover:bg-[#FAFAF9]"
          >
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ org.name }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ org.org_type }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ org.contact_email || "-" }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ org.phone || "-" }}
            </td>
            <td
              class="p-3 border-b text-center flex justify-center items-center gap-2"
            >
              <NuxtLink
                :to="`/organisations/${org.uuid}`"
                class="p-1 px-2 rounded hover:bg-[#10b481]/20"
              >
                <i class="bx bx-show text-[#10b481] text-lg"></i>
              </NuxtLink>
              <NuxtLink
                :to="`/organisations/edit/${org.uuid}`"
                class="p-1 px-2 rounded hover:bg-[#f4a261]/10"
              >
                <i class="bx bx-edit text-[#f4a261] text-lg"></i>
              </NuxtLink>
              <button
                @click="deleteOrganisation(org.uuid)"
                class="p-1 px-2 rounded hover:bg-[#e63946]/10"
              >
                <i class="bx bx-trash text-[#e63946] text-lg"></i>
              </button>
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
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, computed, watch, onMounted } from "vue";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;
const currentLocale = computed(() => languageStore.lang);

const organisations = ref<any[]>([]);
const search = ref("");
const orgType = ref("");
const itemsPerPage = 4;
const currentPage = ref(1);

const orgTypes = [
  { label: "Gouvernement", value: "GOVERNMENT" },
  { label: "ONG", value: "NGO" },
  { label: "Privé", value: "PRIVATE" },
  { label: "Coopérative", value: "COOP" },
  { label: "Autre", value: "OTHER" },
];

const fetchOrganisations = async () => {
  const token = sessionStorage.getItem("token") || "";
  const res = await fetch(`${API_URL}/api/groups/organisations/`, {
    headers: { Authorization: `Token ${token}` },
  });
  organisations.value = await res.json();
};

const filteredOrganisations = computed(() => {
  let data = [...organisations.value];
  if (search.value)
    data = data.filter((org) =>
      org.name.toLowerCase().includes(search.value.toLowerCase())
    );
  if (orgType.value)
    data = data.filter((org) => org.org_type === orgType.value);
  return data;
});

const result = computed(() => filteredOrganisations.value.length);
const totalPages = computed(() =>
  Math.ceil(filteredOrganisations.value.length / itemsPerPage)
);
const paginatedOrganisations = ref<any[]>([]);

const updatePaginated = () => {
  const start = (currentPage.value - 1) * itemsPerPage;
  paginatedOrganisations.value = filteredOrganisations.value.slice(
    start,
    start + itemsPerPage
  );
};

watch([organisations, search, orgType, currentPage], updatePaginated, {
  immediate: true,
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const goToPage = (page: number) => {
  currentPage.value = page;
};

const deleteOrganisation = async (uuid: string) => {
  if (!confirm("Supprimer cette organisation ?")) return;
  const token = sessionStorage.getItem("token") || "";
  await fetch(`${API_URL}/api/groups/organisations/${uuid}/`, {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` },
  });
  fetchOrganisations();
};

const resetFilters = () => {
  search.value = "";
  orgType.value = "";
  currentPage.value = 1;
};

onMounted(fetchOrganisations);

const visiblePages = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1)
);
</script>

<style scoped>
.th {
  padding: 10px;
  text-align: left;
}
.td {
  padding: 10px;
}
</style>
