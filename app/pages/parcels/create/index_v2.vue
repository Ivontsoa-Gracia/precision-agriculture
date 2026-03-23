<template>
  <div
    class="p-1 sm:p-8 relative mb-4 sm:mb-1"
  >
    <div class="relative w-full h-screen overflow-hidden">
      <!-- MAP FULLSCREEN -->
      <div
        id="map"
        ref="mapRef"
        class="absolute rounded-2xl inset-0 z-0"
      ></div>
      <div class="absolute top-4 left-16">
        <div ref="searchRef" id="search-input" class="relative w-80">
          <i
            class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></i>
          <input
            v-model="form.search"
            type="text"
            class="w-full px-4 py-3 pl-10 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            :placeholder="t('searchonmap')"
            @input="onSearchInput"
          />
        </div>
      </div>

      <!-- ONBOARDING -->
      <div v-if="showGuide" class="absolute inset-0 z-20 pointer-events-none">
        <!-- DARK OVERLAY WITH HOLE -->
        <div
          class="absolute inset-0 rounded-2xl transition-all duration-300"
          :style="overlayStyle"
        ></div>

        <!-- BUBBLE -->
        <transition name="fade-scale">
          <div
            :key="step"
            class="absolute pointer-events-auto bg-white rounded-2xl shadow-2xl p-4 w-[280px]"
            :style="bubbleStyle"
          >
            <p class="text-sm text-gray-700 mb-2">
              {{ steps[step].text }}
            </p>

            <div class="flex justify-between items-center">
              <button class="btn-neutre" @click="skipGuide">
                Skip
              </button>

              <button
                class="btn-primary"
                @click="nextStep"
              >
                {{ step === steps.length - 1 ? "Finish" : "Next" }}
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- OVERLAY UI -->
      <div class="absolute inset-0 z-10 pointer-events-none">
        <!-- PANEL DRAGGABLE -->
        <div
          ref="panelRef"
          id="panel"
          class="pointer-events-auto absolute top-48 left-16 w-[380px] max-h-[85vh] overflow-hidden rounded-2xl bg-[#fafaf9] border border-white/30"
        >
          <!-- HEADER (DRAG HANDLE) -->
          <div
            class="cursor-move px-6 py-6 flex justify-between items-center border-b bg-[#fff]"
          >
            <h3 class="subtitle">
              {{ t("titlesaveparcel") }}
            </h3>
            <i class="bx bx-move text-gray-400"></i>
          </div>

          <!-- CONTENT -->
          <div class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            <!-- POINTS -->
            <div>
              <label class="label">{{ t("points") }}</label>

              <div
                v-if="form.points.length"
                class="mt-2 max-h-40 overflow-y-auto rounded-xl border bg-gray-50"
              >
                <table class="w-full text-xs small text-gray-700">
                  <tbody>
                    <tr
                      v-for="(p, index) in form.points"
                      :key="index"
                      class="border-b last:border-0"
                    >
                      <td class="px-2 py-2 text-center">{{ index + 1 }}</td>
                      <td>{{ p.lat.toFixed(5) }}</td>
                      <td>{{ p.lng.toFixed(5) }}</td>
                      <td class="text-right pr-2">
                        <button @click="removePoint(index)" class="p-2 px-2 rounded-full hover:bg-[#e63946]/10">
                          <i class="bx bx-trash text-red-500"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p v-else class="text-xs text-gray-400 italic mt-2">
                {{ t("nopoinntsfound") }}
              </p>
            </div>

            <!-- AREA -->
            <div>
              <label class="label">{{ t("parcelarea") }}</label>
              <input
                :value="formatM2(form.area)"
                readonly
                class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
              />
            </div>

            <!-- NAME -->
            <div>
              <label class="label">{{
                t("thparcelname")
              }}</label>
              <input
                v-model="form.parcel"
                type="text"
                class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
                placeholder="Parcel name"
              />
            </div>

            <!-- BUTTON -->
            <button
              ref="saveRef"
              id="save-btn"
              @click="submitForm"
              class="w-full btn-primary"
            >
              {{ t("btnsaveparcel") }}
            </button>
          </div>
        </div>
      </div>
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { API_URL } from "~/config";
import { reactive, ref, onMounted } from "vue";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useRouter } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";

