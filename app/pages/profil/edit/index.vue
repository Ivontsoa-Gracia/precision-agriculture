<template>
    <div class="min-h-screen bg-gray-50 py-14 px-6 md:px-20">
      <div class="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h1 class="text-3xl font-bold text-[#10b481] mb-6">{{ t("editProfile") }}</h1>
  
        <!-- Formulaire de modification -->
        <form @submit.prevent="updateProfile" class="grid grid-cols-1 md:grid-cols-2 gap-6">
  
          <div class="col-span-2">
            <label class="block mb-1 font-semibold">{{ t("username") }}</label>
            <input v-model="form.username" type="text" class="w-full p-3 border rounded-lg" required />
          </div>
  
          <div>
            <label class="block mb-1 font-semibold">{{ t("firstName") }}</label>
            <input v-model="form.first_name" type="text" class="w-full p-3 border rounded-lg" />
          </div>
  
          <div>
            <label class="block mb-1 font-semibold">{{ t("lastName") }}</label>
            <input v-model="form.last_name" type="text" class="w-full p-3 border rounded-lg" />
          </div>
  
          <div class="col-span-2">
            <label class="block mb-1 font-semibold">{{ t("email") }}</label>
            <input v-model="form.email" type="email" class="w-full p-3 border rounded-lg" required />
          </div>
  
          <div class="col-span-2 flex justify-between mt-4">
            <button type="submit" class="px-6 py-2 bg-[#10b481] text-white rounded-xl hover:bg-[#0e9b6c] transition">
              {{ t("saveChanges") }}
            </button>
  
            <button type="button" @click="goBack" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">
              {{ t("back") }}
            </button>
          </div>
  
        </form>
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
  
  const form = ref({
    username: "",
    email: "",
    first_name: "",
    last_name: ""
  });
  
  onMounted(async () => {
    const token = sessionStorage.getItem("token");
  const uuid = sessionStorage.getItem("uuid");
  if (!token || !uuid) router.push("/login");
    try {
      const res = await fetch(`${API_URL}/api/users/${uuid}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      form.value.username = data.username;
      form.value.email = data.email;
      form.value.first_name = data.first_name;
      form.value.last_name = data.last_name;
    } catch (err) {
      console.error(err);
      router.push("/login");
    }
  });
  
  const updateProfile = async () => {
    const token = sessionStorage.getItem("token");
  const uuid = sessionStorage.getItem("uuid");
  if (!token || !uuid) router.push("/login");
    try {
      const res = await fetch(`${API_URL}/api/users/${uuid}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify(form.value)
      });
  
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
    //   alert(t("profileUpdated"));
      router.push("/profil");
    } catch (err) {
      console.error(err);
    //   alert(t("updateFailed"));
    }
  };
  
  const goBack = () => {
    router.push("/profil");
  };
  </script>
  