<template>
  <div class="p-1 sm:p-6">
    <Breadcrumb />

    <section class="mb-10">
      <div class="flex items-center justify-between mb-8">
        <h2
          class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2"
        >
          {{ t("parcelcroplist") }}
        </h2>

        <NuxtLink
          to="/parcel-crops/create"
          class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white text-sm rounded hover:bg-[#0da06a] transition"
        >
          <i class="bx bx-plus"></i>
          {{ t("add") }}
        </NuxtLink>
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
          {{ t('reset') }}
        </button>
      </div>
    </section>

    <div class="hidden md:block overflow-x-auto bg-white">
      <table class="min-w-[700px] w-full text-left border-collapse">
        <thead class="bg-[#FAFAF9]">
          <tr>
            <th
              @click="sortBy('parcel_name')"
              class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("thparcelname") }}
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('crop.name')"
              class="cursor-pointer items-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("crop") }}
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('planting_date')"
              class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("plantingdate") }}
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('harvest_date')"
              class="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("harvestdate") }}
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
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("status") }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b text-center"
            >
              {{ t("thactions") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="pc in paginatedParcelCrops"
            :key="pc.id"
            class="hover:bg-[#FAFAF9]"
          >
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ pc.parcel_name || pc.parcel }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ pc.crop?.name || "-" }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ formatDate(pc.planting_date) }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ formatDate(pc.harvest_date) || "-" }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              {{ pc.area }}
            </td>
            <td class="px-6 py-2 border-b text-sm text-gray-900">
              <span
                v-if="pc.status?.name"
                :class="[
                  'px-3 py-1 rounded-full text-xs',
                  statusClasses(pc.status.name),
                ]"
              >
                {{ t(cropStatusKeyMap[pc.status.name]) }}
              </span>
              <span v-else>-</span>
            </td>
            <td
              class="p-3 border-b text-center flex justify-center items-center gap-2"
            >
              <button
                @click="showParcelCrop(pc.id)"
                class="p-1 px-2 rounded hover:bg-[#10b481]/20"
              >
                <i class="bx bx-show text-[#10b481] text-lg"></i>
              </button>
              <button
                @click="editParcelCrop(pc.id)"
                class="p-1 px-2 rounded hover:bg-[#f4a261]/10"
              >
                <i class="bx bx-edit text-[#f4a261] text-lg"></i>
              </button>
              <button
                @click="deleteParcelCrop(pc.id)"
                class="p-1 px-2 rounded hover:bg-[#e63946]/10"
              >
                <i class="bx bx-trash text-[#e63946] text-lg"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="md:hidden space-y-4 text-md">
      <div
        v-for="pc in paginatedParcelCrops"
        :key="pc.id"
        class="bg-white p-4 rounded-xl shadow flex flex-col gap-2"
      >
        <div class="flex justify-between items-center">
          <span class="font-bold text-[#212121]">{{
            pc.parcel_name || pc.parcel
          }}</span>
          <div class="flex gap-2">
            <button
              @click="showParcelCrop(pc.id)"
              class="p-2 px-4 rounded hover:bg-[#10b481]/20"
            >
              <i class="bx bx-show text-[#10b481] text-md"></i>
            </button>
            <button
              @click="editParcelCrop(pc.id)"
              class="p-2 px-4 rounded hover:bg-[#f4a261]/10"
            >
              <i class="bx bx-edit text-[#f4a261] text-md"></i>
            </button>
            <button
              @click="deleteParcelCrop(pc.id)"
              class="p-2 px-4 rounded hover:bg-[#e63946]/10"
            >
              <i class="bx bx-trash text-[#e63946] text-md"></i>
            </button>
          </div>
        </div>
        <p>
          <span class="font-semibold">{{ t("crop") }}:</span>
          {{ pc.crop?.name || "-" }}
        </p>
        <p v-if="pc.status?.name">
          <span class="font-semibold"></span>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              statusClasses(pc.status.name),
            ]"
          >
            {{ t(cropStatusKeyMap[pc.status.name]) }}
          </span>
        </p>
        <p v-else>
          <span class="font-semibold">{{ t("status") }}:</span> -
        </p>
      </div>
      <p
        v-if="paginatedParcelCrops.length === 0"
        class="text-center text-gray-500"
      >
        {{ t("noparcelcropfound") }}
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

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import Breadcrumb from "~/components/Breadcrumb.vue";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;
const currentLocale = computed(() => languageStore.lang);

const cropStatusKeyMap: Record<string, string> = {
  Planned: "cropStatusPlanned",
  Planted: "cropStatusPlanted",
  Germinated: "cropStatusGerminated",
  Growing: "cropStatusGrowing",
  Flowering: "cropStatusFlowering",
  Fruiting: "cropStatusFruiting",
  Mature: "cropStatusMature",
  Harvested: "cropStatusHarvested",
  "Post-Harvest": "cropStatusPostHarvest",
  Failed: "cropStatusFailed",
};

const router = useRouter();

const parcelCropsState = useState("parcelCropsData", () => ({
  data: [],
  timestamp: 0,
}));

