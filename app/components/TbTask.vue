<template>
  <div class="">

    <div
      class="border-b border-gray-200 flex items-center justify-between mb-6"
    >
      <nav class="flex space-x-8">
        <a
          href="#"
          @click.prevent="activeTab = 'historique'"
          :class="[
            'loan-tab border-b-2 whitespace-nowrap py-4 px-1 small text-sm',
            activeTab === 'historique'
              ? 'text-[#10b481] border-[#10b481]'
              : 'border-transparent text-gray-700 hover:text-[#10b481] hover:border-[#10b481]',
          ]"
        >
          {{ t("history") }}
        </a>
        <a
          href="#"
          @click.prevent="activeTab = 'upcoming'"
          :class="[
            'loan-tab border-b-2 whitespace-nowrap py-4 px-1 small text-sm',
            activeTab === 'upcoming'
              ? 'text-[#10b481] border-[#10b481]'
              : 'border-transparent text-gray-700 hover:text-[#10b481] hover:border-[#10b481]',
          ]"
        >
          {{ t("upcoming") }}
        </a>
        <select
          v-model="parcelCropFilter"
          class="border-b-2 border-transparent outline-none text-gray-700 bg-transparent px-2 py-1 small text-sm hover:text-[#10b481] hover:border-[#10b481]"
        >
          <option value="">{{ t("all") }}</option>
          <option
            v-for="parcel in uniqueParcelCrops"
            :key="parcel"
            :value="parcel"
          >
            {{ parcel }}
          </option>
        </select>
      </nav>

      <div class="flex justify-end gap-3">
        <button
        @click="markTasksDone"
        :disabled="selectedTasks.length === 0"
        class="btn-neutre disabled:opacity-0"
      >
        {{ t("markDone") }}
      </button>
      </div>
    </div>

    <div class="block overflow-x-auto bg-white">
      <table class="min-w-[700px] w-full text-left border-collapse overflow-y-auto">
        <thead class="bg-[#FAFAF9]">
          <tr>
            <th
              @click="sortBy('name')"
              class="px-6 py-3 text-left text-xs small text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("taskname") }}
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('due_date')"
              class="px-6 py-3 text-left text-xs small text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("due") }}
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              @click="sortBy('parcelCropFull')"
              class="px-6 py-3 text-left text-xs small text-gray-500 uppercase tracking-wider border-b"
            >
              {{ t("parcelcrop") }}
              <i class="bxr bx-carets-up-down"></i>
            </th>
            <th
              class="px-6 py-3 text-left text-xs small text-gray-500 uppercase tracking-wider border-b text-center"
            >
              {{ t("priority") }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs small text-gray-500 uppercase tracking-wider border-b text-center"
            >
              {{ t("status") }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs small text-gray-500 uppercase tracking-wider border-b text-center"
            >
              {{ t("thactions") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in paginatedTasks"
            :key="task.id"
            class="hover:bg-gray-50"
          >
          <td class="px-6 py-2 border-b text-sm text-gray-900">
              <div class="flex items-center gap-3">
                <label
                  v-if="statuses[task.status] !== 'Done'"
                  class="relative flex items-center gap-3 cursor-pointer select-none"
                >
                  <div class="relative">
                    <input
                      type="checkbox"
                      v-model="selectedTasks"
                      :value="task.id"
                      class="appearance-none w-5 h-5 border border-gray-300 rounded flex items-center justify-center transition-all duration-200 checked:bg-[#10b481] checked:border-gray-400 cursor-pointer"
                    />
                    <svg
                      v-if="selectedTasks.includes(task.id)"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                      stroke-width="3"
                      class="absolute inset-0 m-auto w-3 h-3 pointer-events-none"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </label>

                <span
                  v-else
                  class="flex items-center justify-center w-5 h-5 border border-gray-400 bg-[#fafaf9] rounded"
                >
                  <svg
                    class="w-3 h-3 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>

                <!-- Nom de la tâche -->
                <span
                  :class="
                    statuses[task.status] === 'Done'
                      ? 'line-through small text-gray-400'
                      : 'content'
                  "
                >
                  {{ task.name }}
                </span>
              </div>
            </td>
            <td class="px-6 py-2 border-b content">
                {{ formatDate(task.due_date) }}
            </td>
            <td class="px-6 py-2 border-b content">
              {{ task.parcelCropFull || "-" }}
            </td>
            <td class="px-6 py-2 border-b text-center">
              <span
                v-if="priorities[task.priority]"
                :class="[
                  'px-3 py-1 rounded-full text-xs small border',
                  priorities[task.priority] === 'High'
                    ? 'bg-[#e63946]/10 text-[#e63946] border-[#e63946]'
                    : priorities[task.priority] === 'Medium'
                    ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]'
                    : 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]',
                ]"
              >
                {{ t(priorityKeyMap[priorities[task.priority]]) }}
              </span>
              <span v-else>-</span>
            </td>
            <td class="px-6 py-2 border-b text-center">
              <span
                v-if="statuses[task.status]"
                :class="[
                  'px-3 py-1 rounded-full text-xs small border',
                  statuses[task.status] === 'Pending'
                    ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]'
                    : statuses[task.status] === 'In Progress'
                    ? 'bg-[#219ebc]/10 text-[#219ebc] border-[#219ebc]'
                    : statuses[task.status] === 'Done'
                    ? 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]'
                    : statuses[task.status] === 'Canceled'
                    ? 'bg-gray-100 text-gray-600 border-gray-500'
                    : 'bg-gray-200 text-gray-700',
                ]"
              >
                {{ t(statusKeyMap[statuses[task.status]]) }}
              </span>
              <span v-else>-</span>
            </td>
            <td class="p-3 border-b text-center flex justify-center gap-2">
              <button
                @click="showTask(task.id)"
                class="p-2 px-2 rounded-full hover:bg-[#10b481]/20"
              >
                <i class="bx bx-show text-[#10b481] text-lg"></i>
              </button>
              <button
                @click="editTask(task.id)"
                class="p-2 px-2 rounded-full hover:bg-[#f4a261]/10"
              >
                <i class="bx bx-edit text-[#f4a261] text-lg"></i>
              </button>
              <button
                @click="deleteTask(task.id)"
                class="p-2 px-2 rounded-full hover:bg-[#e63946]/10"
              >
                <i class="bx bx-trash text-[#e63946] text-lg"></i>
              </button>
            </td>
          </tr>
          <tr v-if="paginatedTasks.length === 0">
            <td colspan="7" class="p-6 text-center text-gray-400 small text-sm">
              {{ t("notaskfound") }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    
    <div class="bg-white px-4 py-3 rounded-b-2xl flex items-center justify-between sm:px-6 content">
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
              class="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
              class="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
import TaskCalendar from "~/components/TaskCalendar.vue";
import Breadcrumb from "~/components/Breadcrumb.vue";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;
const currentLocale = computed(() => languageStore.lang);

const priorityKeyMap = {
  Low: "priorityLow",
  Medium: "priorityMedium",
  High: "priorityHigh",
};
const statusKeyMap = {
  Pending: "statusPending",
  "In Progress": "statusInProgress",
  Done: "statusDone",
  Cancelled: "statusCancelled",
};

const router = useRouter();

const tasksState = useState("tasksData", () => ({
  data: [] as any[],
  timestamp: 0,
}));
const prioritiesState = useState("prioritiesData", () => ({
  data: {} as Record<number, string>,
  timestamp: 0,
}));
const statusesState = useState("statusesData", () => ({
  data: {} as Record<number, string>,
  timestamp: 0,
}));

const tasks = ref<any[]>(tasksState.value.data);
const priorities = ref<Record<number, string>>(prioritiesState.value.data);
const statuses = ref<Record<number, string>>(statusesState.value.data);

const activeTab = ref<"historique" | "upcoming">("historique");
const itemsPerPage = 4;
const currentPage = ref(1);
const paginatedTasks = ref<any[]>([]);

const loadLookups = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  const now = Date.now();
  const priorityDataSafe = prioritiesState.value.data || {};
  const statusDataSafe = statusesState.value.data || {};

  if (
    Object.keys(priorityDataSafe).length &&
    Object.keys(statusDataSafe).length &&
    now - prioritiesState.value.timestamp < 30 * 60 * 1000 &&
    now - statusesState.value.timestamp < 30 * 60 * 1000
  ) {
    priorities.value = priorityDataSafe;
    statuses.value = statusDataSafe;
    return;
  }

  try {
    const [priorityRes, statusRes] = await Promise.all([
      fetch(`${API_URL}/api/task-priority/`, {
        headers: { Authorization: `Token ${token}` },
      }),
      fetch(`${API_URL}/api/task-status/`, {
        headers: { Authorization: `Token ${token}` },
      }),
    ]);
    if (!priorityRes.ok || !statusRes.ok)
      throw new Error("Failed to load lookups");

    const priorityData = await priorityRes.json();
    const statusData = await statusRes.json();

    priorities.value = Object.fromEntries(
      priorityData.map((p: any) => [p.id, p.name])
    );
    statuses.value = Object.fromEntries(
      statusData.map((s: any) => [s.id, s.name])
    );

    prioritiesState.value = { data: priorities.value, timestamp: Date.now() };
    statusesState.value = { data: statuses.value, timestamp: Date.now() };
  } catch (err) {
    console.error("Lookup load error:", err);
  }
};

