<template>
  <div class="p-1 sm:p-6 mb-10 sm:mb-1">
    <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2">
      <i class="bx bx-task text-3xl text-[#10b481]"></i>
      {{ t("titiletaskslist") }}
    </h2>

    <div
      class="border-b border-gray-200 flex items-center justify-between mb-6"
    >
      <nav class="flex space-x-8">
        <a
          href="#"
          @click.prevent="activeTab = 'historique'"
          :class="[
            'loan-tab border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm',
            activeTab === 'historique'
              ? 'text-[#10b481] border-[#10b481]'
              : 'border-transparent text-gray-500 hover:text-[#10b481] hover:border-[#10b481]',
          ]"
        >
          {{ t("history") }}
        </a>
        <a
          href="#"
          @click.prevent="activeTab = 'upcoming'"
          :class="[
            'loan-tab border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm',
            activeTab === 'upcoming'
              ? 'text-[#10b481] border-[#10b481]'
              : 'border-transparent text-gray-500 hover:text-[#10b481] hover:border-[#10b481]',
          ]"
        >
          {{ t("upcoming") }}
        </a>
      </nav>

      <div class="flex justify-end">
        <NuxtLink
          to="/tasks/create"
          class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white rounded-lg hover:bg-[#0da06a] transition"
        >
          <i class="bx bx-plus text-lg"></i> {{ t("btnaddtask") }}
        </NuxtLink>

        <NuxtLink
          to="/tasks/d"
          class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white rounded-lg hover:bg-[#0da06a] transition"
        >
          <i class="bx bx-plus text-lg"></i> {{ t("TAsk Dashboard") }}
        </NuxtLink>
      </div>
    </div>

    <div class="hidden md:block overflow-x-auto bg-white rounded-xl shadow p-4">
      <table class="min-w-[700px] w-full text-left border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-2 border-b">{{ t("taskname") }}</th>
            <th class="px-6 py-2 border-b">{{ t("due") }}</th>
            <th class="px-6 py-2 border-b">{{ t("parcelcrop") }}</th>
            <th class="px-6 py-2 border-b text-center">{{ t("priority") }}</th>
            <th class="px-6 py-2 border-b text-center">{{ t("status") }}</th>
            <th class="px-6 py-2 border-b text-center">{{ t("thactions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in paginatedTasks"
            :key="task.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-2 border-b">{{ task.name }}</td>
            <td class="px-6 py-2 border-b">
              {{ new Date(task.due_date).toLocaleDateString() }}
            </td>
            <td class="px-6 py-2 border-b">{{ task.parcelCropFull || "-" }}</td>
            <td class="px-6 py-2 border-b text-center">
              <span
                v-if="priorities[task.priority]"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium border',
                  priorities[task.priority] === 'High'
                    ? 'bg-[#e63946]/10 text-[#e63946] border-[#e63946]/50'
                    : priorities[task.priority] === 'Medium'
                    ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]/50'
                    : 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]/50',
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
                  'px-3 py-1 rounded-full text-xs font-medium border',
                  statuses[task.status] === 'Pending'
                    ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]/50'
                    : statuses[task.status] === 'In Progress'
                    ? 'bg-[#219ebc]/10 text-[#219ebc] border-[#219ebc]/50'
                    : statuses[task.status] === 'Done'
                    ? 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]/50'
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
                class="p-2 rounded-full hover:bg-[#10b481]/20"
              >
                <i class="bx bx-show text-[#10b481] text-xl"></i>
              </button>
              <button
                @click="editTask(task.id)"
                class="p-2 rounded-full hover:bg-[#f4a261]/10"
              >
                <i class="bx bx-edit text-[#f4a261] text-xl"></i>
              </button>
              <button
                @click="deleteTask(task.id)"
                class="p-2 rounded-full hover:bg-[#e63946]/10"
              >
                <i class="bx bx-trash text-[#e63946] text-xl"></i>
              </button>
            </td>
          </tr>
          <tr v-if="paginatedTasks.length === 0">
            <td colspan="7" class="p-6 text-center text-gray-500">
              {{ t("notaskfound") }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="md:hidden space-y-4">
      <div
        v-for="task in paginatedTasks"
        :key="task.id"
        class="bg-white p-4 rounded-xl shadow flex flex-col gap-3 hover:shadow-lg transition"
      >
        <div class="flex justify-between items-start">
          <h3 class="font-bold text-[#212121] text-lg">{{ task.name }}</h3>
          <div class="flex gap-2">
            <button
              @click="showTask(task.id)"
              class="p-2 rounded-full hover:bg-[#10b481]/20"
            >
              <i class="bx bx-show text-[#10b481] text-xl"></i>
            </button>
            <button
              @click="editTask(task.id)"
              class="p-2 rounded-full hover:bg-[#f4a261]/10"
            >
              <i class="bx bx-edit text-[#f4a261] text-xl"></i>
            </button>
            <button
              @click="deleteTask(task.id)"
              class="p-2 rounded-full hover:bg-[#e63946]/10"
            >
              <i class="bx bx-trash text-[#e63946] text-xl"></i>
            </button>
          </div>
        </div>
        <p>
          <span class="font-semibold">{{ t("due") }}:</span>
          {{ new Date(task.due_date).toLocaleDateString() }}
        </p>
        <p>
          <span class="font-semibold">{{ t("parcelcrop") }}:</span>
          {{ task.parcelCropFull || "-" }}
        </p>
        <p>
          <span class="font-semibold">{{ t("priority") }}: </span>
          <span
            v-if="priorities[task.priority]"
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium border',
              priorities[task.priority] === 'High'
                ? 'bg-[#e63946]/10 text-[#e63946] border-[#e63946]/50'
                : priorities[task.priority] === 'Medium'
                ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]/50'
                : 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]/50',
            ]"
          >
            {{ t(priorityKeyMap[priorities[task.priority]]) }}
          </span>
          <span v-else>-</span>
        </p>
        <p>
          <span class="font-semibold">{{ t("status") }}: </span>
          <span
            v-if="statuses[task.status]"
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium border',
              statuses[task.status] === 'Pending'
                ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]/50'
                : statuses[task.status] === 'In Progress'
                ? 'bg-[#219ebc]/10 text-[#219ebc] border-[#219ebc]/50'
                : statuses[task.status] === 'Done'
                ? 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]/50'
                : statuses[task.status] === 'Canceled'
                ? 'bg-gray-100 text-gray-600 border-gray-500'
                : 'bg-gray-200 text-gray-700',
            ]"
          >
            {{ t(statusKeyMap[statuses[task.status]]) }}
          </span>
          <span v-else>-</span>
        </p>
      </div>
      <p v-if="paginatedTasks.length === 0" class="text-center text-gray-500">
        {{ t("notaskfound") }}
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
        >
          {{ page }}
        </button>
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
  if (
    Object.keys(prioritiesState.value.data).length &&
    Object.keys(statusesState.value.data).length &&
    now - prioritiesState.value.timestamp < 30 * 60 * 1000 &&
    now - statusesState.value.timestamp < 30 * 60 * 1000
  ) {
    priorities.value = prioritiesState.value.data;
    statuses.value = statusesState.value.data;
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

watch(activeTab, () => {
  currentPage.value = 1;
  updatePaginated();
});
watch(currentPage, () => updatePaginated());

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
    await loadLookups();
    updatePaginated();
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

const filteredTasks = computed(() => {
  if (activeTab.value === "historique") return tasks.value;
  const now = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(now.getMonth() + 3);
  return tasks.value.filter((task) => {
    const dueDate = new Date(task.due_date);
    const statusName = statuses.value[task.status] || "";
    return (
      statusName !== "Done" && dueDate >= now && dueDate <= threeMonthsLater
    );
  });
});

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
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const goToPage = (page: number) => {
  currentPage.value = page;
};

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
</script>
