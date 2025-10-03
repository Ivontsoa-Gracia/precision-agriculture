<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg mt-10">
    <div class="flex items-center gap-3 mb-6">
      <i class="bx bx-edit text-4xl text-[#10b481] animate-pulse"></i>
      <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight relative">
        {{ t("editparcelcrop") }}
      </h2>
    </div>

    <form @submit.prevent="submitParcelCrop" class="space-y-6 bg-white">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("parcel") }} *</label>
          <select
            v-model="form.parcel"
            required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          >
            <option v-for="p in parcels" :key="p.uuid" :value="p.uuid">
              {{ p.parcel_name }}
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("crop") }} *</label>
          <select
            v-model="form.crop_id"
            required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          >
            <option v-for="c in crops" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.variety?.name }})
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("plantingdate") }} *</label>
          <input
            v-model="form.planting_date"
            type="date"
            required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          />
        </div>

        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("harvestdate") }}</label>
          <input
            v-model="form.harvest_date"
            type="date"
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          />
        </div>

        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("area") }} (m²) *</label>
          <input
            v-model="form.area"
            type="number"
            step="1"
            required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          />
        </div>

        <div class="flex flex-col">
          <label class="font-semibold mb-1">{{ t("status") }} *</label>
          <select
            v-model="form.status_id"
            required
            class="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          >
            <option v-for="s in statuses" :key="s.id" :value="s.id">
              {{ t(cropStatusKeyMap[s.name]) }}
            </option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        class="w-full bg-gradient-to-r from-[#10b481] to-[#0da06a] hover:from-[#0da06a] hover:to-[#10b481] transition-colors py-3 rounded-xl font-semibold text-white text-lg flex justify-center items-center gap-2"
      >
        <i class="bx bx-save text-xl"></i>
        {{ t("btnsaveparcelcrop") }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
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

const form = ref({
  parcel: "",
  crop_id: null,
  planting_date: "",
  harvest_date: "",
  area: null,
  status_id: null,
});

const parcels = ref<any[]>([]);
const crops = ref<any[]>([]);
const statuses = ref<any[]>([]);

const loadData = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const [resParcels, resCrops, resStatuses, resParcelCrop] =
      await Promise.all([
        fetch(`${API_URL}/api/parcels/`, {
          headers: { Authorization: `Token ${token}` },
        }),
        fetch(`${API_URL}/api/crops/`, {
          headers: { Authorization: `Token ${token}` },
        }),
        fetch(`${API_URL}/api/status-crops/`, {
          headers: { Authorization: `Token ${token}` },
        }),
        fetch(`${API_URL}/api/parcel-crops/${route.params.id}/`, {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);

    parcels.value = await resParcels.json();
    crops.value = await resCrops.json();
    statuses.value = await resStatuses.json();
    const data = await resParcelCrop.json();
    form.value = {
      parcel: data.parcel,
      crop_id: data.crop_id,
      planting_date: data.planting_date,
      harvest_date: data.harvest_date || "",
      area: data.area,
      status_id: data.status_id,
    };
  } catch (err) {
    console.error(err);
    alert("Failed to load data");
  }
};

onMounted(loadData);

const submitParcelCrop = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/parcel-crops/${route.params.id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    alert("Parcel Crop updated successfully!");
    router.push("/parcel-crops");
  } catch (err) {
    console.error(err);
    alert("Failed to update parcel crop");
  }
};
</script>

<style scoped>
input::placeholder,
select::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
</style>
