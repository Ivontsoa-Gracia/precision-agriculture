<template>
  <div class="p-6 space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      <div class="relative flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
        <div class="flex items-center justify-center w-16 h-16 rounded-full bg-[#10b481]/10">
          <i class='bx bx-map text-4xl text-[#10b481]'></i>
        </div>
        <div class="flex flex-col text-left">
          <p class="text-3xl font-bold text-[#10b481]">{{ totalParcels }}</p>
          <p class="text-sm font-medium text-[#10b481]">Active parcels</p>
        </div>
        <div class="absolute right-0 top-6 bottom-6 border-r-4 border-[#10b481]"></div>
      </div>

      <div class="relative flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
        <div class="flex items-center justify-center w-16 h-16 rounded-full bg-[#c99383]/10">
          <i class='bx bx-task text-4xl text-[#c99383]'></i>
        </div>
        <div class="flex flex-col text-left">
          <p class="text-3xl font-bold text-[#c99383]">{{ taskCompletionRate }}%</p>
          <p class="text-sm font-medium text-[#c99383]">Completed tasks</p>
        </div>
        <div class="absolute right-0 top-6 bottom-6 border-r-4 border-[#c99383]"></div>
      </div>

      <div class="relative flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
        <div class="flex items-center justify-center w-16 h-16 rounded-full bg-[#222831]/10">
          <i class='bx bx-bar-chart-alt-2 text-4xl text-[#222831]'></i>
        </div>
        <div class="flex flex-col text-left">
          <p class="text-3xl font-bold text-[#222831]">{{ yieldTotal }} kg</p>
          <p class="text-sm font-medium text-[#222831]">Total yield</p>
        </div>
        <div class="absolute right-0 top-6 bottom-6 border-r-4 border-[#222831]"></div>
      </div>

      <div class="relative flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
        <div class="flex items-center justify-center w-16 h-16 rounded-full bg-[#6d4c41]/10">
          <i class='bx bx-line-chart text-4xl text-[#6d4c41]'></i>
        </div>
        <div class="flex flex-col text-left">
          <p class="text-3xl font-bold text-[#6d4c41]">{{ yieldAvg }} kg</p>
          <p class="text-sm font-medium text-[#6d4c41]">Average yield</p>
        </div>
        <div class="absolute right-0 top-6 bottom-6 border-r-4 border-[#6d4c41]"></div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <div class="col-span-2 bg-white rounded-2xl shadow-md p-1 z-40">
        <client-only>
          <div id="map" class="h-[450px] rounded-xl"></div>
        </client-only>
      </div>

      <div class="col-span-1">
        <div class="p-6 bg-white rounded-2xl shadow-md flex flex-col hover:shadow-xl transition duration-300 h-[500px]">

          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-lg text-gray-900 flex items-center gap-2">
              <i class='bx bx-fullscreen text-[#10b481] text-xl'></i>
              Zoom on Parcel
            </h3>


            <span class="text-sm text-gray-500">{{ totalParcels }} parcel(s)</span>
          </div>

          <div class="relative mb-4 flex items-center gap-2">
            <!-- Search input -->
            <div class="relative flex-1">
              <input
                type="text"
                v-model="parcelSearch"
                placeholder="Search for a parcel..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#212121] transition"
              />
              <i class='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'></i>
            </div>

            <!-- Menu ... -->
            <div class="relative">
              <button
                @click="showSortMenu = !showSortMenu"
                class="px-3 py-2 rounded-xl hover:bg-gray-100 transition text-gray-700 font-medium"
              >
                <i class='bx bx-dots-vertical-rounded text-2xl'></i>
              </button>

              <!-- Dropdown -->
              <transition name="fade-scale">
                <div
                  v-if="showSortMenu"
                  class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-xl shadow-xl z-50"
                >
                  <p class="px-4 py-2 text-gray-500 font-semibold border-b border-gray-200">Sort by</p>
                  <label 
                    class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer rounded-lg"
                  >
                    <input 
                      type="radio" 
                      value="name" 
                      v-model="parcelSort" 
                      class="accent-[#212121]" 
                      @change="showSortMenu = false"
                    />
                    Name (A → Z)
                  </label>
                  <label 
                    class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer rounded-lg"
                  >
                    <input 
                      type="radio" 
                      value="yield" 
                      v-model="parcelSort" 
                      class="accent-[#212121]" 
                      @change="showSortMenu = false"
                    />
                    Yield (desc)
                  </label>
                </div>
              </transition>
            </div>
          </div>

          <ul class="flex-1 overflow-y-auto space-y-3 pr-1">
            <li
              v-for="p in sortedParcels"
              :key="p.id"
              class="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-[#f0fdf4] transition shadow-sm"
            >
              <div class="flex flex-col">
                <span class="text-gray-800 font-semibold">{{ p.name }}</span>
                <span class="text-xs text-gray-500">
                  Yield: <strong>{{ getParcelYield(p) }} kg</strong>
                </span>
              </div>
              <button
                @click="zoomParcel(p)"
                class="flex items-center gap-2 text-sm font-medium text-white px-3 py-1.5 rounded-lg 
                      bg-[#10b481] hover:bg-[#0d8a66] transition-colors duration-200 shadow-sm shadow-[#10b481]/30"
              >
                <i class='bx bx-zoom-in text-base'></i>
                <span>Zoom</span>
              </button>

            </li>
          </ul>
        </div>        
      </div>

    </div>

    <div class="grid grid-cols-3 gap-6 hidden">
      <div class="col-span-2 bg-white rounded-2xl shadow-md p-4 z-40">
        <h3 class="font-bold text-lg mb-4 text-gray-900 mb-12">Yield per parcel (kg)</h3>
        <client-only>
          <canvas id="yieldChart" class="h-96 w-full"></canvas>
        </client-only>
      </div>
      
      <div class="col-span-1 bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition flex-1 min-w-[200px]">
        <h3 class="font-bold text-lg mb-4 text-gray-900">Soil Summary (%)</h3>
        <div class="space-y-4">
          <div v-for="(value, key) in soilSummary" :key="key">
            <div class="flex justify-between mb-1">
              <span class="text-gray-600 capitalize">{{ key }}</span>
              <span class="text-gray-700 font-semibold">{{ value }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="soilColors[key]"
                :style="{ width: value + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition flex-1 min-w-[200px] hidden">
        <h3 class="font-bold text-lg mb-4 text-gray-900">Crop distribution</h3>
        <client-only>
          <canvas id="cropChart" class="h-48 w-full"></canvas>
        </client-only>
      </div>
    </div>

    <div class=" space-y-6">
      <!-- Grand titre Analytics -->
      <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Analytics</h2>

      <div class="grid grid-cols-3 gap-6">
        <!-- Graphique linéaire Yield Evolution -->
        <div class="col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h3 class="font-bold text-lg mb-4 text-gray-900">Yield Evolution</h3>
          <canvas id="parcelYieldChart" class="h-96 w-full rounded-xl"></canvas>
        </div>

        <!-- Accordéon des parcelles -->
        <div class="col-span-1 bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition flex-1 min-w-[200px]">
          <h3 class="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
            <i class='bx bx-bar-chart text-[#10b481] text-xl'></i>
            Parcels Analytics
          </h3>

          <div v-for="(parcel, key) in analyticsData" :key="key" class="bg-white rounded-md shadow-md mb-4 overflow-hidden transition hover:shadow-xl">
            <!-- Bouton Accordéon -->
            <button 
              @click="parcel.open = !parcel.open" 
              class="w-full p-4 flex justify-between items-center border border-gray-200 bg-[#fafafa] hover:bg-[#f9f9f9] transition-colors font-medium text-gray-800"
            >
              <span class="text-lg">{{ parcel.parcel_name }}</span>
              <i :class="parcel.open ? 'bx bx-chevron-up text-gray-600' : 'bx bx-chevron-down text-gray-600'" class="text-xl"></i>
            </button>
            
            <!-- Contenu Accordéon -->
            <div v-if="parcel.open" class="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              <!-- Yield Summary -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white rounded-md p-3 shadow-sm flex flex-col">
                  <span class="text-gray-500 text-sm">Mean Yield</span>
                  <span class="text-lg font-bold text-[#10b481]">{{ parcel.mean_yield.toFixed(2) }} kg</span>
                </div>
                <div class="bg-white rounded-md p-3 shadow-sm flex flex-col">
                  <span class="text-gray-500 text-sm">Mean Yield per Area</span>
                  <span class="text-lg font-bold text-[#c99383]">{{ parcel.mean_yield_per_area.toFixed(2) }} kg/ha</span>
                </div>
              </div>

              <!-- Yields by Date (mini-cards) -->
              <div class="space-y-2 mt-3">
                <div v-for="(date, i) in parcel.dates" :key="i" class="bg-white p-3 rounded-md shadow-sm flex justify-between items-center hover:shadow-md transition">
                  <div class="flex flex-col">
                    <span class="text-gray-500 text-sm">{{ date }} ({{ parcel.years[i] }})</span>
                    <span class="text-gray-800 font-medium">{{ parcel.yield_amount[i].toFixed(2) }} kg</span>
                  </div>
                  <div class="flex flex-col text-right">
                    <span class="text-gray-400 text-xs mb-1">Yield per Area</span>
                    <span class="text-[#10b481] font-medium text-lg">
                      {{ parcel.yield_per_area[i].toFixed(2) }} kg/ha
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Graphique en barres pour Total Yield per Year -->
      <!-- <div class="bg-white rounded-2xl shadow-md p-6">
        <h3 class="font-bold text-lg mb-4 text-gray-900">Total Yield per Year</h3>
        <canvas id="totalYieldChart" class="h-96 w-full rounded-xl"></canvas>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Chart from "chart.js/auto";
import { nextTick } from "vue";

definePageMeta({ layout: "dashboard" });

const showSortMenu = ref(false)

const router = useRouter();
const dashboard = ref<any>({ parcels: [], task_summary: [], yield_summary: [], soil_summary: [] });
  const analyticsData = ref<any>();

let cropChart: Chart | null = null;
let yieldChart: Chart | null = null;
let map: any = null;
let parcelLayer: any = null;

const soilColors: Record<string, string> = {
  nitrogen: "bg-[#10b481]",   
  soc: "bg-[#c99383]",      
  clay: "bg-[#6d4c41]",      
  phh2o: "bg-[#5fd4a2]",   
  sand: "bg-[#f4a261]",     
  silt: "bg-[#219ebc]"     
};

// --- Top Stats Computed ---
const totalParcels = computed(() => dashboard.value.parcels?.length || 0);
const taskCompletionRate = computed(() => {
  let total=0, done=0;
  dashboard.value.task_summary?.forEach((t:any)=>{ total+=t.task_summary?.total_tasks||0; done+=t.task_summary?.completed_tasks||0 });
  return total>0?Math.round((done/total)*100):0;
});
const yieldTotal = computed(()=>dashboard.value.yield_summary?.reduce((sum:number,y:any)=>sum+(y.summary?.total_yield||0),0)||0);
const yieldAvg = computed(()=>{ const vals=dashboard.value.yield_summary?.map((y:any)=>y.summary?.avg_yield||0)||[]; return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0 });

// --- Soil Summary ---
const soilTargets = computed(()=>{
  const res:Record<string,number>={nitrogen:0,soc:0,clay:0,phh2o:0,sand:0,silt:0};
  if(!dashboard.value.soil_summary?.length)return res;
  Object.keys(res).forEach(k=>{ const maxVal=Math.max(...dashboard.value.soil_summary.map((s:any)=>s.soil_summary?.[k]||0)); res[k]=Math.round(maxVal*1.1);});
  return res;
});
const soilSummary = computed(()=>{
  const soils = dashboard.value.soil_summary?.filter((s:any)=>s.soil_summary) || [];
  const res:Record<string,number>={nitrogen:0,soc:0,clay:0,phh2o:0,sand:0,silt:0};
  soils.forEach((s:any)=>{Object.keys(res).forEach(k=>res[k]+=s.soil_summary?.[k]||0);});
  Object.keys(res).forEach(k=>{ const avg=res[k]/(soils.length||1); res[k]=Math.min(Math.round(avg/soilTargets.value[k]*100),100);});
  return res;
});

// --- Parcelles search + sort ---
const parcelSearch = ref("");
const parcelSort = ref("name"); 
const filteredParcels = computed(()=>parcelSearch.value ? dashboard.value.parcels.filter((p:any)=>p.name.toLowerCase().includes(parcelSearch.value.toLowerCase())) : dashboard.value.parcels);
const sortedParcels = computed(()=>{
  const list = [...filteredParcels.value];
  if(parcelSort.value==="name") return list.sort((a,b)=>a.name.localeCompare(b.name));
  if(parcelSort.value==="yield") return list.sort((a,b)=>((b.yield_summary?.[0]?.summary?.total_yield||0)-(a.yield_summary?.[0]?.summary?.total_yield||0)));
  return list;
});

function getParcelYield(parcel: any) {
  if (!dashboard.value.yield_summary) return 0;
  return dashboard.value.yield_summary
    .filter((y: any) => y.parcel_name === parcel.name)
    .reduce((sum: number, y: any) => sum + (y.summary?.total_yield || 0), 0);
}


// --- Fetch dashboard ---
async function fetchDashboard() {
  const token = sessionStorage.getItem("token");
  if (!token) return router.push("/login");

  try {
    // Dashboard
    const res = await axios.get(
      "https://mvp-dvws.onrender.com/api/dashboard/full_dashboard/",
      { headers: { Authorization: `Token ${token}` } }
    );
    dashboard.value = res.data;

    // Analytics
    const resanalytics = await fetch(
      `https://mvp-dvws.onrender.com/analytics/yields/`,
      { headers: { Authorization: `Token ${token}` } }
    );

    if (!resanalytics.ok) throw new Error("Failed to load forecast");
    analyticsData.value = await resanalytics.json();
  } catch (err) {
    console.error(err);
  }
}

function addLegend(L: any) {
  const legendControl = L.control({ position: "topright" });

  legendControl.onAdd = function () {
    const container = L.DomUtil.create("div", "leaflet-bar legend-toggle");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "flex-end"; // align all to the right
    container.style.gap = "4px";

    // Button with Boxicons icon
    const button = L.DomUtil.create("a", "", container);
    button.href = "#";
    button.style.textAlign = "center";
    button.style.width = "45px";
    button.style.height = "45px";
    button.style.cursor = "pointer";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.background = "white";
    button.style.borderRadius = "3px";
    button.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

    button.innerHTML = '<i class="bx bx-info-circle text-gray-400 text-2xl"></i>';

    // Legend div (hidden by default)
    const legendDiv = L.DomUtil.create("div", "legend-content", container);
    legendDiv.style.display = "none";
    legendDiv.style.background = "white";
    legendDiv.style.padding = "10px 14px";
    legendDiv.style.borderRadius = "4px";
    legendDiv.style.boxShadow = "0 2px 12px rgba(0,0,0,0.3)";
    legendDiv.style.fontSize = "13px";
    legendDiv.style.flexDirection = "column"; // vertical stack
    legendDiv.style.display = "flex"; 
    legendDiv.style.gap = "6px";
    legendDiv.style.minWidth = "140px";
    legendDiv.style.alignItems = "flex-start"; // text left inside legend

    legendDiv.innerHTML = `
      <span style="display:flex; align-items:center;">
        <i style="background:#10b481; width:12px; height:12px; display:inline-block; margin-right:6px; border-radius:100%;"></i> Parcel
      </span>
      <span style="display:flex; align-items:center;">
        <i style="background:#e63946; width:12px; height:12px; display:inline-block; margin-right:6px; border-radius:100%;"></i> Fire
      </span>
    `;

    // Toggle legend on button click
    L.DomEvent.on(button, "click", function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      legendDiv.style.display = legendDiv.style.display === "flex" ? "none" : "flex";
    });

    return container;
  };

  legendControl.addTo(map);
}


// --- Map ---
async function initMap() {
  const L = (await import("leaflet")).default;
  await import("leaflet/dist/leaflet.css");

  // --- Définir les différents fonds de carte ---
  const satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri' }
  );

  const streets = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; OpenStreetMap contributors' }
  );

  const topo = L.tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    { attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap' }
  );

  const soil = L.tileLayer(
    'https://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png',
    { attribution: 'Soil & Terrain: Wikimedia' }
  );

  const agriculture = L.tileLayer(
    'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Agriculture / Land cover: Esri' } // à adapter si tu trouves un vrai layer agriculture
  );

  // --- Initialiser la carte avec couche par défaut ---
  map = L.map("map", {
    center: [-18.8792, 47.5079],
    zoom: 6,
    layers: [satellite]
  });

  parcelLayer = L.layerGroup().addTo(map);

  // --- Contrôle pour changer les fonds de carte ---
  const baseMaps = {
  "Satellite": satellite,
  "Street Map": streets,
  "Topographic Map": topo,
  // "Soil / Terrain": soil,
  "Agricultural View": agriculture
};

  L.control.layers(baseMaps).addTo(map);

  // --- Ajouter les données ---
  updateMap(L);
  await loadFireCSV(L);

  // --- Légende ---
  addLegend(L);
}


