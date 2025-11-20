<template>
  <div class="max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md mt-10">
    <h2
      class="text-xl sm:text-3xl font-bold mb-6 text-[#212121] flex items-center gap-3"
    >
      <i class="bx bx-leaf text-xl sm:text-3xl text-[#10b481]"></i>
      {{ t("newcrop") }}
    </h2>

    <form @submit.prevent="submitCrop" class="space-y-5">
      <div class="flex flex-col">
        <label class="block font-medium">{{ t("cropname") }} *</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Enter crop name"
          required
          class="w-full border p-2 rounded focus:ring-[#212121]"
        />
      </div>

      <div class="flex flex-col">
        <label class="block font-medium">{{ t("variety") }} *</label>
        <select
          v-model="form.variety_id"
          required
          class="w-full border p-2 rounded focus:ring-[#212121]"
        >
          <option v-for="v in varieties" :key="v.id" :value="v.id">
            {{ v.name }}
          </option>
        </select>
      </div>

      <button
        type="button"
        @click="skipStep"
        class="w-full border border-gray-300 text-gray-700 py-3 rounded-xl mt-2"
      >
        {{ t("skip") }}
      </button>

      <button
        type="submit"
        class="w-full bg-[#10b481] hover:bg-[#0da06a] transition-colors py-3 rounded-xl text-white text-lg flex justify-center items-center gap-2"
      >
        <i class="bx bx-plus text-xl"></i>
        {{ t("btnsavecrop") }}
      </button>
    </form>
  </div>
  <!-- <div
      v-if="isLoading"
      class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl"
    >
      <div
        class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"
      ></div>
    </div> -->
  <transition name="fade">
    <div
      v-if="notification.visible"
      :class="[
        'fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold',
        notification.type === 'success' ? 'bg-[#10b481]' : 'bg-red-500',
      ]"
    >
      {{ notification.message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { defineEmits } from "vue";
const emit = defineEmits<{
  (e: "next"): void;
}>();

const skipStep = () => {
  emit("skip");
};

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;
const currentLocale = computed(() => languageStore.lang);

const router = useRouter();

const formState = useState("formData", () => ({ name: "", variety_id: null }));
const varietiesState = useState("varietiesData", () => [] as any[]);
const notificationState = useState("notificationData", () => ({
  visible: false,
  message: "",
  type: "success",
}));
const loadingState = useState("isLoading", () => false);

const form = ref(formState.value);
const varieties = ref(varietiesState.value);
const notification = ref(notificationState.value);
const isLoading = ref(loadingState.value);

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

onMounted(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    if (!varietiesState.value.length) {
      const res = await fetch(`${API_URL}/api/varieties/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      varieties.value = await res.json();
      varietiesState.value = varieties.value;
    } else {
      varieties.value = varietiesState.value;
    }
  } catch (err) {
    console.error("Failed to load varieties:", err);
  }
});

const submitCrop = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  isLoading.value = true;
  loadingState.value = true;
  try {
    const res = await fetch(`${API_URL}/api/crops/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    await res.json();
    showNotification("Crop created successfully!", "success");
    emit("next");
  } catch (err) {
    console.error(err);
    showNotification("Network error, please check your server", "error");
  } finally {
    isLoading.value = false;
    loadingState.value = false;
  }
};

watch(form, (val) => (formState.value = val), { deep: true });
watch(varieties, (val) => (varietiesState.value = val), { deep: true });
watch(notification, (val) => (notificationState.value = val), { deep: true });
watch(isLoading, (val) => (loadingState.value = val));
</script>

<style scoped>
input::placeholder,
select::placeholder {
  color: rgba(33, 33, 33, 0.5);
}
</style>
