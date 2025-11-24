<template>
  <div class="p-4 sm:p-6 max-w-4xl mx-auto mt-1 sm:mt-6 mb-10 sm:mb-1">
    <h2
      class="text-xl sm:text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2"
    >
      {{ t("titleeditparcel") }}
    </h2>

    <form @submit.prevent="submitParcel" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col">
            <label class="text-gray-700 text-sm font-medium mb-1">{{
              t("owner")
            }}</label>
            <input
              v-model="ownerName"
              type="text"
              readonly
              class="px-3 py-2 rounded border bg-white cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#10b481]"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-gray-700 text-sm font-medium mb-1"
              >{{ t("thparcelname") }} *</label
            >
            <input
              v-model="form.parcel_name"
              type="text"
              required
              class="px-3 py-2 rounded border bg-white focus:outline-none focus:ring-2 focus:ring-[#10b481]"
            />
          </div>
        </div>

        <div>
          <h3 class="text-gray-700 text-sm font-medium mb-1">
            {{ t("pointsParcel") }}
          </h3>

          <div class="overflow-x-auto rounded border">
            <table class="min-w-full bg-white">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 text-left font-semibold text-gray-700">
                    #
                  </th>
                  <th class="px-4 py-2 text-left font-semibold text-gray-700">
                    {{ t("thlatitude") }}
                  </th>
                  <th class="px-4 py-2 text-left font-semibold text-gray-700">
                    {{ t("thlongitude") }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(point, index) in form.parcel_points"
                  :key="index"
                  class="border-t"
                >
                  <td class="px-4 py-2 font-semibold text-gray-900">
                    {{ index + 1 }}
                  </td>

                  <td class="px-4 py-2">
                    <input
                      v-model.number="point.latitude"
                      type="number"
                      step="any"
                      class="w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#10b481]"
                    />
                  </td>

                  <td class="px-4 py-2">
                    <input
                      v-model.number="point.longitude"
                      type="number"
                      step="any"
                      class="w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#10b481]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="w-full bg-[#10b481] transition-colors py-3 rounded text-white text-lg flex justify-center items-center gap-2"
      >
        {{ t("btnsaveparcel") }}
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

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();

const t = (key: string) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

const router = useRouter();
const route = useRoute();
const id = route.params.id as string;

const isLoading = ref(false);

const notification = ref({
  visible: false,
  message: "",
  type: "success",
});

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

const form = ref({
  parcel_name: "",
  parcel_points: [],
});

const ownerUUID = ref("");
const ownerName = ref("");

onMounted(async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/parcels/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    const data = await res.json();

    ownerUUID.value = data.owner;

    form.value = {
      parcel_name: data.parcel_name || "",
      parcel_points: data.parcel_points?.length
        ? data.parcel_points.map((p: any) => ({
            latitude: p.latitude,
            longitude: p.longitude,
            order: p.order,
          }))
        : [],
    };

    if (data.owner) {
      const ownerRes = await fetch(`${API_URL}/api/users/${data.owner}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (ownerRes.ok) {
        const ownerData = await ownerRes.json();
        ownerName.value =
          `${ownerData.first_name || ""} ${ownerData.last_name || ""}`.trim() ||
          data.owner;
      } else {
        ownerName.value = data.owner;
      }
    }
  } catch (err) {
    console.error(err);
  }
});

const submitParcel = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  isLoading.value = true;
  try {
    const payload = {
      owner: ownerUUID.value,
      parcel_name: form.value.parcel_name,
      parcel_points: form.value.parcel_points.map((p, index) => ({
        latitude: p.latitude,
        longitude: p.longitude,
        order: index + 1,
      })),
    };

    const res = await fetch(`${API_URL}/api/parcels/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    showNotification("Parcel updated successfully!", "success");
    setTimeout(() => {
      router.push({ path: "/parcels", query: { refresh: "1" } });
    }, 3000);
  } catch (err) {
    console.error(err);
    showNotification("Network error, please check your server", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>
