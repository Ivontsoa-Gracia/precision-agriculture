<template>
  <section class="mx-auto p-6">
    <div class="flex flex-col md:flex-row gap-16">
      <!-- Infos à gauche -->
      <div class="flex-1 space-y-4">
        <div class="w-full">
          <div class="flex items-center justify-between mb-6">
            <h2
              class="text-2xl font-bold text-gray-800 flex items-center gap-3"
            >
              certification detail
            </h2>
            <button
              @click="goToEdit(evaluation.uuid)"
              class="text-[#222831] hover:text-[#10b481] text-2xl flex items-center"
              title="Edit"
            >
              <i class="bx bx-edit-alt"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              class="border border-gray-100 p-4 text-sm rounded flex items-center gap-3"
            >
              <div>
                <p class="uppercase tracking-wide text-gray-500">
                  Certification
                </p>
                <p class="font-medium text-gray-800">
                  {{ evaluation.cert_type_detail?.name }}
                </p>
              </div>
            </div>

            <div
              class="border border-gray-100 text-sm p-4 rounded flex items-center gap-3"
            >
              <div>
                <p class="uppercase tracking-wide text-gray-500 text-sm mb-2">
                  Status
                </p>
                <p class="font-medium text-gray-800">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium border',
                      evaluation.status === 'VALID'
                        ? 'text-green-700 border-green-700 bg-green-100'
                        : evaluation.status === 'EXPIRED'
                        ? 'text-red-700 border-red-700 bg-red-100'
                        : evaluation.status === 'REVOKED'
                        ? 'text-yellow-700 border-yellow-700 bg-yellow-100'
                        : evaluation.status === 'PENDING'
                        ? 'text-blue-700 border-blue-700 bg-blue-100'
                        : '',
                    ]"
                  >
                    {{ formatStatus(evaluation.status) }}
                  </span>
                </p>
              </div>
            </div>

            <div
              class="border border-gray-100 p-4 text-sm rounded flex items-center gap-3"
            >
              <div>
                <p class="uppercase tracking-wide text-gray-500">Emis par</p>
                <p class="font-medium text-gray-800">
                  {{ evaluation.issued_by }}
                </p>
              </div>
            </div>

            <div
              class="border border-gray-100 text-sm p-4 rounded flex items-center gap-3"
            >
              <div>
                <p class="uppercase tracking-wide text-gray-500 text-sm">
                  Date de creation
                </p>
                <p class="font-medium text-gray-800">
                  {{ formatDate(evaluation.created_at) }}
                </p>
              </div>
            </div>

            <div
              class="border border-gray-100 text-sm p-4 rounded flex items-center gap-3"
            >
              <div>
                <p class="uppercase tracking-wide text-gray-500">
                  Date d'emission
                </p>
                <p class="font-medium text-gray-800">
                  {{ formatDate(evaluation.issued_at) }}
                </p>
              </div>
            </div>

            <div
              class="border border-gray-100 text-sm p-4 rounded flex items-center gap-3"
            >
              <div>
                <p class="uppercase tracking-wide text-gray-500 text-sm">
                  Date d'expiration
                </p>
                <p class="font-medium text-gray-800">
                  {{ formatDate(evaluation.expires_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aperçu fichier à droite -->
      <div class="flex-1 flex flex-col items-center justify-start gap-4">
  <!-- En-tête avec titre et bouton download -->
  <div class="flex items-center justify-between w-full mb-4">
    <h2 class="font-medium text-gray-700 text-sm">Fichier associé</h2>
    <a
      :href="evaluation.file_url"
      download
      class="flex items-center gap-2 text-[#10b481] text-sm font-medium hover:text-[#0da06a] transition"
      title="Télécharger le fichier"
    >
      <i class="bx bx-download text-lg"></i>
      Télécharger
    </a>
  </div>

  <!-- Aperçu du fichier -->
  <div
    class="w-full h-64 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded bg-gray-50 shadow-sm transition"
  >
    <template v-if="isImage(evaluation.file_url)">
      <img
        :src="evaluation.file_url"
        class="max-h-56 object-contain rounded-lg shadow-md transition-transform hover:scale-105"
      />
    </template>
    <template v-else>
      <i class="bx bx-file text-7xl text-gray-400 mb-3"></i>
      <span class="text-gray-800 font-medium text-center">
        {{ evaluation.file_name || "Fichier PDF" }}
      </span>
      <a
        :href="evaluation.file_url"
        target="_blank"
        class="mt-3 px-6 py-2 bg-[#10b481] text-white rounded hover:bg-[#0da06a] transition"
      >
        Ouvrir
      </a>
    </template>
  </div>
</div>

    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
import { ref, onMounted } from "vue";
import { API_URL } from "~/config";
import { useRoute, useRouter } from "vue-router";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;
const currentLocale = computed(() => languageStore.lang);

const route = useRoute();
const router = useRouter();
const evaluation = ref<any>({});

// Vérifie si le fichier est une image
const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

// Vérifie si le fichier est un PDF
const isPDF = (url: string) => /\.pdf$/i.test(url);

const fetchEvaluation = async () => {
  const token = sessionStorage.getItem("token") || "";
  const res = await fetch(
    `${API_URL}/api/suivi-evaluation/evaluation/${route.params.id}/`,
    {
      headers: { Authorization: `Token ${token}` },
    }
  );
  const data = await res.json();

  evaluation.value = data;
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(languageStore.lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const goToEdit = (id: number) => {
  router.push(`/certifications/evaluation/edit/${id}`);
};

const formatStatus = (status: string | undefined) => {
  if (!status) return "-";
  return status.charAt(0) + status.slice(1).toLowerCase();
};

onMounted(fetchEvaluation);
</script>
