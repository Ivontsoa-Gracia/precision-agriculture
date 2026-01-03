<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Créer un Report</h1>

    <form @submit.prevent="createReport" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Nom -->
      <div class="col-span-2">
        <label class="text-gray-700 text-sm font-medium mb-1">Nom</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full border p-2 rounded bg-transparent text-sm"
          required
        />
      </div>

      <!-- Type -->
      <div>
        <label class="text-gray-700 text-sm font-medium mb-1">Type</label>
        <select
          v-model="form.type"
          class="w-full border p-2 rounded bg-transparent text-sm"
          required
        >
          <option value="" disabled>-- Choisir --</option>
          <option value="PROGRESS">PROGRESS</option>
          <option value="FINANCIAL">FINANCIAL</option>
          <option value="IMPACT">IMPACT</option>
          <option value="AUDIT">AUDIT</option>
        </select>
      </div>

      <!-- Statut -->
      <div>
        <label class="text-gray-700 text-sm font-medium mb-1">Statut</label>
        <select
          v-model="form.status"
          class="w-full border p-2 rounded bg-transparent text-sm"
          required
        >
          <option value="DRAFT">DRAFT</option>
          <option value="SUBMITTED">SUBMITTED</option>
          <option value="APPROVED">APPROVED</option>
        </select>
      </div>

      <!-- Période début -->
      <div>
        <label class="text-gray-700 text-sm font-medium mb-1">Période de début</label>
        <input
          v-model="form.period_start"
          type="date"
          class="w-full border p-2 rounded bg-transparent text-sm"
          required
        />
      </div>

      <!-- Période fin -->
      <div>
        <label class="text-gray-700 text-sm font-medium mb-1">Période de fin</label>
        <input
          v-model="form.period_end"
          type="date"
          class="w-full border p-2 rounded bg-transparent text-sm"
          required
        />
      </div>

      <!-- Organisation -->
      <div class="col-span-2">
        <label class="text-gray-700 text-sm font-medium mb-1">Organisation</label>
        <select
          v-model="form.organisation_id"
          class="w-full border p-2 rounded bg-transparent text-sm"
          required
        >
          <option value="" disabled>Sélectionner</option>
          <option v-for="org in organisations" :key="org.uuid" :value="org.uuid">
            {{ org.name }}
          </option>
        </select>
      </div>

      <!-- Bouton submit -->
      <div class="col-span-2">
        <button
          type="submit"
          class="w-full bg-[#10b481] hover:bg-[#0da06a] transition-colors py-3 rounded text-white text-sm flex justify-center items-center gap-2"
        >
          Créer
        </button>
      </div>
    </form>

    <!-- Messages -->
    <p v-if="successMessage" class="mt-4 text-green-600">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="mt-4 text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>

  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { API_URL } from "~/config";
  
  definePageMeta({ layout: "dashboard" });
  
  const router = useRouter();
  
  const form = ref<{
  name: string
  type: string
  period_start: string
  period_end: string
  status: string
  organisation_id: string
}>({
  name: "",
  type: "",
  period_start: "",
  period_end: "",
  status: "DRAFT",
  organisation_id: "",
})

  
  const organisations = ref<any[]>([]);
  const successMessage = ref("");
  const errorMessage = ref("");
  
  /* =========================
     FETCH ORGANISATIONS
  ========================= */
  const fetchOrganisations = async () => {
    try {
      const token = sessionStorage.getItem("token") || "";
      const res = await fetch(`${API_URL}/api/groups/organisations/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("Erreur chargement organisations");
  
      organisations.value = await res.json();
    } catch (err) {
      console.error(err);
      errorMessage.value = "Impossible de charger les organisations.";
    }
  };
  
  onMounted(fetchOrganisations);
  
  /* =========================
     CREATE REPORT
  ========================= */
  const createReport = async () => {
    successMessage.value = "";
    errorMessage.value = "";

    console.log("Form:", JSON.stringify(form.value, null, 2));



    if (!form.value.organisation_id) {
    errorMessage.value = "Veuillez sélectionner une organisation."
    return
  }

  console.log("Form envoyé :", JSON.stringify(form.value, null, 2))


  
    try {
      const token = sessionStorage.getItem("token") || "";
  
      const res = await fetch(`${API_URL}/api/suivi-evaluation/reporting/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(form.value),
      });
  
      if (!res.ok) {
        const err = await res.json();
        console.error("Backend error:", err);
        throw err;
      }
  
      successMessage.value = "Report créé avec succès !";
      router.push("/reporting");
    } catch (err: any) {
      errorMessage.value =
        err?.organisation_id?.[0] ||
        "Erreur lors de la création du report.";
    }
  };
  </script>
  