<template>
  <section class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Créer une évaluation</h1>

    <form @submit.prevent="createEvaluation" class="space-y-5">
      <!-- Type de certification -->
      <div>
        <label class="text-gray-700 text-sm font-medium mb-1">Type de certification </label>
        <select
          v-model="form.cert_type"
          required
          class="w-full bg-transparent border p-2 rounded focus:ring-[#212121] text-sm text-800"
        >
          <option value="" disabled>Choisir un type</option>
          <option v-for="type in certTypes" :key="type.uuid" :value="type.uuid">
            {{ type.name }}
          </option>
        </select>
      </div>

      <!-- Émis par -->
      <div>
        <label class="text-gray-700 text-sm font-medium mb-1">Émis par </label>
        <input
          v-model="form.issued_by"
          type="text"
          required
          placeholder="Ex : Ministère, Organisme..."
          class="w-full bg-transparent border p-2 rounded focus:ring-[#212121] text-sm text-800"
        />
      </div>

      <!-- Fichier -->
      <div>
        <label
          class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition"
        >
          <i class="bx bx-upload text-6xl mb-3 text-gray-300"></i>

          <span class="text-sm font-medium text-gray-700 mb-2">
            Cliquez ou glissez-déposez votre fichier
          </span>

          <span v-if="fileName" class="text-sm text-blue-500 mb-2">
            {{ fileName }}
          </span>

          <input
            type="file"
            required
            @change="handleFileUpload"
            class="hidden"
          />
        </label>
      </div>

      <!-- Dates en 2 colonnes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-gray-700 text-sm font-medium mb-1">Date d’émission </label>
          <input
            v-model="form.issued_at"
            type="date"
            required
            class="w-full bg-transparent border p-2 rounded focus:ring-[#212121] text-sm text-800"
          />
        </div>
        <div>
          <label class="text-gray-700 text-sm font-medium mb-1">Date d’expiration </label>
          <input
            v-model="form.expires_at"
            type="date"
            required
            class="w-full bg-transparent border p-2 rounded focus:ring-[#212121] text-sm text-800"
          />
        </div>
      </div>

      <!-- Statut -->
      <div>
        <label class="text-gray-700 text-sm font-medium mb-1">Statut </label>
        <select
          v-model="form.status"
          required
          class="w-full bg-transparent border p-2 rounded focus:ring-[#212121] text-sm text-800"
        >
          <option value="VALID">VALID</option>
          <option value="EXPIRED">EXPIRED</option>
          <option value="REVOKED">REVOKED</option>
          <option value="PENDING">PENDING</option>
        </select>
      </div>

      <!-- Bouton -->
      <div class="flex gap-3 items-center mt-4">
        <button type="submit" class="w-full bg-[#10b481] hover:bg-[#0da06a] transition-colors py-3 rounded text-white text-sm flex justify-center items-center gap-2">
          Créer
        </button>
        <p v-if="success" class="text-green-600 font-medium">{{ success }}</p>
        <p v-if="error" class="text-red-600 font-medium">{{ error }}</p>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";

const router = useRouter();

const form = ref({
  cert_type: "",
  issued_by: "",
  issued_at: "",
  expires_at: "",
  status: "VALID",
  file: null as File | null,
});

const fileName = ref("");
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const certTypes = ref<any[]>([]);

// Gestion du fichier
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    form.value.file = target.files[0];
    fileName.value = target.files[0].name;
  }
};

// Récupération des types de certification
const fetchCertTypes = async () => {
  const token = sessionStorage.getItem("token") || "";
  const res = await fetch(`${API_URL}/api/suivi-evaluation/certification-types/`, {
    headers: { Authorization: `Token ${token}` },
  });
  certTypes.value = await res.json();
};

// Création de l’évaluation
const createEvaluation = async () => {
  error.value = null;
  success.value = null;

  try {
    const token = sessionStorage.getItem("token") || "";
    const formData = new FormData();

    formData.append("cert_type", form.value.cert_type);
    formData.append("issued_by", form.value.issued_by);
    formData.append("issued_at", form.value.issued_at);
    formData.append("expires_at", form.value.expires_at);
    formData.append("status", form.value.status);

    if (form.value.file) formData.append("file", form.value.file);

    const res = await fetch(`${API_URL}/api/suivi-evaluation/evaluation/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));

    success.value = "Évaluation créée avec succès !";
    setTimeout(() => router.push("/certifications/evaluation"), 1000);
  } catch (err: any) {
    error.value = err.message;
  }
};

onMounted(fetchCertTypes);
</script>