function updateMap(L: any) {
  if (!parcelLayer) return;
  parcelLayer.clearLayers();

  dashboard.value.parcels?.forEach((p: any) => {
  if (!p.points?.length) return;

  if (p.points.length === 1) {
    const pt = p.points[0];
    // Cercle rouge plus gros pour le point unique
    L.circleMarker([pt.lat, pt.lng], {
      radius: 1,       // taille du point
      color: "#10b481",    // bordure
      fillColor: "#10b481", // couleur intérieure
      fillOpacity: 0.9
    })
    .bindPopup(`<strong>${p.name}</strong>`)
    .addTo(parcelLayer);
  } else {
    const latlngs = p.points.map((pt: any) => [pt.lat, pt.lng]);
    L.polygon(latlngs, {
      color: "#10b481",
      fillColor: "#10b481",
      fillOpacity: 0.3
    })
    .bindPopup(`<strong>${p.name}</strong>`)
    .addTo(parcelLayer);

    // Pour rendre les sommets visibles
    p.points.forEach((pt: any) => {
      L.circleMarker([pt.lat, pt.lng], {
        radius: 2,
        color: "#10b481",
        fillColor: "#10b481",
        fillOpacity: 0.7
      }).addTo(parcelLayer);
    });
  }
});


  const allLayers: any[] = [];
  parcelLayer.eachLayer((layer: any) => allLayers.push(layer));

  if (allLayers.length)
    map.fitBounds(L.featureGroup(allLayers).getBounds().pad(0.2));
}

