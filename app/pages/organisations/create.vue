<template>
    <section class="max-w-3xl mx-auto p-4 sm:p-6 mb-10 sm:mb-1">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">
        Créer une organisation
      </h1>
  
      <form @submit.prevent="createOrganisation" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div class="flex flex-col gap-4 h-full">
      <div class="flex-1 flex flex-col">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
          Nom de l’organisation *
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          maxlength="150"
          class="w-full border border-gray-300 bg-transparent rounded px-3 py-2 h-12 focus:outline-none outline-none"
        />
      </div>
  
      <div class="flex-1 flex flex-col">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="5"
          class="w-full border border-gray-300 bg-transparent rounded px-3 py-2 h-full focus:outline-none outline-none resize-none"
        ></textarea>
      </div>
    </div>
  
    <!-- Colonne droite -->
    <div class="flex flex-col gap-4 h-full">
      <div class="flex-1 flex flex-col">
        <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <input
          id="address"
          v-model="form.address"
          type="text"
          maxlength="255"
          class="w-full border border-gray-300 bg-transparent rounded px-3 py-2 h-full focus:outline-none outline-none"
        />
      </div>
  
      <div class="flex-1 flex flex-col">
        <label for="contact_email" class="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
        <input
          id="contact_email"
          v-model="form.contact_email"
          type="email"
          maxlength="254"
          class="w-full border border-gray-300 bg-transparent rounded px-3 py-2 h-full focus:outline-none outline-none"
        />
      </div>
  
      <div class="flex-1 flex flex-col">
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
        <input
          id="phone"
          v-model="form.phone"
          type="text"
          maxlength="50"
          class="w-full border border-gray-300 bg-transparent rounded px-3 py-2 h-full focus:outline-none outline-none"
        />
      </div>
    </div>
  </div>
  
  
        <!-- Type d’organisation -->
        <div>
          <p class="block text-sm font-medium text-gray-700 mb-2">
            Type d’organisation *
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              v-for="type in orgTypes"
              :key="type.value"
              class="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="org_type"
                :value="type.value"
                v-model="form.org_type"
                required
                class="text-green-600 text-sm focus:ring-green-500"
              />
              <span class="text-gray-700 text-sm">{{ type.label }}</span>
            </label>
          </div>
        </div>
  
        <div class="pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#10b481] text-white py-2 px-4 text-sm rounded hover:bg-[#10b481] transition disabled:opacity-50"
          >
            {{ loading ? "Création en cours..." : "Créer l’organisation" }}
          </button>
        </div>
  
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>
      </form>
    </section>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: "dashboard" });
  
  import { ref } from "vue";
  import { useFetch, useRouter } from "#app";
  import { API_URL } from "~/config";
  import { useUserStore } from "~/stores/userStore";
  
  const userStore = useUserStore();
  
  console.log("Token:", userStore.token);
  
  interface OrganisationForm {
    name: string;
    description: string;
    org_type: string;
    address: string;
    contact_email: string;
    phone: string;
  }
  
  const router = useRouter();
  
  const form = ref<OrganisationForm>({
    name: "",
    description: "",
    org_type: "",
    address: "",
    contact_email: "",
    phone: "",
  });
  
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  
  const orgTypes = [
    { label: "Gouvernement", value: "GOVERNMENT" },
    { label: "ONG", value: "NGO" },
    { label: "Secteur privé", value: "PRIVATE" },
    { label: "Coopérative", value: "COOP" },
    { label: "Autre", value: "OTHER" },
  ];
  
  const createOrganisation = async () => {
    error.value = null;
    success.value = null;
    loading.value = true;
  
    try {
      const { data, error: fetchError } = await useFetch(
        `${API_URL}/api/groups/organisations/`,
        {
          method: "POST",
          body: form.value,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${sessionStorage.getItem("token")}`,
          },
        }
      );
  
      if (fetchError.value) throw new Error(fetchError.value.message);
  
      success.value = "Organisation créée avec succès.";
  
      setTimeout(() => {
        router.push("/group/create-group");
      }, 1200);
    } catch (err: any) {
      error.value = err.message || "Une erreur est survenue lors de la création.";
    } finally {
      loading.value = false;
    }
  };
  </script>
  