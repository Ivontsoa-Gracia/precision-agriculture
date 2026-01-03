<template>
  <div class="p-1 sm:p-6">
    <Breadcrumb />
    <section class="mb-10">
      <div class="flex items-center justify-between mb-8">
        <h2
          class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2"
        >
          {{ t("yieldlist") }}
        </h2>

        <button
          @click="goToCreate"
          class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white text-sm rounded hover:bg-[#0da06a] transition"
        >
          <i class="bx bx-plus"></i> {{ t("add") }}
        </button>
      </div>

      <div
        class="flex items-center gap-3 border border-gray-200 rounded px-3 py-2 bg-white"
      >
        <div class="relative flex-1">
          <i
            class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></i>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full pl-10 pr-3 py-2 text-sm bg-transparent focus:outline-none"
            :placeholder="t('searchPlaceholder')"
          />
        </div>

        <div class="w-px h-6 bg-gray-200"></div>

        <button
          @click="resetFilters"
          class="text-sm text-gray-500 hover:text-gray-900 transition px-6"
        >
          {{ t("reset") }}
        </button>
      </div>
    </section>

    <div class="hidden md:block overflow-x-auto bg-white">
      <table class="min-w-[700px] w-full text-left border-collapse">
        <thead class="bg-[#FAFAF9]">
          <tr>
            <th
              @click="sortBy('date')"
              class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("thdate") }}
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('parcel_name')"
              class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("thparcelname") }}
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('area')"
              class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("area") }} (m²)
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('crop')"
              class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("crop") }}
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('yield_amount')"
              class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("thyield") }}
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b text-center"
            >
              {{ t("thactions") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="y in paginatedYields" :key="y.id" class="hover:bg-gray-50">
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ formatDate(y.date) }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ y.parcel_name || "-" }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ y.area }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ y.parcelCrop ? `${y.parcelCrop.crop.name}` : "-" }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ y.yield_amount }}
            </td>
            <td
              class="px-6 py-3 border-b text-sm text-gray-900 text-center flex justify-center gap-2"
            >
              <button
                @click="goToShow(y.id)"
                class="p-1 px-2 rounded hover:bg-[#10b481]/20"
              >
                <i class="bx bx-show text-[#10b481] text-lg"></i>
              </button>
              <button
                @click="goToEdit(y.id)"
                class="p-1 px-2 rounded hover:bg-[#f4a261]/10"
              >
                <i class="bx bx-edit text-[#f4a261] text-lg"></i>
              </button>
              <button
                @click="deleteYield(y.id)"
                class="p-1 px-2 rounded hover:bg-[#e63946]/10"
              >
                <i class="bx bx-trash text-[#e63946] text-lg"></i>
              </button>
            </td>
          </tr>
          <tr v-if="yields.length === 0">
            <td colspan="6" class="p-6 text-center text-sm text-gray-500">
              {{ t("noyieldfound") }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="md:hidden space-y-4 text-md">
      <div
        v-for="y in yields"
        :key="y.id"
        class="bg-white p-4 rounded-xl shadow flex flex-col gap-3 hover:shadow-lg transition"
      >
        <div class="flex justify-between items-start">
          <h3 class="font-bold text-[#212121] text-lg">
            {{ y.parcel_name || "-" }}
          </h3>
          <div class="flex gap-1">
            <button
              @click="goToShow(y.id)"
              class="p-2 rounded hover:bg-[#10b481]/20"
            >
              <i class="bx bx-show text-[#10b481] text-md"></i>
            </button>
            <button
              @click="goToEdit(y.id)"
              class="p-2 rounded hover:bg-[#f4a261]/10"
            >
              <i class="bx bx-edit text-[#f4a261] text-md"></i>
            </button>
            <button
              @click="deleteYield(y.id)"
              class="p-2 rounded hover:bg-[#e63946]/10"
            >
              <i class="bx bx-trash text-[#e63946] text-md"></i>
            </button>
          </div>
        </div>
        <p>
          <span class="font-semibold">{{ t("thdate") }}:</span>
          {{ formatDate(y.date) }}
        </p>
        <p>
          <span class="font-semibold">{{ t("area") }}:</span> {{ y.area }}
        </p>
        <p>
          <span class="font-semibold">{{ t("crop") }}:</span>
          {{ y.parcelCrop ? y.parcelCrop.crop.name : "-" }}
        </p>
        <p>
          <span class="font-semibold">{{ t("thyield") }}:</span>
          {{ y.yield_amount }}
        </p>
      </div>
      <p v-if="yields.length === 0" class="text-center text-sm text-gray-500">
        {{ t("noyieldfound") }}
      </p>
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

<script setup>
definePageMeta({ layout: "dashboard" });
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import Breadcrumb from "~/components/Breadcrumb.vue";


const languageStore = useLanguageStore();
const t = (key) => translate[languageStore.lang][key] || key;
const currentLocale = computed(() => languageStore.lang);

const router = useRouter();
const currentPage = ref(1);
const perPage = 4;

const yieldsState = useState("yieldsData", () => ({ data: [], timestamp: 0 }));

const yields = ref(yieldsState.value.data);

const parcelCache = {};

const searchQuery = ref("");

const sortKey = ref(null);
const sortAsc = ref(true);

function resetFilters() {
  searchQuery.value = "";
  currentPage.value = 1;
}

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
  currentPage.value = 1;
}

