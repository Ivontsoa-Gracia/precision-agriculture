<template>
    <section class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Audits de certification</h1>
        <NuxtLink
          to="/certifications/audit/create"
          class="bg-[#10b481] text-white px-4 py-2 rounded"
        >
          + Nouvel audit
        </NuxtLink>
      </div>
  
      <div class="bg-white rounded shadow overflow-x-auto">
        <table class="min-w-[800px] w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="th">Certification</th>
              <th class="th">Rapport</th>
              <th class="th">Auditeur</th>
              <th class="th">Résultat</th>
              <th class="th">Date</th>
              <th class="th">Actions</th>
            </tr>
          </thead>
  
          <tbody>
            <tr v-for="audit in audits" :key="audit.uuid" class="border-t">
              <td class="td">{{ audit.cert_type_detail?.name }}</td>
              <td class="td">{{ audit.report_detail?.name }}</td>
              <td class="td">{{ audit.auditor }}</td>
              <td class="td">{{ audit.result }}</td>
              <td class="td">{{ audit.date_audit }}</td>
              <td class="px-6 py-2 border-b text-center flex justify-center gap-1">
                <NuxtLink
                  :to="`/certifications/audit/${audit.uuid}`"
                  class="p-2 px-4 rounded hover:bg-[#10b481]/10"
                >
                  <i class="bx bx-show text-[#10b481] text-xl"></i>
                </NuxtLink>

                <NuxtLink
                  :to="`/certifications/audit/edit/${audit.uuid}`"
                  class="p-2 px-4 rounded hover:bg-[#f4a261]/10"
                >
                  <i class="bx bx-edit text-[#f4a261] text-xl"></i>
                </NuxtLink>
                <button
                  @click="deleteAudit(audit.uuid)"
                  class="p-2 px-4 rounded hover:bg-[#e63946]/10"
                >
                  <i class="bx bx-trash text-[#e63946] text-xl"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </template>
  
  <script setup>
  definePageMeta({ layout: "dashboard" })
  import { ref, onMounted } from "vue"
  import { API_URL } from "~/config"
  
  const audits = ref([])
  
  const fetchAudits = async () => {
    const token = sessionStorage.getItem("token")
    const res = await fetch(`${API_URL}/api/suivi-evaluation/certification-audits/`, {
      headers: { Authorization: `Token ${token}` },
    })
    audits.value = await res.json()
  }
  
  const deleteAudit = async (uuid) => {
    if (!confirm("Supprimer cet audit ?")) return
    const token = sessionStorage.getItem("token")
    await fetch(`${API_URL}/api/suivi-evaluation/certification-audits/${uuid}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    })
    fetchAudits()
  }
  
  onMounted(fetchAudits)
  </script>
  
  <style scoped>
  .th { padding: 10px; }
  .td { padding: 10px; }
  </style>
  