<template>
  <div class="max-w-3xl mx-auto mt-1 sm:mt-10 mb-10 sm:mb-1 p-8 bg-white rounded-2xl border border-gray-200">
    <h2 class="mb-6">
      {{ t("newcrop") }}
    </h2>

    <form @submit.prevent="submitCrop" class="space-y-5">
      <div class="flex flex-col">
        <label class="label mb-1">{{ t("cropname") }} *</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Enter crop name"
          required
          class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
        />
      </div>

      <div class="flex flex-col">
        <label class="label mb-1">{{ t("variety") }} *</label>
        <select
          v-model="form.variety_id"
          required
          class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
        >
          <option v-for="v in varieties" :key="v.id" :value="v.id">
            {{ v.name }}
          </option>
        </select>
      </div>

      <button
        type="submit"
        class="w-full btn-primary flex justify-center items-center gap-2"
      >
        {{ t("btnsavecrop") }}
      </button>
    </form>
  </div>
  <!-- <div
    v-if="isLoading"
    class="absolute inset-0 bg-black/50 flex items-center justify-center"
  >
    <div
      class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"
    ></div>
  </div> -->

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
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

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
    setTimeout(() => {
      router.push({ path: "/parcel-crops/create" });
    }, 3000);
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
