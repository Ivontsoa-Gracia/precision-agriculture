<template>
  <div
    class="p-6 sm:p-8 space-y-4 sm:space-y-10 mb-10 sm:mb-1 pt-12 w-full max-w-[100vw] overflow-x-hidden"
  >
    <YieldAnalitics />

    <div class="space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            class="relative flex items-center gap-4 p-3 bg-white rounded-2xl transition border border-gray-200"
          >
            <div
              class="flex items-center justify-center w-20 h-20 rounded-xl bg-[#10b481]/10"
            >
              <i class="bx bx-location-alt-2 text-4xl text-[#10b481]"></i>
            </div>
            <div class="flex flex-col text-left">
              <p class="text-3xl small font-bold text-[#10b481]">
                {{ totalParcels }}
              </p>
              <p class="text-sm small text-[#10b481]">
                {{ t("activeparcels") }}
              </p>
            </div>
            <div
              class="absolute right-0 top-3 bottom-3 border-r-4 rounded-l-2xl border-[#10b481]"
            ></div>
          </div>

          <div
            class="relative flex items-center gap-4 p-3 bg-white rounded-2xl transition border border-gray-200"
          >
            <div
              class="flex items-center justify-center w-20 h-20 rounded-xl bg-[#c99383]/10"
            >
              <i class="bxr bx-calendar-check text-4xl text-[#c99383]"></i>
            </div>
            <div class="flex flex-col text-left">
              <p class="text-3xl small font-bold text-[#c99383]">{{ taskTasks }}</p>
              <p class="text-sm small text-[#c99383]">
                {{ t("totalTask") }}
              </p>
            </div>
            <div
              class="absolute right-0 top-3 bottom-3 border-r-4 rounded-l-2xl border-[#c99383]"
            ></div>
          </div>

          <div
            class="relative col-span-2 p-6 bg-white rounded-2xl transition border border-gray-200 h-64"
          >
          <p class="subtitle">
            Task Performance
          </p>
            <canvas ref="taskPerformanceCanvas" class="small"></canvas>
          </div>
        </div>

        <div
          class="lg:col-span-1 relative p-6 bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center"
        >
          <canvas ref="taskChartCanvas" class="w-64 h-64"></canvas>

          <div
            class="absolute inset-0 flex -mt-8 flex-col items-center justify-center pointer-events-none"
          >
            <h2 class=" text-5xl  font-extrabold text-gray-700">
              {{ taskComh2letionRate }}%
            </h2>
            <span class=" text-xs text-gray-400 small">{{
              t("completedtasks")
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        class="relative p-5 bg-white rounded-2xl border border-gray-200 transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-[#10b481]/10 rounded-lg flex items-center justify-center"
        >
          <i class="bx bx-location-pin text-[#10b481] text-lg"></i>
        </div>

        <p class="text-xs small text-gray-400 uppercase tracking-wide">
          {{ t("fertility") }}
        </p>
        <h3 class="mt-2 text-sm font-semibold text-gray-700 small">
          {{ bestSoilParcel?.parcel_name }}
        </h3>
        <p class="text-sm text-gray-400 small">
          SOC : {{ bestSoilParcel?.soil_summary.soc }}
        </p>
      </div>

      <div
        class="relative p-5 bg-white rounded-2xl border border-gray-200 transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center"
        >
          <i class="bxr bx-leaf-alt text-yellow-400 text-lg"></i>
        </div>

        <p class="text-xs small text-gray-400 uppercase tracking-wide">
          {{ t("productivity") }}
        </p>
        <h3 class="mt-2 text-sm font-semibold text-gray-700 small">
          {{ topCrop?.crop_name }}
        </h3>
        <p class="text-sm text-gray-400 small">
          {{ t("total") }} : {{ topCrop?.summary.total_yield.toFixed(2) }} kg
        </p>
      </div>

      <div
        class="relative p-5 bg-white rounded-2xl border border-gray-200 transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"
        >
          <i class="bxr bx-thermometer text-red-500 text-xl"></i>
        </div>
        <p class="text-xs small text-gray-400 uppercase tracking-wide">
          {{ t("tempAverage") }}
        </p>
        <h3 class="mt-2 text-sm font-semibold text-gray-700 small">
          {{ avgTemperature }}°C
        </h3>
      </div>

      <div
        class="relative p-5 bg-white rounded-2xl border border-gray-200 transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"
        >
          <i class="bx bx-error text-orange-600 text-xl"></i>
        </div>

        <p class="text-xs small text-gray-400 uppercase tracking-wide">
          {{ t("riskParcel") }}
        </p>
        <h3 class="mt-2 text-sm font-semibold text-gray-700 small">
          {{ highestRiskParcel?.parcel_name }}
        </h3>
        <p class="text-sm text-gray-400 small">
          {{ highestRiskParcel?.alerts_count }} {{ t("alerts") }}
        </p>
      </div>

      <div
        class="relative p-5 bg-white rounded-2xl border border-gray-200 transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-[#219ebc]/10 rounded-lg flex items-center justify-center"
        >
          <i
            class="bxr bx-chart-bar-columns absolute text-[#219ebc] text-xl"
          ></i>
        </div>
        <p class="text-xs small text-gray-400 uppercase tracking-wide">
          {{ t("bestRendement") }}
        </p>
        <h3 class="mt-2 text-sm font-semibold text-gray-700 small">
          {{ bestYieldParcel?.parcel_name }}
        </h3>
        <p class="text-sm text-gray-400 small">
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
        class="relative p-5 bg-white rounded-2xl border border-gray-200 transition-all"
      >
        <div
          class="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <i class="bxr bx-database text-gray-400 text-xl"></i>
        </div>
        <p class="text-xs small text-gray-400 uppercase tracking-wide">
          {{ t("cultureSansDonnees") }}
        </p>
        <h3 class="mt-2 text-sm font-semibold text-gray-700 small">
          {{ emptyCrops.length }} {{ t("culture") }}
        </h3>
      </div>
    </div>
  </div>
  <div
    class="px-8 flex items-center justify-between border-b border-gray-300 mb-2 text-sm sm:text-base"
  >
    <div class="flex gap-6">
      <a
        v-for="menu in menus"
        :key="menu.name"
        href="#"
        @click.prevent="selectMenu(menu.name)"
        :class="[
          'loan-tab border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm small',
          activeMenu === menu.name
            ? 'text-[#10b481] border-[#10b481]'
            : 'border-transparent text-gray-500 hover:text-[#10b481] hover:border-[#10b481]',
        ]"
      >
        {{ menu.label }}
      </a>
    </div>

    <button
      @click="goToAddPage"
      class="flex items-center gap-2 btn-primary"
    >
      <i class="bx bx-plus"></i>
      <span>{{ t("add") }}</span>
    </button>
  </div>

  <div class="p-8">
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
import YieldAnalitics from "~/components/YieldAnalitics.vue";
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
    ? Math.round(vals.reduce((a: any, b: any) => a + b, 0) / vals.length)
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

const activeMenu = ref("parcelles");
const userUUID = ref(null);

onMounted(() => {
  userUUID.value = sessionStorage.getItem("uuid");
});

const menus = computed(() => {
  return [
    {
      name: "parcelles",
      label: t("parcels"),
      component: TbParcel,
      addPath: `/parcels/create/p/${userUUID.value}`,
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
  ];
});

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

  const best = soilList.reduce((best: { soil_summary: { soc: any; }; }, curr: { soil_summary: { soc: number; }; }) => {
    return curr.soil_summary.soc > (best?.soil_summary.soc || 0) ? curr : best;
  }, null);

  if (!best) return null;

  const parcel = dashboard.value.parcels?.find((p: { id: any; }) => p.id === best.parcel_id);

  return {
    ...best,
    parcel_name: parcel?.name || "Inconnu",
  };
});

