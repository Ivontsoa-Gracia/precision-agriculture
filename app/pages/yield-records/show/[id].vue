<template>
  <div class="w-full md:w-2/3 mx-auto mt-12 p-8 bg-white rounded-2xl border border-gray-200">
    <button
      @click="goBack"
      class="menu-item hover:underline mb-4 inline-flex items-center gap-1"
    >
      <i class="bx bx-arrow-left"></i> {{ t("back") }}
    </button>

    <div class="flex items-center justify-between mb-6">
      <h2 class="">
        {{ t("yielddetail") }}
      </h2>
      <button
        @click="goToEdit"
        class="btn-neutre flex items-center"
        title="Edit"
      >
        <i class="bx bx-edit-alt"></i>
      </button>
    </div>

    <div v-if="yieldRecord" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="border border-gray-200 p-4 rounded-2xl flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-400 small text-sm">{{ t("thdate") }}</p>
          <p class="content">{{ formatDate(yieldRecord.date) }}</p>
        </div>
      </div>

      <div class="border border-gray-200 p-4 rounded-2xl flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-400 small text-sm">{{ t("thyield") }}</p>
          <p class="content">{{ yieldRecord.yield_amount }}</p>
        </div>
      </div>

      <div class="border border-gray-200 p-4 rounded-2xl flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-400 small text-sm">{{ t("area") }} (m²)</p>
          <p class="content">{{ yieldRecord.area }}</p>
        </div>
      </div>

      <div class="border border-gray-200 p-4 rounded-2xl flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-400 small text-sm">{{ t("parcelcrop") }}</p>
          <p class="content">
            {{ parcelCropData && parcelData ? `${parcelData.parcel_name} - ${parcelCropData.crop.name}` : "-" }}
          </p>
        </div>
      </div>

      <div class="border border-gray-200 p-4 rounded-2xl flex items-center gap-3">
        <div>
          <p class="uppercase tracking-wide text-gray-400 small text-sm">{{ t("notes") }}</p>
          <p class="content">
            {{ yieldRecord.notes || "-" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import DetailItem from "~/components/DetailItem.vue";
import { API_URL } from "~/config";

import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();

const t = (key) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

const route = useRoute();
const router = useRouter();
const yieldRecord = ref(null);

const parcelCropData = ref(null);
const parcelData = ref(null);

async function fetchYield() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const res = await axios.get(
      `${API_URL}/api/yield-records/${route.params.id}/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    yieldRecord.value = res.data;

    if (yieldRecord.value.parcelCrop) {
      const resParcelCrop = await axios.get(
        `${API_URL}/api/parcel-crops/${yieldRecord.value.parcelCrop}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      parcelCropData.value = resParcelCrop.data;

      if (parcelCropData.value.parcel) {
        const resParcel = await axios.get(
          `${API_URL}/api/parcels/${parcelCropData.value.parcel}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        parcelData.value = resParcel.data;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function goToEdit() {
  router.push(`/yield-records/edit/${route.params.id}`);
}

function goBack() {
  router.push("/yield-records");
}

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(languageStore.lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(fetchYield);
</script>
