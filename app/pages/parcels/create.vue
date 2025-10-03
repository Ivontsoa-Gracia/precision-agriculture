<template>
  <div class="flex h-full">
    <div class="w-2/5 p-4 rounded-lg space-y-4">
      <div
        class="p-4 border rounded-xl bg-[#f4a261]/10 text-[#5a3210] border-[#f4a261]/40 flex items-start gap-3 shadow-sm -mt-2"
      >
        <i class="bx bx-info-circle text-2xl text-[#f4a261] -mt-0"></i>

        <div>
          <h3 class="font-semibold text-[#f4a261] mb-2 text-lg">
            {{ t("instructions") }}
          </h3>
          <ul class="list-disc list-inside text-sm space-y-1">
            <li v-html="t('step1')"></li>
            <li v-html="t('step2')"></li>
            <li v-html="t('step3')"></li>
            <li v-html="t('step4')"></li>
            <li v-html="t('step5')"></li>
          </ul>
        </div>
      </div>

      <form class="space-y-4">
        <div class="bg-[#f9f9f9] shadow p-6 space-y-4 rounded-lg">
          <h2 class="text-3xl font-extrabold text-[#222831] mb-4">
            {{ t("titlesaveparcel") }}
          </h2>

          <div class="hidden">
            <label class="block text-sm font-medium mb-1">Owner</label>
            <input
              v-model="user.username"
              type="text"
              class="w-full p-2 border rounded bg-gray-100"
              readonly
            />
          </div>

          <p class="text-xs text-gray-500 mt-1">{{ t("searchintruction") }}</p>
          <div class="flex flex-col relative w-full">
            <i
              class="bx bx-search absolute left-3 top-6 -translate-y-1/2 text-gray-400 pointer-events-none text-lg"
            ></i>

            <input
              v-model="form.search"
              type="text"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#212121] transition"
              :placeholder="t('searchonmap')"
              @input="onSearchInput"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">{{
              t("parcelarea")
            }}</label>
            <input
              :value="formatM2(form.area)"
              type="text"
              readonly
              class="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">{{
              t("thparcelname")
            }}</label>
            <input
              v-model="form.parcel"
              type="text"
              class="w-full p-2 border rounded"
              placeholder="Parcel name"
            />
          </div>

          <button
            type="button"
            class="bg-[#10b481] text-white px-4 py-2 rounded shadow hover:bg-[#0da06a] w-full"
            @click="submitForm"
          >
            {{ t("btnsaveparcel") }}
          </button>
        </div>
      </form>
    </div>

    <div class="flex-1 ml-4 bg-gray-200 rounded-lg shadow z-40">
      <div id="map" class="h-full w-full rounded-lg"></div>
    </div>
  </div>

  <div
    v-if="isLoading"
    class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl z-50"
  >
    <div
      class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"
    ></div>
  </div>
  <transition name="fade">
    <div
      v-if="notification.visible"
      :class="[
        'fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50',
        notification.type === 'success' ? 'bg-[#10b481]' : 'bg-red-500',
      ]"
    >
      {{ notification.message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();

const t = (key: string) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);
definePageMeta({ layout: "dashboard" });
import { API_URL } from "~/config";

const isLoading = ref(false);
const notification = ref({ visible: false, message: "", type: "success" });

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

const mode = ref<"polygon" | "point">("polygon");
const form = reactive({
  parcel: "",
  search: "",
  latitude: "",
  longitude: "",
  points: [] as { lat: number; lng: number; order: number }[],
  area: "",
});
const user = reactive<{ uuid: string; username: string }>({
  uuid: "",
  username: "",
});

let map: any;
let drawnPolygon: any = null;
let marker: any = null;
let turf: any = null;
let searchTimeout: any = null;

function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(searchLocation, 500);
}

function calculateParcelArea(points: { lat: number; lng: number }[]) {
  if (!points || points.length < 3) return 0;
  const coords = points.map((p) => [p.lng, p.lat]);
  coords.push([points[0].lng, points[0].lat]);
  const polygon = turf.polygon([coords]);
  const areaM2 = turf.area(polygon);
  return areaM2 / 10000;
}

function updatePolygon() {
  if (!map) return;
  if (drawnPolygon) map.removeLayer(drawnPolygon);
  if (form.points.length > 0) {
    drawnPolygon = L.polygon(
      form.points.map((p) => [p.lat, p.lng]),
      { color: "blue" }
    ).addTo(map);
  }
  form.area =
    form.points.length < 3
      ? "---"
      : calculateParcelArea(form.points).toFixed(2);
}

function removeLastPoint() {
  if (form.points.length > 0) {
    form.points.pop();
    updatePolygon();
  }
}

async function searchLocation() {
  if (!form.search) return;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        form.search
      )}`,
      {
        headers: {
          "User-Agent": "ParcelApp/1.0 (contact@tonapp.com)",
          "Accept-Language": "mg,fr,en",
        },
      }
    );
    const results = await response.json();
    if (!results?.length) return;
    const place = results[0];
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    map.setView([lat, lon], 14);
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lon]).addTo(map);
  } catch (err) {
    console.error("Erreur recherche:", err);
  }
}

async function submitForm() {
  isLoading.value = true;
  try {
    const token = sessionStorage.getItem("token");
    const uuid = sessionStorage.getItem("uuid");
    if (!token) return;

    const parcel_points = form.points.map((p) => ({
      latitude: p.lat,
      longitude: p.lng,
      order: p.order,
    }));

    const payload = { owner: uuid, parcel_name: form.parcel, parcel_points };

    const response = await fetch(`${API_URL}/api/parcels/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data);
      return;
    }
    showNotification("Parcel saved successfully!", "success");
  } catch (err) {
    console.error(err);
    showNotification("Network error", "error");
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  if (!process.client) return;

  const L = await import("leaflet");
  await import("leaflet/dist/leaflet.css");
  turf = await import("@turf/turf");

  const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Tiles &copy; Esri" }
  );
  const streets = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "&copy; OpenStreetMap contributors" }
  );
  const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
      "Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy; OpenTopoMap",
  });

  map = L.map("map", {
    center: [-18.8792, 47.5079],
    zoom: 6,
    layers: [satellite],
  });
  L.control
    .layers({
      Satellite: satellite,
      "Street Map": streets,
      "Topographic Map": topo,
    })
    .addTo(map);

  map.on("click", (e: any) => {
    const order = form.points.length + 1;
    form.points.push({ lat: e.latlng.lat, lng: e.latlng.lng, order });
    updatePolygon();
  });
});

const formatM2 = (areaInHa) => {
  if (!areaInHa) return "- m²";
  return `${(areaInHa * 10000).toLocaleString()} m²`;
};
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
