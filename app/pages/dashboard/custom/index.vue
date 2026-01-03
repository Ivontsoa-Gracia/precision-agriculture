<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-6">Créer un champ personnalisé</h1>

    <form @submit.prevent="submitForm" class="space-y-5">
      <!-- Nom -->
      <div>
        <label class="block text-sm font-medium mb-1">Nom technique</label>
        <input
          v-model="form.name"
          type="text"
          class="input"
          placeholder="ex: taux_adoption_custom"
          required
        />
      </div>

      <!-- Type -->
      <div>
        <label class="block text-sm font-medium mb-1">Type de champ</label>
        <select v-model="form.field_type" class="input" required>
          <option disabled value="">Sélectionner</option>
          <option value="text">Text</option>
          <option value="number">Nombre</option>
          <option value="boolean">Booléen</option>
          <option value="date">Date</option>
        </select>
      </div>

      <!-- Indicator cible -->
      <div>
        <label class="block text-sm font-medium mb-1"> Indicator cible </label>
        <select v-model="form.table_target" class="input" required>
          <option disabled value="">Sélectionner un indicator</option>
          <option
            v-for="indicator in indicators"
            :key="indicator.uuid"
            :value="indicator.uuid"
          >
            {{ indicator.name }} ({{ indicator.code }})
          </option>
        </select>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <button type="submit" class="btn-primary">Créer</button>
        <span v-if="success" class="text-green-600 text-sm">
          Champ créé avec succès
        </span>
      </div>

      <!-- Erreur -->
      <p v-if="error" class="text-red-600 text-sm">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import axios from "axios"
import { API_URL } from "~/config"

const indicators = ref<any[]>([])
const error = ref("")
const success = ref(false)

const form = ref({
  name: "",
  field_type: "",
  table_target: "",
})

/* Charger les indicators */
const fetchIndicators = async () => {
  const token = sessionStorage.getItem("token") || ""

  try {
    const res = await axios.get(
      `${API_URL}/api/suivi-evaluation/indicators/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
    indicators.value = res.data
  } catch (e) {
    error.value = "Erreur lors du chargement des indicators"
  }
}

/* Soumission */
const submitForm = async () => {
  error.value = ""
  success.value = false

  const token = sessionStorage.getItem("token") || ""
  const uuid = sessionStorage.getItem("uuid") || ""

  try {
    await axios.post(
      `${API_URL}/api/suivi-evaluation/custom-fields/`,
      {
        ...form.value,
        created_by: uuid, // ✅ ajouté ici
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )

    success.value = true
    form.value = {
      name: "",
      field_type: "",
      table_target: "",
    }
  } catch (e: any) {
    error.value =
      e?.response?.data?.detail ||
      "Erreur lors de la création du champ"
  }
}


onMounted(fetchIndicators)
</script>


<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
}

.btn-primary {
  background: #2563eb;
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 0.5rem;
}
</style>
