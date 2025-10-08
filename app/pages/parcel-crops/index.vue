<template>
  <div class="p-1 sm:p-6">
    <h2
      class="text-xl sm:text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2"
    >
      <i class="bx bx-box text-xl sm:text-3xl text-[#10b481]"></i>
      {{ t("parcelcroplist") }}
    </h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/parcel-crops/create"
        class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white rounded-lg hover:bg-[#0da06a] transition"
      >
        <i class="bx bx-plus text-lg"></i> {{ t("btnaddparcelcrop") }}
      </NuxtLink>
    </div>

    <div class="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
      <table class="min-w-[600px] w-full text-left border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-2 border-b">{{ t("thparcelname") }}</th>
            <th class="px-6 py-2 border-b">{{ t("crop") }}</th>
            <th class="px-6 py-2 border-b">{{ t("plantingdate") }}</th>
            <th class="px-6 py-2 border-b">{{ t("harvestdate") }}</th>
            <th class="px-6 py-2 border-b">{{ t("area") }} (m²)</th>
            <th class="px-6 py-2 border-b">{{ t("status") }}</th>
            <th class="px-6 py-2 border-b text-center">{{ t("thactions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="pc in paginatedParcelCrops"
            :key="pc.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-2 border-b">
              {{ pc.parcel_name || pc.parcel }}
            </td>
            <td class="px-6 py-2 border-b">{{ pc.crop?.name || "-" }}</td>
            <td class="px-6 py-2 border-b">{{ pc.planting_date }}</td>
            <td class="px-6 py-2 border-b">{{ pc.harvest_date || "-" }}</td>
            <td class="px-6 py-2 border-b">{{ pc.area }}</td>
            <td class="px-6 py-2 border-b">
              <span
                v-if="pc.status?.name"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  statusClasses(pc.status.name),
                ]"
              >
                {{ t(cropStatusKeyMap[pc.status.name]) }}
              </span>
              <span v-else>-</span>
            </td>
            <td class="p-3 border-b text-center flex justify-center gap-2">
              <button
                @click="showParcelCrop(pc.id)"
                class="p-2 rounded-full hover:bg-[#10b481]/20"
              >
                <i class="bx bx-show text-[#10b481] text-xl"></i>
              </button>
              <button
                @click="editParcelCrop(pc.id)"
                class="p-2 rounded-full hover:bg-[#f4a261]/10"
              >
                <i class="bx bx-edit text-[#f4a261] text-xl"></i>
              </button>
              <button
                @click="deleteParcelCrop(pc.id)"
                class="p-2 rounded-full hover:bg-[#e63946]/10"
              >
                <i class="bx bx-trash text-[#e63946] text-xl"></i>
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
              class="p-2 rounded-full hover:bg-[#10b481]/20"
            >
              <i class="bx bx-show text-[#10b481] text-md"></i>
            </button>
            <button
              @click="editParcelCrop(pc.id)"
              class="p-2 rounded-full hover:bg-[#f4a261]/10"
            >
              <i class="bx bx-edit text-[#f4a261] text-md"></i>
            </button>
            <button
              @click="deleteParcelCrop(pc.id)"
              class="p-2 rounded-full hover:bg-[#e63946]/10"
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
    <div class="flex justify-between items-center mt-4 mb-2text-sm sm:text-md">
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

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";

import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

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
  paginatedParcelCrops.value = parcelCrops.value.slice(
    start,
    start + itemsPerPage
  );
};
watch([parcelCrops, currentPage], updatePaginated, { immediate: true });

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
  } catch (err) {
    console.error(err);
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
</script>
