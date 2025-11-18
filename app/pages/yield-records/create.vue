<template>
  <div class="p-4 sm:p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto mb-10 sm:mb-1">
    <h2 class="text-xl sm:text-3xl font-bold mb-6 text-[#212121] flex items-center gap-3">
      <i class="bx bx-bar-chart text-xl sm:text-3xl text-[#10b481] animate-pulse"></i>
      {{ t("newyield") }}
    </h2>

    <form @submit.prevent="createYieldRecord" class="space-y-4">
      <div>
        <label class="block mb-1 font-medium text-gray-700">{{
          t("parcelcrop")
        }}</label>
        <select
          v-model="form.parcelCrop"
          @change="onParcelCropChange"
          class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]"
          required
        >
          <option v-for="crop in parcelCrops" :key="crop.id" :value="crop.id">
            {{ crop.parcel.parcel_name }} - {{ crop.crop.name }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block mb-1 font-medium text-gray-700">{{
            t("thdate")
          }}</label>
          <input
            v-model="form.date"
            type="date"
            class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]"
            required
          />
        </div>

        <div>
          <label class="block mb-1 font-medium text-gray-700">{{
            t("thyield")
          }}</label>
          <input
            v-model.number="form.yield_amount"
            type="number"
            class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]"
            required
          />
        </div>

        <div>
          <label class="block mb-1 font-medium text-gray-700"
            >{{ t("area") }} (m²)</label
          >
          <input
            v-model.number="form.area"
            type="number"
            :max="areaInM2(maxArea)"
            step="1"
            @input="checkArea"
            class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]"
            required
          />
        </div>
      </div>

      <div>
        <label class="block mb-1 font-medium text-gray-700">{{
          t("notes")
        }}</label>
        <textarea
          v-model="form.notes"
          class="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#10b481]"
        ></textarea>
      </div>

      <div class="text-right">
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-[#10b481] to-[#0a8f6e] text-white px-6 py-2 rounded-lg font-bold shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
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

    <transition name="fade">
      <div
        v-if="notification.visible"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
      >
        <div
          :class="[
            'bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4 w-[340px] text-center transition-all duration-300',
            notification.type === 'success'
              ? 'border-t-4 border-[#10b481]'
              : 'border-t-4 border-red-500',
          ]"
        >
          <!-- Icône -->
          <div
            v-if="notification.type === 'success'"
            class="w-16 h-16 rounded-full bg-[#10b481] flex items-center justify-center"
          >
            <i class="bx bx-check text-4xl font-extrabold text-white"></i>
          </div>
          <div
            v-else
            class="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
          >
            <i class="bx bx-x text-4xl font-extrabold text-white"></i>
          </div>

          <p
            :class="[
              'text-lg font-semibold',
              notification.type === 'success'
                ? 'text-[#10b481]'
                : 'text-red-500',
            ]"
          >
            {{ notification.message }}
          </p>

          <!-- Message secondaire -->
          <p class="text-gray-500 text-sm">
            {{
              notification.type === "success"
                ? "Redirecting to your dashboard..."
                : "Please try again."
            }}
          </p>
        </div>
      </div>
    </transition>
</template>

<script setup>
definePageMeta({ layout: "dashboard" });

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as turf from "@turf/turf";
import { API_URL } from "~/config";

import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();

const t = (key) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

const router = useRouter();
const parcelCrops = ref([]);
const maxArea = ref(null);

const isLoading = ref(false);

const notification = ref({
  visible: false,
  message: "",
  type: "success",
});

const showNotification = (message, type = "success", duration = 3000) => {
  notification.value.message = message;
  notification.value.type = type;
  notification.value.visible = true;
  setTimeout(() => {
    notification.value.visible = false;
  }, duration);
};

const form = ref({
  date: "",
  yield_amount: null,
  area: null,
  notes: "",
  parcelCrop: null,
});

let token = null;

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

function calculateParcelArea(points) {
  if (!points || points.length < 3) return 0;
  const coords = points.map((p) => [p.lng, p.lat]);
  coords.push([points[0].lng, points[0].lat]);
  const polygon = turf.polygon([coords]);
  const areaM2 = turf.area(polygon);
  return areaM2 / 10000; // hectares
}

function onParcelCropChange() {
  const selected = parcelCrops.value.find(
    (pc) => pc.id === form.value.parcelCrop
  );
  if (selected?.parcel?.points) {
    const area = calculateParcelArea(selected.parcel.points);
    maxArea.value = area.toFixed(2);
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

const formatM2 = (areaInHa) => {
  if (!areaInHa) return "0 m²";
  return `${(areaInHa * 10000).toLocaleString()} m²`;
};

const areaInM2 = (areaInHa) => {
  if (!areaInHa) return 0;
  return areaInHa * 10000;
};
</script>
