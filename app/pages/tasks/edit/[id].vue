<template>
  <section>
    <div class="p-4 sm:p-6 max-w-3xl mx-auto mb-10 sm:mb-1 p-8 bg-white rounded-2xl border border-gray-200">
      <h2
        class="mb-6"
      >
        {{ t("edittask") }}
      </h2>

      <form @submit.prevent="submitTask" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label class="label mb-1"
              >{{ t("taskname") }} *</label
            >
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            />
          </div>

          <div class="flex flex-col">
            <label class="label mb-1"
              >{{ t("due") }} *</label
            >
            <input
              v-model="form.due_date"
              type="date"
              required
              class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            />
          </div>
        </div>

        <div class="flex flex-col">
          <label class="label mb-1"
            >{{ t("desc") }} *</label
          >
          <textarea
            v-model="form.description"
            required
            class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label class="label mb-1">{{
              t("parcelcrop")
            }}</label>
            <select
              v-model="form.parcelCrop"
              class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            >
              <option
                v-for="crop in parcelCrops"
                :key="crop.id"
                :value="crop.id"
              >
                {{ crop.label }}
              </option>
            </select>
          </div>

          <div class="flex flex-col">
            <label class="label mb-1">{{
              t("priority")
            }}</label>
            <select
              v-model="form.priority"
              class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            >
              <option v-for="p in priorities" :key="p.id" :value="p.id">
                {{ t(priorityKeyMap[p.name]) }}
              </option>
            </select>
          </div>
        </div>

        <div class="gap-4">
          <div class="flex flex-col">
            <label class="label mb-1">{{
              t("status")
            }}</label>
            <select
              v-model="form.status"
              class="w-full w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            >
              <option v-for="s in statuses" :key="s.id" :value="s.id">
                {{ t(statusKeyMap[s.name]) }}
              </option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          class="w-full btn-primary flex justify-center items-center gap-2"
        >
          {{ t("savetask") }}
        </button>
      </form>
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
import { useRouter, useRoute } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
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
    setTimeout(() => {
      router.push({ path: "/tasks", query: { refresh: "1" } });
    }, 3000);
  } catch (err) {
    console.error(err);
    showNotification("Network error, please check your server", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>
