<template>
  <div class="p-6 flex justify-center items-start">
    <div class="w-full max-w-5xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 mt-2">
      
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <i class="bx bx-show text-4xl text-[#10b481] animate-pulse"></i>
        <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight relative">
          Task Details
          <span class="block w-24 h-1 bg-gradient-to-r from-[#10b481] to-[#0a8f6e] rounded-full mt-1"></span>
        </h2>
      </div>

      <!-- Task Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem label="Task Name" :value="task.name"/>
        <DetailItem label="Due Date" :value="task.due_date"/>
        <DetailItem label="Parcel Crop" :value="task.parcelCropFull || '-'"/>
        <DetailItem label="Created At" :value="task.created_at"/>
        <DetailItem label="Updated At" :value="task.updated_at"/>
        <DetailItem label="Completed At" :value="task.completed_at || '-'"/>

        <div class="col-span-1 md:col-span-2 flex flex-col gap-1">
          <span class="font-semibold text-[#212121]">Description</span>
          <p class="mt-1 text-gray-700 bg-gray-50 p-4 rounded-md border">{{ task.description }}</p>
        </div>

        <!-- Priority Badge -->
        <div class="flex flex-col gap-1">
          <span class="font-semibold text-[#212121]">Priority</span>
          <span
            :class="[
              'px-4 py-1 rounded-full text-md font-medium w-max text-center border',
              priorityName === 'Low' ? 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]/50' :
              priorityName === 'Medium' ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]/50' :
              priorityName === 'High' ? 'bg-[#e63946]/10 text-[#e63946] border-[#e63946]/50' : 'bg-gray-400'
            ]"
          >
            {{ priorityName || '-' }}
          </span>
        </div>

        <!-- Status Badge -->
        <div class="flex flex-col gap-1">
          <span class="font-semibold text-[#212121]">Status</span>
          <span
            :class="[
              'px-4 py-1 rounded-full text-md font-medium w-max text-center border',
              statusName === 'Pending' ? 'bg-[#f4a261]/10 text-[#f4a261] border-[#f4a261]/50' :
              statusName === 'In Progress' ? 'bg-[#219ebc]/10 text-[#219ebc] border-[#219ebc]/50' :
              statusName === 'Done' ? 'bg-[#10b481]/10 text-[#10b481] border-[#10b481]/50' :
              statusName === 'Cancelled' ? 'bg-gary-10 text-gary border-gary-500' : 'bg-gray-100'
            ]"
          >
            {{ statusName || '-' }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-10 flex justify-end gap-4">
        <button @click="editTask"
          class="px-6 py-3 bg-gradient-to-r from-[#10b481] to-[#0a8f6e] text-white rounded-2xl font-bold shadow-md hover:shadow-xl hover:scale-105 transition transform">
          <i class="bx bx-edit-alt"></i> Edit
        </button>

        <button @click="goBack"
          class="px-6 py-3 bg-gray-50 text-gray-800 rounded-2xl font-semibold shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">
          <i class="bx bx-arrow-back"></i> Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { API_URL } from '~/config'
import DetailItem from '~/components/DetailItem.vue'

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const task = ref<any>({})
const priorityName = ref<string>('')
const statusName = ref<string>('')

onMounted(async () => {
  const token = sessionStorage.getItem('token')
  if (!token) { router.push('/login'); return }

  try {
    // Get task details
    const resTask = await fetch(`${API_URL}/api/tasks/${id}/`, { headers: { Authorization: `Token ${token}` } })
    task.value = await resTask.json()

    // 2️⃣ Récupérer le parcelCrop complet + parcel si existe
    if (task.value.parcelCrop) {
      try {
        // ParcelCrop
        const resParcelCrop = await fetch(
          `${API_URL}/api/parcel-crops/${task.value.parcelCrop}/`,
          { headers: { Authorization: `Token ${token}` } }
        )
        const parcelCropData = await resParcelCrop.json()

        // Parcel
        const resParcel = await fetch(
          `${API_URL}/api/parcels/${parcelCropData.parcel}/`,
          { headers: { Authorization: `Token ${token}` } }
        )
        const parcelData = await resParcel.json()

        // Stocker la combinaison parcel name - crop name
        task.value.parcelCropFull = `${parcelData.parcel_name} - ${parcelCropData.crop.name}`
      } catch (err) {
        console.error("Parcel/ParcelCrop fetch error:", err)
        task.value.parcelCropFull = '-'
      }
    } else {
      task.value.parcelCropFull = '-'
    }

    // Get priority name
    if (task.value.priority) {
      const resPriority = await fetch(`${API_URL}/api/task-priority/${task.value.priority}/`, { headers: { Authorization: `Token ${token}` } })
      const dataPriority = await resPriority.json()
      priorityName.value = dataPriority.name
    }

    // Get status name
    if (task.value.status) {
      const resStatus = await fetch(`${API_URL}/api/task-status/${task.value.status}/`, { headers: { Authorization: `Token ${token}` } })
      const dataStatus = await resStatus.json()
      statusName.value = dataStatus.name
    }

  } catch (err) {
    console.error(err)
    alert("Failed to load task details")
  }
})

const goBack = () => router.push('/tasks')
const editTask = () => router.push(`/tasks/edit/${id}`)
</script>

<style scoped>
@keyframes gradient-slide {
  0% { background-position: 0% }
  50% { background-position: 100% }
  100% { background-position: 0% }
}
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-slide 3s ease infinite;
}
</style>
