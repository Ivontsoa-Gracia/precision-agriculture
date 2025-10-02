<template>
  <div class="h-screen font-sans bg-[#fafafa] flex flex-col">

    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 h-20 bg-[#fafafa] backdrop-blur-md">
      <!-- Logo -->
      <div class="flex items-center space-x-4">
        <div class="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-[#222831] to-[#3a3f47] flex items-center justify-center shadow-lg">
          <img src="/icons/logo-smartsaha_HD.svg" alt="Logo" class="h-8 w-8 sm:h-10 sm:w-10 invert brightness-0"/>
        </div>
        <div class="hidden sm:flex flex-col text-left">
          <h1 class="text-xl font-extrabold text-[#222831] tracking-tight">SmartSaha</h1>
          <p class="text-sm text-gray-500">{{ t('slogan') }}</p>
        </div>
      </div>

      <!-- Right menu -->
      <div class="flex items-center space-x-2 sm:space-x-6">
        <!-- Mobile menu burger -->
        <button class="sm:hidden p-2 text-gray-800">
          <i class='bx bx-menu text-2xl'></i>
        </button>

        <div class="hidden sm:flex items-center space-x-4">
          <NuxtLink 
            to="/assistant" 
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#10b481]/10 hover:text-[#10b481] transition-all duration-200 font-medium"
          >
            <i class='bx bx-brain text-lg'></i>
            <span>Agronomist IA</span>
          </NuxtLink>

          <NuxtLink 
            to="/contact" 
            class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#10b481]/10 hover:text-[#10b481] transition-all duration-200 font-medium"
          >
            <i class='bx bx-envelope text-lg'></i>
            <span>Contact</span>
          </NuxtLink>
        </div>


        <div class="ml-4 flex items-center gap-2">

          <div class="relative inline-flex bg-gray-100 rounded-xl p-1 px-4 shadow-inner gap-4">
          <!-- Slider animé pour la langue active -->
            <div
              class="absolute top-0 left-0 h-full w-1/2 bg-[#10b481] rounded-xl transition-all duration-300 "
              :style="{ transform: currentLocale.code === 'en' ? 'translateX(0%)' : 'translateX(100%)' }"
            ></div>

            <button
              v-for="(loc, index) in locales"
              :key="loc.code"
              @click="switchLocale(loc.code)"
              class="relative z-10 flex-1 text-center py-2 text-sm font-medium transition-colors duration-200 px-1"
              :class="currentLocale.code === loc.code ? 'text-white' : 'text-gray-700'"
            >
              {{ loc.name }}
            </button>
         </div>
        </div>

        <!-- User -->
        <div class="hidden sm:flex items-center bg-white/80 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-sm border border-gray-100">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-[#f4a261] to-[#f4a261] flex items-center justify-center shadow">
            <i class='bx bx-user text-white'></i>
          </div>
          <div class="ml-3 text-left">
            <p class="font-semibold text-[#222831] text-sm">{{ user?.username }}</p>
            <p class="text-xs text-gray-500">{{ user?.email }}</p>
          </div>
        </div>
      </div>
    </header>


    <div class="flex flex-1 pt-16">
      <!-- Sidebar -->
      <aside
        class="hidden sm:flex peer group  fixed top-20 left-0 h-[calc(100vh-4rem)] 
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
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ t('dashboard') }}</span>
          </NuxtLink>

          <NuxtLink
            to="/parcels"
            class="flex items-center gap-3 px-4 py-3 hover:bg-[#10b481]/20 rounded-lg transition"
            active-class="bg-[#10b481]/40"
          >
            <i class="bx-light bx bx-map text-3xl text-white ml-2"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ t('parcels') }}</span>
          </NuxtLink>

          <NuxtLink
            to="/tasks"
            class="flex items-center gap-3 px-4 py-3 hover:bg-[#10b481]/20 rounded-lg transition"
            active-class="bg-[#10b481]/40"
          >
            <i class="bx-light bx bx-task text-3xl text-white ml-2"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ t('tasks') }}</span>
          </NuxtLink>

          <NuxtLink
            to="/yield-records"
            class="flex items-center gap-3 px-4 py-3 hover:bg-[#10b481]/20 rounded-lg transition"
            active-class="bg-[#10b481]/40"
          >
            <i class="bx-light bx bx-bar-chart text-3xl text-white ml-2"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ t('yields') }}</span>
          </NuxtLink>

          <NuxtLink
            to="/parcel-crops"
            class="flex items-center gap-3 px-4 py-3 hover:bg-[#10b481]/20 rounded-lg transition"
            active-class="bg-[#10b481]/40"
          >
            <i class="bx-light bx bx-box text-3xl text-white ml-2"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ t('crops') }}</span>
          </NuxtLink>
        </nav>

        <!-- Bottom Section -->
        <div class="flex flex-col space-y-2 px-2 py-4 border-t border-gray-600 mb-6">
          <NuxtLink
            to="/help"
            class="flex items-center gap-3 px-3 py-2 hover:bg-[#10b481]/20 rounded-lg transition"
          >
            <i class="bx-light bx bx-help-circle text-3xl text-white"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ t('help') }}</span>
          </NuxtLink>

          <button
            @click="logout"
            class="flex items-center gap-3 px-3 py-2 hover:bg-red-500/20 rounded-lg transition"
          >
            <i class="bx-light bx bx-log-out text-3xl text-white"></i>
            <span class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ t('logout') }}</span>
          </button>
        </div>
      </aside>

      <nav class="fixed bottom-0 left-0 right-0 sm:hidden bg-[#222831] flex justify-around py-2 shadow-lg">
        <NuxtLink to="/dashboard" class="text-white text-2xl"><i class='bx bx-grid-alt'></i></NuxtLink>
        <NuxtLink to="/parcels" class="text-white text-2xl"><i class='bx bx-map'></i></NuxtLink>
        <NuxtLink to="/tasks" class="text-white text-2xl"><i class='bx bx-task'></i></NuxtLink>
        <NuxtLink to="/yield-records" class="text-white text-2xl"><i class='bx bx-bar-chart'></i></NuxtLink>
        <NuxtLink to="/parcel-crops" class="text-white text-2xl"><i class='bx bx-box'></i></NuxtLink>
      </nav>

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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '~/config'
import { useLanguageStore } from '~/stores/language'
import { translate } from '~/utils/translate'

const languageStore = useLanguageStore()

// Fonction pour récupérer la traduction
const t = (key: string) => {
  const lang = languageStore.lang
  return translate[lang][key] || key
}

// Liste des langues
const locales = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
]

// Langue courante
const currentLocale = computed(() =>
  locales.find(l => l.code === languageStore.lang) || locales[0]
)

// Switcher de langue
const switchLocale = (code: string) => {
  languageStore.setLang(code)
}


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
