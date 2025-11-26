<template>
  <div
    class="p-6 flex flex-col gap-8 md:flex-row md:items-start md:justify-center md:gap-6"
  >
    <div class="w-full md:w-2/3 mx-auto">
      <button
        @click="goBack"
        class="text-[#222831] hover:underline text-sm font-medium mb-4 inline-flex items-center gap-1"
      >
        <i class="bx bx-arrow-left"></i> {{ t("back") }}
      </button>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
          {{ t("pareclcropdetail") }}
        </h2>
        <button
          @click="goToEdit(parcelCrop.id)"
          class="text-[#222831] hover:text-[#10b481] text-2xl flex items-center"
          title="Edit"
        >
        <i class="bx bx-edit-alt"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("parcel") }}
            </p>
            <p class="font-semibold text-gray-800">
              {{ parcelCrop.parcel_name }}
            </p>
          </div>
        </div>

        <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("crop") }}
            </p>
            <p class="font-semibold text-gray-800">
              {{ parcelCrop.crop?.name }} ({{
                parcelCrop.crop?.variety?.name || "-"
              }})
            </p>
          </div>
        </div>

        <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("plantingdate") }}
            </p>
            <p class="font-semibold text-gray-800">
              {{ formatDate(parcelCrop.planting_date) }}
            </p>
          </div>
        </div>

        <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("harvestdate") }}
            </p>
            <p class="font-semibold text-gray-800">
              {{
                parcelCrop.harvest_date
                  ? formatDate(parcelCrop.harvest_date)
                  : "-"
              }}
            </p>
          </div>
        </div>

        <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("area") }} (m²)
            </p>
            <p class="font-semibold text-gray-800">{{ parcelCrop.area }}</p>
          </div>
        </div>

        <div class="border border-gray-100 p-4 rounded flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("status") }}
            </p>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                statusColorClass(parcelCrop.status?.name),
              ]"
            >
              {{ parcelCrop.status?.name || "-" }}
            </span>
          </div>
        </div>

        <div
          class="border border-gray-100 p-4 rounded flex items-center gap-3 col-span-1 md:col-span-2"
        >
          <div>
            <p class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("createdat") }}
            </p>
            <p class="font-semibold text-gray-800">
              {{ formatDate(parcelCrop.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="forecastData"
      class="w-full md:w-1/3 bg-[#222831] rounded shadow-sm p-6 flex flex-col items-center text-white"
    >
      <div
        class="flex items-center justify-center w-12 h-12 md:w-20 md:h-20 rounded bg-[#f4a261]/20"
      >
        <i
          class="bx bx-bar-chart-alt-2 text-2xl md:text-3xl text-[#f4a261]"
        ></i>
      </div>

      <h3 class="text-xl md:text-2xl font-bold mt-4 text-center text-gray-200">
        {{ t("titleyieldforcast") }}
      </h3>
      <p class="mt-2 text-center text-gray-300">
        {{ t("forecastdate") }}:
        <span class="font-semibold text-gray-200">{{
          formatDate(forecastData.forecast_date)
        }}</span>
      </p>
      <p class="text-xl md:text-3xl font-extrabold text-[#f4a261] mt-4">
        {{ forecastData.predicted_yield.toFixed(2) }} kg
      </p>

      <div class="w-full h-40 md:h-48 mt-12">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import Chart from "chart.js/auto";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;

const route = useRoute();
const router = useRouter();
const parcelCrop = ref<any>({});
const forecastData = ref<any>(null);
const yieldRecords = ref<any[]>([]);
const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const isLoading = ref(false);

onMounted(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/parcel-crops/${route.params.id}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load parcel crop");
    const data = await res.json();

    const resParcel = await fetch(`${API_URL}/api/parcels/`, {
      headers: { Authorization: `Token ${token}` },
    });
    const parcels = await resParcel.json();
    const parcel = parcels.find((p: any) => p.uuid === data.parcel);
    parcelCrop.value = {
      ...data,
      parcel_name: parcel?.parcel_name || data.parcel,
    };

    const resForecast = await fetch(`${API_URL}/forecast/${route.params.id}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!resForecast.ok) throw new Error("Failed to load forecast");
    forecastData.value = await resForecast.json();

    const resYields = await fetch(`${API_URL}/api/yield-records/`, {
      headers: { Authorization: `Token ${token}` },
    });
    const allYields = await resYields.json();
    yieldRecords.value = allYields.filter(
      (y: any) => y.parcelCrop === parcelCrop.value.id
    );

    await nextTick();
    renderChart();
  } catch (err) {
    console.error(err);
  }
});

const renderChart = () => {
  if (!chartRef.value) return;

  const labels = yieldRecords.value.map((y) => formatDate(y.date));
  const data = yieldRecords.value.map((y) => y.yield_amount);

  if (chartInstance) chartInstance.destroy();

  const ctx = chartRef.value.getContext("2d");
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, 0, chartRef.value.height);
  gradient.addColorStop(0, "rgba(244,162,97,0.8)");
  gradient.addColorStop(1, "rgba(244,162,97,0.3)");

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Yield (kg)",
          data,
          backgroundColor: gradient,
          borderRadius: 3,
          barThickness: 20,
          hoverBackgroundColor: "#f4a261",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        x: {
          ticks: { color: "#ccc", font: { weight: "500" } },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#ccc", font: { weight: "500" } },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
    },
  });
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

const goToEdit = (id: number) => {
  router.push(`/parcel-crops/edit/${id}`);
};

const goBack = () => {
  router.push("/parcel-crops");
};

const statusColorClass = (status: string | undefined) => {
  switch (status) {
    case "Planned":
      return "bg-gray-200 text-gray-800";
    case "Planted":
      return "bg-blue-100 text-blue-700";
    case "Growing":
      return "bg-yellow-100 text-yellow-800";
    case "Harvested":
      return "bg-green-100 text-green-700";
    case "Failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
</script>
