<template>
    <section class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Nouvel audit</h1>
  
      <form @submit.prevent="createAudit" class="space-y-4">
        <select v-model="form.cert_type" required class="input">
          <option disabled value="">Type de certification</option>
          <option v-for="c in certTypes" :key="c.uuid" :value="c.uuid">
            {{ c.name }}
          </option>
        </select>
  
        <select v-model="form.report" required class="input">
          <option disabled value="">Rapport</option>
          <option v-for="r in reports" :key="r.uuid" :value="r.uuid">
            {{ r.name }}
          </option>
        </select>
  
        <input v-model="form.auditor" placeholder="Auditeur" class="input" required />
  
        <select v-model="form.result" class="input" required>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
          <option value="PENDING">PENDING</option>
        </select>
  
        <input type="date" v-model="form.date_audit" class="input" required />
  
        <textarea v-model="form.remarks" class="input" placeholder="Remarques"></textarea>
  
        <button class="bg-[#10b481] text-white px-4 py-2 rounded">
          Créer
        </button>
  
        <p v-if="error" class="text-red-600">{{ error }}</p>
      </form>
    </section>
  </template>
  
  <script setup>
  definePageMeta({ layout: "dashboard" })
  import { ref, onMounted } from "vue"
  import { useRouter } from "vue-router"
  import { API_URL } from "~/config"
  
  const router = useRouter()
  const form = ref({
  cert_type: null,
  report: null,
  auditor: "",
  result: "PASS",
  date_audit: "",
  remarks: "",
})

  
  const certTypes = ref([])
  const reports = ref([])
  const error = ref(null)
  
  const token = sessionStorage.getItem("token")
  
  const loadData = async () => {
    certTypes.value = await fetch(`${API_URL}/api/suivi-evaluation/certification-types/`, {
      headers: { Authorization: `Token ${token}` },
    }).then(r => r.json())
  
    reports.value = await fetch(`${API_URL}/api/suivi-evaluation/reporting/`, {
      headers: { Authorization: `Token ${token}` },
    }).then(r => r.json())
  }
  
  const createAudit = async () => {
  error.value = null

  // sécurité front
  if (!form.value.cert_type || !form.value.report) {
    error.value = "Veuillez sélectionner un type de certification et un rapport."
    return
  }

  console.log("AUDIT PAYLOAD →", form.value)

  try {
    const res = await fetch(
      `${API_URL}/api/suivi-evaluation/certification-audits/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(form.value),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error("Erreur API audit :", data)
      error.value = JSON.stringify(data, null, 2)
      return
    }

    router.push("/certifications/audit")
  } catch (err) {
    error.value = err.message
  }
}


  
  onMounted(loadData)
  </script>
  
  <style scoped>
  .input {
    width: 100%;
    border: 1px solid #ddd;
    padding: 8px;
    border-radius: 6px;
  }
  </style>
  