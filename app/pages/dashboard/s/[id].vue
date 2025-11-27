<template>
<div class="p-6 sm:p-6 space-y-4 sm:space-y-6 mb-10 sm:mb-1 pt-12 w-full max-w-[100vw] overflow-x-hidden">
    <WeatherData />
    <YieldAnalitics />

    <div class="space-y-6 mb-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            class="relative flex items-center gap-4 p-3 bg-white rounded shadow-sm transition border border-gray-100"
          >
            <div
              class="flex items-center justify-center w-20 h-20 rounded bg-[#10b481]/10"
            >
              <i class="bx bx-location-alt-2 text-4xl text-[#10b481]"></i>
            </div>
            <div class="flex flex-col text-left">
              <p class="text-3xl font-bold text-[#10b481]">
                {{ totalParcels }}
              </p>
              <p class="text-sm font-medium text-[#10b481]">
                {{ t("activeparcels") }}
              </p>
            </div>
            <div
              class="absolute right-0 top-3 bottom-3 border-r-4 border-[#10b481]"
            ></div>
          </div>

          <div
            class="relative flex items-center gap-4 p-3 bg-white rounded shadow-sm transition border border-gray-100"
          >
            <div
              class="flex items-center justify-center w-20 h-20 rounded bg-[#c99383]/10"
            >
              <i class="bxr bx-calendar-check text-4xl text-[#c99383]"></i>
            </div>
            <div class="flex flex-col text-left">
              <p class="text-3xl font-bold text-[#c99383]">{{ taskTasks }}</p>
              <p class="text-sm font-medium text-[#c99383]">
                {{ t("totalTask") }}
              </p>
            </div>
            <div
              class="absolute right-0 top-3 bottom-3 border-r-4 border-[#c99383]"
            ></div>
          </div>

          <div
            class="relative col-span-2 p-6 bg-white rounded shadow-sm transition border border-gray-100 h-64"
          >
            <canvas ref="taskPerformanceCanvas"></canvas>
          </div>
        </div>

        <div
          class="lg:col-span-1 relative p-6 bg-gray-100 rounded shadow-md border border-gray-100 flex flex-col items-center justify-center"
        >
          <canvas ref="taskChartCanvas" class="w-64 h-64"></canvas>

          <div
            class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <p class="text-5xl font-extrabold text-[#112830]">
              {{ taskCompletionRate }}%
            </p>
            <span class="mt-2 text-xs text-gray-500 font-medium">{{
              t("completedtasks")
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        class="relative p-5 bg-white rounded border border-gray-100 shadow-sm transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-[#10b481]/10 rounded flex items-center justify-center shadow"
        >
          <i class="bx bx-location-pin text-[#10b481] text-lg"></i>
        </div>

        <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {{ t("fertility") }}
        </p>
        <h3 class="mt-2 text-lg font-semibold text-gray-800">
          {{ bestSoilParcel?.parcel_name }}
        </h3>
        <p class="text-sm text-gray-500">
          SOC : {{ bestSoilParcel?.soil_summary.soc }}
        </p>
      </div>

      <div
        class="relative p-5 bg-white rounded border border-gray-100 shadow-sm transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-yellow-100 rounded flex items-center justify-center shadow"
        >
          <i class="bxr bx-leaf-alt text-yellow-400 text-lg"></i>
        </div>

        <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {{ t("productivity") }}
        </p>
        <h3 class="mt-2 text-lg font-semibold text-gray-800">
          {{ topCrop?.crop_name }}
        </h3>
        <p class="text-sm text-gray-500">
          {{ t("total") }} : {{ topCrop?.summary.total_yield.toFixed(2) }} kg
        </p>
      </div>

      <div
        class="relative p-5 bg-white rounded border border-gray-100 shadow-sm transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-red-100 rounded flex items-center justify-center shadow"
        >
          <i class="bxr bx-thermometer text-red-500 text-xl"></i>
        </div>
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {{ t("tempAverage") }}
        </p>
        <h3 class="mt-2 text-lg font-semibold text-gray-800">
          {{ avgTemperature }}°C
        </h3>
      </div>

      <div
        class="relative p-5 bg-white rounded border border-gray-100 shadow-sm transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-orange-100 rounded flex items-center justify-center shadow"
        >
          <i class="bx bx-error text-orange-600 text-xl"></i>
        </div>

        <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {{ t("riskParcel") }}
        </p>
        <h3 class="mt-2 text-lg font-semibold text-gray-800">
          {{ highestRiskParcel?.parcel_name }}
        </h3>
        <p class="text-sm text-gray-500">
          {{ highestRiskParcel?.alerts_count }} {{ t("alerts") }}
        </p>
      </div>

      <div
        class="relative p-5 bg-white rounded border border-gray-100 shadow-sm transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-[#219ebc]/10 rounded flex items-center justify-center shadow"
        >
          <i
            class="bxr bx-chart-bar-columns absolute text-[#219ebc] text-xl"
          ></i>
        </div>
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {{ t("bestRendement") }}
        </p>
        <h3 class="mt-2 text-lg font-semibold text-gray-800">
          {{ bestYieldParcel?.parcel_name }}
        </h3>
        <p class="text-sm text-gray-500">
          {{ t("moyenne") }} :
          {{
            bestYieldParcel?.summary.avg_yield
              ? bestYieldParcel.summary.avg_yield.toFixed(2)
              : 0
          }}
          kg
        </p>
      </div>

      <div
        class="relative p-5 bg-white rounded border border-gray-100 shadow-sm transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded flex items-center justify-center shadow"
        >
          <i class="bxr bx-database text-gray-400 text-xl"></i>
        </div>
        <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {{ t("cultureSansDonnees") }}
        </p>
        <h3 class="mt-2 text-lg font-semibold text-gray-800">
          {{ emptyCrops.length }} {{ t("culture") }}
        </h3>
      </div>
    </div>
  </div>
  <div
    class="px-6 flex items-center justify-between border-b border-gray-300 mb-2 mt-20 text-sm sm:text-base"
  >
    <div class="flex gap-6">
      <a
        v-for="menu in menus"
        :key="menu.name"
        href="#"
        @click.prevent="selectMenu(menu.name)"
        :class="[
          'relative px-3 py-2 font-medium transition-colors after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#10b481] after:transition-all hover:after:w-full focus:after:w-full',
          activeMenu === menu.name
            ? 'text-[#10b481] after:w-full'
            : 'text-gray-800',
        ]"
      >
        {{ menu.label }}
      </a>
    </div>

    <button
      @click="goToAddPage"
      class="flex items-center gap-2 bg-[#10b481] hover:bg-[#10b481] focus:bg-[#10b481] text-white px-4 py-2 rounded transition"
    >
      <i class="bx bx-plus text-lg"></i>
      <span>{{ t("add") }}</span>
    </button>
  </div>

  <div class="p-6">
    <component :is="currentComponent" />
  </div>

  <!-- <ActiveAlerte /> -->

  <pre
    class="bg-gray-900 text-green-400 text-sm p-4 rounded-xl overflow-auto mt-6 hidden"
    >{{ dashboardJson }}
</pre
  >
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";
import TbParcel from "~/components/TbParcel.vue";
import TbTask from "~/components/TbTask.vue";
import TbYield from "~/components/TbYield.vue";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import WeatherData from "~/components/WeatherData.vue";
import YieldAnalitics from "~/components/YieldAnalitics.vue";
// import ActiveAlerte from "~/components/ActiveAlerte.vue";
import Chart from "chart.js/auto";

const languageStore = useLanguageStore();

const t = (key: string) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

const showSortMenu = ref(false);

const router = useRouter();

const totalParcels = computed(() => dashboard.value.parcels?.length || 0);
const taskCompletionRate = computed(() => {
  let total = 0,
    done = 0;
  dashboard.value.task_summary?.forEach((t: any) => {
    total += t.task_summary?.total_tasks || 0;
    done += t.task_summary?.completed_tasks || 0;
  });
  return total > 0 ? Math.round((done / total) * 100) : 0;
});

const taskTasks = computed(() => {
  let total = 0,
    done = 0;
  dashboard.value.task_summary?.forEach((t: any) => {
    total += t.task_summary?.total_tasks || 0;
    done += t.task_summary?.completed_tasks || 0;
  });
  return total;
});

const yieldTotal = computed(
  () =>
    dashboard.value.yield_summary?.reduce(
      (sum: number, y: any) => sum + (y.summary?.total_yield || 0),
      0
    ) || 0
);
const yieldAvg = computed(() => {
  const vals =
    dashboard.value.yield_summary?.map((y: any) => y.summary?.avg_yield || 0) ||
    [];
  return vals.length
    ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    : 0;
});

const dashboardState = useState("dashboardData", () => ({
  parcels: [],
  task_summary: [],
  yield_summary: [],
  soil_summary: [],
}));

const dashboard = ref(dashboardState.value);

async function fetchDashboard() {
  const token = sessionStorage.getItem("token");
  if (!token) return router.push("/login");

  try {
    const res = await axios.get(`${API_URL}/api/dashboard/full_dashboard/`, {
      headers: { Authorization: `Token ${token}` },
    });
    dashboard.value = res.data;
    dashboardState.value = res.data;
  } catch (err) {
    console.error(err);
  }
}

watch(dashboard, (val) => (dashboardState.value = val), { deep: true });

onMounted(async () => {
  await fetchDashboard();
});

const userUUID = sessionStorage.getItem("uuid");
const activeMenu = ref("parcelles");

const menus = computed(() => [
  {
    name: "parcelles",
    label: t("parcels"),
    component: TbParcel,
    addPath: `/parcels/create/p/${userUUID}`,
  },
  {
    name: "taches",
    label: t("tasks"),
    component: TbTask,
    addPath: "/tasks/create",
  },
  {
    name: "culture",
    label: t("yields"),
    component: TbYield,
    addPath: "/yield-records/create",
  },
]);

const currentComponent = computed(() => {
  const menu = menus.value.find((m) => m.name === activeMenu.value);
  return menu ? menu.component : TbParcel;
});

const selectMenu = (name: string) => {
  activeMenu.value = name;
};

const goToAddPage = () => {
  const menu = menus.value.find((m) => m.name === activeMenu.value);
  if (menu) router.push(menu.addPath);
};

const dashboardJson = computed(() => JSON.stringify(dashboard.value, null, 2));

const bestSoilParcel = computed(() => {
  const soilList = dashboard.value.soil_summary || [];
  if (!soilList.length) return null;

  const best = soilList.reduce((best, curr) => {
    return curr.soil_summary.soc > (best?.soil_summary.soc || 0) ? curr : best;
  }, null);

  if (!best) return null;

  const parcel = dashboard.value.parcels?.find((p) => p.id === best.parcel_id);

  return {
    ...best,
    parcel_name: parcel?.name || "Inconnu",
  };
});

const topCrop = computed(() => {
  const yields = dashboard.value.yield_summary || [];
  const valid = yields.filter((y) => y.summary);
  return valid.length
    ? valid.reduce((max, y) =>
        y.summary.total_yield > max.summary.total_yield ? y : max
      )
    : null;
});

const emptyCrops = computed(
  () => dashboard.value.yield_summary?.filter((y) => !y.summary) || []
);

const highestRiskParcel = computed(() => {
  return dashboard.value.climate_summary?.parcel_details?.reduce((max, p) =>
    p.alerts_count > max.alerts_count ? p : max
  );
});

const avgTemperature = computed(() => {
  const list = dashboard.value.climate_summary?.parcel_details || [];
  if (!list.length) return 0;
  return Math.round(
    list.reduce((sum, p) => sum + (p.current_temperature || 0), 0) / list.length
  );
});

const bestYieldParcel = computed(() => {
  const yields = dashboard.value.yield_summary?.filter((y) => y.summary) || [];
  if (!yields.length) return null;

  return yields.reduce((max, y) =>
    y.summary.avg_yield > max.summary.avg_yield ? y : max
  );
});

const totalTasks = computed(
  () =>
    dashboard.value.task_summary?.reduce(
      (sum, t) => sum + (t.task_summary?.total_tasks || 0),
      0
    ) || 0
);

const completedTasks = computed(
  () =>
    dashboard.value.task_summary?.reduce(
      (sum, t) => sum + (t.task_summary?.completed_tasks || 0),
      0
    ) || 0
);

const pendingTasks = computed(() => totalTasks.value - completedTasks.value);

const tasksByParcel = computed(
  () =>
    dashboard.value.task_summary?.map((t) => {
      const parcel = dashboard.value.parcels?.find((p) => p.id === t.parcel_id);
      return {
        parcel_name: parcel?.name || "Inconnu",
        total: t.task_summary?.total_tasks || 0,
        completed: t.task_summary?.completed_tasks || 0,
        pending:
          (t.task_summary?.total_tasks || 0) -
          (t.task_summary?.completed_tasks || 0),
      };
    }) || []
);

const taskChartCanvas = ref<HTMLCanvasElement | null>(null);
let taskChart: Chart | null = null;

const statusColors: Record<string, string> = {
  Pending: "#f4a261",
  "In Progress": "#10b481",
  Done: "#219ebc",
  Cancelled: "#c99383",
};

const allTasks = computed(() => {
  const tasks: any[] = [];
  dashboard.value.task_summary?.forEach((parcel: any) => {
    const total = parcel.task_summary?.total_tasks || 0;
    const completed = parcel.task_summary?.completed_tasks || 0;
    const pending = total - completed;

    if (pending > 0) tasks.push({ status: "Pending", count: pending });
    if (completed > 0) tasks.push({ status: "Done", count: completed });
  });
  return tasks;
});

const statusCount = computed(() => {
  const counts: Record<string, number> = {};
  allTasks.value.forEach((t) => {
    counts[t.status] = (counts[t.status] || 0) + t.count;
  });
  return counts;
});

function updateTaskChart() {
  if (!taskChartCanvas.value) return;
  if (taskChart) taskChart.destroy();

  const labels = Object.keys(statusCount.value);
  const dataValues = Object.values(statusCount.value);
  const backgroundColors = labels.map(
    (status) => statusColors[status] || "#888"
  );

  taskChart = new Chart(taskChartCanvas.value.getContext("2d")!, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12, padding: 16 } },
      },
    },
  });
}