async function parcelName(id) {
  if (parcelCache[id]) return parcelCache[id];

  const token = sessionStorage.getItem("token");
  if (!token) return id;

  try {
    const res = await fetch(`${API_URL}/api/parcels/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error("Parcel API error");
    const data = await res.json();
    parcelCache[id] = data.parcel_name;
    return data.parcel_name;
  } catch (err) {
    console.error("Erreur récupération parcel:", err);
    return id;
  }
}

async function fetchParcelCrop(id, token) {
  try {
    const res = await axios.get(`${API_URL}/api/parcel-crops/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching parcelCrop:", err);
    return null;
  }
}

const result = ref(0);

async function fetchYields() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  const now = Date.now();
  if (
    yieldsState.value.data.length &&
    now - yieldsState.value.timestamp < 30 * 60 * 1000
  ) {
    yields.value = yieldsState.value.data;
    result.value = yields.value.length;
    return;
  }

  try {
    const res = await axios.get(`${API_URL}/api/yield-records/`, {
      headers: { Authorization: `Token ${token}` },
    });

    const yieldsWithParcelCrop = await Promise.all(
      res.data.map(async (y) => {
        if (y.parcelCrop) {
          y.parcelCrop = await fetchParcelCrop(y.parcelCrop, token);
          y.parcel_name = await parcelName(y.parcelCrop.parcel, token);
        }
        return y;
      })
    );

    yields.value = yieldsWithParcelCrop;
    result.value = data.length;
    yieldsState.value = { data: yields.value, timestamp: Date.now() };
  } catch (err) {
    console.error(err);
  }
}

function goToCreate() {
  router.push("/yield-records/create");
}
function goToShow(id) {
  router.push(`/yield-records/show/${id}`);
}
function goToEdit(id) {
  router.push(`/yield-records/edit/${id}`);
}

async function deleteYield(id) {
  if (!confirm("Are you sure you want to delete this Yield Record?")) return;

  try {
    const token = sessionStorage.getItem("token");
    await axios.delete(`${API_URL}/api/yield-records/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    });

    yields.value = yields.value.filter((y) => y.id !== id);

    yieldsState.value.data = yields.value;

    alert("Yield Record deleted successfully.");
  } catch (err) {
    console.error("Error deleting YieldRecord:", err);
    alert("Failed to delete Yield Record.");
  }
}

const filteredYields = computed(() => {
  let data = yields.value.filter((y) => {
    const crop = y.parcelCrop?.crop?.name || "";
    const parcel = y.parcel_name || "";
    const q = searchQuery.value.toLowerCase();
    return parcel.toLowerCase().includes(q) || crop.toLowerCase().includes(q);
  });

  if (sortKey.value) {
    data.sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];

      if (sortKey.value === "crop") {
        valA = a.parcelCrop?.crop?.name || "";
        valB = b.parcelCrop?.crop?.name || "";
      }

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortAsc.value ? -1 : 1;
      if (valA > valB) return sortAsc.value ? 1 : -1;
      return 0;
    });
  }

  return data;
});

const paginatedYields = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredYields.value.slice(start, start + perPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredYields.value.length / perPage)
);

function goToPage(page) {
  currentPage.value = page;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

const visiblePages = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1)
);

onMounted(fetchYields);

onMounted(() => {
  if (router.currentRoute.value.query.refresh) {
    yields.value = yieldsState.value.data;
    if (
      !yields.value.length ||
      Date.now() - yieldsState.value.timestamp > 30 * 60 * 1000
    ) {
      fetchYields();
    }
  }
});

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(languageStore.lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
