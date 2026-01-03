<template>
  <div class="max-w-xl mx-auto py-12 px-6">
    <h1 class="text-xl font-semibold text-gray-900 mb-2">Créer un groupe</h1>
    <p class="text-sm text-gray-500 mb-8">
      Un groupe permet de collaborer et suivre des activités ensemble.
    </p>

    <form @submit.prevent="createGroup" class="space-y-6">
      <!-- Nom -->
      <div class="space-y-1">
        <label class="text-sm text-gray-600">Nom du groupe *</label>
        <input
          v-model="form.name"
          class="w-full border border-gray-300 rounded px-3 py-2 h-12 focus:outline-none outline-none"
          required
        />
      </div>

      <!-- Description -->
      <div class="space-y-1">
        <label class="text-sm text-gray-600">Description</label>
        <textarea
          v-model="form.description"
          rows="2"
          class="w-full border border-gray-300 rounded px-3 py-2 h-12 focus:outline-none outline-none"
        />
      </div>

      <!-- Organisation / Type -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
        <div class="space-y-2">
          <label class="text-sm text-gray-600">Organisation *</label>
          <select
            v-model="form.organisation_id"
            class="w-full border border-gray-300 rounded px-3 py-2 h-12 focus:outline-none outline-none"
            required
          >
            <option value="" disabled>Sélectionner</option>
            <option
              v-for="org in organisations"
              :key="org.uuid"
              :value="org.uuid"
            >
              {{ org.name }}
            </option>
          </select>

          <button
            type="button"
            @click="router.push('/group/create-organisation')"
            class="text-xs text-gray-400 hover:text-[#10b481]"
          >
            Créer une organisation
          </button>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-gray-600">Type de groupe *</label>
          <select
            v-model="form.type_id"
            class="w-full border border-gray-300 rounded px-3 py-2 h-12 focus:outline-none outline-none"
            required
          >
            <option value="" disabled class="text-gray-500">
              Sélectionner
            </option>
            <option
              v-for="type in groupTypes"
              :key="type.uuid"
              :value="type.uuid"
            >
              {{ type.name }}
            </option>
          </select>

          <button
            type="button"
            @click="showTypeForm = !showTypeForm"
            class="text-xs text-gray-400 hover:text-[#10b481]"
          >
            Ajouter un type
          </button>
        </div>
      </div>

      <!-- Nouveau type -->
      <div v-if="showTypeForm" class="flex items-center gap-3">
        <input
          v-model="newTypeName"
          placeholder="Nom du nouveau type"
          class="flex-1 h-12 border border-gray-300 rounded px-3 focus:outline-none focus:border-[#10b481]"
        />

        <button
          type="button"
          @click="createGroupType"
          class="h-12 px-4 text-sm font-medium text-white bg-[#10b481] rounded hover:bg-[#0e8b6e] transition"
        >
          Enregistrer
        </button>
      </div>

      <!-- Action -->
      <div class="pt-6">
        <button
          type="submit"
          class="text-sm font-medium text-white bg-[#10b481] px-6 py-2 rounded hover:bg-[#0e8b6e] transition"
        >
          Créer le groupe
        </button>
      </div>
    </form>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";

const router = useRouter();

// Variables
const token = ref("");
const form = reactive({
  name: "",
  description: "",
  organisation_id: "",
  type_id: "",
});

const organisations = ref([]);
const groupTypes = ref([]);
const showTypeForm = ref(false);
const newTypeName = ref("");
const error = ref("");
const success = ref("");

// Charger token côté client uniquement
onMounted(() => {
  if (process.client) {
    token.value = sessionStorage.getItem("token") || "";
    fetchData();
  }
});

// Récupération organisations et types
async function fetchData() {
  try {
    const orgRes = await $fetch(`${API_URL}/api/groups/organisations/`, {
      headers: { Authorization: `Token ${token.value}` },
    });
    organisations.value = orgRes;

    const typeRes = await $fetch(`${API_URL}/api/groups/group-types/`, {
      headers: { Authorization: `Token ${token.value}` },
    });
    groupTypes.value = typeRes;
  } catch (err: any) {
    error.value = err.message || "Erreur lors du chargement des données";
  }
}

// Créer un nouveau type
async function createGroupType() {
  if (!newTypeName.value) return;
  try {
    const res = await $fetch(`${API_URL}/api/groups/group-types/`, {
      method: "POST",
      body: { name: newTypeName.value },
      headers: { Authorization: `Token ${token.value}` },
    });
    groupTypes.value.push(res);
    success.value = "Type créé avec succès";
    newTypeName.value = "";
    showTypeForm.value = false;
    error.value = "";
  } catch (err: any) {
    error.value = err.message || "Erreur lors de la création du type";
    success.value = "";
  }
}

// Créer le groupe
async function createGroup() {
  error.value = "";
  success.value = "";
  if (!form.name || !form.organisation_id || !form.type_id) {
    error.value = "Veuillez remplir tous les champs obligatoires";
    return;
  }

  try {
    const res = await $fetch(`${API_URL}/api/groups/groups/`, {
      method: "POST",
      body: form,
      headers: { Authorization: `Token ${token.value}` },
    });
    success.value = "Groupe créé avec succès";
    setTimeout(() => router.push("/group/join-group"), 1200);
  } catch (err: any) {
    error.value = err.message || "Erreur lors de la création du groupe";
  }
}
</script>