const totalPages = computed(() =>
  Math.ceil(filteredTasks.value.length / itemsPerPage)
);
const visiblePages = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1)
);

const updatePaginated = () => {
  const start = (currentPage.value - 1) * itemsPerPage;
  paginatedTasks.value = filteredTasks.value.slice(start, start + itemsPerPage);
};

const result = ref(0);

onMounted(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  const now = Date.now();
  if (
    tasksState.value.data.length &&
    now - tasksState.value.timestamp < 30 * 60 * 1000
  ) {
    tasks.value = tasksState.value.data;
    result.value = tasks.value.length;
    await loadLookups();
    updatePaginated();
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/tasks/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    tasks.value = data;
    result.value = data.length;
    await loadLookups();

    await Promise.all(
      tasks.value.map(async (task: any) => {
        if (task.parcelCrop) {
          try {
            const resParcelCrop = await fetch(
              `${API_URL}/api/parcel-crops/${task.parcelCrop}/`,
              { headers: { Authorization: `Token ${token}` } }
            );
            if (!resParcelCrop.ok) throw new Error("ParcelCrop fetch error");
            const parcelCropData = await resParcelCrop.json();

            const resParcel = await fetch(
              `${API_URL}/api/parcels/${parcelCropData.parcel}/`,
              { headers: { Authorization: `Token ${token}` } }
            );
            if (!resParcel.ok) throw new Error("Parcel fetch error");
            const parcelData = await resParcel.json();

            task.parcelCropFull = `${parcelData.parcel_name} - ${parcelCropData.crop.name}`;
          } catch (err) {
            console.error(err);
            task.parcelCropFull = "-";
          }
        } else {
          task.parcelCropFull = "-";
        }
      })
    );

    updatePaginated();

    tasksState.value = { data: tasks.value, timestamp: Date.now() };
  } catch (err) {
    console.error("Failed to load tasks:", err);
  }
});

