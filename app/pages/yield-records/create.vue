<template>
  <section>
    <Breadcrumb />

    <div class="max-w-3xl mx-auto mt-1 sm:mt-16 mb-10 sm:mb-1">
      <h2
        class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2"
      >
        {{ t("newyield") }}
      </h2>

      <form @submit.prevent="createYieldRecord" class="space-y-4">
        <div>
          <label class="text-gray-700 text-sm font-medium mb-1">{{
            t("parcelcrop")
          }}</label>
          <select
            v-model="form.parcelCrop"
            @change="onParcelCropChange"
            class="border rounded px-3 py-2 w-full bg-transparent focus:ring-2 focus:ring-[#10b481]"
            required
          >
            <option v-for="crop in parcelCrops" :key="crop.id" :value="crop.id">
              {{ crop.parcel.parcel_name }} - {{ crop.crop.name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-gray-700 text-sm font-medium mb-1">{{
              t("thdate")
            }}</label>
            <input
              v-model="form.date"
              type="date"
              class="border rounded px-3 py-2 w-full bg-transparent focus:ring-2 focus:ring-[#10b481]"
              required
            />
          </div>

          <div>
            <label class="text-gray-700 text-sm font-medium mb-1">{{
              t("thyield")
            }}</label>
            <input
              v-model.number="form.yield_amount"
              type="number"
              class="border rounded px-3 py-2 w-full bg-transparent focus:ring-2 focus:ring-[#10b481]"
              required
            />
          </div>

          <div>
            <label class="text-gray-700 text-sm font-medium mb-1"
              >{{ t("area") }} (m²)</label
            >
            <input
              v-model.number="form.area"
              type="number"
              :max="areaInM2(maxArea)"
              step="1"
              @input="checkArea"
              class="border rounded px-3 py-2 w-full bg-transparent focus:ring-2 focus:ring-[#10b481]"
              required
            />
          </div>
        </div>

        <div>
          <label class="text-gray-700 text-sm font-medium mb-1">{{
            t("notes")
          }}</label>
          <textarea
            v-model="form.notes"
            class="border rounded px-3 py-2 w-full bg-transparent focus:ring-2 focus:ring-[#10b481]"
          ></textarea>
        </div>

        <div class="text-right">
          <button
            type="submit"
            class="w-full bg-[#10b481] hover:bg-[#0da06a] transition-colors py-3 rounded text-white text-sm flex justify-center items-center gap-2"
          >
            {{ t("btnsaveyield") }}
          </button>
        </div>
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
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import * as turf from "@turf/turf";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import Breadcrumb from "~/components/Breadcrumb.vue";

const languageStore = useLanguageStore();
const t = (key) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);
const router = useRouter();

// ✅ useState Nuxt3 style
const parcelCrops = useState<any[]>("parcelCrops", () => []);
const maxArea = useState<number | null>("maxArea", () => null);
const isLoading = useState<boolean>("isLoading", () => false);
const notification = useState("notification", () => ({
  visible: false,
  message: "",
  type: "success",
}));
const form = ref({
  date: "",
  yield_amount: null,
  area: null,
  notes: "",
  parcelCrop: null,
});

let token: string | null = null;

const showNotification = (
  message: string,
  type = "success",
  duration = 3000
) => {
  notification.value.message = message;
  notification.value.type = type;
  notification.value.visible = true;
  setTimeout(() => (notification.value.visible = false), duration);
};

onMounted(async () => {
  if (!process.client) return;

  token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  await loadParcelCrops();
});

async function loadParcelCrops() {
  try {
    const res = await fetch(`${API_URL}/api/parcel-crops/`, {
      headers: { Authorization: `Token ${token}` },
    });
    const data = await res.json();

    for (const pc of data) {
      if (pc.parcel) {
        const resParcel = await fetch(`${API_URL}/api/parcels/${pc.parcel}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        pc.parcel = await resParcel.json();
      }
    }

    parcelCrops.value = data;
  } catch (err) {
    console.error(err);
  }
}

function calculateParcelArea(points: { lng: number; lat: number }[]) {
  if (!points || points.length < 3) return 0;
  const coords = points.map((p) => [p.lng, p.lat]);
  coords.push([points[0].lng, points[0].lat]);
  const polygon = turf.polygon([coords]);
  const areaM2 = turf.area(polygon);
  return areaM2 / 10000;
}

function onParcelCropChange() {
  const selected = parcelCrops.value.find(
    (pc) => pc.id === form.value.parcelCrop
  );
  if (selected?.parcel?.points) {
    const area = calculateParcelArea(selected.parcel.points);
    maxArea.value = area.toFixed(2) as unknown as number;
    form.value.area = areaInM2(maxArea.value);
  } else {
    maxArea.value = null;
    form.value.area = null;
  }
}

function checkArea() {
  if (areaInM2(maxArea.value) && form.value.area > areaInM2(maxArea.value)) {
    form.value.area = areaInM2(maxArea.value);
  }
}

async function createYieldRecord() {
  if (!token) return;
  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/yield-records/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(form.value),
    });
    if (!res.ok) throw new Error("Erreur création YieldRecord");

    showNotification("Yield saved successfully!", "success");
    setTimeout(() => {
      router.push({ path: "/yield-records", query: { refresh: "1" } });
    }, 3000);
  } catch (err) {
    console.error(err);
    showNotification("Network error, please check your server", "error");
  } finally {
    isLoading.value = false;
  }
}

const formatM2 = (areaInHa: number | null) => {
  if (!areaInHa) return "0 m²";
  return `${(areaInHa * 10000).toLocaleString()} m²`;
};

const areaInM2 = (areaInHa: number | null) => {
  if (!areaInHa) return 0;
  return areaInHa * 10000;
};
</script>
