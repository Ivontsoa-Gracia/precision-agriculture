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
        <DetailItem label="Parcel Crop" :value="task.parcelCrop || '-'"/>
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
              'px-4 py-1 rounded-full font-semibold text-white w-max text-center animate-pulse',
              priorityName === 'Low' ? 'bg-green-500' :
              priorityName === 'Medium' ? 'bg-[#f4a261]' :
              priorityName === 'High' ? 'bg-red-500' : 'bg-gray-400'
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
              'px-4 py-1 rounded-full font-semibold text-transparent bg-clip-text w-max text-center animate-gradient',
              statusName === 'Pending' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              statusName === 'In Progress' ? 'bg-[#f4a261]' :
              statusName === 'Done' ? 'bg-gradient-to-r from-green-400 to-green-600' :
              statusName === 'Cancelled' ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gray-400'
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
    const resTask = await fetch(`https://mvp-dvws.onrender.com/api/tasks/${id}/`, { headers: { Authorization: `Token ${token}` } })
    task.value = await resTask.json()

    // Get priority name
    if (task.value.priority) {
      const resPriority = await fetch(`https://mvp-dvws.onrender.com/api/task-priority/${task.value.priority}/`, { headers: { Authorization: `Token ${token}` } })
      const dataPriority = await resPriority.json()
      priorityName.value = dataPriority.name
    }

    // Get status name
    if (task.value.status) {
      const resStatus = await fetch(`https://mvp-dvws.onrender.com/api/task-status/${task.value.status}/`, { headers: { Authorization: `Token ${token}` } })
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