watch(statusCount, () => updateTaskChart(), { deep: true });

onMounted(() => updateTaskChart());

const yieldTrendCanvas = ref<HTMLCanvasElement | null>(null);
let yieldTrendChart: Chart | null = null;

const yieldTrendData = computed(() => {
  const yields = dashboard.value.yield_summary?.filter((y) => y.summary) || [];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    return {
      day: `Day ${i + 1}`,
      value:
        yields.reduce((sum, y) => sum + (y.summary?.avg_yield || 0), 0) /
        (yields.length || 1),
    };
  });
  return last7Days;
});

function updateYieldTrendChart() {
  if (!yieldTrendCanvas.value) return;
  if (yieldTrendChart) yieldTrendChart.destroy();

  yieldTrendChart = new Chart(yieldTrendCanvas.value.getContext("2d")!, {
    type: "line",
    data: {
      labels: yieldTrendData.value.map((d) => d.day),
      datasets: [
        {
          label: "Avg Yield (kg)",
          data: yieldTrendData.value.map((d) => d.value),
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
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 500 },
        },
      },
    },
  });
}

onMounted(() => updateYieldTrendChart());
watch(yieldTrendData, () => updateYieldTrendChart(), { deep: true });

const taskPerformanceCanvas = ref<HTMLCanvasElement | null>(null);
let taskPerformanceChart: Chart | null = null;

