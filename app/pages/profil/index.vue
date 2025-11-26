<template>
  <div class="py-12 px-4 sm:px-6 lg:px-20 flex justify-center">
    <div class="w-full max-w-5xl bg-white rounded overflow-hidden">
      <div
        class="relative h-24 bg-gradient-to-r from-[#10b481] to-[#0da06a] flex justify-center items-center"
      >
        <div
          class="absolute -bottom-16 w-32 h-32 rounded-full border-4 border-white shadow-lg flex justify-center items-center bg-white"
        >
          <i class="bx bx-user text-6xl text-[#10b481]"></i>
        </div>
      </div>

      <div class="mt-20 px-8 py-6 text-center">
        <h1 class="text-3xl font-extrabold text-gray-900">
          {{ user?.username }}
        </h1>
        <p class="text-gray-500 mt-1">{{ user?.email }}</p>
      </div>

      <div class="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="bg-white p-6 rounded border border-gray-200 transition flex items-center gap-4"
        >
          <div>
            <h2 class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("firstName") }}
            </h2>
            <p class="font-medium text-gray-800">
              {{ user?.first_name }}
            </p>
          </div>
        </div>

        <div
          class="bg-white p-6 rounded border border-gray-200 transition flex items-center gap-4"
        >
          <div>
            <h2 class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("lastName") }}
            </h2>
            <p class="font-medium text-gray-800">
              {{ user?.last_name }}
            </p>
          </div>
        </div>

        <div
          class="bg-white p-6 rounded border border-gray-200 transition flex items-center gap-4"
        >
          <div>
            <h2 class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("username") }}
            </h2>
            <p class="font-medium text-gray-800">
              {{ user?.username }}
            </p>
          </div>
        </div>

        <div
          class="bg-white p-6 rounded border border-gray-200 transition flex items-center gap-4"
        >
          <div>
            <h2 class="uppercase tracking-wide text-gray-500 text-sm">
              {{ t("email") }}
            </h2>
            <p class="font-medium text-gray-800">{{ user?.email }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <p
            class="tracking-wide text-[#10b481] cursor-pointer"
            @click="router.push('/profil/edit/reset-password')"
          >
            {{ t("changePassword") }}
          </p>
        </div>
      </div>

      <div
        class="px-8 py-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 border-t border-gray-200"
      >
        <a
          href="/profil/edit"
          class="w-full sm:w-auto text-center px-6 py-3 bg-[#10b481] text-white font-medium rounded shadow hover:bg-[#0da06a] transition flex items-center justify-center gap-2"
        >
          <i class="bx bx-edit-alt text-lg"></i>
          {{ t("editProfile") }}
        </a>
      </div>

      <div
        class="px-8 py-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-4"
      >
        <div class="flex gap-6">
          <a href="/conditions/terms-of-service" class="hover:underline">{{
            t("terms")
          }}</a>
          <a href="/conditions/privacy-policy" class="hover:underline">{{
            t("policy")
          }}</a>
        </div>
        <button
          @click.prevent="logout"
          class="text-red-600 hover:underline font-medium cursor-pointer flex items-center gap-1"
        >
          <i class="bx bx-log-out"></i> {{ t("logout") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

definePageMeta({ layout: "dashboard" });

const router = useRouter();
const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;

const token = sessionStorage.getItem("token");
const uuid = sessionStorage.getItem("uuid");
if (!token || !uuid) router.push("/login");

const user = ref<any>(null);

onMounted(async () => {
  try {
    const response = await fetch(`${API_URL}/api/users/${uuid}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!response.ok) throw new Error("Erreur API");
    const data = await response.json();
    user.value = {
      username: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      id: data.id,
      date_joined: data.date_joined,
    };
  } catch (err) {
    console.error(err);
    router.push("/login");
  }
});

const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("uuid");
  router.push("/login");
};
</script>
