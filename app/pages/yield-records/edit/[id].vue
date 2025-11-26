<template>
  <div class="p-4 sm:p-6 max-w-3xl mx-auto mt-6 mb-10 sm:mb1">
    <h2
      class="text-xl sm:text-3xl font-bold mb-6 text-[#212121] flex items-center gap-3"
    >
      {{ t("edityield") }}
    </h2>

    <form @submit.prevent="update" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="text-gray-700 text-sm font-medium mb-1">{{
            t("thdate")
          }}</label>
          <input
            v-model="form.date"
            type="date"
            class="px-3 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-gray-700 text-sm font-medium mb-1">{{
            t("thyield")
          }}</label>
          <input
            v-model.number="form.yield_amount"
            type="number"
            step="0.01"
            class="px-3 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div class="flex flex-col">
          <label class="text-gray-700 text-sm font-medium mb-1"
            >{{ t("area") }} (m²)</label
          >
          <input
            v-model.number="form.area"
            type="number"
            step="0.01"
            class="px-3 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-gray-700 text-sm font-medium mb-1">{{
            t("notes")
          }}</label>
          <textarea
            v-model="form.notes"
            class="px-3 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="w-full bg-[#10b481] text-white py-3 rounded text-lg flex justify-center items-center gap-2 hover:scale-105 transition-transform shadow-md"
      >
        {{ t("btnsaveyield") }}
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
            notification.type === 'success' ? 'text-[#10b481]' : 'text-red-500',
          ]"
        >
          {{ notification.message }}
        </p>

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
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { API_URL } from "~/config";

import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();

const t = (key) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

const route = useRoute();
const router = useRouter();

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
  yield_amount: 0,
  area: 0,
  notes: "",
});

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
    form.value = {
      date: res.data.date || "",
      yield_amount: res.data.yield_amount || 0,
      area: res.data.area || 0,
      notes: res.data.notes || "",
    };
  } catch (err) {
    console.error(err);
  }
}

async function update() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  isLoading.value = true;

  try {
    await axios.put(
      `${API_URL}/api/yield-records/${route.params.id}/`,
      form.value,
      { headers: { Authorization: `Token ${token}` } }
    );
    showNotification("Yield updated successfully!", "success");
    setTimeout(() => {
      router.push({ path: "/yield-records" });
    }, 3000);
  } catch (err) {
    console.error(err);
    showNotification("Network error, please check your server", "error");
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchYield);
</script>
