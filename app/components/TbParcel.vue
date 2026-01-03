<template>
  <div class="py-10">
    <section class="mb-10">
      <div class="flex items-center justify-between mb-8 hidden">
        <h2
          class="text-xl sm:test-2xl font-semibold text-gray-900 tracking-tight"
        >
          {{ t("titleparcellist") }}
        </h2>

        <NuxtLink
          to="/parcels/create"
          class="inline-flex flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white text-sm rounded hover:bg-[#0da06a] transition"
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
            v-model="filters.parcel_name"
            type="text"
            class="w-full pl-10 pr-3 py-2 text-sm bg-transparent focus:outline-none"
            :placeholder="t('filterbyparcel')"
          />
        </div>

        <div class="w-px h-6 bg-gray-200"></div>

        <select
          v-model.number="rowsPerPage"
          class="text-sm text-gray-700 bg-transparent focus:outline-none"
        >
          <option :value="4">4</option>
          <option :value="8">8</option>
          <option :value="12">12</option>
          <option :value="16">16</option>
        </select>

        <div class="w-px h-6 bg-gray-200"></div>

        <button
          @click="resetFilters"
          class="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          Reset
        </button>

        <div class="w-px h-6 bg-gray-200"></div>

        <div class="relative group">
          <button
            class="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 transition"
          >
            Export
            <i class="bx bx-chevron-down text-xs"></i>
          </button>

          <div
            class="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition"
          >
            <button
              @click="exportData('pdf')"
              class="block w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
            >
              PDF
            </button>
            <button
              @click="exportData('csv')"
              class="block w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
            >
              CSV
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="pb-2">
      <div class="overflow-x-auto bg-white">
        <table class="min-w-[700px] w-full text-left border-collapse">
          <thead class="bg-[#FAFAF9]">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
              >
                {{ t("thparcelname") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b hidden sm:table-cell"
              >
                {{ t("locations") }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b hidden sm:table-cell"
              >
                {{ t("area") }}
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
              v-for="field in paginatedFields"
              :key="field.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-2 border-b text-sm text-gray-900 hidden">
                {{ field.owner }}
              </td>

              <td class="px-6 py-2 border-b text-sm text-gray-900">
                <NuxtLink
                  :to="`/parcels/show/${field.fieldId}`"
                  class="hover:text-[#10b481] transition-colors"
                >
                  {{ field.parcel_name }}
                </NuxtLink>
              </td>

              <td
                class="px-6 py-2 border-b text-sm text-gray-900 hidden sm:table-cell"
              >
                {{ field.weatherMeta.location }}
              </td>
              <td
                class="px-6 py-2 border-b text-sm text-gray-900 hidden sm:table-cell"
              >
                {{ formatM2(field.area_m2) }}
              </td>

              <td class="p-3 border-b text-center flex justify-center gap-2">
                <NuxtLink
                  :to="`/parcels/show/${field.fieldId}`"
                  class="p-2 px-2 rounded hover:bg-[#10b481]/10"
                >
                  <i class="bx bx-show text-[#10b481] text-lg"></i>
                </NuxtLink>

                <NuxtLink
                  :to="`/parcels/edit/${field.fieldId}`"
                  class="p-2 px-2 rounded hover:bg-[#f4a261]/10"
                >
                  <i class="bx bx-edit text-[#f4a261] text-lg"></i>
                </NuxtLink>
                <button
                  @click="confirmDelete(field.fieldId)"
                  class="p-2 px-2 rounded hover:bg-[#e63946]/10"
                >
                  <i class="bx bx-trash text-[#e63946] text-lg"></i>
                </button>
              </td>
            </tr>
            <tr v-if="paginatedFields.length === 0">
              <td colspan="6" class="p-6 text-center text-gray-500">
                {{ t("noparcelsfound") }}
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
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
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
  </div>

  <div
    v-if="showDeleteModal"
    class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
  >
    <div class="bg-white rounded p-6 w-80 text-center shadow-lg">
      <h3 class="text-xl font-bold mb-4">{{ t("deleteParcel") }}</h3>
      <p class="mb-6">{{ t("textConfirmDeleteParcel") }}</p>
      <div class="flex justify-center gap-4">
        <button
          @click="deleteParcelConfirmed"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {{ t("yes") }}
        </button>
        <button
          @click="cancelDelete"
          class="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
        >
          {{ t("no") }}
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="isLoading"
    class="absolute inset-0 bg-black/50 flex items-center justify-center"
  >
    <div
      class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"
    ></div>
  </div>

  <transition name="fade">
    <div
      v-if="notification.visible"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
    >
      <div
        :class="[
          'bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4 w-[340px] text-center transition-all duration-300',
          notification.type === 'success'
            ? 'border-t-4 border-[#10b481]'
            : 'border-t-4 border-red-500',
        ]"
      >
        <div
          v-if="notification.type === 'success'"
          class="w-16 h-16 rounded-full bg-[#10b481] flex items-center justify-center"
        >
          <i class="bx bx-check text-4xl font-extrabold text-white"></i>
        </div>
        <div
          v-else
          class="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
        >
          <i class="bx bx-x text-4xl font-extrabold text-white"></i>
        </div>

        <p
          :class="[
            'text-lg font-semibold',
            notification.type === 'success' ? 'text-[#10b481]' : 'text-red-500',
          ]"
        >
          {{ notification.message }}
        </p>

        <p class="text-gray-500 text-sm">
          {{
            notification.type === "success"
              ? "Redirecting to your dashboard..."
              : "Please try again."
          }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
import axios from "axios";
import * as turf from "@turf/turf";
const router = useRouter();

const languageStore = useLanguageStore();
const showFilters = ref(false);

const t = (key: string) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

definePageMeta({
  layout: "dashboard",
});

const isLoading = ref(false);

const notification = ref({
  visible: false,
  message: "",
  type: "success",
});

const showNotification = (
  message: string,
  type: "success" | "error" = "success",
  duration = 3000
) => {
  notification.value.message = message;
  notification.value.type = type;
  notification.value.visible = true;
  setTimeout(() => (notification.value.visible = false), duration);
};

async function exportData(type: "pdf" | "csv") {
  const data = filteredFields.value.map((f) => {
    // Transformer les points en chaîne "lat,lng;lat,lng;..."
    const pointsStr = f.parcel_points
      ? f.parcel_points.map((p) => `${p.latitude},${p.longitude}`).join("; ")
      : "-";

    return {
      Owner: f.owner,
      ParcelName: f.parcel_name,
      Points: pointsStr,
      Area_m2: formatM2(f.area_m2),
      Location: f.weatherMeta.location,
    };
  });

  if (type === "pdf") {
    if (process.client) {
      const { jsPDF } = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");

      const doc = new jsPDF();
      autoTableModule.default(doc, {
        head: [["Owner", "ParcelName", "Points", "Area_m2", "Location"]],
        body: data.map(Object.values),
        startY: 20,
      });

      doc.save("parcels.pdf");
    }
  } else {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => `"${row[h]}"`).join(",")),
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "parcels.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

const filters = reactive({
  owner: "",
  parcel_name: "",
});

const fields = ref<any[]>([]);
const rowsPerPage = ref(4);
const currentPage = ref(1);
const activeMenu = ref<string | null>(null);
const menuPosition = reactive({ top: 0, right: 0 });

const fieldsState = useState("fieldsData", () => ({
  data: [] as any[],
  timestamp: 0,
}));

const result = ref(0);

onMounted(async () => {
  const token = sessionStorage.getItem("token");
  const userUUID = sessionStorage.getItem("uuid");
  if (!token || !userUUID) {
    alert("Vous devez être connecté");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/parcels/`, {
      headers: { Authorization: `Token ${token}` },
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Erreur API:", err);
      return;
    }

    const parcels = await response.json();
    result.value = parcels.length;
    console.log("Parcels fetched:", parcels);
    if (!Array.isArray(parcels)) {
      console.error("La réponse n'est pas un tableau :", parcels);
      return;
    }

    fields.value = parcels
      .filter((parcel: any) => parcel.owner === userUUID)
      .map((parcel: any, idx: number) => {
        const points = parcel.parcel_points;

        return {
          id: idx + 1,
          fieldId: parcel.uuid,
          owner: "Moi",
          parcel_points: points,
          parcel_name: parcel.parcel_name,
          latitude: points?.[0]?.latitude ?? "-",
          longitude: points?.[0]?.longitude ?? "-",
          area_m2: points ? calculateParcelArea(points) : 0,
          fullData: null,
          weatherMeta: null,
        };
      });

    // ✅ Fetch full data pour chaque parcelle
    for (const field of fields.value) {
      await fetchParcelFullData(field);
    }
  } catch (err) {
    console.error("Erreur réseau:", err);
  }
});

function extractWeatherMeta(parcelData: any) {
  const meta = parcelData?.weather_data?.metadata;
  if (!meta) return null;

  return {
    location: meta.location_name,
    forecast_period: `${meta.start_date} → ${meta.end_date}`,
    forecast_days: meta.forecast_days,
    risk_level: meta.risk_level,
    last_update: meta.created_at,
  };
}

async function fetchParcelFullData(parcel: any) {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  if (!parcel.fieldId) {
    console.warn("Parcel fieldId manquant", parcel);
    return;
  }

  try {
    const { data } = await axios.get(
      `${API_URL}/api/parcels-full/${parcel.fieldId}/full_data/`,
      {
        headers: { Authorization: `Token ${token}` },
      }
    );

    parcel.fullData = data;
    parcel.weatherMeta = extractWeatherMeta(data);
  } catch (error) {
    console.error(`Erreur full data parcel ${parcel.fieldId}:`, error);
  }
}

function calculateParcelArea(points) {
  if (!points || points.length < 3) return 0;

  // Turf attend des coordonnées [lng, lat]
  const coords = points.map((p) => [p.longitude, p.latitude]);

  // Fermer le polygone
  coords.push([points[0].longitude, points[0].latitude]);

  // Créer le polygone GeoJSON
  const polygon = turf.polygon([coords]);

  // Calculer la surface en m²
  const areaM2 = turf.area(polygon);

  // Convertir en hectares
  const areaHa = areaM2 / 10000;

  // Retourner avec 2 décimales
  return areaHa.toFixed(2);
}

const formatM2 = (areaInHa) => {
  if (!areaInHa) return "- m²";
  return `${(areaInHa * 10000).toLocaleString()} m²`;
};

const filteredFields = computed(() =>
  fields.value.filter(
    (f) =>
      f.owner.toLowerCase().includes(filters.owner.toLowerCase()) &&
      f.parcel_name.toLowerCase().includes(filters.parcel_name.toLowerCase())
  )
);

const totalPages = computed(() =>
  Math.ceil(filteredFields.value.length / rowsPerPage.value)
);
const paginatedFields = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return filteredFields.value.slice(start, start + rowsPerPage.value);
});

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  if (totalPages.value <= 15) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else {
    if (currentPage.value <= 7) {
      pages.push(
        ...Array.from({ length: 8 }, (_, i) => i + 1),
        "...",
        totalPages.value
      );
    } else if (currentPage.value >= totalPages.value - 6) {
      pages.push(
        1,
        "...",
        ...Array.from({ length: 8 }, (_, i) => totalPages.value - 7 + i)
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage.value - 2,
        currentPage.value - 1,
        currentPage.value,
        currentPage.value + 1,
        currentPage.value + 2,
        "...",
        totalPages.value
      );
    }
  }
  return pages;
});

function resetFilters() {
  filters.owner = "";
  filters.parcel_name = "";
  currentPage.value = 1;
}

function toggleMenu(id: string, event: MouseEvent) {
  if (activeMenu.value === id) {
    activeMenu.value = null;
  } else {
    activeMenu.value = id;
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    menuPosition.top = rect.bottom + window.scrollY;
    menuPosition.right = rect.right + window.scrollX;
  }
}

const showDeleteModal = ref(false);
const parcelToDelete = ref<string | null>(null);

function confirmDelete(uuid: string) {
  parcelToDelete.value = uuid;
  showDeleteModal.value = true;
}

async function deleteParcelConfirmed() {
  if (!parcelToDelete.value) return;
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté");
    return;
  }
  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/parcels/${parcelToDelete.value}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to delete parcel: ${res.status}`);
    fields.value = fields.value.filter(
      (f) => f.fieldId !== parcelToDelete.value
    );
    showDeleteModal.value = false;
    parcelToDelete.value = null;

    showNotification("Parcel deleted successfully!", "success");
    setTimeout(() => {}, 3000);
  } catch (err) {
    console.error(err);
    alert("Failed to delete parcel");
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  parcelToDelete.value = null;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function goToPage(page: number | string) {
  if (page !== "...") currentPage.value = page as number;
}
</script>