const parcelCrops = ref(parcelCropsState.value.data);

const parcelCache: Record<string, string> = {};

const searchQuery = ref("");

const sortKey = ref<string | null>(null);
const sortAsc = ref(true);

async function parcelName(id: string): Promise<string> {
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

const statusClasses = (statusName: string) => {
  switch (statusName) {
    case "Planned":
      return "bg-[#219ebc]/10 text-[#219ebc] border border-[#219ebc]/50";
    case "Planted":
      return "bg-[#10b481]/10 text-[#10b481] border border-[#10b481]/50";
    case "Germinated":
      return "bg-[#5fd4a2]/10 text-[#0c9069] border border-[#0c9069]/40";
    case "Growing":
      return "bg-[#c99383]/10 text-[#c99383] border border-[#c99383]/50";
    case "Flowering":
      return "bg-[#f4a261]/10 text-[#f4a261] border border-[#f4a261]/50";
    case "Fruiting":
      return "bg-[#6d4c41]/10 text-[#6d4c41] border border-[#6d4c41]/40";
    case "Mature":
      return "bg-[#10b481]/10 text-[#0c9069] border border-[#10b481]/40";
    case "Harvested":
      return "bg-[#222831]/10 text-[#222831] border border-[#222831]/40";
    case "Post-Harvest":
      return "bg-[#7a7a7a]/10 text-[#7a7a7a] border border-[#7a7a7a]/40";
    case "Failed":
      return "bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/50";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-300";
  }
};

const filteredAndSortedCrops = computed(() => {
  let data = [...parcelCrops.value];

  // Filtre par nom de parcelle ou nom de culture
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    data = data.filter(
      (pc) =>
        (pc.parcel_name?.toLowerCase().includes(q) ?? false) ||
        (pc.crop?.name?.toLowerCase().includes(q) ?? false)
    );
  }

  // Tri par colonne
  if (sortKey.value) {
    data.sort((a, b) => {
      let valA = a[sortKey.value as keyof typeof a];
      let valB = b[sortKey.value as keyof typeof b];

      if (valA === null || valA === undefined) valA = "";
      if (valB === null || valB === undefined) valB = "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortAsc.value ? -1 : 1;
      if (valA > valB) return sortAsc.value ? 1 : -1;
      return 0;
    });
  }

  return data;
});

const itemsPerPage = 4;
const currentPage = ref(1);
const paginatedParcelCrops = ref<any[]>([]);
const totalPages = computed(() =>
  Math.ceil(parcelCrops.value.length / itemsPerPage)
);
const visiblePages = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1)
);
const updatePaginated = () => {
  const start = (currentPage.value - 1) * itemsPerPage;
  paginatedParcelCrops.value = filteredAndSortedCrops.value.slice(
    start,
    start + itemsPerPage
  );
};
watch(
  [parcelCrops, currentPage, searchQuery, sortKey, sortAsc],
  updatePaginated,
  {
    immediate: true,
  }
);

const result = ref(0);

onMounted(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  const now = Date.now();
  if (
    parcelCropsState.value.data.length &&
    now - parcelCropsState.value.timestamp < 30 * 60 * 1000
  ) {
    parcelCrops.value = parcelCropsState.value.data;
    result.value = parcelCrops.value.length;
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/parcel-crops/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    for (const crop of data) {
      if (crop.parcel) {
        crop.parcel_name = await parcelName(crop.parcel);
      }
    }

    parcelCrops.value = data;
    result.value = data.length;
    parcelCropsState.value = { data: data, timestamp: Date.now() };
  } catch (err) {
    console.error(err);
  }
});

onMounted(async () => {
  if (router.currentRoute.value.query.refresh) {
    await loadParcelCrops(); // fonction qui recharge les tasks depuis l'API
  }
});

const deleteParcelCrop = async (id: number) => {
  if (!confirm("Are you sure you want to delete this parcel crop?")) return;
  const token = sessionStorage.getItem("token");
  try {
    const res = await fetch(`${API_URL}/api/parcel-crops/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    parcelCrops.value = parcelCrops.value.filter((pc) => pc.id !== id);

    parcelCropsState.value.data = parcelCrops.value;

    updatePaginated();
    alert("Parcel crop deleted");
  } catch (err) {
    console.error(err);
    alert("Failed to delete");
  }
};

const editParcelCrop = (id: number) => router.push(`/parcel-crops/edit/${id}`);
const showParcelCrop = (id: number) => router.push(`/parcel-crops/show/${id}`);

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const goToPage = (page: number) => {
  currentPage.value = page;
};

async function loadParcelCrops() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/parcel-crops/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    for (const crop of data) {
      if (crop.parcel) {
        crop.parcel_name = await parcelName(crop.parcel);
      }
    }

    parcelCrops.value = data;
    parcelCropsState.value = { data: data, timestamp: Date.now() };
    updatePaginated();
  } catch (err) {
    console.error(err);
  }
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(languageStore.lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  sortKey.value = null;
  sortAsc.value = true;
  currentPage.value = 1;
};
</script>
