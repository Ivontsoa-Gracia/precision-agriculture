<template>
  <div class="p-6 min-h-screen space-y-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard BI</h1>
        <p class="text-gray-600">
          Customisable Business Intelligence dashboard for decision-making
        </p>
      </div>

      <div class="relative inline-block">
        <button
          @click="showYears = !showYears"
          class="bg-[#10b481] hover:bg-[#0b7a58] text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition"
        >
          <i class="bxr bx-calendar-alt-2 text-xl"></i>
          {{ selectedYear }}
        </button>

        <transition name="fade">
          <div
            v-if="showYears"
            class="absolute mt-3 w-64 max-h-80 overflow-y-auto bg-white shadow-lg rounded p-4 border border-gray-100 right-0"
          >
            <h3 class="text-gray-700 font-semibold mb-3 text-center">
              Select a period
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="year in years"
                :key="year"
                @click="selectYear(year)"
                class="py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-[#10b481]/10 transition"
                :class="
                  selectedYear === year
                    ? 'bg-[#10b481]/20 text-[#10b481]'
                    : 'text-gray-700'
                "
              >
                {{ year }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <!-- DIV 1 -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- 1ère partie : 4 cards (2x2) -->
      <div
        v-if="dashboard"
        class="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1"
      >
        <div
          class="bg-white p-6 rounded shadow hover:shadow-lg transition flex flex-col"
        >
          <div class="flex justify-between items-center mb-4">
            <p class="text-sm font-medium text-gray-500">
              {{
                dashboard.kpis.find((k) => k.code === "TOTAL_PRODUCTEURS")
                  ?.indicator || "Producteurs suivis"
              }}
            </p>
            <i class="bx bxs-user text-2xl text-[#10b481]"></i>
          </div>

          <p class="text-3xl font-bold text-gray-800">
            {{
              dashboard.kpis.find((k) => k.code === "TOTAL_PRODUCTEURS")
                ?.value || "-"
            }}
          </p>

          <!-- Evolution percent -->
          <span
            class="text-sm font-semibold mt-1"
            :class="{
              'text-green-500':
                dashboard.kpis.find((k) => k.code === 'TOTAL_PRODUCTEURS')
                  ?.evolution_percent > 0,
              'text-red-500':
                dashboard.kpis.find((k) => k.code === 'TOTAL_PRODUCTEURS')
                  ?.evolution_percent < 0,
              'text-gray-400':
                dashboard.kpis.find((k) => k.code === 'TOTAL_PRODUCTEURS')
                  ?.evolution_percent === 0,
            }"
          >
            {{
              dashboard.kpis.find((k) => k.code === "TOTAL_PRODUCTEURS")
                ?.evolution_percent > 0
                ? "+"
                : dashboard.kpis.find((k) => k.code === "TOTAL_PRODUCTEURS")
                    ?.evolution_percent < 0
                ? "-"
                : ""
            }}
            {{
              Math.abs(
                dashboard.kpis.find((k) => k.code === "TOTAL_PRODUCTEURS")
                  ?.evolution_percent || 0
              )
            }}%
          </span>

          <!-- Status -->
          <p
            class="text-xs mt-1 font-medium"
            :class="{
              'text-green-500':
                dashboard.kpis.find((k) => k.code === 'TOTAL_PRODUCTEURS')
                  ?.status === 'En hausse',
              'text-red-500':
                dashboard.kpis.find((k) => k.code === 'TOTAL_PRODUCTEURS')
                  ?.status === 'En baisse',
              'text-gray-500':
                dashboard.kpis.find((k) => k.code === 'TOTAL_PRODUCTEURS')
                  ?.status === 'Stable',
            }"
          >
            {{
              dashboard.kpis.find((k) => k.code === "TOTAL_PRODUCTEURS")
                ?.status || "Stable"
            }}
          </p>
        </div>

        <div
          class="bg-white p-6 rounded shadow hover:shadow-lg transition flex flex-col"
        >
          <div class="flex justify-between items-center mb-4">
            <p class="text-sm font-medium text-gray-500">
              {{
                dashboard.kpis.find((k) => k.code === "TOTAL_GROUPES")
                  ?.indicator || "Groupes actifs"
              }}
            </p>
            <i class="bxr bxs-community text-2xl text-[#10b481]"></i>
          </div>
          <p class="text-3xl font-bold text-gray-800">
            {{
              dashboard.kpis.find((k) => k.code === "TOTAL_GROUPES")?.value ||
              "-"
            }}
          </p>
          <span
            class="text-sm font-semibold mt-1"
            :class="{
              'text-green-500':
                dashboard.kpis.find((k) => k.code === 'TOTAL_GROUPES')
                  ?.evolution_percent > 0,
              'text-red-500':
                dashboard.kpis.find((k) => k.code === 'TOTAL_GROUPES')
                  ?.evolution_percent < 0,
              'text-gray-400':
                dashboard.kpis.find((k) => k.code === 'TOTAL_GROUPES')
                  ?.evolution_percent === 0,
            }"
          >
            {{
              dashboard.kpis.find((k) => k.code === "TOTAL_GROUPES")
                ?.evolution_percent > 0
                ? "+"
                : dashboard.kpis.find((k) => k.code === "TOTAL_GROUPES")
                    ?.evolution_percent < 0
                ? "-"
                : ""
            }}
            {{
              Math.abs(
                dashboard.kpis.find((k) => k.code === "TOTAL_GROUPES")
                  ?.evolution_percent || 0
              )
            }}%
          </span>
        </div>

        <div
          class="bg-white p-6 rounded shadow hover:shadow-lg transition flex flex-col"
        >
          <div class="flex justify-between items-center mb-4">
            <p class="text-sm font-medium text-gray-500">
              {{
                dashboard.kpis.find((k) => k.code === "PARCELLES_ACTIVES")
                  ?.indicator || "Producteurs suivis"
              }}
            </p>
            <i class="bx bxs-box text-2xl text-[#10b481]"></i>
          </div>
          <p class="text-3xl font-bold text-gray-800">
            {{
              dashboard.kpis.find((k) => k.code === "PARCELLES_ACTIVES")
                ?.value || "-"
            }}
          </p>
          <span class="text-sm text-green-500 font-semibold mt-1">
            <span
              class="text-sm font-semibold mt-1"
              :class="{
                'text-green-500':
                  dashboard.kpis.find((k) => k.code === 'PARCELLES_ACTIVES')
                    ?.evolution_percent > 0,
                'text-red-500':
                  dashboard.kpis.find((k) => k.code === 'PARCELLES_ACTIVES')
                    ?.evolution_percent < 0,
                'text-gray-400':
                  dashboard.kpis.find((k) => k.code === 'PARCELLES_ACTIVES')
                    ?.evolution_percent === 0,
              }"
            >
              {{
                dashboard.kpis.find((k) => k.code === "PARCELLES_ACTIVES")
                  ?.evolution_percent > 0
                  ? "+"
                  : dashboard.kpis.find((k) => k.code === "PARCELLES_ACTIVES")
                      ?.evolution_percent < 0
                  ? "-"
                  : ""
              }}
              {{
                Math.abs(
                  dashboard.kpis.find((k) => k.code === "PARCELLES_ACTIVES")
                    ?.evolution_percent || 0
                )
              }}%
            </span>

            <!-- Status -->
            <p
              class="text-xs mt-1 font-medium"
              :class="{
                'text-green-500':
                  dashboard.kpis.find((k) => k.code === 'PARCELLES_ACTIVES')
                    ?.status === 'En hausse',
                'text-red-500':
                  dashboard.kpis.find((k) => k.code === 'PARCELLES_ACTIVES')
                    ?.status === 'En baisse',
                'text-gray-500':
                  dashboard.kpis.find((k) => k.code === 'PARCELLES_ACTIVES')
                    ?.status === 'Stable',
              }"
            >
              {{
                dashboard.kpis.find((k) => k.code === "PARCELLES_ACTIVES")
                  ?.status || "Stable"
              }}
            </p>
          </span>
        </div>

        <div
          class="bg-white p-6 rounded shadow hover:shadow-lg transition flex flex-col"
        >
          <div class="flex justify-between items-center mb-4">
            <p class="text-sm font-medium text-gray-500">
              {{
                dashboard.kpis.find((k) => k.code === "AUDITS_NON_CONFORMES")
                  ?.indicator || "Audits non conformes"
              }}
            </p>
            <i class="bx bxs-box text-2xl text-[#10b481]"></i>
          </div>
          <p class="text-3xl font-bold text-gray-800">
            {{
              dashboard.kpis.find((k) => k.code === "AUDITS_NON_CONFORMES")
                ?.value || "-"
            }}
          </p>
          <span class="text-sm text-green-500 font-semibold mt-1">
            <span
              class="text-sm font-semibold mt-1"
              :class="{
                'text-green-500':
                  dashboard.kpis.find((k) => k.code === 'AUDITS_NON_CONFORMES')
                    ?.evolution_percent > 0,
                'text-red-500':
                  dashboard.kpis.find((k) => k.code === 'AUDITS_NON_CONFORMES')
                    ?.evolution_percent < 0,
                'text-gray-400':
                  dashboard.kpis.find((k) => k.code === 'AUDITS_NON_CONFORMES')
                    ?.evolution_percent === 0,
              }"
            >
              {{
                dashboard.kpis.find((k) => k.code === "AUDITS_NON_CONFORMES")
                  ?.evolution_percent > 0
                  ? "+"
                  : dashboard.kpis.find(
                      (k) => k.code === "AUDITS_NON_CONFORMES"
                    )?.evolution_percent < 0
                  ? "-"
                  : ""
              }}
              {{
                Math.abs(
                  dashboard.kpis.find((k) => k.code === "AUDITS_NON_CONFORMES")
                    ?.evolution_percent || 0
                )
              }}%
            </span>

            <!-- Status -->
            <p
              class="text-xs mt-1 font-medium"
              :class="{
                'text-green-500':
                  dashboard.kpis.find((k) => k.code === 'AUDITS_NON_CONFORMES')
                    ?.status === 'En hausse',
                'text-red-500':
                  dashboard.kpis.find((k) => k.code === 'AUDITS_NON_CONFORMES')
                    ?.status === 'En baisse',
                'text-gray-500':
                  dashboard.kpis.find((k) => k.code === 'AUDITS_NON_CONFORMES')
                    ?.status === 'Stable',
              }"
            >
              {{
                dashboard.kpis.find((k) => k.code === "AUDITS_NON_CONFORMES")
                  ?.status || "Stable"
              }}
            </p>
          </span>
        </div>
      </div>

      <!-- 2e partie : hauteur égale à la première -->
      <div class="flex flex-col gap-6 flex-1" v-if="dashboard">
        <div class="flex gap-6 h-full">
          <!-- Card A : occupe toute la hauteur -->
          <div
            class="bg-white p-6 rounded shadow hover:shadow-lg transition flex flex-col flex-1"
          >
            <!-- Titre principal de la card -->
            <p
              class="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide"
            >
              Rapports
            </p>

            <!-- Conteneur des indicateurs -->
            <div class="space-y-3">
              <div
                v-for="kpi in dashboard.kpis.filter((k) =>
                  [
                    'RAPPORTS_SOUMIS',
                    'RAPPORTS_BROUILLON',
                    'RAPPORTS_APPROUVES',
                    'TOTAL_RAPPORTS',
                  ].includes(k.code)
                )"
                :key="kpi.code"
                class="flex justify-between items-center border-b border-gray-100 pb-3 last:border-b-0"
              >
                <!-- Partie gauche : nom et status -->
                <div class="flex flex-col">
                  <p class="text-gray-800 font-semibold text-base">
                    {{ kpi.indicator }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Status:
                    <span
                      :class="{
                        'text-green-500': kpi.status === 'En hausse',
                        'text-red-500': kpi.status === 'En baisse',
                        'text-gray-400': kpi.status === 'Stable',
                      }"
                    >
                      {{ kpi.status }}
                    </span>
                  </p>
                </div>

                <!-- Partie droite : valeur et évolution -->
                <div class="flex flex-col items-end">
                  <p class="text-2xl font-bold text-gray-900">
                    {{ kpi.value }}
                  </p>
                  <p
                    class="text-sm font-semibold"
                    :class="{
                      'text-green-500': kpi.evolution_percent > 0,
                      'text-red-500': kpi.evolution_percent < 0,
                      'text-gray-400': kpi.evolution_percent === 0,
                    }"
                  >
                    {{
                      kpi.evolution_percent > 0
                        ? "+"
                        : kpi.evolution_percent < 0
                        ? "-"
                        : ""
                    }}
                    {{ Math.abs(kpi.evolution_percent) }}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Partie droite : card C au-dessus et card B dessous -->
          <div class="flex flex-col gap-6 flex-1">
            <!-- Card C (Widgets) -->
            <div
              @click="goToCreate"
              class="bg-white p-5 rounded shadow hover:shadow-lg transition flex items-center gap-3 cursor-pointer"
            >
              <i class="bxr bx-grid-plus text-2xl text-[#10b481]"></i>
              <p class="text-lg font-semibold text-gray-700">Widgets</p>
            </div>

            <!-- Card B (prend le reste de la hauteur) -->
            <div
              class="bg-white p-6 rounded shadow hover:shadow-lg transition flex flex-col justify-center flex-1"
            >
              <p class="text-sm font-medium text-gray-500 mb-2">
                {{ dashboard.organisation.name }}
              </p>
              <p class="text-xl font-bold text-gray-800">
                <span
                  :class="
                    dashboard.organisation.conformite === 'CONFORME'
                      ? 'text-green-600'
                      : 'text-red-600'
                  "
                >
                  {{ dashboard.organisation.conformite }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DIV 2 -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- 1ère partie : chart en baton -->
      <div class="flex-1 gap-4">
        <div class="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <p class="text-sm font-medium text-gray-500 mb-4">Bar Chart</p>
          <canvas id="barChart" class="w-full h-60"></canvas>
        </div>
        <div class="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <div class="mt-6">
            <p class="text-sm font-medium text-gray-500 mb-4">Line Chart</p>
            <canvas id="lineChart" class="w-full h-40"></canvas>
          </div>
        </div>
      </div>

      <!-- 2ème partie : 2 cards côte à côte -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
        <div
          class="bg-white p-6 rounded shadow hover:shadow-lg transition flex flex-col justify-center"
        >
          <p class="text-sm font-medium text-gray-500 mb-2">Card X</p>
          <p class="text-3xl font-bold text-gray-800">58</p>
        </div>
        <div
          class="bg-white p-6 rounded shadow hover:shadow-lg transition flex flex-col justify-center"
        >
          <p class="text-sm font-medium text-gray-500 mb-2">Card Y</p>
          <p class="text-3xl font-bold text-gray-800">42</p>
        </div>

        <!-- Tableau sous les 2 cards -->
        <div
          class="sm:col-span-2 mt-6 bg-white p-6 rounded shadow hover:shadow-lg transition"
        >
          <p class="text-sm font-medium text-gray-500 mb-4">Tableau</p>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nom
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Valeur
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Produit 1
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-green-500"
                  >
                    Actif
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    245
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Produit 2
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                    Inactif
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    120
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Produit 3
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-yellow-500"
                  >
                    En pause
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    87
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";
import axios from "axios";
import { API_URL } from "~/config";

const router = useRouter();
const showYears = ref(false);
const selectedYear = ref("2025");
const years = ref(["2023", "2024", "2025", "2026", "2027"]);
const trends = ref<{ labels: string[]; values: number[] }>({
  labels: [],
  values: [],
});


const selectYear = (year) => {
  selectedYear.value = year;
  showYears.value = false;
  console.log("Selected year:", year);
};

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;

// état
const dashboard = ref<any>(null);
const loading = ref(true);
const error = ref("");

// fonction fetch
const fetchDashboard = async () => {
  const token = sessionStorage.getItem("token") || "";
  loading.value = true;
  error.value = "";
  try {
    const res = await axios.get(
      `${API_URL}/api/suivi-evaluation/dashboard-bi/`,
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    dashboard.value = res.data;
    console.log("Dashboard Bi JSON:", JSON.stringify(dashboard.value, null, 2));
  } catch (err: any) {
    error.value =
      err.response?.data?.error || "Erreur lors du chargement du dashboard";
  } finally {
    loading.value = false;
  }
};

const fetchAnnalytics = async () => {
  const token = sessionStorage.getItem("token") || "";

  // Endpoint trends
  fetch(`${API_URL}/api/suivi-evaluation/analytic-bi/trends/?code=RENDEMENT_MOYEN`, {
    method: 'GET',
    headers: { Authorization: `Token ${token}` },
  })
    .then(response => response.json())
    .then(data => {
      console.log("Trends:", JSON.stringify(data, null, 2));

      trends.value.labels = data.series.map((item: any) =>
        new Date(item.period).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
        })
      );

      trends.value.values = data.series.map((item: any) =>
        item.value === 0 ? null : item.value // coupure intelligente
      );
    })
    .catch(error => console.error('Erreur:', error));

  // Endpoint compare
  fetch(`${API_URL}/api/suivi-evaluation/analytic-bi/compare/?code=CERT_VALIDEES&group=group`, {
    method: 'GET',
    headers: { Authorization: `Token ${token}` },
  })
    .then(response => response.json())
    .then(data => {
      console.log("Compare:", JSON.stringify(data, null, 2));
    })
    .catch(error => console.error('Erreur:', error));


  fetch(`${API_URL}/api/suivi-evaluation/alert-bi`, {
    method: 'GET',
    headers: { Authorization: `Token ${token}` },
  })
    .then(response => response.json())
    .then(data => {
      console.log("Alerts:", JSON.stringify(data, null, 2));
    })
    .catch(error => console.error('Erreur:', error));
}