const taskPerformanceData = computed(() => {
  const parcels = dashboard.value.parcels || [];
  const tasks = dashboard.value.task_summary || [];

  return parcels.map((parcel) => {
    const summary = tasks.find((t) => t.parcel_id === parcel.id);

    const total = summary?.task_summary?.total_tasks || 0;
    const completed = summary?.task_summary?.completed_tasks || 0;

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      parcel_name: parcel.name,
      completion_rate: rate,
    };
  });
});

function renderTaskPerformanceChart() {
  if (!taskPerformanceCanvas.value) return;
  if (taskPerformanceChart) taskPerformanceChart.destroy();

  const labels = taskPerformanceData.value.map((p) => p.parcel_name);
  const values = taskPerformanceData.value.map((p) => p.completion_rate);

  taskPerformanceChart = new Chart(
    taskPerformanceCanvas.value.getContext("2d")!,
    {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Completion Rate (%)",
            data: values,
            borderRadius: 3,
            barThickness: 18,
            backgroundColor: values.map(
              (v) => `rgba(16, 180, 129, ${0.3 + v / 300})`
            ),
            borderColor: "#10b481",
            borderWidth: 1,
            hoverBackgroundColor: "#10b481",
            hoverBorderColor: "#10b481",
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            right: 20,
            left: 20,
            bottom: 10,
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#2c2c2c",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#10b481",
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function (context) {
                return `${context.dataset.data[context.dataIndex]}% completed`;
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 10,
              color: "#6b7280",
              font: { size: 12 },
              callback: (v) => v + "%",
            },
            grid: {
              drawTicks: false,
              drawBorder: false,
              color: "rgba(200,200,200,0.15)",
            },
          },
          y: {
            ticks: {
              autoSkip: false,
              color: "#374151",
              font: { size: 13, weight: "500" },
            },
            grid: {
              drawTicks: false,
              drawBorder: false,
            },
          },
        },
      },
    }
  );
}

watch(taskPerformanceData, () => renderTaskPerformanceChart(), { deep: true });
onMounted(() => renderTaskPerformanceChart());
</script>

<style>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #d0d0d0;
  border-radius: 10px;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
