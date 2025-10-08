<template>
  <div class="p-4 sm:p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg mb-10 sm:mb-1">
    <h2 class="text-xl sm:text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2">
      <i class="bx bx-edit text-xl sm:text-3xl text-[#10b481]"></i>
      {{ t("edittask") }}
    </h2>

    <form @submit.prevent="submitTask" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("taskname") }} *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          />
        </div>

        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("due") }} *</label>
          <input
            v-model="form.due_date"
            type="date"
            required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          />
        </div>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold mb-1">{{ t("desc") }} *</label>
        <textarea
          v-model="form.description"
          required
          class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("parcelcrop") }}</label>
          <select
            v-model="form.parcelCrop"
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          >
            <option v-for="crop in parcelCrops" :key="crop.id" :value="crop.id">
              {{ crop.label }}
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("priority") }}</label>
          <select
            v-model="form.priority"
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          >
            <option v-for="p in priorities" :key="p.id" :value="p.id">
              {{ t(priorityKeyMap[p.name]) }}
            </option>
          </select>
        </div>
      </div>

      <div class="gap-4">
        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("status") }}</label>
          <select
            v-model="form.status"
            class="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          >
            <option v-for="s in statuses" :key="s.id" :value="s.id">
              {{ t(statusKeyMap[s.name]) }}
            </option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        class="w-full bg-[#10b481] hover:bg-[#0da06a] transition-colors py-3 rounded-xl text-white text-lg flex justify-center items-center gap-2"
      >
        <i class="bx bx-save text-xl"></i>
        {{ t("savetask") }}
      </button>
    </form>
  </div>
  <div
    v-if="isLoading"
    class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl"
  >
    <div
      class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"
    ></div>
  </div>
  <transition name="fade">
    <div
      v-if="notification.visible"
      :class="[
        'fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold',
        notification.type === 'success' ? 'bg-[#10b481]' : 'bg-red-500',
      ]"
    >
      {{ notification.message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
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
const route = useRoute();
const id = route.params.id as string;

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

const form = ref({
  name: "",
  description: "",
  due_date: "",
  parcelCrop: null,
  priority: null,
  status: null,
});

const priorities = ref<any[]>([]);
const statuses = ref<any[]>([]);
const parcelCrops = ref<any[]>([]);

onMounted(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/tasks/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    const data = await res.json();
    form.value = {
      name: data.name,
      description: data.description,
      due_date: data.due_date,
      parcelCrop: data.parcelCrop,
      priority: data.priority,
      status: data.status,
    };

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

    const parcelCropsRaw = await cropRes.json();
    parcelCrops.value = await Promise.all(
      parcelCropsRaw.map(async (pc: any) => {
        try {
          const resParcel = await fetch(
            `${API_URL}/api/parcels/${pc.parcel}/`,
            { headers: { Authorization: `Token ${token}` } }
          );
          const parcelData = await resParcel.json();
          return {
            ...pc,
            label: `${parcelData.parcel_name} - ${pc.crop.name}`,
          };
        } catch (err) {
          console.error("Parcel fetch error:", err);
          return { ...pc, label: pc.crop.name };
        }
      })
    );
  } catch (err) {
    console.error(err);
    alert("Failed to load data");
  }
});

const submitTask = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  isLoading.value = true;

  try {
    const res = await fetch(`${API_URL}/api/tasks/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    showNotification("Task updated successfully!", "success");

    router.push("/tasks");
  } catch (err) {
    console.error(err);
    showNotification("Network error, please check your server", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>
