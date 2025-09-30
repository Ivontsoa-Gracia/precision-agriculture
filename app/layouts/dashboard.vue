<template>
  <div class="h-screen font-sans bg-[#fafafa] flex flex-col">

    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-20 
                  bg-[#fafafa] backdrop-blur-md">
      
      <!-- Logo + Titre -->
      <div class="flex items-center space-x-4 -ml-4">
        <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#222831] to-[#3a3f47] 
                    flex items-center justify-center shadow-lg">
          <img src="/icons/logo-smartsaha_HD.svg" alt="Logo" class="h-10 w-10 invert brightness-0"/>
        </div>
        <div class="flex flex-col text-left">
          <h1 class="text-xl font-extrabold text-[#222831] tracking-tight">SmartSaha</h1>
          <p class="text-sm text-gray-500">Nurture data. Harvest impact</p>
        </div>
      </div>

      <!-- Navigation droite -->
      <div class="flex items-center space-x-6 -mr-4">
        <NuxtLink 
          to="/assistant" 
          class="flex items-center gap-3 text-gray-800 hover:text-[#10b481] transition-colors duration-300 font-medium text-sm tracking-wide"
        >
          <i class='bx bx-brain bx-sm text-gray-700'></i>
          <span class="hidden sm:inline">Agronomist IA</span>
        </NuxtLink>

        <NuxtLink 
          to="/contact" 
          class="flex items-center gap-3 text-gray-800 hover:text-[#10b481] transition-colors duration-300 font-medium text-sm tracking-wide"
        >
          <i class='bx bx-envelope bx-sm text-gray-700'></i>
          <span class="hidden sm:inline">Contact</span>
        </NuxtLink>


        <!-- User card -->
        <div class="flex items-center bg-white/80 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-sm border border-gray-100">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-[#f4a261] to-[#f4a261] 
                      flex items-center justify-center shadow">
            <i class='bx-light bx bx-user text-white text-lg'></i>
          </div>
          <div class="ml-3 text-left">
            <p class="font-semibold text-[#222831] text-sm leading-tight">{{ user?.username }}</p>
            <p class="text-xs text-gray-500">{{ user?.email }}</p>
          </div>
        </div>
      </div>
    </header>


    <div class="flex flex-1 pt-16">
      <!-- Sidebar -->
      <aside
        class="peer group  fixed top-20 left-0 h-[calc(100vh-4rem)] 
             flex flex-col justify-between bg-[#222831] shadow-lg 
             w-20 hover:w-56 transition-all duration-300"
      >
        <nav class="flex flex-col space-y-2 py-4">
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-3 px-4 py-3 hover:bg-[#10b481]/20 rounded-lg transition"
            active-class="bg-[#10b481]/40 rounded-full text-black"
          >
            <i class="bx-light bx bx-grid-alt text-3xl text-white ml-2 "></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/parcels"
            class="flex items-center gap-3 px-4 py-3 hover:bg-[#10b481]/20 rounded-lg transition"
            active-class="bg-[#10b481]/40"
          >
            <i class="bx-light bx bx-map text-3xl text-white ml-2"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">Parcels</span>
          </NuxtLink>

          <NuxtLink
            to="/tasks"
            class="flex items-center gap-3 px-4 py-3 hover:bg-[#10b481]/20 rounded-lg transition"
            active-class="bg-[#10b481]/40"
          >
            <i class="bx-light bx bx-task text-3xl text-white ml-2"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">Tasks</span>
          </NuxtLink>

          <NuxtLink
            to="/yield-records"
            class="flex items-center gap-3 px-4 py-3 hover:bg-[#10b481]/20 rounded-lg transition"
            active-class="bg-[#10b481]/40"
          >
            <i class="bx-light bx bx-bar-chart text-3xl text-white ml-2"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">Yields</span>
          </NuxtLink>

          <NuxtLink
            to="/parcel-crops"
            class="flex items-center gap-3 px-4 py-3 hover:bg-[#10b481]/20 rounded-lg transition"
            active-class="bg-[#10b481]/40"
          >
            <i class="bx-light bx bx-box text-3xl text-white ml-2"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">Crops</span>
          </NuxtLink>
        </nav>

        <!-- Bottom Section -->
        <div class="flex flex-col space-y-2 px-2 py-4 border-t border-gray-600 mb-6">
          <NuxtLink
            to="/help"
            class="flex items-center gap-3 px-3 py-2 hover:bg-[#10b481]/20 rounded-lg transition"
          >
            <i class="bx-light bx bx-help-circle text-3xl text-white"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">Help</span>
          </NuxtLink>

          <button
            @click="logout"
            class="flex items-center gap-3 px-3 py-2 hover:bg-red-500/20 rounded-lg transition"
          >
            <i class="bx-light bx bx-log-out text-3xl text-white"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main
        class="flex-1 p-6 ml-20 transition-all duration-300 peer-hover:ml-56"
      >
        <slot />
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '~/config'

const user = ref<{ username: string; email: string } | null>(null)
const router = useRouter()

onMounted(async () => {
  const uuid = sessionStorage.getItem('uuid')
  const token = sessionStorage.getItem('token')

  if (!uuid || !token) {
    router.push('/login')
    return
  }

  try {
    const response = await fetch(`${API_URL}/api/users/${uuid}/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
    if (!response.ok) throw new Error(`Erreur API: ${response.status}`)
    const data = await response.json()
    user.value = { username: data.username, email: data.email }
  } catch (err) {
    console.error(err)
    router.push('/login')
  }
})

const logout = () => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('uuid')
  router.push('/')
}

</script>

<style scoped>
.group:hover span {
  transition: opacity 0.2s ease-in-out;
}
</style>
