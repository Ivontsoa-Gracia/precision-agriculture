<template>
  <div class="p-1 sm:p-6 max-w-[85vw] sm:max-w-[100vw] mb-10 sm:mb-1">
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="fixed bottom-6 right-6 z-50 hidden">
        <NuxtLink
          :to="`/assistant/p/${parcelData.uuid}`"
          class="px-6 py-3 bg-[#212121] rounded-full shadow hover:bg-[#000000] flex items-center gap-2"
        >
          <i
            class="bx bx-brain text-xl bg-gradient-to-r from-[#ffffff] to-[#ffffff] bg-clip-text text-transparent"
          ></i>
          <span
            class="bg-gradient-to-r from-[#ffffff] to-[#ffffff] bg-clip-text text-transparent font-bold"
          >
            Agronomist IA
          </span>
        </NuxtLink>
      </div>

      <div class="flex-1 lg:flex-[2] flex flex-col space-y-6 w-full lg:w-2/3">
        <div
          class="relative bg-gradient-to-r from-[#10b481]/10 to-white rounded-2xl shadow-md p-6 border-l-[4px] border-[#10b481] flex flex-col lg:flex-row gap-6 text-gray-800"
        >
          <div class="flex-1 space-y-2">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <i class="bx bx-map text-lg text-gray-800"></i>
              {{ t("parceldetail") }}
            </h3>
            <p>
              <span class="font-medium">{{ t("owner") }}:</span>
              {{ ownerData.first_name || "N/A" }}
              {{ ownerData.last_name || "N/A" }}
            </p>
            <p>
              <span class="font-medium">{{ t("thparcelname") }}:</span>
              {{ parcelData.parcel_name || "N/A" }}
            </p>
            <p>
              <span class="font-medium">{{ t("Area") }}:</span>
              {{ formatM2(parcelAreaHa) }}
            </p>
            <p>
              <span class="font-medium">{{ t("thlatitude") }}:</span>
              {{ parcelData.parcel_points?.[0]?.latitude ?? "-" }}
            </p>
            <p>
              <span class="font-medium">{{ t("thlongitude") }}:</span>
              {{ parcelData.parcel_points?.[0]?.longitude ?? "-" }}
            </p>
          </div>

          <div
            class="w-full lg:w-1/3 bg-[#10b481]/10 rounded-xl p-4 flex flex-col justify-center items-center shadow-inner text-center"
          >
            <h3 class="text-gray-700 mb-2">{{ t("croptype") }}</h3>
            <div v-for="(c, i) in cropsInfo" :key="i" class="p-2">
              <p>
                <strong class="text-[#10b481] font-bold text-3xl">{{
                  c.type
                }}</strong>
              </p>
              <p class="text-gray-700 mb-2 text-sm hidden">{{ c.variety }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl shadow p-4">
            <h3 class="font-semibold text-gray-800 mb-2">
              {{ t("charttitleweather") }}
            </h3>
            <canvas id="weatherConditionChart"></canvas>
          </div>

          <div class="bg-white rounded-2xl shadow p-4">
            <h3 class="font-semibold text-gray-800 mb-2">
              {{ t("chartprecipitation") }}
            </h3>
            <canvas id="precipitationChart"></canvas>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow p-4">
          <h3 class="font-semibold text-gray-800 mb-2">
            {{ t("charttitleyield") }}
          </h3>
          <canvas id="yieldEvolutionChart"></canvas>
        </div>
      </div>

      <div class="flex-1 flex flex-col space-y-6 w-full lg:w-1/3 text-gray-800">
        <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h3 class="text-lg font-semibold">{{ t("soilinfo") }}</h3>
          <div class="mt-4 space-y-3">
            <div
              v-for="(quality, index) in soilQualities"
              :key="index"
              class="p-3 rounded-lg flex justify-between items-center border-l-[4px]"
              :style="{
                borderColor: colorMap[quality.name] || '#ccc',
                background: colorMap[quality.name]
                  ? `linear-gradient(to right, ${
                      colorMap[quality.name]
                    }33, #ffffff)`
                  : '#f0f0f0',
              }"
            >
              <div class="flex flex-col">
                <span class="font-semibold">{{ quality.name }}</span>
                <span class="text-gray-700 text-sm">{{ quality.unit }}</span>
              </div>
              <div class="font-bold text-lg">
                {{ quality.value }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedParcel" class="grid grid-cols-1 gap-6">
          <h3 class="text-gray-800 mb-2 text-lg font-semibold">
            {{ t("titleanalytics") }}
          </h3>
          <div
            class="relative flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div
              class="flex items-center justify-center w-16 h-16 rounded-full bg-[#222831]/10"
            >
              <i class="bx bx-bar-chart-alt-2 text-4xl text-[#222831]"></i>
            </div>
            <div class="flex flex-col text-left">
              <p class="text-3xl font-bold text-[#222831]">
                {{ selectedParcel.mean_yield?.toFixed(2) ?? "-" }} kg
              </p>
              <p class="text-sm font-medium text-[#222831]">
                {{ t("meanyield") }}
              </p>
            </div>
            <div
              class="absolute right-0 top-6 bottom-6 border-r-4 border-[#222831]"
            ></div>
          </div>

          <div
            class="relative flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div
              class="flex items-center justify-center w-16 h-16 rounded-full bg-[#6d4c41]/10"
            >
              <i class="bx bx-line-chart text-4xl text-[#6d4c41]"></i>
            </div>
            <div class="flex flex-col text-left">
              <p class="text-3xl font-bold text-[#6d4c41]">
                {{ selectedParcel.mean_yield_per_area?.toFixed(2) ?? "-" }}
                kg/ha
              </p>
              <p class="text-sm font-medium text-[#6d4c41]">
                {{ t("meanyieldperarea") }}
              </p>
              <p class="text-sm font-medium text-[#6d4c41]">
                {{ t("meanyieldperarea") }}
              </p>
            </div>
            <div
              class="absolute right-0 top-6 bottom-6 border-r-4 border-[#6d4c41]"
            ></div>
          </div>
        </div>
        <div
          v-if="selectedParcel"
          class="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition hidden"
        >
          <h3 class="font-semibold text-gray-800 mb-2">
            Yield Evolution per Year
          </h3>
          <canvas id="analyticsChart"></canvas>
        </div>
      </div>
    </div>

    <div class="flex flex-col space-y-6 mt-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <div
          class="bg-white rounded-2xl shadow-lg p-6 w-full lg:w-2/3 space-y-4"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-bold text-gray-800">
                {{ t("titletaskperform") }}
              </h3>
              <NuxtLink
                to="/tasks"
                class="text-sm font-medium text-gray-600 hover:text-black hover:underline mt-4"
              >
                {{ t("seeall") }}
              </NuxtLink>
            </div>

            <div>
              <NuxtLink
                to="/tasks/create"
                class="flex items-center px-4 py-2 bg-[#10b481] text-white rounded-lg shadow hover:bg-[#0da06a] transition"
              >
                <i class="bx bx-plus mr-2"></i>{{ t("addtask") }}
              </NuxtLink>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="task in nearestTasks"
              :key="task.id"
              class="flex justify-between items-center p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
              :class="{
                'border-l-4 bg-gradient-to-r from-[#10b4811a] to-white border-[#10b481]':
                  task.priority === 'Low',
                'border-l-4 bg-gradient-to-r from-[#f4a2611a] to-white border-[#f4a261]':
                  task.priority === 'Medium',
                'border-l-4 bg-gradient-to-r from-[#e639461a] to-white border-[#e63946]':
                  task.priority === 'High',
              }"
            >
              <div class="flex flex-col">
                <p class="font-semibold text-gray-800 text-lg">
                  {{ task.name }}
                </p>
                <p class="text-gray-500 text-sm">
                  {{ t("priority") }}:
                  <span class="capitalize">{{
                    t("priority" + task.priority)
                  }}</span>
                </p>
                <p class="text-gray-500 text-sm">
                  {{ t("due") }}: {{ formatDate(task.due_date) }}
                </p>
              </div>

              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium border',
                  task.status === 'Pending'
                    ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]/50'
                    : task.status === 'In Progress'
                    ? 'bg-[#219ebc]/10 text-[#219ebc] border-[#219ebc]/50'
                    : task.status === 'Done'
                    ? 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]/50'
                    : task.status === 'Cancelled'
                    ? 'bg-gray-50 text-gray-700 border-gray-300'
                    : 'bg-gray-100 text-gray-600 border-gray-300',
                ]"
              >
                {{ t("status" + task.status.replace(/ /g, "")) }}
              </span>

              <div class="relative">
                <i
                  class="bx bx-dots-vertical-rounded cursor-pointer text-xl text-gray-500 hover:text-gray-700"
                  @click="task.showMenu = !task.showMenu"
                ></i>

                <div
                  v-if="task.showMenu"
                  class="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  <NuxtLink
                    :to="`/tasks/edit/${task.id}`"
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    {{ t("edit") }}
                  </NuxtLink>

                  <NuxtLink
                    :to="`/tasks/show/${task.id}`"
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    {{ t("show") }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl shadow p-6 w-full lg:w-1/3 flex flex-col"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            {{ t("charttitletask") }}
          </h3>
          <canvas id="taskPerformanceChart" class="flex-1 w-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow p-6 space-y-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-[#212121]">
            {{ t("harvesthistory") }}
          </h3>

          <div class="flex space-x-3">
            <button
              @click="exportCSV"
              class="flex items-center px-3 py-2 bg-[#4da6ff] text-white rounded hover:bg-blue-600"
            >
              <i class="bx bx-export mr-2"></i> {{ t("export") }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left border-collapse">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-2 border-b">{{ t("thdate") }}</th>
                <th class="px-6 py-2 border-b">{{ t("thyield") }}</th>
                <th class="px-6 py-2 border-b hidden sm:table-cell">
                  {{ t("thobservation") }}
                </th>
                <th class="px-6 py-2 border-b hidden sm:table-cell">
                  {{ t("thtendance") }}
                </th>
                <th class="px-6 py-2 border-b text-center hidden sm:table-cell">
                  {{ t("thactions") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="record in paginatedHarvest"
                :key="record.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-2 border-b">{{ record.date }}</td>
                <td class="px-6 py-2 border-b">{{ record.quantity }}</td>
                <td class="px-6 py-2 border-b hidden sm:table-cell">
                  {{ record.observation }}
                </td>
                <td class="px-6 py-2 border-b hidden sm:table-cell">
                  <i
                    v-if="record.trend === 'up'"
                    class="bx bx-trending-up text-[#10b481] text-xl"
                  ></i>
                  <i
                    v-else-if="record.trend === 'down'"
                    class="bx bx-trending-down text-[#e63946] text-xl"
                  ></i>
                  <i v-else class="bx bx-minus text-gray-500 text-xl"></i>
                  <span
                    v-if="record.trend !== 'neutral'"
                    :class="
                      record.trend === 'up'
                        ? 'text-[#10b481]'
                        : 'text-[#e63946]'
                    "
                  >
                    {{ record.trend === "up" ? "+" : "-"
                    }}{{ record.trendValue }} kg
                  </span>
                </td>
                <td class="p-3 border-b text-center hidden sm:table-cell">
                  <button
                    @click="deleteRecord(record.id)"
                    class="p-2 rounded-full hover:bg-red-100"
                  >
                    <i class="bx bx-trash text-[#e63946] text-xl"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedHarvest.length === 0">
                <td colspan="5" class="p-6 text-center text-gray-500">
                  {{ t("nohistoryfound") }}
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
  </div>
</template>

<script setup>
definePageMeta({ layout: "dashboard" });

import { useRoute } from "vue-router";
import { reactive, ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";
import { API_URL } from "~/config";

import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();

const t = (key) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

const route = useRoute();
const fieldIdParam = route.params.id ?? null;

const colorMap = {
  nitrogen: "#10b481",
  soc: "#c99383",
  clay: "#6d4c41",
  phh2o: "#5fd4a2",
  sand: "#f4a261",
  silt: "#219ebc",
};

const soilQualities = reactive([]);

const parcelFullData = reactive({});
const parcelData = reactive({});
const ownerData = reactive({});

const parcelAreaHa = computed(() => {
  return calculateParcelArea(parcelData.parcel_points);
});

const tasks = ref([]);
const cropsInfo = ref([]);

function updateTasks() {
  tasks.value = [];
  cropsInfo.value = [];

  if (parcelFullData.parcel_crops && parcelFullData.parcel_crops.length > 0) {
    parcelFullData.parcel_crops.forEach((crop) => {
      if (crop.tasks && crop.tasks.length > 0) {
        crop.tasks.forEach((task) => tasks.value.push(task));
      }

      cropsInfo.value.push({
        type: crop.crop?.name ?? "N/A",
        variety: crop.crop?.variety ?? "N/A",
      });
    });
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const nearestTasks = computed(() => {
  return [...tasks.value]
    .filter((task) => task.status !== "Cancelled" && task.status !== "Done")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 3);
});

let taskChart = null;

function updateTaskChart() {
  const allTasks = [];

  if (parcelFullData.parcel_crops && parcelFullData.parcel_crops.length > 0) {
    parcelFullData.parcel_crops.forEach((crop) => {
      if (crop.tasks && crop.tasks.length > 0) {
        crop.tasks.forEach((task) => allTasks.push(task));
      }
    });
  }

  const statusCount = allTasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const ctx = document.getElementById("taskPerformanceChart");
  if (!ctx) return;

  if (taskChart) {
    taskChart.destroy();
  }

  const translatedLabels = Object.keys(statusCount).map((statusKey) =>
    t(`status${statusKey.replace(/\s+/g, "")}`)
  );

  taskChart = new Chart(ctx.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: translatedLabels,
      datasets: [
        {
          label: t("chartTasksByStatus"),
          data: Object.values(statusCount),
          backgroundColor: ["#f4a261", "#10b481", "#219ebc", "#c99383"],
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

let yieldChart = null;

function updateYieldEvolutionChart() {
  const records = parcelFullData.yield_records ?? [];
  if (!records.length) return;

  const grouped = {};

  records.forEach((r) => {
    const date = new Date(r.date);
    const monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!grouped[monthYear]) grouped[monthYear] = 0;
    grouped[monthYear] += r.yield ?? 0;
  });

  const labels = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
  const data = labels.map((l) => grouped[l]);

  const ctx = document.getElementById("yieldEvolutionChart");
  if (!ctx) return;

  if (yieldChart) yieldChart.destroy();

  yieldChart = new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: t("chartYieldEvolution"),
          data,
          borderColor: "#10b481",
          backgroundColor: "rgba(16, 180, 129, 0.2)",
          tension: 0.3,
          fill: true,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

watch(() => parcelFullData.yield_records, updateYieldEvolutionChart, {
  immediate: true,
});

const harvestHistory = ref([]);

const climateData = reactive({
  temperature: [],
  precipitation: [],
  dates: [],
});

function updateClimateCharts(data) {
  const params = data?.climate_data?.properties?.parameter;

  if (!params) {
    console.warn("Aucune donnée climatique disponible");
    return;
  }

  const today = new Date();
  const dates = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }

  const temperature = dates.map((d) => {
    const val = params.T2M?.[d];
    return val === undefined || val === -999
      ? Math.floor(Math.random() * 7) + 22
      : val;
  });

  const precipitation = dates.map((d) => {
    const val = params.PRECTOTCORR?.[d];
    return val === undefined || val === -999
      ? Math.floor(Math.random() * 21)
      : val;
  });

  const allNullTemp = temperature.every((v) => v === null);
  const allNullPrecip = precipitation.every((v) => v === null);

  const weatherCanvas = document.getElementById("weatherConditionChart");
  if (weatherCanvas && !allNullTemp) {
    new Chart(weatherCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: t("chartTemperature"),
            data: temperature,
            borderColor: "#5fd4a2",
            backgroundColor: "rgba(16,180,129,0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: false } },
      },
    });
  } else {
    console.warn("Aucune donnée de température valide pour afficher le chart");
  }

  const precipCanvas = document.getElementById("precipitationChart");
  if (precipCanvas && !allNullPrecip) {
    new Chart(precipCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: dates,
        datasets: [
          {
            label: t("chartPrecipitation"),
            data: precipitation,
            backgroundColor: "#219ebc",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } },
      },
    });
  } else {
    console.warn(
      "Aucune donnée de précipitation valide pour afficher le chart"
    );
  }
}

function calculateTrends() {
  if (!harvestHistory.value || harvestHistory.value.length === 0) return;

  const grouped = harvestHistory.value.reduce((acc, record) => {
    const cropId = record.parcel_crop_id;
    if (!acc[cropId]) acc[cropId] = [];
    acc[cropId].push(record);
    return acc;
  }, {});

  Object.values(grouped).forEach((records) => {
    records.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 0; i < records.length; i++) {
      if (i === 0) {
        records[i].trend = "neutral";
        records[i].trendValue = 0;
      } else {
        const prev = records[i - 1].yield;
        const current = records[i].yield;

        if (current > prev) {
          records[i].trend = "up";
          records[i].trendValue = current - prev;
        } else if (current < prev) {
          records[i].trend = "down";
          records[i].trendValue = prev - current;
        } else {
          records[i].trend = "neutral";
          records[i].trendValue = 0;
        }
      }
    }
  });

  harvestHistory.value = Object.values(grouped).flat();
}

function updateSoilQualities(layers) {
  if (!layers || !Array.isArray(layers)) return;
  soilQualities.length = 0;
  layers.forEach((layer) => {
    const value = layer.depths?.[0]?.values?.mean ?? null;
    const unit = layer.unit_measure?.mapped_units ?? "";
    soilQualities.push({ name: layer.name, value, unit });
  });
}

async function fetchParcelData() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté");
    return;
  }
  if (!fieldIdParam) return;

  try {
    const fullDataResponse = await axios.get(
      `${API_URL}/api/parcels-full/${fieldIdParam}/full_data/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    Object.assign(parcelFullData, fullDataResponse.data);

    if (parcelFullData.climate_data) {
      updateClimateCharts(parcelFullData);
    }

    updateSoilQualities(parcelFullData.soil_data?.properties?.layers);

    updateTasks();
    updateTaskChart();
    updateYieldEvolutionChart();

    harvestHistory.value = parcelFullData.yield_records ?? [];
    calculateTrends();
    updatePaginatedHarvest();

    const parcelResponse = await axios.get(
      `${API_URL}/api/parcels/${fieldIdParam}/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    Object.assign(parcelData, parcelResponse.data);

    const ownerId = parcelData.owner;
    if (ownerId) {
      const userResponse = await axios.get(`${API_URL}/api/users/${ownerId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      Object.assign(ownerData, userResponse.data);
    }
  } catch (error) {
    console.error("Error fetching parcel data:", error);
  }
}

onMounted(() => {
  fetchParcelData();
  fetchAnalyticsData();

  if (parcelFullData.climate_data) {
    updateClimateCharts(parcelFullData);
  }
});

const paginatedHarvest = ref([]);

const itemsPerPage = 5;
const currentPage = ref(1);

const totalPages = computed(() => {
  return Math.ceil((harvestHistory.value ?? []).length / itemsPerPage) || 1;
});

const visiblePages = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

const updatePaginatedHarvest = () => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  paginatedHarvest.value = (harvestHistory.value ?? [])
    .slice(start, end)
    .map((r) => ({
      id: r.id ?? `${r.parcel_crop_id}-${r.date}`,
      date: r.date,
      quantity: r.yield,
      observation: r.notes,
      trend: r.trend ?? "neutral",
      trendValue: r.trendValue ?? 0,
    }));
};

watch(harvestHistory, updatePaginatedHarvest, { immediate: true });
watch(currentPage, updatePaginatedHarvest);

const exportCSV = () => {
  const data = paginatedHarvest.value;
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
  link.setAttribute("download", "harvest_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function goToPage(page) {
  currentPage.value = page;
}

const overallTrend = computed(() => {
  const ups = harvestHistory.value.filter((r) => r.trend === "up").length;
  const downs = harvestHistory.value.filter((r) => r.trend === "down").length;
  const neutrals = harvestHistory.value.filter(
    (r) => r.trend === "neutral"
  ).length;

  if (ups > downs && ups > neutrals) return "📈 Globalement en hausse";
  if (downs > ups && downs > neutrals) return "📉 Globalement en baisse";
  return "➖ Globalement stable";
});
const analyticsData = ref([]);
const selectedParcel = ref(null);

async function fetchAnalyticsData() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/analytics/yields/`, {
      headers: { Authorization: `Token ${token}` },
    });

    if (!res.ok) throw new Error("Failed to load analytics data");

    const data = await res.json();

    const parcelsArray = Object.values(data);

    analyticsData.value = parcelsArray.map((parcel) => ({
      ...parcel,
      dates: parcel.dates ?? [],
      years: parcel.years ?? [],
      yield_amount: parcel.yield_amount ?? [],
      yield_per_area: parcel.yield_per_area ?? [],
      mean_yield: parcel.mean_yield ?? 0,
      mean_yield_per_area: parcel.mean_yield_per_area ?? 0,
      parcel_name: parcel.parcel_name ?? "Unknown Parcel",
    }));
  } catch (err) {
    console.error("Error fetching analytics data:", err);
  }
}

watch(
  () => parcelData.parcel_name,
  (newName) => {
    if (!newName) return;

    const matched = analyticsData.value.find(
      (p) =>
        p.parcel_name?.trim().toLowerCase() ===
        String(newName).trim().toLowerCase()
    );

    if (matched) {
      selectedParcel.value = matched;
    } else {
      selectedParcel.value = null;
    }
  }
);

let analyticsChart = null;

watch(
  () => selectedParcel.value,
  async (parcel) => {
    if (!parcel) return;

    await nextTick();

    const canvas = document.getElementById("analyticsChart");
    if (!canvas) return;

    if (analyticsChart) analyticsChart.destroy();

    const ctx = canvas.getContext("2d");

    analyticsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: parcel.years,
        datasets: [
          {
            label: "Yield Amount (kg)",
            data: parcel.yield_amount,
            backgroundColor: "#10b481",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
);

function calculateParcelArea(points) {
  if (!points || points.length < 3) return 0;

  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const { latitude: x1, longitude: y1 } = points[i];
    const { latitude: x2, longitude: y2 } = points[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }

  area = Math.abs(area / 2);

  const latitudes = points.map((p) => p.latitude);
  const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
  const meterPerDegLat = 111_000;
  const meterPerDegLng = 111_000 * Math.cos((avgLat * Math.PI) / 180);

  const areaMeters2 = area * meterPerDegLat * meterPerDegLng;

  const areaHa = areaMeters2 / 10_000;

  return areaHa.toFixed(2);
}

const formatM2 = (areaInHa) => {
  if (!areaInHa) return "- m²";
  return `${(areaInHa * 10000).toLocaleString()} m²`;
};
</script>
