<template>
  <div class="max-w-3xl mx-auto p-4 sm:p-6 mb-10 sm:mb-1">
    <h2
      class="text-xl sm:text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2"
    >
      {{ t("titlenewtask") }}
    </h2>

    <form @submit.prevent="submitTask" class="space-y-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 flex flex-col">
          <label class="text-gray-700 text-sm font-medium mb-1"
            >{{ t("taskname") }} *</label
          >
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full border p-2 rounded focus:ring-[#212121]"
          />
        </div>

        <div class="flex-1 flex flex-col">
          <label class="text-gray-700 text-sm font-medium mb-1"
            >{{ t("due") }} *</label
          >
          <input
            v-model="form.due_date"
            type="date"
            required
            class="w-full border p-2 rounded focus:ring-[#212121]"
          />
        </div>
      </div>

      <div class="flex flex-col">
        <label class="text-gray-700 text-sm font-medium mb-1"
          >{{ t("desc") }} *</label
        >
        <textarea
          v-model="form.description"
          required
          class="w-full border p-2 rounded focus:ring-[#212121]"
        ></textarea>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 flex flex-col">
          <label class="text-gray-700 text-sm font-medium mb-1">{{
            t("parcelcrop")
          }}</label>
          <select
            v-model="form.parcelCrop"
            class="w-full border p-2 rounded focus:ring-[#212121]"
          >
            <option v-for="crop in parcelCrops" :key="crop.id" :value="crop.id">
              {{ crop.fullName }}
            </option>
          </select>
        </div>

        <div class="flex-1 flex flex-col">
          <label class="text-gray-700 text-sm font-medium mb-1">{{
            t("priority")
          }}</label>
          <select
            v-model="form.priority"
            class="w-full border p-2 rounded focus:ring-[#212121]"
          >
            <option v-for="p in priorities" :key="p.id" :value="p.id">
              {{ t(priorityKeyMap[p.name]) }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex flex-col">
        <label class="text-gray-700 text-sm font-medium mb-1">{{
          t("status")
        }}</label>
        <select
          v-model="form.status"
          class="w-full border p-2 rounded focus:ring-[#212121]"
        >
          <option v-for="s in statuses" :key="s.id" :value="s.id">
            {{ t(statusKeyMap[s.name]) }}
          </option>
        </select>
      </div>

      <button
        type="submit"
        class="w-full bg-[#10b481] text-white py-2 rounded hover:opacity-90 transition"
      >
        {{ t("btnaddtask") }}
      </button>
    </form>
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
definePageMeta({
  layout: "dashboard",
});

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";

import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;

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

const priorities = useState<any[]>("prioritiesData", () => []);
const statuses = useState<any[]>("statusesData", () => []);
const parcelCrops = useState<any[]>("parcelCropsData", () => []);

const form = ref({
  name: "",
  description: "",
  due_date: "",
  parcelCrop: null,
  priority: null,
  status: null,
});

onMounted(async () => {
  const uuid = sessionStorage.getItem("uuid");
  const token = sessionStorage.getItem("token");

  if (!uuid || !token) {
    router.push("/login");
    return;
  }

  try {
    const [priRes, staRes, cropRes] = await Promise.all([
      fetch(`${API_URL}/api/task-priority/`, {
        headers: { Authorization: `Token ${token}` },
      }),
      fetch(`${API_URL}/api/task-status/`, {
        headers: { Authorization: `Token ${token}` },
      }),
      fetch(`${API_URL}/api/parcel-crops/`, {
        headers: { Authorization: `Token ${token}` },
      }),
    ]);

    priorities.value = await priRes.json();
    statuses.value = await staRes.json();
    const cropsData = await cropRes.json();

    const enrichedCrops = await Promise.all(
      cropsData.map(async (pc: any) => {
        try {
          const resParcel = await fetch(
            `${API_URL}/api/parcels/${pc.parcel}/`,
            { headers: { Authorization: `Token ${token}` } }
          );
          const parcelData = await resParcel.json();
          return {
            ...pc,
            fullName: `${parcelData.parcel_name} - ${pc.crop.name}`,
          };
        } catch {
          return { ...pc, fullName: pc.crop.name };
        }
      })
    );

    parcelCrops.value = enrichedCrops;
  } catch (err) {
    console.error("Erreur lors du chargement des options:", err);
  }
});

const submitTask = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) return router.push("/login");

  const { name, due_date, parcelCrop, priority, status } = form.value;
  if (!name || !due_date || !parcelCrop || !priority || !status) {
    showNotification("Please fill in all required fields.", "error");
    return;
  }

  isLoading.value = true;

  try {
    const res = await fetch(`${API_URL}/api/tasks/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) throw new Error("Failed to create task");
    await res.json();

    showNotification("Task saved successfully!", "success");
    setTimeout(
      () => router.push({ path: "/tasks", query: { refresh: "1" } }),
      3000
    );
  } catch (err) {
    console.error("Erreur création tâche:", err);
    showNotification("Network error, please check your server", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>
