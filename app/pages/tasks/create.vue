<template>
  <section>
    <Breadcrumb />
    <div class="max-w-3xl mx-auto p-4 sm:p-6 mb-10 sm:mb-1">
      <h2
        class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6"
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
              class="w-full border p-2 rounded bg-transparent focus:ring-[#212121]"
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
              class="w-full border p-2 rounded bg-transparent focus:ring-[#212121]"
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
            class="w-full border p-2 rounded bg-transparent focus:ring-[#212121]"
          ></textarea>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 flex flex-col">
            <label class="text-gray-700 text-sm font-medium mb-1">{{
              t("parcelcrop")
            }}</label>
            <select
              v-model="form.parcelCrop"
              class="w-full border p-2 rounded bg-transparent focus:ring-[#212121]"
            >
              <option
                v-for="crop in parcelCrops"
                :key="crop.id"
                :value="crop.id"
              >
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
              class="w-full border p-2 rounded bg-transparent focus:ring-[#212121]"
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
            class="w-full border p-2 rounded bg-transparent focus:ring-[#212121]"
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

    <transition name="slide-right">
      <div
        v-if="notification.visible"
        class="fixed bottom-4 right-4 z-[9999] bg-[#112830] rounded shadow-xl px-6 py-4 flex items-center gap-4 w-80 text-left border-l-4 transition-all duration-300"
        :class="
          notification.type === 'success'
            ? 'border-[#10b481]'
            : 'border-red-500'
        "
      >
        <div
          :class="
            notification.type === 'success' ? 'bg-[#10b481]' : 'bg-red-500'
          "
          class="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
        >
          <i
            :class="notification.type === 'success' ? 'bx bx-check' : 'bx bx-x'"
          ></i>
        </div>
        <div>
          <p class="font-medium text-sm text-gray-100">
            {{ notification.message }}
          </p>
          <p class="text-gray-300 text-xs">
            {{
              notification.type === "success"
                ? "Success!"
                : "Something went wrong."
            }}
          </p>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import Breadcrumb from "~/components/Breadcrumb.vue";

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
