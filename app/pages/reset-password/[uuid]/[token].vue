<template>
    <div class="min-h-screen bg-gray-50 py-14 px-6 md:px-20">
      <div
        class="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <div class="mb-6">
          <button
            @click="router.push('/profil')"
            class="text-gray-500 hover:text-gray-700 flex items-center gap-2 font-medium"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {{ t("back") }}
          </button>
        </div>
  
        <h1 class="text-3xl font-bold text-[#10b481] mb-6">
          {{ t("changePasswordTitle") }}
        </h1>
  
        <form @submit.prevent="updatePassword" class="space-y-4">
          <div>
            <label class="block mb-1 font-semibold">{{
              t("currentPassword")
            }}</label>
            <input
              v-model="form.current_password"
              type="password"
              placeholder="********"
              class="w-full p-3 border rounded-lg"
              required
            />
          </div>
  
          <div>
            <label class="block mb-1 font-semibold">{{ t("newPassword") }}</label>
            <input
              v-model="form.new_password"
              type="password"
              placeholder="********"
              class="w-full p-3 border rounded-lg"
              required
            />
          </div>
  
          <div class="flex justify-end mt-4">
            <button
              type="submit"
              class="px-6 py-2 bg-[#10b481] text-white rounded-xl hover:bg-[#0e9b6c] transition"
            >
              {{ t("savePassword") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { API_URL } from "~/config";
  import { useLanguageStore } from "~/stores/language";
  import { translate } from "~/utils/translate";
  
  definePageMeta({ layout: "dashboard" });
  
  const router = useRouter();
  const languageStore = useLanguageStore();
  const t = (key: string) => translate[languageStore.lang][key] || key;
  
  const form = ref({
    current_password: "",
    new_password: "",
  });
  
  const updatePassword = async () => {
    const token = sessionStorage.getItem("token");
    const uuid = sessionStorage.getItem("uuid");
  
    if (!token || !uuid) router.push("/login");
  
    if (!form.value.current_password || !form.value.new_password) return;
  
    try {
      const res = await fetch(`${API_URL}/api/users/${uuid}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(form.value),
      });
  
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      router.push("/profil");
    } catch (err) {
      console.error(err);
    }
  };
  </script>
  