function zoomParcel(parcel: any) {
  if (!map || !parcelLayer) return;

  parcelLayer.eachLayer((layer: any) => {
    if (layer.getLatLng) {
      const latlng = layer.getLatLng();
      if (parcel.points.some((p: any) => p.lat === latlng.lat && p.lng === latlng.lng)) {
        map.setView([latlng.lat, latlng.lng], 15);
        layer.openPopup();
      }
    } else if (layer.getBounds) {
      const bounds = layer.getBounds();
      if (parcel.points.every((pt: any) => bounds.contains([pt.lat, pt.lng]))) {
        map.fitBounds(bounds.pad(0.3));
        layer.openPopup();
      }
    }
  });
}


// --- Watch dashboard changes ---
// watch(dashboard, ()=>{

//   // Crops Doughnut Chart
//   const cropCount:Record<string,number>={};
//   dashboard.value.yield_summary?.forEach((y:any)=>{ if(y.crop_name) cropCount[y.crop_name]=(cropCount[y.crop_name]||0)+1; });
//   const ctxCrop=document.getElementById("cropChart") as HTMLCanvasElement;
//   if(ctxCrop){ if(cropChart) cropChart.destroy();
//     const colors=["#10b481","#212121","#c99383","#f6ad55","#4ade80","#60a5fa"];
//     cropChart=new Chart(ctxCrop,{type:"doughnut",data:{labels:Object.keys(cropCount),datasets:[{data:Object.values(cropCount),backgroundColor:Object.keys(cropCount).map((_,i)=>colors[i%colors.length]),borderWidth:2,borderColor:"#fff"}]},options:{responsive:true,cutout:"50%",plugins:{legend:{position:"bottom"},tooltip:{enabled:true}}}});
//   }
// });