const topCrop = computed(() => {
  const yields = dashboard.value.yield_summary || [];
  const valid = yields.filter((y: { summary: any; }) => y.summary);
  return valid.length
    ? valid.reduce((max: { summary: { total_yield: number; }; }, y: { summary: { total_yield: number; }; }) =>
        y.summary.total_yield > max.summary.total_yield ? y : max
      )
    : null;
});

const emptyCrops = computed(
  () => dashboard.value.yield_summary?.filter((y: { summary: any; }) => !y.summary) || []
);

const highestRiskParcel = computed(() => {
  return dashboard.value.climate_summary?.parcel_details?.reduce((max: { alerts_count: number; }, p: { alerts_count: number; }) =>
    p.alerts_count > max.alerts_count ? p : max
  );
});

const avgTemperature = computed(() => {
  const list = dashboard.value.climate_summary?.parcel_details || [];
  if (!list.length) return 0;
  return Math.round(
    list.reduce((sum: any, p: { current_temperature: any; }) => sum + (p.current_temperature || 0), 0) / list.length
  );
});

const bestYieldParcel = computed(() => {
  const yields = dashboard.value.yield_summary?.filter((y: { summary: any; }) => y.summary) || [];
  if (!yields.length) return null;

  return yields.reduce((max: { summary: { avg_yield: number; }; }, y: { summary: { avg_yield: number; }; }) =>
    y.summary.avg_yield > max.summary.avg_yield ? y : max
  );
});

const totalTasks = computed(
  () =>
    dashboard.value.task_summary?.reduce(
      (sum: any, t: { task_summary: { total_tasks: any; }; }) => sum + (t.task_summary?.total_tasks || 0),
      0
    ) || 0
);

const completedTasks = computed(
  () =>
    dashboard.value.task_summary?.reduce(
      (sum: any, t: { task_summary: { completed_tasks: any; }; }) => sum + (t.task_summary?.completed_tasks || 0),
      0
    ) || 0
);

const pendingTasks = computed(() => totalTasks.value - completedTasks.value);

const tasksByParcel = computed(
  () =>
    dashboard.value.task_summary?.map((t: { parcel_id: any; task_summary: { total_tasks: any; completed_tasks: any; }; }) => {
      const parcel = dashboard.value.parcels?.find((p: { id: any; }) => p.id === t.parcel_id);
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
  const yields = dashboard.value.yield_summary?.filter((y: { summary: any; }) => y.summary) || [];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    return {
      day: `Day ${i + 1}`,
      value:
        yields.reduce((sum: any, y: { summary: { avg_yield: any; }; }) => sum + (y.summary?.avg_yield || 0), 0) /
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

  return parcels.map((parcel: any) => {
    const summary = tasks.find((t: { parcel_id: any; }) => t.parcel_id === parcel.id);

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

  const labels = taskPerformanceData.value.map((p: { parcel_name: any; }) => p.parcel_name);
  const values = taskPerformanceData.value.map((p: { completion_rate: any; }) => p.completion_rate);

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
              (v: number) => `rgba(16, 180, 129, ${0.3 + v / 300})`
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
              color: "#9CA3AF",
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
              color: "#9CA3AF",
              font: { size: 12 },
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
