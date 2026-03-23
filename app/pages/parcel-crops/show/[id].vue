<template>
  <div
    class="p-8 flex flex-col gap-8 md:flex-row md:items-start md:justify-center md:gap-6 "
  >
    <div class="w-full md:w-2/3 mx-auto p-8 bg-white rounded-2xl border border-gray-200">
      <button
      @click="goBack"
      class="menu-item hover:underline mb-4 inline-flex items-center gap-1"
    >
      <i class="bx bx-arrow-left"></i> {{ t("back") }}
    </button>

      <div class="flex items-center justify-between mb-6">
        <h2 class="flex items-center gap-3">
          {{ t("pareclcropdetail") }}
        </h2>
        <button
          @click="goToEdit(parcelCrop.id)"
          class="btn-neutre flex items-center"
          title="Edit"
        >
        <i class="bx bx-edit-alt"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border border-gray-200 p-4 text-sm rounded-xl flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-400 small ">
              {{ t("parcel") }}
            </p>
            <p class="content">
              {{ parcelCrop.parcel_name }}
            </p>
          </div>
        </div>

        <div class="border border-gray-200 p-4 text-sm rounded-xl flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-400 small">
              {{ t("crop") }}
            </p>
            <p class="content">
              {{ parcelCrop.crop?.name }} ({{
                parcelCrop.crop?.variety?.name || "-"
              }})
            </p>
          </div>
        </div>

        <div class="border border-gray-200 text-sm p-4 rounded-xl flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-400 small ">
              {{ t("plantingdate") }}
            </p>
            <p class="content">
              {{ formatDate(parcelCrop.planting_date) }}
            </p>
          </div>
        </div>

        <div class="border border-gray-200 text-sm p-4 rounded-xl flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-400 small text-sm">
              {{ t("harvestdate") }}
            </p>
            <p class="content">
              {{
                parcelCrop.harvest_date
                  ? formatDate(parcelCrop.harvest_date)
                  : "-"
              }}
            </p>
          </div>
        </div>

        <div class="border border-gray-200 text-sm p-4 rounded-xl flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-400 small text-sm">
              {{ t("area") }} (m²)
            </p>
            <p class="content">{{ parcelCrop.area }}</p>
          </div>
        </div>

        <div class="border border-gray-200 text-sm p-4 rounded-xl flex items-center gap-3">
          <div>
            <p class="uppercase tracking-wide text-gray-400 small text-sm mb-2">
              {{ t("status") }}
            </p>
            <span
                v-if="parcelCrop.status?.name"
                :class="[
                  'px-3 py-1 rounded-full text-xs',
                  statusClasses(parcelCrop.status.name),
                ]"
              >
                {{ t(cropStatusKeyMap[parcelCrop.status.name]) }}
              </span>
              <span v-else>-</span>
          </div>
        </div>

        <div
          class="border border-gray-200 text-sm p-4 rounded-xl flex items-center gap-3 col-span-1 md:col-span-2"
        >
          <div>
            <p class="uppercase tracking-wide text-gray-400 small text-sm">
              {{ t("createdat") }}
            </p>
            <p class="content">
              {{ formatDate(parcelCrop.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="forecastData"
      class="w-full md:w-1/3 bg-[#112830] rounded-2xl shadow-sm p-6 flex flex-col items-center text-white"
    >
      <div
        class="flex items-center justify-center w-12 h-12 md:w-20 md:h-20 rounded bg-[#10b481]/20"
      >
        <i
          class="bx bx-bar-chart-alt-2 text-2xl md:text-3xl text-[#10b481]"
        ></i>
      </div>

      <h2 class="mt-4 text-center text-gray-200">
        {{ t("titleyieldforcast") }}
      </h2>
      <p class="mt-2 text-center text-gray-300 small text-sm">
        {{ t("forecastdate") }}:
        <span class="font-medium text-gray-200 small text-sm">{{
          formatDate(forecastData.forecast_date)
        }}</span>
      </p>
      <p class="text-xl md:text-3xl font-extrabold text-[#10b481] mt-4 small">
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

const cropStatusKeyMap: Record<string, string> = {
  Planned: "cropStatusPlanned",
  Planted: "cropStatusPlanted",
  Germinated: "cropStatusGerminated",
  Growing: "cropStatusGrowing",
  Flowering: "cropStatusFlowering",
  Fruiting: "cropStatusFruiting",
  Mature: "cropStatusMature",
  Harvested: "cropStatusHarvested",
  "Post-Harvest": "cropStatusPostHarvest",
  Failed: "cropStatusFailed",
};

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
  gradient.addColorStop(0, "#10b481");
  gradient.addColorStop(1, "#10b481");

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
          hoverBackgroundColor: "#10b481",
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

const statusClasses = (statusName: string) => {
  switch (statusName) {
    case "Planned":
      return "bg-[#219ebc]/10 text-[#219ebc] border border-[#219ebc]";
    case "Planted":
      return "bg-[#10b481]/10 text-[#10b481] border border-[#10b481]";
    case "Germinated":
      return "bg-[#5fd4a2]/10 text-[#0c9069] border border-[#0c9069]";
    case "Growing":
      return "bg-[#c99383]/10 text-[#c99383] border border-[#c99383]";
    case "Flowering":
      return "bg-[#f4a261]/10 text-[#f4a261] border border-[#f4a261]";
    case "Fruiting":
      return "bg-[#6d4c41]/10 text-[#6d4c41] border border-[#6d4c41]";
    case "Mature":
      return "bg-[#10b481]/10 text-[#0c9069] border border-[#10b481]";
    case "Harvested":
      return "bg-[#222831]/10 text-[#222831] border border-[#222831]";
    case "Post-Harvest":
      return "bg-[#7a7a7a]/10 text-[#7a7a7a] border border-[#7a7a7a]";
    case "Failed":
      return "bg-[#e63946]/10 text-[#e63946] border border-[#e63946]";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-300";
  }
};
</script>
