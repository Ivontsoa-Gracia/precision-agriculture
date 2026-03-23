<template>
  <section>
    <div class="max-w-3xl mx-auto mt-1 sm:mt-10 mb-10 sm:mb-1 p-8 bg-white rounded-2xl border border-gray-200">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4"
      >
        <h2
          class=""
        >
          {{ t("newparcelcrop") }}
        </h2>

        <NuxtLink
          to="/crops/create"
          class="flex items-center gap-2 btn-primary justify-center"
        >
          <i class="bx bx-plus"></i> {{ t("btnaddcrop") }}
        </NuxtLink>
      </div>

      <form @submit.prevent="submitParcelCrop" class="space-y-5">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 flex flex-col">
            <label class="label mb-1"
              >{{ t("parcel") }} *</label
            >
            <select
              v-model="form.parcel"
              required
              class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            >
              <option v-for="p in parcels" :key="p.uuid" :value="p.uuid">
                {{ p.parcel_name }}
              </option>
            </select>
          </div>

          <div class="flex-1 flex flex-col">
            <label class="label mb-1"
              >{{ t("crop") }} *</label
            >
            <select
              v-model="form.crop_id"
              required
              class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            >
              <option v-for="c in crops" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.variety?.name }})
              </option>
            </select>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 flex flex-col">
            <label class="label mb-1"
              >{{ t("plantingdate") }} *</label
            >
            <input
              v-model="form.planting_date"
              type="date"
              required
              class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            />
          </div>

          <div class="flex-1 flex flex-col">
            <label class="label mb-1">{{
              t("harvestdate")
            }}</label>
            <input
              v-model="form.harvest_date"
              type="date"
              class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 flex flex-col">
            <label class="label mb-1"
              >{{ t("area") }} (m²) *</label
            >
            <input
              v-model.number="form.area"
              type="number"
              step="1"
              :max="areaInM2(calculatedArea)"
              required
              placeholder="Enter area in m²"
              class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
              @input="onAreaInput"
            />
            <!-- <small class="text-gray-500 text-sm">
            Max: {{ formatM2(calculatedArea) }}
          </small> -->
          </div>

          <div class="flex-1 flex flex-col">
            <label class="label mb-1"
              >{{ t("status") }} *</label
            >
            <select
              v-model="form.status_id"
              required
              class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            >
              <option v-for="s in statuses" :key="s.id" :value="s.id">
                {{ t(cropStatusKeyMap[s.name]) }}
              </option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          class="w-full btn-primary flex justify-center items-center gap-2"
        >
          {{ t("btnsaveparcelcrop") }}
        </button>
      </form>
    </div>
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-black/50 flex items-center justify-center"
    >
      <div
        class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"
      ></div>
    </div>

    <transition name="slide-right">
      <div
        v-if="notification.visible"
        class="fixed bottom-4 right-4 z-[9999] bg-[#112830] rounded shadow-xl px-6 py-4 flex items-center gap-4 w-80 text-left border-l-4 transition-all duration-300"
        :class="
          notification.type === 'success'
            ? 'border-[#10b481]'
            : 'border-red-500'
        "
      >
        <div
          :class="
            notification.type === 'success' ? 'bg-[#10b481]' : 'bg-red-500'
          "
          class="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
        >
          <i
            :class="notification.type === 'success' ? 'bx bx-check' : 'bx bx-x'"
          ></i>
        </div>
        <div>
          <p class="font-medium text-sm text-gray-100">
            {{ notification.message }}
          </p>
          <p class="text-gray-300 text-xs">
            {{
              notification.type === "success"
                ? "Success!"
                : "Something went wrong."
            }}
          </p>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { watch } from "vue";
import * as turf from "@turf/turf";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import Breadcrumb from "~/components/Breadcrumb.vue";

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

const notification = ref({
  visible: false,
  message: "",
  type: "success",
});

const showNotification = (
  message: string,
  type: "success" | "error" = "success",
  duration = 3000
) => {
  notification.value.message = message;
  notification.value.type = type;
  notification.value.visible = true;
  setTimeout(() => (notification.value.visible = false), duration);
};

const router = useRouter();
const form = ref({
  parcel: "",
  crop_id: null,
  planting_date: "",
  harvest_date: "",
  area: null,
  status_id: null,
});

const parcels = useState<any[]>("parcelsData", () => []);
const crops = useState<any[]>("cropsData", () => []);
const statuses = useState<any[]>("statusesData", () => []);

const calculatedArea = ref<number>(0);

function calculateParcelArea(points: { lat: number; lng: number }[]): number {
  if (points.length < 3) return 0;

  const coords = points.map((p) => [p.lng, p.lat]);
  coords.push([points[0].lng, points[0].lat]);

  const polygon = turf.polygon([coords]);
  const areaM2 = turf.area(polygon);
  const areaHa = areaM2 / 10000;
  const rounded = Math.round(areaHa * 100) / 100;

  return rounded;
}

watch(
  () => form.value.parcel,
  (parcelId) => {
    const selectedParcel = parcels.value.find((p) => p.uuid === parcelId);
    if (selectedParcel?.points?.length) {
      const area = calculateParcelArea(selectedParcel.points);
      calculatedArea.value = Number(area.toFixed(2));
      form.value.area = areaInM2(calculatedArea.value);
    } else {
      calculatedArea.value = 0;
      form.value.area = null;
    }
  }
);

const onAreaInput = () => {
  if (form.value.area > areaInM2(calculatedArea.value)) {
    form.value.area = areaInM2(calculatedArea.value);
  } else if (form.value.area < 0) {
    form.value.area = 0;
  }
};

onMounted(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const resParcels = await fetch(`${API_URL}/api/parcels/`, {
      headers: { Authorization: `Token ${token}` },
    });
    parcels.value = await resParcels.json();

    const resCrops = await fetch(`${API_URL}/api/crops/`, {
      headers: { Authorization: `Token ${token}` },
    });
    crops.value = await resCrops.json();

    const resStatus = await fetch(`${API_URL}/api/status-crops/`, {
      headers: { Authorization: `Token ${token}` },
    });
    statuses.value = await resStatus.json();
  } catch (err) {
    console.error(err);
    alert("Failed to load data");
  }
});

const submitParcelCrop = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/parcel-crops/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    showNotification("Parcel Crop created successfully!", "success");
    setTimeout(() => {
      router.push({ path: "/parcel-crops", query: { refresh: "1" } });
    }, 3000);
  } catch (err) {
    console.error(err);
    showNotification("Failed to create parcel crop", "error");
  } finally {
    isLoading.value = false;
  }
};

const areaInM2 = (areaInHa: number) => {
  if (!areaInHa) return 0;
  return areaInHa * 10000;
};
</script>

<style scoped>
input::placeholder,
select::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
</style>