onMounted(async () => {
  if (router.currentRoute.value.query.refresh) {
    await fetchTasks();
  }
});

// const filteredTasks = computed(() => {
//   if (activeTab.value === "historique") return tasks.value;
//   const now = new Date();
//   const threeMonthsLater = new Date();
//   threeMonthsLater.setMonth(now.getMonth() + 3);
//   return tasks.value.filter((task) => {
//     const dueDate = new Date(task.due_date);
//     const statusName = statuses.value[task.status] || "";
//     return (
//       statusName !== "Done" && dueDate >= now && dueDate <= threeMonthsLater
//     );
//   });
// });

const deleteTask = async (id: number) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    const res = await fetch(`${API_URL}/api/tasks/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    tasks.value = tasks.value.filter((t) => t.id !== id);
    tasksState.value.data = tasks.value;
    updatePaginated();
    alert("Task deleted successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to delete task");
  }
};

const editTask = (id: number) => router.push(`/tasks/edit/${id}`);
const showTask = (id: number) => router.push(`/tasks/show/${id}`);
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function goToPage(page: number | string) {
  if (page !== "...") currentPage.value = page as number;
}

const fetchTasks = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/tasks/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    tasks.value = await res.json();

    await loadLookups();

    await Promise.all(
      tasks.value.map(async (task: any) => {
        if (task.parcelCrop) {
          try {
            const resParcelCrop = await fetch(
              `${API_URL}/api/parcel-crops/${task.parcelCrop}/`,
              { headers: { Authorization: `Token ${token}` } }
            );
            if (!resParcelCrop.ok) throw new Error("ParcelCrop fetch error");
            const parcelCropData = await resParcelCrop.json();

            const resParcel = await fetch(
              `${API_URL}/api/parcels/${parcelCropData.parcel}/`,
              { headers: { Authorization: `Token ${token}` } }
            );
            if (!resParcel.ok) throw new Error("Parcel fetch error");
            const parcelData = await resParcel.json();

            task.parcelCropFull = `${parcelData.parcel_name} - ${parcelCropData.crop.name}`;
          } catch {
            task.parcelCropFull = "-";
          }
        } else {
          task.parcelCropFull = "-";
        }
      })
    );

    updatePaginated();
    tasksState.value = { data: tasks.value, timestamp: Date.now() };
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  }
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(languageStore.lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const parcelCropFilter = ref("");
const sortKey = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

const uniqueParcelCrops = computed(() => {
  const set = new Set(tasks.value.map((t) => t.parcelCropFull).filter(Boolean));
  return Array.from(set);
});

const filteredTasks = computed(() => {
  let filtered = tasks.value;

  if (activeTab.value === "upcoming") {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);
    filtered = filtered.filter((task) => {
      const dueDate = new Date(task.due_date);
      const statusName = statuses.value[task.status] || "";
      return (
        statusName !== "Done" && dueDate >= now && dueDate <= threeMonthsLater
      );
    });
  }

  if (parcelCropFilter.value) {
    filtered = filtered.filter(
      (task) => task.parcelCropFull === parcelCropFilter.value
    );
  }

  if (sortKey.value) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortKey.value] || "";
      const bVal = b[sortKey.value] || "";
      if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
      return 0;
    });
  }

  result.value = filtered.length;
  return filtered;
});

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
  updatePaginated();
};

watch([parcelCropFilter, activeTab, filteredTasks], () => {
  currentPage.value = 1;
  updatePaginated();
});

const selectedTasks = ref<number[]>([]);

const markTasksDone = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  try {
    await Promise.all(
      selectedTasks.value.map(async (taskId) => {
        const task = tasks.value.find((t) => t.id === taskId);
        if (!task) return;

        const updatedTask = {
          ...task,
          status: Object.keys(statuses.value).find(
            (id) => statuses.value[Number(id)] === "Done"
          ),
        };

        const res = await fetch(`${API_URL}/api/tasks/${taskId}/mark_done/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(updatedTask),
        });

        if (!res.ok) throw new Error(`Failed to update task ${taskId}`);
      })
    );

    // Mettre à jour localement
    tasks.value.forEach((task) => {
      if (selectedTasks.value.includes(task.id)) {
        task.status = Number(
          Object.keys(statuses.value).find(
            (id) => statuses.value[Number(id)] === "Done"
          )
        );
      }
    });

    selectedTasks.value = [];
    updatePaginated();
    alert("Selected tasks marked as Done!");
  } catch (err) {
    console.error(err);
    alert("Failed to update selected tasks");
  }
};
</script>


<style>
::-webkit-scrollbar {
  width: 2px;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
}
</style>