const router = useRouter();

const languageStore = useLanguageStore();
const showInstructions = ref(false);

const t = (key: string) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

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
    setTimeout(() => {
      router.push({ path: "/parcels" });
    }, 3000);
  } catch (err) {
    console.error(err);
    showNotification("Network error", "error");
  } finally {
    isLoading.value = false;
  }
}

function removePoint(index: number) {
  const removedPoint = form.points[index];
  if (!removedPoint) return;

  form.points.splice(index, 1);

  form.points.forEach((p, i) => (p.order = i + 1));

  map.eachLayer((layer: any) => {
    if (
      layer instanceof L.CircleMarker ||
      layer instanceof L.Tooltip ||
      layer instanceof L.Polygon
    ) {
      map.removeLayer(layer);
    }
  });

  form.points.forEach((p) => {
    const circle = L.circleMarker([p.lat, p.lng], {
      radius: 6,
      color: "#1d4ed8",
      fillColor: "#3b82f6",
      fillOpacity: 0.8,
      weight: 2,
    }).addTo(map);

    L.tooltip({
      permanent: true,
      direction: "top",
      className: "custom-label",
      offset: [0, -5],
    })
      .setContent(`Point ${p.order}`)
      .setLatLng([p.lat, p.lng])
      .addTo(map);
  });

  if (form.points.length >= 3) {
    drawnPolygon = L.polygon(
      form.points.map((p) => [p.lat, p.lng]),
      { color: "blue" }
    ).addTo(map);
  }

  updatePolygon();
}

onMounted(async () => {
  if (!process.client) return;

  const L = await import("leaflet");
  await import("leaflet/dist/leaflet.css");
  turf = await import("@turf/turf");

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Tiles &copy; Esri" }
  );
  const streets = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "&copy; OpenStreetMap contributors" }
  );

  map = L.map("map", {
    center: [-18.8792, 47.5079],
    zoom: 6,
    layers: [satellite],
  });

  L.control.layers({ Satellite: satellite, "Street Map": streets }).addTo(map);

  map.on("click", (e: any) => {
    form.points.push({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      order: form.points.length + 1,
    });

    map.eachLayer((layer: any) => {
      if (
        layer instanceof L.CircleMarker ||
        layer instanceof L.Tooltip ||
        layer instanceof L.Polygon
      ) {
        map.removeLayer(layer);
      }
    });

    form.points.forEach((p) => {
      const circle = L.circleMarker([p.lat, p.lng], {
        radius: 6,
        color: "#1d4ed8",
        fillColor: "#3b82f6",
        fillOpacity: 0.8,
        weight: 2,
      }).addTo(map);

      L.tooltip({
        permanent: true,
        direction: "top",
        className: "custom-label",
        offset: [0, -5],
      })
        .setContent(`Point ${p.order}`)
        .setLatLng([p.lat, p.lng])
        .addTo(map);
    });

    if (form.points.length >= 3) {
      drawnPolygon = L.polygon(
        form.points.map((p) => [p.lat, p.lng]),
        { color: "blue" }
      ).addTo(map);
    }

    updatePolygon();
  });
});

const formatM2 = (areaInHa) => {
  if (!areaInHa) return "- m²";
  return `${(areaInHa * 10000).toLocaleString()} m²`;
};

onMounted(() => {
  if (localStorage.getItem("instructions_seen")) {
    showInstructions.value = false;
  }
});

watch(showInstructions, (val) => {
  if (!val) {
    localStorage.setItem("instructions_seen", "true");
  }
});

