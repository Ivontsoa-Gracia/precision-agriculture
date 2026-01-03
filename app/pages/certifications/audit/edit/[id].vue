<template>
    <section class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Éditer l’audit</h1>
  
      <form @submit.prevent="updateAudit" class="space-y-4">
        <!-- Type de certification -->
        <div>
          <label class="block mb-1">Type de certification *</label>
          <select v-model="form.cert_type" required class="input">
            <option disabled value="">Choisir un type</option>
            <option v-for="c in certTypes" :key="c.uuid" :value="c.uuid">
              {{ c.name }}
            </option>
          </select>
        </div>
  
        <!-- Rapport -->
        <div>
          <label class="block mb-1">Rapport *</label>
          <select v-model="form.report" required class="input">
            <option disabled value="">Choisir un rapport</option>
            <option v-for="r in reports" :key="r.uuid" :value="r.uuid">
              {{ r.name }}
            </option>
          </select>
        </div>
  
        <!-- Auditeur -->
        <div>
          <label class="block mb-1">Auditeur *</label>
          <input
            v-model="form.auditor"
            type="text"
            required
            class="input"
          />
        </div>
  
        <!-- Résultat -->
        <div>
          <label class="block mb-1">Résultat *</label>
          <select v-model="form.result" required class="input">
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
            <option value="CONDITIONAL">CONDITIONAL</option>
          </select>
        </div>
  
        <!-- Date audit -->
        <div>
          <label class="block mb-1">Date de l’audit *</label>
          <input
            v-model="form.date_audit"
            type="date"
            required
            class="input"
          />
        </div>
  
        <!-- Remarques -->
        <div>
          <label class="block mb-1">Remarques</label>
          <textarea
            v-model="form.remarks"
            rows="3"
            class="input"
          />
        </div>
  
        <!-- Actions -->
        <div class="flex gap-3">
          <button
            type="submit"
            class="bg-[#10b481] text-white px-4 py-2 rounded"
          >
            Sauvegarder
          </button>
  
          <NuxtLink
            to="/certifications/audit"
            class="bg-gray-200 px-4 py-2 rounded"
          >
            Annuler
          </NuxtLink>
        </div>
  
        <p v-if="error" class="text-red-600">{{ error }}</p>
        <p v-if="success" class="text-green-600">{{ success }}</p>
      </form>
    </section>
  </template>
  
  <script setup>
  definePageMeta({ layout: "dashboard" })
  
  import { ref, onMounted } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { API_URL } from "~/config"
  
  const route = useRoute()
  const router = useRouter()
  
  const form = ref({
    cert_type: "",
    report: "",
    auditor: "",
    result: "PASS",
    date_audit: "",
    remarks: "",
  })
  
  const certTypes = ref([])
  const reports = ref([])
  const error = ref(null)
  const success = ref(null)
  
  const token = sessionStorage.getItem("token") || ""
  
  /* Charger listes + audit */
  const loadData = async () => {
    const [certRes, reportRes, auditRes] = await Promise.all([
      fetch(`${API_URL}/api/suivi-evaluation/certification-types/`, {
        headers: { Authorization: `Token ${token}` },
      }),
      fetch(`${API_URL}/api/suivi-evaluation/reporting/`, {
        headers: { Authorization: `Token ${token}` },
      }),
      fetch(
        `${API_URL}/api/suivi-evaluation/certification-audits/${route.params.id}/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      ),
    ])
  
    certTypes.value = await certRes.json()
    reports.value = await reportRes.json()
  
    const audit = await auditRes.json()
  
    // Pré-remplissage
    form.value = {
      cert_type: audit.cert_type?.uuid,
      report: audit.report?.uuid,
      auditor: audit.auditor,
      result: audit.result,
      date_audit: audit.date_audit,
      remarks: audit.remarks || "",
    }
  }
  
  /* Update */
  const updateAudit = async () => {
    error.value = null
    success.value = null
  
    const res = await fetch(
      `${API_URL}/api/suivi-evaluation/certification-audits/${route.params.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(form.value),
      }
    )
  
    if (!res.ok) {
      error.value = "Erreur lors de la mise à jour de l’audit"
      return
    }
  
    success.value = "Audit mis à jour avec succès"
    setTimeout(() => {
      router.push(`/certifications/audit/${route.params.id}`)
    }, 800)
  }
  
  onMounted(loadData)
  </script>
  
  <style scoped>
  .input {
    width: 100%;
    border: 1px solid #d1d5db;
    padding: 8px;
    border-radius: 6px;
  }
  </style>
  