// fetch au montage
onMounted(() => {
  fetchDashboard();
  fetchAnnalytics();
});


watch(dashboard, (newVal) => {
  if (!newVal) return;

  const barCtx = document.getElementById("barChart") as HTMLCanvasElement;
  const certificationData = [
    newVal.kpis.find(k => k.code === "CERT_VALIDEES")?.value || 0,
    newVal.kpis.find(k => k.code === "CERT_EXPIREES")?.value || 0,
    newVal.kpis.find(k => k.code === "CERT_REVOQUEES")?.value || 0,
    newVal.kpis.find(k => k.code === "CERT_ATTENTE")?.value || 0,
  ];

  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Valides", "Expirées", "Révoquées", "En attente"],
      datasets: [
        {
          label: "Certifications",
          data: certificationData,
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "#10b481");
            gradient.addColorStop(1, "#10b48133");
            return gradient;
          },
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "#eee" }, beginAtZero: true },
      },
    },
  });

  const lineCtx = document.getElementById("lineChart") as HTMLCanvasElement;

  if (trends.value.labels.length) {
    new Chart(lineCtx, {
      type: "line",
      data: {
        labels: trends.value.labels,
        datasets: [
          {
            label: "Rendement moyen",
            data: trends.value.values,
            borderColor: "#10b481",
            backgroundColor: "#10b48133",
            tension: 0.35,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Valeur : ${ctx.raw ?? "N/A"}`,
            },
          },
        },
        scales: {
          y: { beginAtZero: false },
          x: { grid: { display: false } },
        },
      },
    });
  }

}, { immediate: true });

const goToCreate = () => {
  router.push("/dashboard/custom"); // ou /indicators/create selon ta structure
};


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
