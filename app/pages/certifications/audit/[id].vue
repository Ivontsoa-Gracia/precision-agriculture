<template>
    <section class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-4">
        Audit – {{ audit.cert_type?.name }}
      </h1>
  
      <p><strong>Rapport :</strong> {{ audit.report_detail?.name }}</p>
      <p><strong>Rapport :</strong> {{ audit.report_detail?.type }}</p>
      <p><strong>Rapport :</strong> {{ audit.report_detail?.status }}</p>
      <p><strong>Auditeur :</strong> {{ audit.auditor }}</p>
      <p><strong>Résultat :</strong> {{ audit.result }}</p>
      <p><strong>Date :</strong> {{ audit.date_audit }}</p>
      <p><strong>Remarques :</strong> {{ audit.remarks || "-" }}</p>
  
      <NuxtLink to="/certifications/audit" class="mt-4 inline-block text-blue-600">
        ← Retour
      </NuxtLink>
    </section>
  </template>
  
  <script setup>
  definePageMeta({ layout: "dashboard" })
  import { ref, onMounted } from "vue"
  import { useRoute } from "vue-router"
  import { API_URL } from "~/config"
  
  const route = useRoute()
  const audit = ref({})
  
  onMounted(async () => {
    const token = sessionStorage.getItem("token")
    const res = await fetch(
      `${API_URL}/api/suivi-evaluation/certification-audits/${route.params.id}/`,
      { headers: { Authorization: `Token ${token}` } }
    )
    audit.value = await res.json()
  })
  </script>
  