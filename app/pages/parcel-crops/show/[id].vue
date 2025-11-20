<template>
  <div class="p-1 sm:p-6 flex flex-col items-center gap-8 mb-10 sm:mb-1">
    <div
      v-if="forecastData"
      class="relative w-full max-w-3xl bg-white backdrop-blur-md bg-opacity-80 rounded-3xl shadow-2xl p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-xl transition"
    >
      <div
        class="flex-shrink-0 text-3xl sm:text-5xl p-5 rounded-full bg-[#f4a261]/20 text-[#f4a261]"
      >
        <i class="bx bx-bar-chart-alt-2"></i>
      </div>

      <div class="flex-1 items-center text-center md:text-left">
        <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          {{ t("titleyieldforcast") }}
        </h3>
        <div
          class="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-1 md:gap-6"
        >
          <p class="text-gray-500 text-sm md:text-base">
            {{ t("forecastdate") }}:
            <span class="font-medium text-gray-800">
              {{ forecastData.forecast_date }}
            </span>
          </p>
        </div>
      </div>

      <div
        class="absolute right-0 top-6 bottom-6 border-r-4 border-[#f4a261] hidden md:block"
      ></div>

      <p
        class="text-xl sm:text-3xl font-extrabold text-[#f4a261] md:ml-4 md:mr-16 mx-auto text-center"
      >
        {{ forecastData.predicted_yield.toFixed(2) }} kg
      </p>
    </div>

    <div
      class="w-full max-w-3xl bg-white backdrop-blur-md rounded-3xl shadow-2xl p-8"
    >
      <div class="flex items-center gap-3 mb-6">
        <i
          class="bx bx-box text-xl sm:text-3xl text-[#10b481] animate-pulse"
        ></i>
        <h2
          class="text-xl sm:text-3xl font-extrabold text-gray-800 tracking-tight relative"
        >
          {{ t("pareclcropdetail") }}
          <span
            class="block w-24 h-1 bg-gradient-to-r from-[#10b481] to-[#0a8f6e] rounded-full mt-1"
          ></span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem :label="t('parcel')" :value="parcelCrop.parcel_name" />
        <DetailItem
          :label="t('crop')"
          :value="
            parcelCrop.crop?.name +
            ' (' +
            (parcelCrop.crop?.variety?.name || '-') +
            ')'
          "
        />
        <DetailItem
          :label="t('plantingdate')"
          :value="parcelCrop.planting_date"
        />
        <DetailItem
          :label="t('harvestdate')"
          :value="parcelCrop.harvest_date || '-'"
        />
        <DetailItem :label="`${t('area')} (m²)`" :value="parcelCrop.area" />
        <DetailItem
          :label="t('status')"
          :value="
            parcelCrop.status?.name
              ? t(cropStatusKeyMap[parcelCrop.status?.name])
              : '-'
          "
        />

        <DetailItem :label="t('createdat')" :value="parcelCrop.created_at" />
      </div>

      <div class="mt-8 flex flex-col md:flex-row justify-end gap-4">
        <NuxtLink
          :to="`/parcel-crops/edit/${parcelCrop.id}`"
          class="px-6 py-3 bg-gradient-to-r from-[#10b481] to-[#0a8f6e] text-white rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition transform flex items-center gap-2"
        >
          <i class="bx bx-edit-alt"></i> {{ t("edit") }}
        </NuxtLink>

        <NuxtLink
          to="/parcel-crops"
          class="px-6 py-3 bg-gray-50 text-gray-800 rounded-2xl font-semibold shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          <i class="bx bx-arrow-back"></i> {{ t("back") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import DetailItem from "~/components/DetailItem.vue";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();

const t = (key: string) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

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
const isLoading = ref(false);

const route = useRoute();
const router = useRouter();
const parcelCrop = ref<any>({});
const forecastData = ref<any>(null);

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
  } catch (err) {
    console.error(err);
  }
});
</script>