watch(dashboard, async () => {

  updateMap((window as any).L);

  await nextTick();

  const cropCount: Record<string, number> = {};
  dashboard.value.yield_summary?.forEach((y: any) => {
    if (y.crop_name) cropCount[y.crop_name] = (cropCount[y.crop_name] || 0) + 1;
  });

  const ctxCrop = document.getElementById("cropChart") as HTMLCanvasElement | null;
  if (ctxCrop) {
    if (cropChart) cropChart.destroy();
    const colors = ["#10b481", "#212121", "#c99383", "#f6ad55", "#4ade80", "#60a5fa"];
    cropChart = new Chart(ctxCrop, {
      type: "doughnut",
      data: {
        labels: Object.keys(cropCount),
        datasets: [
          {
            data: Object.values(cropCount),
            backgroundColor: Object.keys(cropCount).map((_, i) => colors[i % colors.length]),
            borderWidth: 2,
            borderColor: "#fff"
          }
        ]
      },
      options: {
        responsive: true,
        cutout: "65%",
        plugins: { legend: { position: "bottom" }, tooltip: { enabled: true } }
      }
    });
  }

  const ctxYield = document.getElementById("yieldChart") as HTMLCanvasElement | null;
  if (!ctxYield) return;

  const labels = dashboard.value.yield_summary.map((y: any) => y.parcel_name);
  const data = dashboard.value.yield_summary.map((y: any) => y.summary?.total_yield || 0);

  if (yieldChart) yieldChart.destroy();
  yieldChart = new Chart(ctxYield, {
    type: "bar",
    data: { labels, datasets: [{ label: "Yield (kg)", data, backgroundColor: "#f4a261", borderRadius: 6, maxBarThickness: 40 }] },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        x: { ticks: { color: "#4b5563", font: { size: 13 } }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: "#4b5563", font: { size: 13 } }, grid: { color: "#e5e7eb" } }
      }
    }
  });
});

