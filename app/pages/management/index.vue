<template>
    <div class="p-1 sm:p-6 mb-10 sm:mb-1">
      <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2">
        <i class="bx bx-data text-3xl text-[#10b481]"></i>
        Data Management
      </h2>
  
      <!-- Onglets -->
      <div class="border-b border-gray-200 flex items-center justify-between mb-6">
        <nav class="flex space-x-8">
          <a
            href="#"
            @click.prevent="activeTab = 'rapport'"
            :class="[
              'border-b-2 py-4 px-1 font-medium text-sm',
              activeTab === 'rapport'
                ? 'text-[#10b481] border-[#10b481]'
                : 'border-transparent text-gray-500 hover:text-[#10b481] hover:border-[#10b481]',
            ]"
          >
            Rapport de certification
          </a>
          <a
            href="#"
            @click.prevent="activeTab = 'historique'"
            :class="[
              'border-b-2 py-4 px-1 font-medium text-sm',
              activeTab === 'historique'
                ? 'text-[#10b481] border-[#10b481]'
                : 'border-transparent text-gray-500 hover:text-[#10b481] hover:border-[#10b481]',
            ]"
          >
            Historique des changements
          </a>
        </nav>
      </div>
  
      <!-- Tableau Rapport de certification -->
      <div
        v-if="activeTab === 'rapport'"
        class="overflow-x-auto bg-white rounded-xl shadow p-4"
      >
        <table class="min-w-[900px] w-full text-left border-collapse">
          <thead class="bg-gray-100 text-sm text-gray-700 uppercase">
            <tr>
              <th class="px-6 py-3 border-b">Type de donnée</th>
              <th class="px-6 py-3 border-b">Nom / Identifiant</th>
              <th class="px-6 py-3 border-b">Détails</th>
              <th class="px-6 py-3 border-b">Dernière mise à jour</th>
              <th class="px-6 py-3 border-b text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in rapportData"
              :key="item.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-3 border-b font-medium text-gray-800">
                {{ item.type }}
              </td>
              <td class="px-6 py-3 border-b">{{ item.identifiant }}</td>
              <td class="px-6 py-3 border-b">{{ item.details }}</td>
              <td class="px-6 py-3 border-b">{{ item.date }}</td>
              <td class="px-6 py-3 border-b text-center">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium border',
                    item.status === 'Actif'
                      ? 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]/50'
                      : item.status.includes('Cultivée')
                      ? 'bg-[#8ecae6]/10 text-[#219ebc] border-[#219ebc]/30'
                      : item.status.includes('En cours')
                      ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]/40'
                      : item.status.includes('En attente')
                      ? 'bg-[#f9c74f]/10 text-[#f9c74f] border-[#f9c74f]/40'
                      : 'bg-gray-200 text-gray-700 border-gray-300',
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div
        v-if="activeTab === 'historique'"
        class="overflow-x-auto bg-white rounded-xl shadow"
      >
        <table class="min-w-[950px] w-full text-left border-collapse">
          <thead class="bg-gray-100 text-sm text-gray-700 uppercase">
            <tr>
              <th class="px-6 py-3 border-b">Date / Heure</th>
              <th class="px-6 py-3 border-b">Utilisateur</th>
              <th class="px-6 py-3 border-b">Élément modifié</th>
              <th class="px-6 py-3 border-b">Action</th>
              <th class="px-6 py-3 border-b">Ancienne valeur</th>
              <th class="px-6 py-3 border-b">Nouvelle valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in historiqueData"
              :key="log.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-3 border-b">{{ log.date }}</td>
              <td class="px-6 py-3 border-b">{{ log.user }}</td>
              <td class="px-6 py-3 border-b">{{ log.element }}</td>
              <td class="px-6 py-3 border-b">{{ log.action }}</td>
              <td class="px-6 py-3 border-b">
                {{ log.old || '—' }}
              </td>
              <td class="px-6 py-3 border-b">
                {{ log.new || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({ layout: "dashboard" });
  import { ref } from "vue";
  
  const activeTab = ref("rapport");
  
  const rapportData = ref([
    {
      id: 1,
      type: "Producteur",
      identifiant: "PROD-0245 — Rakoto Jean",
      details: "Membre coopérative “SoaLandy”, 5 parcelles",
      date: "2025-09-20",
      status: "Actif",
    },
    {
      id: 2,
      type: "Parcelle",
      identifiant: "PARC-0789 — Ambatomena",
      details: "Superficie : 2.4 ha — Maïs",
      date: "2025-09-21",
      status: "Cultivée",
    },
    {
      id: 3,
      type: "Activité",
      identifiant: "ACT-0034 — Fertilisation",
      details: "Azote + Compost, dose : 50 kg/ha",
      date: "2025-09-23",
      status: "En cours",
    },
    {
      id: 4,
      type: "Rendement",
      identifiant: "REND-2025-045 — Rakoto Jean",
      details: "3.8 t/ha — Comparé à 3.2 t/ha en 2024",
      date: "2025-09-25",
      status: "En hausse",
    },
    {
      id: 5,
      type: "Certification",
      identifiant: "CERT-0012 — Fairtrade",
      details: "Audit prévu le 2025-10-15",
      date: "2025-09-26",
      status: "En attente d’audit",
    },
  ]);
  
  const historiqueData = ref([
    {
      id: 1,
      date: "2025-09-23 10:45",
      user: "AdminKoto",
      element: "Rendement (REND-2025-045)",
      action: "Modification",
      old: "3.2 t/ha",
      new: "3.8 t/ha",
    },
    {
      id: 2,
      date: "2025-09-23 11:10",
      user: "DataAgentMina",
      element: "Parcelle (PARC-0789)",
      action: "Mise à jour",
      old: "2.1 ha",
      new: "2.4 ha",
    },
    {
      id: 3,
      date: "2025-09-24 09:30",
      user: "AdminKoto",
      element: "Activité (ACT-0034)",
      action: "Validation",
      old: "En attente",
      new: "En cours",
    },
    {
      id: 4,
      date: "2025-09-25 15:00",
      user: "AuditeurJules",
      element: "Certification (CERT-0012)",
      action: "Ajout document",
      old: "—",
      new: "AuditChecklist_v2.pdf",
    },
  ]);
  </script>
  
  <style scoped>
  table {
    border-spacing: 0;
  }
  th,
  td {
    white-space: nowrap;
  }
  </style>
  