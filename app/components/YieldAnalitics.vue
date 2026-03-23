<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="">
          {{ t("titleanalytics") }}
        </h2>
        <p class="text-sm text-gray-400 small">
          Overview of your parcel performance
        </p>
      </div>

      <div class="flex gap-3 w-full sm:w-auto">
        <select v-model="selectedParcel" class="btn-neutre">
          <option value="">{{ t("allParcel") }}</option>
          <option
            v-for="(p, idx) in analyticsData"
            :key="idx"
            :value="p.parcel_name"
          >
            {{ p.parcel_name }}
          </option>
        </select>

        <button @click="downloadChart" class="btn-primary">
          {{ t("exportChart") }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div
        class="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-5"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="subtitle">Yield evolution</h3>
          <span class="text-xs text-gray-400 small">Live data</span>
        </div>

        <div class="flex-1 h-64 md:h-72 bg-white small">
          <canvas ref="yieldCanvas"></canvas>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="kpi-card">
          <p class="text-xs text-gray-400 uppercase tracking-wide small">
            {{ t("totalyield") }}
          </p>
          <p class="text-xl font-semibold text-gray-700 small mt-1">
            {{ totalYield.toFixed(2) }}
          </p>
        </div>

        <div class="kpi-card">
          <p class="text-xs text-gray-400 uppercase tracking-wide small">
            {{ t("averageyield") }}
          </p>
          <p class="text-xl font-semibold text-gray-700 small mt-1">
            {{ averageYield.toFixed(2) }}
          </p>
        </div>

        <div class="kpi-card">
          <p class="text-xs text-gray-400 uppercase tracking-wide small">
            {{ t("cumulativeYield") }}
          </p>
          <p class="text-xl font-semibold text-gray-700 small mt-1">
            {{ cumulativeYield.toFixed(2) }}
          </p>
        </div>

        <div class="kpi-card">
          <p class="text-xs text-gray-400 uppercase tracking-wide small">
            {{ t("volatility") }}
          </p>
          <p class="text-xl font-semibold text-gray-700 small mt-1">
            {{ volatility.toFixed(2) }}
          </p>
        </div>

        <div class="kpi-card col-span-2">
          <p class="text-xs text-gray-400 uppercase tracking-wide small">
            {{ t("yieldRelative") }}
          </p>
          <p
            class="text-xl font-semibold text-gray-700 small mt-1 text-[#10b481]"
          >
            {{ relativeYield.toFixed(2) }} %
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from "vue";
import Chart from "chart.js/auto";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();

const t = (key: string) => translate[languageStore.lang][key] || key;

const yieldChart = ref<Chart | null>(null);
const yieldCanvas = ref<HTMLCanvasElement | null>(null);
const analyticsData = useState<any[]>("analyticsData", () => []);
const selectedParcel = ref<string>("");

async function fetchAnalytics() {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  if (!Array.isArray(analyticsData.value)) analyticsData.value = [];

  if (analyticsData.value.length > 0) {
    console.log("Using cached analytics data");
    await nextTick();
    createChart();
    return;
  }

  try {
    const res = await fetch(`${API_URL}/analytics/yields/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch analytics yields");
    const resData = await res.json();

    analyticsData.value = Array.isArray(resData)
      ? resData
      : Object.values(resData);
    await nextTick();
    createChart();
  } catch (err) {
    console.error(err);
  }
}

function createChart() {
  if (!analyticsData.value.length || !yieldCanvas.value) return;

  const dataToUse = selectedParcel.value
    ? analyticsData.value.filter((p) => p.parcel_name === selectedParcel.value)
    : analyticsData.value;

  if (!dataToUse.length) {
    if (yieldChart.value) yieldChart.value.destroy();
    yieldChart.value = null;
    return;
  }

  const allDatesSet = new Set<string>();
  dataToUse.forEach((p) =>
    p.dates.forEach((d) => allDatesSet.add(d.split("T")[0]))
  );
  const labels = Array.from(allDatesSet)
    .sort()
    .map((d) => {
      const date = new Date(d);
      return date.toLocaleDateString(
        languageStore.lang === "fr" ? "fr-FR" : "en-US",
        {
          year: "numeric",
          month: "short",
        }
      );
    });

  const colors = [
    "#112830",
    "#f4a261",
    "#10b481",
    "#6d4c41",
    "#222831",
    "#f4a261",
    "#219ebc",
  ];
  const datasets = dataToUse.map((p, idx) => {
    const ctx = yieldCanvas.value!.getContext("2d")!;
    const gradient = ctx.createLinearGradient(
      0,
      0,
      0,
      yieldCanvas.value!.height
    );
    gradient.addColorStop(0, colors[idx % colors.length] + "33");
    gradient.addColorStop(1, colors[idx % colors.length] + "05");

    return {
      label: p.parcel_name,
      data: labels.map((label) => {
        const originalDate = p.dates.find((dateStr) => {
          const d = new Date(dateStr);
          const formatted = d.toLocaleDateString(
            languageStore.lang === "fr" ? "fr-FR" : "en-US",
            { year: "numeric", month: "short" }
          );
          return formatted === label;
        });

        if (!originalDate) return null;

        const index = p.dates.findIndex((dateStr) => dateStr === originalDate);
        return p.yield_amount[index];
      }),

      backgroundColor: colors[idx % colors.length],
      borderColor: colors[idx % colors.length],

      borderRadius: 3,
      borderSkipped: false,
    };
  });

  if (yieldChart.value) yieldChart.value.destroy();

  yieldChart.value = new Chart(yieldCanvas.value, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { left: 10, right: 10, top: 5, bottom: 5 } },

      plugins: {
        legend: {
          display: false,
          position: "top",
          labels: {
            usePointStyle: true,
            pointStyle: "rectRounded",
            color: "#374151",
            font: { size: 11 },
          },
        },
        tooltip: {
          backgroundColor: "#1f2937",
          titleFont: { size: 12, weight: "bold" },
          bodyFont: { size: 11 },
          padding: 8,
          cornerRadius: 3,
          displayColors: false,
        },
      },

      scales: {
        x: {
          ticks: { color: "#6b7280", font: { size: 11 } },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#6b7280", font: { size: 11 } },
          grid: {
            color: "#f2f2f2",
            borderDash: [4, 4],
          },
          border: { display: false },
        },
      },
    },
  });
}

function downloadChart() {
  if (!yieldChart.value) return;
  const link = document.createElement("a");
  link.href = yieldChart.value.toBase64Image();
  link.download = "parcel_yields_chart.png";
  link.click();
}

watch(selectedParcel, () => createChart());
onMounted(() => fetchAnalytics());

// Assurer que filteredData est un tableau
const filteredData = computed(() =>
  Array.isArray(analyticsData.value)
    ? selectedParcel.value
      ? analyticsData.value.filter(
          (p) => p.parcel_name === selectedParcel.value
        )
      : analyticsData.value
    : []
);

// Assurer que yield_amount est un tableau
const allYields = computed(() =>
  filteredData.value.flatMap((p) =>
    Array.isArray(p.yield_amount) ? p.yield_amount : []
  )
);

const totalYield = computed(() =>
  allYields.value.reduce((acc, v) => acc + v, 0)
);

const averageYield = computed(() =>
  allYields.value.length ? totalYield.value / allYields.value.length : 0
);

const cumulativeYield = computed(() =>
  filteredData.value.reduce(
    (acc, p) =>
      acc +
      (Array.isArray(p.yield_amount)
        ? p.yield_amount.reduce((a, b) => a + b, 0)
        : 0),
    0
  )
);

const volatility = computed(() => {
  const mean = averageYield.value;
  const n = allYields.value.length;
  if (!n) return 0;
  const variance =
    allYields.value.reduce((sum, y) => sum + (y - mean) ** 2, 0) / n;
  return Math.sqrt(variance);
});

const relativeYield = computed(() => {
  if (!filteredData.value.length) return 0;
  const maxTotal = Math.max(
    ...analyticsData.value.map((p) =>
      Array.isArray(p.yield_amount)
        ? p.yield_amount.reduce((a, b) => a + b, 0)
        : 0
    )
  );
  const thisTotal = Array.isArray(filteredData.value[0].yield_amount)
    ? filteredData.value[0].yield_amount.reduce((a, b) => a + b, 0)
    : 0;
  return maxTotal ? (thisTotal / maxTotal) * 100 : 0;
});

const anomalies = computed(() => {
  const mean = averageYield.value;
  const std = volatility.value;
  return allYields.value.filter(
    (y) => y > mean + 2 * std || y < mean - 2 * std
  );
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #d0d0d0;
  border-radius: 10px;
}

.kpi-card {
  @apply p-4 rounded-2xl bg-white border border-gray-200 transition;
}
</style>
