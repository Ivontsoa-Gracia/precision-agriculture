<script setup lang="ts">
definePageMeta({ layout: "dashboard" })

import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { API_URL } from "~/config"

const route = useRoute()
const router = useRouter()

const form = ref({
  name: "",
  description: "",
  org_type: "",
  address: "",
  contact_email: "",
  phone: "",
})

const orgTypes = [
  { label: "Gouvernement", value: "GOVERNMENT" },
  { label: "ONG", value: "NGO" },
  { label: "Privé", value: "PRIVATE" },
  { label: "Coopérative", value: "COOP" },
  { label: "Autre", value: "OTHER" },
]

const fetchOrganisation = async () => {
  const token = sessionStorage.getItem("token") || ""
  const res = await fetch(
    `${API_URL}/api/groups/organisations/${route.params.id}/`,
    { headers: { Authorization: `Token ${token}` } }
  )
  form.value = await res.json()
}

const updateOrganisation = async () => {
  const token = sessionStorage.getItem("token") || ""
  await fetch(
    `${API_URL}/api/groups/organisations/${route.params.id}/`,
    {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    }
  )
  router.push(`/groups/organisations/${route.params.id}`)
}

onMounted(fetchOrganisation)
</script>
