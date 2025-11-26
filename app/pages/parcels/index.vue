<template>
  <div class="p-4 sm:p-6">
    <div class="mb-6">
      <h2
        class="text-2xl sm:text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2"
      >
        <i class="bxr bx-list-ul"></i>
        {{ t("titleparcellist") }}
      </h2>

      <div
        class="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4 p-4"
      >
        <div class="flex items-center space-x-2 flex-wrap w-full sm:w-auto">
          <label for="rows" class="text-sm text-gray-600 font-medium">{{
            t("rowperpage")
          }}</label>
          <select
            id="rows"
            v-model.number="rowsPerPage"
            class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b481] transition"
          >
            <option :value="4">4</option>
            <option :value="8">8</option>
            <option :value="12">12</option>
            <option :value="16">16</option>
          </select>

          <input
            v-model="filters.parcel_name"
            type="text"
            :placeholder="t('filterbyparcel')"
            class="p-2 border border-gray-300 rounded w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#10b481] transition"
          />
          <button
            @click="resetFilters"
            class="p-2 px-4 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center transition"
            aria-label="Refresh Filters"
          >
            <i class="bx bx-refresh text-xl text-gray-700"></i>
          </button>
        </div>

        <div class="flex space-x-3 mt-4 sm:mt-0 flex-nowrap">
          <div class="relative inline-block group">
            <button
              class="flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition"
            >
              <i class="bx bx-export mr-2 text-xl"></i> {{ t("export") }}
              <i class="bx bx-chevron-down ml-2 text-sm"></i>
            </button>
            <div
              class="absolute mt-2 bg-white rounded shadow-lg w-32 hidden group-hover:block z-50"
            >
              <button
                @click="exportData('pdf')"
                class="block px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100 transition rounded-t-lg"
              >
                PDF
              </button>
              <button
                @click="exportData('csv')"
                class="block px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100 transition rounded-b-lg"
              >
                CSV
              </button>
            </div>
          </div>

          <NuxtLink
            to="/parcels/create"
            class="flex items-center bg-[#10b481] text-white px-6 py-2 rounded shadow-sm hover:bg-[#0da06a] transition"
          >
            <i class="bx bx-plus mr-2 text-xl"></i> {{ t("addparcel") }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="pb-2">
      <div class="overflow-x-auto bg-white">
        <table class="min-w-[700px] w-full text-left border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-2 border-b hidden">Owner</th>
              <th class="px-6 py-2 border-b">{{ t("thparcelname") }}</th>
              <th class="px-6 py-2 border-b hidden sm:table-cell">
                {{ t("thlatitude") }}
              </th>
              <th class="px-6 py-2 border-b hidden sm:table-cell">
                {{ t("thlongitude") }}
              </th>
              <th class="px-6 py-2 border-b text-center">
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
              <td class="px-6 py-2 border-b hidden">{{ field.owner }}</td>

              <td class="px-6 py-2 border-b">
                <NuxtLink
                  :to="`/parcels/show/${field.fieldId}`"
                  class="hover:text-[#10b481] transition-colors"
                >
                  {{ field.parcel_name }}
                </NuxtLink>
              </td>

              <td class="px-6 py-2 border-b hidden sm:table-cell">
                {{ field.latitude.toFixed(6) }}
              </td>
              <td class="px-6 py-2 border-b hidden sm:table-cell">
                {{ field.longitude.toFixed(6) }}
              </td>

              <td class="p-3 border-b text-center flex justify-center gap-2">
                <NuxtLink
                  :to="`/parcels/show/${field.fieldId}`"
                  class="p-2 px-4 rounded hover:bg-[#10b481]/20"
                >
                  <i class="bx bx-show text-[#10b481] text-xl"></i>
                </NuxtLink>

                <NuxtLink
                  :to="`/parcels/edit/${field.fieldId}`"
                  class="p-2 px-4 rounded hover:bg-[#f4a261]/10"
                >
                  <i class="bx bx-edit text-[#f4a261] text-xl"></i>
                </NuxtLink>
                <button
                  @click="confirmDelete(field.fieldId)"
                  class="p-2 px-4 rounded hover:bg-[#e63946]/10"
                >
                  <i class="bx bx-trash text-[#e63946] text-xl"></i>
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

      <div class="flex justify-between items-center mt-4 mb-2">
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
  const data = filteredFields.value.map((f) => ({
    Owner: f.owner,
    FieldID: f.fieldId,
    ParcelName: f.parcel_name,
    Latitude: f.latitude,
    Longitude: f.longitude,
  }));

  if (type === "pdf") {
    if (process.client) {
      const { jsPDF } = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");

      const doc = new jsPDF();
      autoTableModule.default(doc, {
        head: [["Owner", "FieldID", "ParcelName", "Latitude", "Longitude"]],
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
    if (!Array.isArray(parcels)) {
      console.error("La réponse n'est pas un tableau :", parcels);
      return;
    }

    fields.value = parcels
      .filter((parcel: any) => parcel.owner === userUUID)
      .map((parcel: any, idx: number) => ({
        id: idx + 1,
        fieldId: parcel.uuid,
        owner: "Moi",
        parcel_name: parcel.parcel_name,
        latitude: parcel.parcel_points?.[0]?.latitude ?? "-",
        longitude: parcel.parcel_points?.[0]?.longitude ?? "-",
      }));
  } catch (err) {
    console.error("Erreur réseau:", err);
  }
});

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
    setTimeout(() => {
    }, 3000);
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
