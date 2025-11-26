<template>
  <div class="w-full md:w-3/4 mx-auto">
    <button
      @click="goBack"
      class="text-[#222831] hover:underline text-sm font-medium mb-4 inline-flex items-center gap-1"
    >
      <i class="bx bx-arrow-left"></i> {{ t("back") }}
    </button>

    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
        {{ t("detailtask") }}
      </h2>
      <button
        @click="editTask"
        class="text-[#222831] hover:text-[#10b481] text-2xl flex items-center"
        title="Edit"
      >
        <i class="bx bx-edit-alt"></i>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">
            {{ t("taskname") }}
          </p>
          <p class="font-semibold text-gray-800">{{ task.name }}</p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">
            {{ t("due") }}
          </p>
          <p class="font-semibold text-gray-800">
            {{ formatDate(task.due_date) }}
          </p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">
            {{ t("parcelcrop") }}
          </p>
          <p class="font-semibold text-gray-800">
            {{ task.parcelCropFull || "-" }}
          </p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">
            {{ t("createdat") }}
          </p>
          <p class="font-semibold text-gray-800">
            {{ formatDate(task.created_at) }}
          </p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">
            {{ t("updatedat") }}
          </p>
          <p class="font-semibold text-gray-800">
            {{ formatDate(task.updated_at) }}
          </p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">
            {{ t("completedat") }}
          </p>
          <p class="font-semibold text-gray-800">
            {{ formatDate(task.completed_at) || "-" }}
          </p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-500 text-sm">
            {{ t("desc") }}
          </p>
          <p class="font-semibold text-gray-800">{{ task.description }}</p>
        </div>
      </div>

      <div class="border border-gray-100 p-4 rounded flex flex-col gap-3">
        <span class="uppercase tracking-wide text-gray-500 text-sm">{{
          t("priority")
        }}</span>
        <span
          :class="[
            'px-4 py-1 rounded-full text-md font-medium w-max text-center border',
            priorityName === 'Low'
              ? 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]/50'
              : priorityName === 'Medium'
              ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]/50'
              : priorityName === 'High'
              ? 'bg-[#e63946]/10 text-[#e63946] border-[#e63946]/50'
              : 'bg-gray-100',
          ]"
        >
          {{ t(priorityKeyMap[priorityName]) }}
        </span>
      </div>

      <div class="border border-gray-100 p-4 rounded flex flex-col gap-3">
        <span class="uppercase tracking-wide text-gray-500 text-sm">{{
          t("status")
        }}</span>
        <span
          :class="[
            'px-4 py-1 rounded-full text-md font-medium w-max text-center border',
            statusName === 'Pending'
              ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]/50'
              : statusName === 'In Progress'
              ? 'bg-[#219ebc]/10 text-[#219ebc] border-[#219ebc]/50'
              : statusName === 'Done'
              ? 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]/50'
              : statusName === 'Cancelled'
              ? 'bg-gray-200 text-gray-600 border-gray-300'
              : 'bg-gray-100',
          ]"
        >
          {{ t(statusKeyMap[statusName]) }}
        </span>
      </div>
    </div>
  </div>
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
  Canceled: "statusCancelled",
};

const router = useRouter();
const route = useRoute();
const id = route.params.id as string;

const task = ref<any>({});
const priorityName = ref<string>("");
const statusName = ref<string>("");

onMounted(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const resTask = await fetch(`${API_URL}/api/tasks/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    task.value = await resTask.json();

    if (task.value.parcelCrop) {
      try {
        const resParcelCrop = await fetch(
          `${API_URL}/api/parcel-crops/${task.value.parcelCrop}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        const parcelCropData = await resParcelCrop.json();

        const resParcel = await fetch(
          `${API_URL}/api/parcels/${parcelCropData.parcel}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        const parcelData = await resParcel.json();

        task.value.parcelCropFull = `${parcelData.parcel_name} - ${parcelCropData.crop.name}`;
      } catch (err) {
        console.error("Parcel/ParcelCrop fetch error:", err);
        task.value.parcelCropFull = "-";
      }
    } else {
      task.value.parcelCropFull = "-";
    }

    if (task.value.priority) {
      const resPriority = await fetch(
        `${API_URL}/api/task-priority/${task.value.priority}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      const dataPriority = await resPriority.json();
      priorityName.value = dataPriority.name;
    }

    if (task.value.status) {
      const resStatus = await fetch(
        `${API_URL}/api/task-status/${task.value.status}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      const dataStatus = await resStatus.json();
      statusName.value = dataStatus.name;
    }
  } catch (err) {
    console.error(err);
    alert("Failed to load task details");
  }
});

const goBack = () => router.push("/tasks");
const editTask = () => router.push(`/tasks/edit/${id}`);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(languageStore.lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<style scoped>
@keyframes gradient-slide {
  0% {
    background-position: 0%;
  }
  50% {
    background-position: 100%;
  }
  100% {
    background-position: 0%;
  }
}
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-slide 3s ease infinite;
}
</style>
