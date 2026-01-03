<template>
    <div class="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-6">Ajouter un indicateur</h1>
      <div class="flex justify-start mt-4">
  <button
    @click="goToCreateCategory"
    class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
  >
    <i class="bx bx-plus text-lg"></i>
    Ajouter une catégorie
  </button>
</div>
      <form @submit.prevent="createIndicator" class="space-y-4">
        <!-- Nom -->
        <div>
          <label class="block font-medium mb-1">Nom</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Nom de l'indicateur"
            class="w-full border p-2 rounded"
            required
          />
        </div>
  
        <!-- Code -->
        <div>
          <label class="block font-medium mb-1">Code</label>
          <input
            v-model="form.code"
            type="text"
            placeholder="Code unique"
            class="w-full border p-2 rounded"
            required
          />
        </div>
  
        <!-- Description -->
        <div>
          <label class="block font-medium mb-1">Description</label>
          <textarea
            v-model="form.description"
            placeholder="Description (optionnelle)"
            class="w-full border p-2 rounded"
          ></textarea>
        </div>
  
        <!-- Unité -->
        <div>
          <label class="block font-medium mb-1">Unité</label>
          <input
            v-model="form.unit"
            type="text"
            placeholder="Ex: kg, %"
            class="w-full border p-2 rounded"
            required
          />
        </div>
  
        <!-- Formule -->
        <div>
          <label class="block font-medium mb-1">Formule</label>
          <input
            v-model="form.formula"
            type="text"
            placeholder="Ex: value1/value2 * 100"
            class="w-full border p-2 rounded"
          />
        </div>
  
        <!-- Fréquence -->
        <div>
  <label class="block font-medium mb-1">Fréquence</label>
  <select v-model="form.frequency" class="w-full border p-2 rounded" required>
    <option value="" disabled>-- Choisir --</option>
    <option value="daily">Quotidien</option>
    <option value="weekly">Hebdomadaire</option>
    <option value="monthly">Mensuel</option>
    <option value="quarterly">Trimestriel</option>
    <option value="yearly">Annuel</option>
  </select>
</div>

  
        <!-- Valeur cible -->
        <div>
          <label class="block font-medium mb-1">Valeur cible</label>
          <input
            v-model.number="form.target_value"
            type="number"
            placeholder="Valeur cible (optionnelle)"
            class="w-full border p-2 rounded"
          />
        </div>
  
        <!-- Catégorie -->
<!-- Catégorie -->
<div>
  <label class="block font-medium mb-1">Catégorie</label>
  <select v-model="form.category" class="w-full border p-2 rounded" required>
    <option value="" disabled>-- Choisir --</option>
    <option v-for="cat in categories" :key="cat.uuid" :value="cat.uuid">
      {{ cat.name }}
    </option>
  </select>
</div>

  
        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700 transition"
        >
          Ajouter l'indicateur
        </button>
      </form>
  
      <p v-if="successMessage" class="mt-4 text-green-600 font-medium">{{ successMessage }}</p>
      <p v-if="errorMessage" class="mt-4 text-red-600 font-medium">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
definePageMeta({ layout: "dashboard" });

  import { ref } from "vue";
  import { useRouter } from 'vue-router'
  import { API_URL } from '~/config'
  
  const router = useRouter()

  const goToCreateCategory = () => {
  router.push('/indicators/category/create')
}
  
const categories = ref<{ uuid: string; name: string }[]>([]);

onMounted(async () => {
  const token = sessionStorage.getItem("token") || "";
  try {
    const res = await fetch(`${API_URL}/api/suivi-evaluation/indicator-categories/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des catégories");
    categories.value = await res.json();
  } catch (err) {
    console.error(err);
  }
});
  
  const form = ref({
    name: "",
    code: "",
    description: "",
    unit: "",
    formula: "",
    frequency: "",
    target_value: null as number | null,
    category: "",
  });
  
  const successMessage = ref("");
  const errorMessage = ref("");
  
  const createIndicator = async () => {
    const token = sessionStorage.getItem("token") || "";
    successMessage.value = "";
    errorMessage.value = "";
  
    try {
      const res = await fetch(`${API_URL}/api/suivi-evaluation/indicators/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(form.value),
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(JSON.stringify(errData));
      }
  
      successMessage.value = "Indicateur ajouté avec succès !";
      // Réinitialiser le formulaire
      form.value = {
        name: "",
        code: "",
        description: "",
        unit: "",
        formula: "",
        frequency: "",
        target_value: null,
        category: "",
      };
    } catch (err: any) {
      console.error(err);
      errorMessage.value = "Erreur lors de la création de l'indicateur.";
    }
  };
  </script>
  