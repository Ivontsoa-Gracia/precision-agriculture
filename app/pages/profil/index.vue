<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-20 flex flex-col justify-between">
      <div class="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        
        <!-- Header -->
        <div class="bg-[#10b481] text-white px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 class="text-2xl sm:text-3xl font-bold">{{ t("profileTitle") }}</h1>
        </div>
  
        <!-- User Info -->
        <div class="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 p-5 rounded-xl shadow border border-gray-200">
            <h2 class="text-sm text-gray-500 font-semibold mb-1">{{ t("username") }}</h2>
            <p class="text-gray-900 text-lg font-medium">{{ user?.username }}</p>
          </div>
  
          <div class="bg-gray-50 p-5 rounded-xl shadow border border-gray-200">
            <h2 class="text-sm text-gray-500 font-semibold mb-1">{{ t("email") }}</h2>
            <p class="text-gray-900 text-lg font-medium">{{ user?.email }}</p>
          </div>
  
          <div class="bg-gray-50 p-5 rounded-xl shadow border border-gray-200">
            <h2 class="text-sm text-gray-500 font-semibold mb-1">{{ t("firstName") }}</h2>
            <p class="text-gray-900 text-lg font-medium">{{ user?.first_name }}</p>
          </div>
  
          <div class="bg-gray-50 p-5 rounded-xl shadow border border-gray-200">
            <h2 class="text-sm text-gray-500 font-semibold mb-1">{{ t("lastName") }}</h2>
            <p class="text-gray-900 text-lg font-medium">{{ user?.last_name }}</p>
          </div>
        </div>
  
        <!-- Actions -->
        <div class="px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200">
          <a
            href="/profil/edit"
            class="w-full sm:w-auto text-center px-6 py-3 bg-[#10b481] text-white font-semibold rounded-xl shadow hover:bg-[#0e9b6c] transition duration-200"
          >
            {{ t("editProfile") }}
          </a>
          <a
            href="/profil/edit/reset-password"
            class="w-full sm:w-auto text-center px-6 py-3 bg-yellow-400 text-white font-semibold rounded-xl shadow hover:bg-yellow-500 transition duration-200"
          >
            {{ t("changePassword") }}
          </a>
        </div>
  
        <!-- Footer links + Logout lien -->
        <div class="px-8 py-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <div class="flex gap-6">
            <a href="/conditions/terms-of-service" class="hover:underline">{{ t("terms") }}</a>
            <a href="/conditions/privacy-policy" class="hover:underline">{{ t("policy") }}</a>
          </div>
          <a @click.prevent="logout" href="#" class="text-red-600 hover:underline cursor-pointer">{{ t("logout") }}</a>
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
  