<template>
  <div class="p-1 sm:p-6">
    <h2
      class="text-xl sm:text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2"
    >
      <i class="bx bx-bar-chart text-3xl text-[#10b481]"></i>
      {{ t("yieldlist") }}
    </h2>

    <div class="flex justify-end mb-4">
      <button
        @click="goToCreate"
        class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white rounded-lg hover:bg-[#0da06a] transition"
      >
        <i class="bx bx-plus text-lg"></i> {{ t("btnyield") }}
      </button>
    </div>

    <div class="hidden md:block overflow-x-auto bg-white rounded-xl shadow p-4">
      <table class="min-w-full text-left border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-2 border-b">{{ t("thdate") }}</th>
            <th class="px-6 py-2 border-b">{{ t("thparcelname") }}</th>
            <th class="px-6 py-2 border-b">{{ t("area") }} (m²)</th>
            <th class="px-6 py-2 border-b">{{ t("crop") }}</th>
            <th class="px-6 py-2 border-b">{{ t("thyield") }}</th>
            <th class="px-6 py-2 border-b text-center">{{ t("thactions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="y in paginatedYields" :key="y.id" class="hover:bg-gray-50">
            <td class="px-6 py-2 border-b">{{ y.date }}</td>
            <td class="px-6 py-2 border-b">{{ y.parcel_name || "-" }}</td>
            <td class="px-6 py-2 border-b">{{ y.area }}</td>
            <td class="px-6 py-2 border-b">
              {{ y.parcelCrop ? `${y.parcelCrop.crop.name}` : "-" }}
            </td>
            <td class="px-6 py-2 border-b">{{ y.yield_amount }}</td>
            <td
              class="px-6 py-2 border-b text-center flex justify-center gap-2"
            >
              <button
                @click="goToShow(y.id)"
                class="p-2 rounded-full hover:bg-[#10b481]/20"
              >
                <i class="bx bx-show text-[#10b481] text-xl"></i>
              </button>
              <button
                @click="goToEdit(y.id)"
                class="p-2 rounded-full hover:bg-[#f4a261]/10"
              >
                <i class="bx bx-edit text-[#f4a261] text-xl"></i>
              </button>
              <button
                @click="deleteYield(y.id)"
                class="p-2 rounded-full hover:bg-[#e63946]/10"
              >
                <i class="bx bx-trash text-[#e63946] text-xl"></i>
              </button>
            </td>
          </tr>
          <tr v-if="yields.length === 0">
            <td colspan="6" class="p-6 text-center text-gray-500">
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
              class="p-2 rounded-full hover:bg-[#10b481]/20"
            >
              <i class="bx bx-show text-[#10b481] text-md"></i>
            </button>
            <button
              @click="goToEdit(y.id)"
              class="p-2 rounded-full hover:bg-[#f4a261]/10"
            >
              <i class="bx bx-edit text-[#f4a261] text-md"></i>
            </button>
            <button
              @click="deleteYield(y.id)"
              class="p-2 rounded-full hover:bg-[#e63946]/10"
            >
              <i class="bx bx-trash text-[#e63946] text-md"></i>
            </button>
          </div>
        </div>
        <p>
          <span class="font-semibold">{{ t("thdate") }}:</span> {{ y.date }}
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
      <p v-if="yields.length === 0" class="text-center text-gray-500">
        {{ t("noyieldfound") }}
      </p>
    </div>
    <div class="flex justify-between items-center mt-4 mb-2 text-sm sm:text-md">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="flex items-center px-3 py-1 rounded disabled:opacity-50"
      >
        <i class="bx bx-chevron-left"></i> {{ t("prev") }}
      </button>

      <div class="flex items-center space-x-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-1 rounded',
            currentPage === page
              ? 'bg-[#10b481] text-white'
              : 'bg-gray-100 hover:bg-gray-200',
          ]"
          v-if="page !== '...'"
        >
          {{ page }}
        </button>
        <span v-else class="px-2">...</span>
      </div>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="flex items-center px-3 py-1 rounded disabled:opacity-50"
      >
        {{ t("next") }} <i class="bx bx-chevron-right"></i>
      </button>
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

const languageStore = useLanguageStore();
const t = (key) => translate[languageStore.lang][key] || key;
const currentLocale = computed(() => languageStore.lang);

const router = useRouter();
const currentPage = ref(1);
const perPage = 4;

const yieldsState = useState("yieldsData", () => ({ data: [], timestamp: 0 }));

const yields = ref(yieldsState.value.data);

const parcelCache = {};

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

const totalPages = computed(() => Math.ceil(yields.value.length / perPage));
const paginatedYields = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return yields.value.slice(start, start + perPage);
});
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
</script>
