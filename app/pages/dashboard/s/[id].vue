<template>
  <div class="p-6 sm:p-6 space-y-4 sm:space-y-6 mb-10 sm:mb-1 pt-12">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        class="relative flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
      >
        <div
          class="flex items-center justify-center w-16 h-16 rounded-lg bg-[#10b481]/10"
        >
          <i class="bx bx-location-alt-2 text-4xl text-[#10b481]"></i>
        </div>
        <div class="flex flex-col text-left">
          <p class="text-3xl font-bold text-[#222831]">{{ totalParcels }}</p>
          <p class="text-sm font-medium text-[#222831]">
            {{ t("activeparcels") }}
          </p>
        </div>
        <div
          class="absolute right-0 top-6 bottom-6 border-r-4 border-[#10b481]"
        ></div>
      </div>

      <div
        class="relative flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
      >
        <div
          class="flex items-center justify-center w-16 h-16 rounded-lg bg-[#c99383]/10"
        >
          <i class="bxr bx-calendar-check text-4xl text-[#c99383]"></i>
        </div>
        <div class="flex flex-col text-left">
          <p class="text-3xl font-bold text-[#c99383]">
            {{ taskCompletionRate }}%
          </p>
          <p class="text-sm font-medium text-[#c99383]">
            {{ t("completedtasks") }}
          </p>
        </div>
        <div
          class="absolute right-0 top-6 bottom-6 border-r-4 border-[#c99383]"
        ></div>
      </div>

      <div
        class="relative flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
      >
        <div
          class="flex items-center justify-center w-16 h-16 rounded-lg bg-[#222831]/10"
        >
          <i class="bx bx-bar-chart-alt-2 text-4xl text-[#222831]"></i>
        </div>
        <div class="flex flex-col text-left">
          <p class="text-3xl font-bold text-[#222831]">{{ yieldTotal }} kg</p>
          <p class="text-sm font-medium text-[#222831]">
            {{ t("totalyield") }}
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
          class="flex items-center justify-center w-16 h-16 rounded-lg bg-[#6d4c41]/10"
        >
          <i class="bx bx-line-chart text-4xl text-[#6d4c41]"></i>
        </div>
        <div class="flex flex-col text-left">
          <p class="text-3xl font-bold text-[#6d4c41]">{{ yieldAvg }} kg</p>
          <p class="text-sm font-medium text-[#6d4c41]">
            {{ t("averageyield") }}
          </p>
        </div>
        <div
          class="absolute right-0 top-6 bottom-6 border-r-4 border-[#6d4c41]"
        ></div>
      </div>
    </div>
  </div>
  <div
    class="px-6 flex items-center justify-between border-b border-gray-300 mb-2 mt-8 text-sm sm:text-base"
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
            : 'text-[#212121]',
        ]"
      >
        {{ menu.label }}
      </a>
    </div>

    <button
      @click="goToAddPage"
      class="flex items-center gap-2 bg-[#212121] hover:bg-[#10b481] focus:bg-[#10b481] text-white px-4 py-2 rounded-lg transition"
    >
      <i class="bx bx-plus text-lg"></i>
      <span>{{ t("add") }}</span>
    </button>
  </div>

  <div class="p-6">
    <component :is="currentComponent" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";
import TbParcel from "~/components/TbParcel.vue";
import TbTask from "~/components/TbTask.vue";
import TbYield from "~/components/TbYield.vue";

definePageMeta({ layout: "dashboard" });

import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

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