onMounted(() => {
  const panel = document.querySelector(".cursor-move").parentElement;

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const header = panel.querySelector(".cursor-move");

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    panel.style.left = e.clientX - offsetX + "px";
    panel.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
});

const step = ref(0);
const showGuide = ref(true);
const currentRect = ref(null);

const steps = [
  {
    selector: "#search-input",
    text: "Search a location here",
    placement: "top",
  },
  {
    selector: "#map",
    text: "Click on the map to add points",
    placement: "center",
  },
  {
    selector: "#panel",
    text: "Your points will appear here",
    placement: "right",
  },
  {
    selector: "#save-btn",
    text: "Save your parcel here",
    placement: "top",
  },
];



const updatePosition = () => {
  const currentStep = steps[step.value];

  
  if (!currentStep) {
    console.warn("Step undefined:", step.value);
    return;
  }

  const el = document.querySelector(currentStep.selector);
const rect = el.getBoundingClientRect();
currentRect.value = rect; // top, left, width, height exact

  if (!el) {
    console.warn("Element not found:", currentStep.selector);
    return;
  }

  currentRect.value = el.getBoundingClientRect();
};

const nextStep = () => {
  if (step.value < steps.length - 1) {
    step.value++;
  } else {
    showGuide.value = false;
  }
};

// ✅ UN SEUL onMounted
onMounted(async () => {
  await nextTick();

  setTimeout(() => {
    updatePosition();
  }, 700);

  window.addEventListener("resize", updatePosition);
});

// ✅ FIX STEP CHANGE
watch(step, async () => {
  await nextTick();
  updatePosition();
});

const overlayStyle = computed(() => {
  if (!currentRect.value) return {};

  // Position exacte de l'élément cible
  const { top, left, width, height } = currentRect.value;

  // centre exact de l'élément
  const centerX = left + width / 2;
  const centerY = top + height / 2;

  return {
    background: "rgba(0,0,0,0.6)",
    WebkitMaskImage: `radial-gradient(circle 100px at ${centerX}px ${centerY}px, transparent 0%, black 100%)`,
    maskImage: `radial-gradient(circle 100px at ${centerX}px ${centerY}px, transparent 0%, black 100%)`,
  };
});

const bubbleStyle = computed(() => {
  if (!currentRect.value) return {};

  const { top, left, width, height } = currentRect.value;
  const placement = steps[step.value].placement;

  const bubbleWidth = 280;
  const bubbleHeight = 80;
  const gap = 12;

  let x = 0;
  let y = 0;

  switch (placement) {
    case "bottom":
      x = left + width / 2 - bubbleWidth / 2;
      y = top + height + gap;
      break;

    case "top":
      x = left + width / 2 - bubbleWidth / 2;
      y = top - bubbleHeight - gap;
      break;

    case "right":
      x = left + width + gap;
      y = top + height / 2 - bubbleHeight / 2;
      break;

    case "left":
      x = left - bubbleWidth - gap;
      y = top + height / 2 - bubbleHeight / 2;
      break;

    case "center":
      x = left + width / 2 - bubbleWidth / 2;
      y = top + height / 2 - bubbleHeight / 2;
      break;
  }

  // ✅ Eviter que la bulle sorte de l'écran
  x = Math.max(10, Math.min(x, window.innerWidth - bubbleWidth - 10));
  y = Math.max(10, Math.min(y, window.innerHeight - bubbleHeight - 10));

  return {
    top: `${y}px`,
    left: `${x}px`,
  };
});
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
.slide-right-enter-active {
  transition: all 0.4s ease-out;
}
.slide-right-leave-active {
  transition: all 0.3s ease-in;
}
.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

.fade-scale-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.fade-scale-leave-from {
  opacity: 1;
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.highlight {
  box-shadow: 0 0 0 4px rgba(16, 180, 129, 0.4);
  border-radius: 12px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.pulse {
  animation: pulse 1.5s infinite;
}
</style>