watch(analyticsData, async () => {
  await nextTick();
  const ctx = document.getElementById("parcelYieldChart") as HTMLCanvasElement | null;
  if (!ctx) return;

  if (yieldChart) yieldChart.destroy();
  yieldChart = new Chart(ctx, {
    type: "line",
    data: chartData.value,
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" }, tooltip: { enabled: true } },
      scales: {
        x: { ticks: { color: "#4b5563" }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: "#4b5563" }, grid: { color: "#e5e7eb" } }
      }
    }
  });
});


const chartData = computed(() => {
  if (!analyticsData.value) return { labels: [], datasets: [] };

  // Récupérer toutes les dates uniques
  const allDates = new Set<string>();
  Object.values(analyticsData.value).forEach((p: any) => p.dates.forEach((d: string) => allDates.add(d)));
  const labels = Array.from(allDates).sort();

  // Créer 1 dataset par parcelle
  const datasets = Object.values(analyticsData.value).map((p: any, idx) => {
    const colorPalette = ["#10b481", "#c99383", "#222831", "#6d4c41", "#f4a261", "#219ebc"];
    return {
      label: p.parcel_name,
      data: labels.map(d => {
        const i = p.dates.indexOf(d);
        return i !== -1 ? p.yield_amount[i] : null;
      }),
      borderColor: colorPalette[idx % colorPalette.length],
      backgroundColor: colorPalette[idx % colorPalette.length],
      tension: 0.3,
      fill: false,
      spanGaps: true,
    };
  });

  return { labels, datasets };
});

async function loadFireCSV(L: any) {
  const res = await fetch("/fires_24h.csv")
  const text = await res.text()
  const lines = text.split("\n")
  const headers = lines[0].split(",")

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",")
    if (row.length < headers.length) continue

    const fire: any = {}
    headers.forEach((h, j) => (fire[h] = row[j]))

    if (fire.latitude && fire.longitude) {
      L.circleMarker([parseFloat(fire.latitude), parseFloat(fire.longitude)], {
        radius: 2,
        color: "#e63946",
        fillColor: "#e63946",
        fillOpacity: 0.9,
      })
        .bindPopup(
          `<b>🔥 Fire detected</b><br>
           Brightness: ${fire.brightness}<br>
           Date: ${fire.acq_date}`
        )
        .addTo(map)
    }
  }
}


onMounted(async () => {
  await initMap()
  await fetchDashboard()
})

</script>

<style>
/* Custom scrollbar */
::-webkit-scrollbar{width:6px;}
::-webkit-scrollbar-thumb{background-color:#d0d0d0;border-radius:10px;}

.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.2s ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-enter-to, .fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

</style>
