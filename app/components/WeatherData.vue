<template>
  <div v-if="filteredWeather.length" class="mx-auto space-y-6">
    <h1 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
      {{ t("analyseMeteo") }}
    </h1>

    <div
      v-for="forecast in filteredWeather"
      :key="forecast.id"
      class="bg-white rounded shadow-sm p-6 border-l-4 border-[#219ebc]"
    >
      <div class="flex justify-between items-center mb-4">
        <div>
          <p class="text-lg font-semibold text-gray-900">
            {{ formatDate(forecast.start) }} → {{ formatDate(forecast.end) }}
          </p>
        </div>
        <p class="text-gray-500 uppercase tracking-wide text-sm font-semibold">
          {{ t("riskLevel") }} :
          <span
            :class="{
              'text-[#10b481]': forecast.risk_level === 'LOW',
              'text-yellow-600': forecast.risk_level === 'MEDIUM',
              'text-red-600': forecast.risk_level === 'HIGH',
            }"
          >
            {{ forecast.risk_level }}
          </span>
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div class="bg-gray-100 rounded p-4 text-center">
          <p class="text-sm text-gray-500">{{ t("temp") }}</p>
          <p class="text-xl font-bold">{{ forecast.current_temperature }}°C</p>
        </div>
        <div class="bg-gray-100 rounded p-4 text-center">
          <p class="text-sm text-gray-500">{{ t("precipitation") }}</p>
          <p class="text-xl font-bold">{{ forecast.total_precipitation }} mm</p>
        </div>
        <div class="bg-gray-100 rounded p-4 text-center">
          <p class="text-sm text-gray-500">{{ t("alertAgricole") }}</p>
          <p class="text-xl font-bold">
            {{ forecast.agricultural_summary.alerts_count }}
          </p>
        </div>
        <div class="bg-gray-100 rounded p-4 text-center">
          <p class="text-sm text-gray-500">{{ t("irrigationRecommander") }}</p>
          <p class="text-lg font-semibold">
            {{
              forecast.agricultural_summary.irrigation_recommendation.irrigation
            }}
          </p>
          <p class="text-xs text-gray-500">
            {{ forecast.agricultural_summary.irrigation_recommendation.reason }}
          </p>
        </div>
      </div>

      <div v-if="forecast.risk_analysis.length" class="mt-4">
        <p
          class="text-gray-500 uppercase tracking-wide text-sm font-semibold mb-4"
        >
          {{ t("analyseRisk") }} :
        </p>
        <ul class="space-y-2">
          <li
            v-for="risk in forecast.risk_analysis"
            :key="risk.date + risk.type"
            class="bg-yellow-100 border border-yellow-400 rounded p-2 text-sm flex flex-wrap items-center gap-x-4"
          >
            <span class="font-semibold text-gray-800"
              >{{ formatDate(risk.date) }}:</span
            >
            <span>{{ risk.message }}</span>
            <span class="text-gray-500 text-xs">
              ({{ t("condition") }}: {{ risk.metrics.condition }},
              {{ t("humidity") }}: {{ risk.metrics.humidity }}%)
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="mt-6 p-4 bg-gray-100 rounded border hidden">
    <h3 class="text-lg font-bold mb-2 text-[#212121]">Weather Data (JSON)</h3>

    <pre class="text-sm bg-white p-3 rounded border overflow-x-auto">
    {{ weather }}
  </pre
    >
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();

const t = (key: string) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

const weather = ref([]);

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

onMounted(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/api/weather-data/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error("API error");

    weather.value = await res.json();
  } catch (err) {
    console.error("Weather fetch error:", err);
  }
});

// Supprime les emojis
function removeEmojis(text) {
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
    ""
  );
}

async function translateText(text, sourceLang = "fr") {
  const targetLang = currentLocale.value || "en";
  if (sourceLang === targetLang) return text;

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${sourceLang}|${targetLang}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error("Erreur de traduction :", error);
    return text;
  }
}

const translatedWeather = ref([]);

async function translateForecast(weather) {
  const irrigation = await translateText(
    removeEmojis(
      weather.agricultural_summary.irrigation_recommendation.irrigation
    )
  );
  const reason = await translateText(
    removeEmojis(weather.agricultural_summary.irrigation_recommendation.reason)
  );

  const riskAnalysis = await Promise.all(
    (weather.risk_analysis || []).map(async (risk) => ({
      ...risk,
      message: await translateText(removeEmojis(risk.message)),
      metrics: {
        ...risk.metrics,
        condition: await translateText(removeEmojis(risk.metrics.condition)),
      },
    }))
  );

  return {
    ...weather,
    agricultural_summary: {
      ...weather.agricultural_summary,
      irrigation_recommendation: {
        ...weather.agricultural_summary.irrigation_recommendation,
        irrigation,
        reason,
      },
    },
    risk_analysis: riskAnalysis,
  };
}

async function translateWeather() {
  translatedWeather.value = await Promise.all(
    weather.value.map((weather) => translateForecast(weather))
  );
}

watchEffect(() => {
  if (weather.value.length) {
    translateWeather();
  }
});

const filteredWeather = computed(() => {
  return translatedWeather.value.filter((forecast) => {
    const start = new Date(forecast.start);
    const end = new Date(forecast.end);

    const isYesterdayIncluded = yesterday >= start && yesterday <= end;
    const isTodayIncluded =
      today >= start &&
      today <= end &&
      end.toDateString() !== today.toDateString();
    const isTomorrowIncluded = tomorrow >= start && tomorrow <= end;

    return isYesterdayIncluded || isTodayIncluded || isTomorrowIncluded;
  });
});

const weatherIcons = {
  "Patchy rain nearby": "mdi:weather-rainy",
  "Moderate rain": "mdi:weather-pouring",
  Sunny: "mdi:weather-sunny",
  Clear: "mdi:weather-night",
  "Partly cloudy": "mdi:weather-partly-cloudy",
  Cloudy: "mdi:weather-cloudy",
  "Light rain": "mdi:weather-rainy",
  "Light rain shower": "mdi:weather-rainy",
  "Heavy rain": "mdi:weather-heavy-rain",
  Thunderstorm: "mdi:weather-lightning",
  Mist: "mdi:weather-fog",
  Fog: "mdi:weather-fog",
};

function getWeatherIcon(condition) {
  return weatherIcons[condition] ?? "mdi:help-circle";
}

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
