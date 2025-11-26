<template>
  <div class="h-screen bg-[#fefefe] flex flex-col">
    <header
      class="fixed top-0 left-0 right-0 z-50 flex items-center px-4 sm:px-8 h-20 bg-[#fefefe] backdrop-blur-md shadow-sm"
    >
      <div class="flex items-center gap-2">
        <button class="sm:hidden p-2 text-gray-800" @click="toggleMobileMenu">
          <i class="bx bx-menu text-2xl"></i>
        </button>

        <div class="flex items-center gap-4 -ml-0 sm:-ml-5">
          <div
            class="h-12 w-12 sm:h-14 sm:w-14 rounded flex items-center justify-center"
          >
            <img src="/logo.png" alt="Logo" />
          </div>

          <div class="hidden sm:flex flex-col text-left">
            <h1 class="text-xl font-extrabold text-[#222831] tracking-tight">
              SmartSaha
            </h1>
            <p class="text-sm text-gray-500">{{ t("slogan") }}</p>
          </div>
        </div>
      </div>

      <div class="hidden sm:flex items-center gap-6 ml-auto">
        <div class="relative inline-block w-40">
          <button
            @click="open = !open"
            class="w-full bg-gray-100 rounded p-2 flex items-center justify-between shadow-inner"
          >
            <span class="flex items-center gap-2">
              <img
                :src="currentLocale.flag"
                alt=""
                class="w-5 h-5 rounded-full"
              />
              <span class="text-sm font-medium">{{ currentLocale.name }}</span>
            </span>
            <i class="bx bx-chevron-down text-lg"></i>
          </button>

          <transition name="fade">
            <ul
              v-if="open"
              class="absolute mt-1 w-full bg-white rounded shadow-lg overflow-hidden z-50"
            >
              <li
                v-for="loc in locales"
                :key="loc.code"
                @click="selectLocale(loc.code)"
                class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#10b481]/10 transition-colors"
              >
                <img :src="loc.flag" alt="" class="w-5 h-5 rounded-full" />
                <span class="text-sm font-medium">{{ loc.name }}</span>
              </li>
            </ul>
          </transition>
        </div>

        <div class="relative">
          <button
            @click="userMenuOpen = !userMenuOpen"
            class="flex items-center gap-1 p-1 bg-white/90 backdrop-blur-sm rounded transition"
          >
            <div
              class="h-10 w-10 rounded-full bg-gradient-to-br from-[#f4a261] to-[#f4a261] flex items-center justify-center"
            >
              <i class="bx bxs-user text-white text-lg"></i>
            </div>
            <div class="ml-2 text-left">
              <p class="font-semibold text-[#222831] text-sm">
                {{ user?.username }}
              </p>
              <p class="text-xs text-gray-500">{{ user?.email }}</p>
            </div>
            <i class="bx bx-chevron-down ml-auto text-sm"></i>
          </button>

          <transition name="fade">
            <ul
              v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-52 bg-white rounded shadow-lg border border-gray-200 overflow-hidden z-50"
            >
              <li
                v-for="item in userMenuItems"
                :key="item.labelKey"
                @click="handleMenuClick(item)"
                :class="
                  item.danger
                    ? 'text-red-500 hover:bg-red-500/10'
                    : 'hover:bg-gray-100'
                "
                class="px-4 py-3 cursor-pointer transition-colors"
              >
                {{ t(item.labelKey) }}
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </header>

    <transition name="slide">
      <aside
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 bg-[#141414]/95 backdrop-blur-sm flex flex-col sm:hidden"
      >
        <div
          class="flex justify-between items-center p-4 border-b border-gray-700"
        >
          <h2 class="text-white font-bold text-lg">
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-full bg-gradient-to-br from-[#f4a261] to-[#f4a261] flex items-center justify-center"
              >
                <i class="bx bxs-user text-white text-lg"></i>
              </div>
              <div class="flex flex-col">
                <p class="text-white font-semibold text-sm">
                  {{ user?.username }}
                </p>
                <p class="text-gray-300 text-xs">{{ user?.email }}</p>
              </div>
            </div>
          </h2>
          <button @click="toggleMobileMenu" class="text-white text-2xl">
            <i class="bx bx-x"></i>
          </button>
        </div>

        <div class="flex flex-col gap-4 px-4 py-4 border-b border-gray-700">
          <div>
            <label class="text-white text-sm mb-1 block">Language</label>
            <select
              v-model="languageStore.lang"
              class="w-full p-2 rounded bg-gray-800 text-white"
            >
              <option v-for="loc in locales" :key="loc.code" :value="loc.code">
                {{ loc.name }}
              </option>
            </select>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-2">
          <button
            v-for="item in sidebarMenu"
            :key="item.to"
            @click="
              router.push(item.to);
              toggleMobileMenu();
            "
            class="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#10b481]/20 rounded w-full text-left"
          >
            <i :class="item.icon + ' text-xl'"></i>
            <span>{{ item.label }}</span>
          </button>

          <button
            v-for="item in userMenuItems.slice(0, 3)"
            :key="item.labelKey"
            @click="
              handleMenuClick(item);
              toggleMobileMenu();
            "
            class="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#10b481]/20 rounded w-full text-left"
          >
            <i :class="item.icon + ' text-xl'"></i>
            <span>{{ t(item.labelKey) }}</span>
          </button>
          <button
            @click="router.push('/help')"
            class="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#10b481]/20 rounded w-full text-left"
          >
            <i class="bxr bx-info-circle text-xl text-white"></i>
            <span>{{ t("help") }}</span>
          </button>
          <button
            @click="logout"
            class="flex items-center gap-3 px-3 py-2 hover:bg-red-500/20 rounded text-white"
          >
            <i class="bx-light bx bx-log-out text-xl"></i>
            <span>{{ t("logout") }}</span>
          </button>
        </nav>
      </aside>
    </transition>

    <div class="flex flex-1 pt-20">
      <aside
        class="hidden sm:flex peer group fixed top-20 left-0 h-[calc(100vh-5rem)] flex flex-col bg-[#141414] shadow-lg w-20 hover:w-56 transition-all duration-300 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        <nav class="flex flex-col space-y-2 py-4">
          <button
            v-for="item in sidebarMenu"
            :key="item.to"
            @click="router.push(item.to)"
            class="group relative flex items-center gap-3 px-4 py-2 text-white transition-all duration-300 hover:bg-white/10"
            active-class="bg-white/10"
          >
            <span
              class="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] border-l-[3px] border-white opacity-0 hover:opacity-100 group-focus:opacity-100 transition-all duration-300"
            ></span>
            <i :class="item.icon + ' text-xl ml-2 font-light'"></i>
            <span
              class="font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >{{ item.label }}</span
            >
          </button>
        </nav>

        <div
          class="flex flex-col space-y-2 px-2 py-4 border-t border-gray-600 mb-6"
        >
          <button
            @click="router.push('/help')"
            class="flex items-center gap-3 px-3 py-2 hover:bg-[#10b481]/20 rounded transition"
          >
            <i class="bxr bx-info-circle text-xl text-white"></i>
            <span
              class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >{{ t("help") }}</span
            >
          </button>

          <button
            @click="logout"
            class="flex items-center gap-3 px-3 py-2 hover:bg-red-500/20 rounded transition"
          >
            <i class="bx-light bx bx-log-out text-xl text-white"></i>
            <span
              class="text-white font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >{{ t("logout") }}</span
            >
          </button>
        </div>
      </aside>

      <main
        class="flex-1 p-6 sm:ml-20 transition-all duration-300 peer-hover:ml-56"
      >
        <slot />
      </main>
    </div>

    <div
      v-if="router.currentRoute.value.path !== '/assistant'"
      @click="router.push('/assistant')"
      :class="[
        'fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#141414] text-white px-4 py-3 shadow-lg hover:bg-[#222831] cursor-pointer transition-all duration-500 ease-in-out',
        isScrolled ? 'px-3 py-3 w-auto justify-center' : '',
      ]"
    >
      <i class="bx bx-robot text-xl"></i>
      <transition name="fade">
        <span v-if="!isScrolled" class="font-light">{{ t("sesily") }}</span>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
// import { useUserStore } from "~/stores/userStore";
const userMenuOpen = ref(false);

const languageStore = useLanguageStore();
const t = (key: string) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const open = ref(false);

const locales = [
  { code: "en", name: "English", flag: "/flags/en.png" },
  { code: "fr", name: "Français", flag: "/flags/fr.png" },
  { code: "mg", name: "Malagasy", flag: "/flags/mg.png" },
];

const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("uuid");
  localStorage.removeItem("serverStore");
  router.push("/");
};

const userMenuItems = [
  {
    labelKey: "account",
    icon: "bx bx-user-circle",
    action: () => router.push("/profil"),
  },
  {
    labelKey: "terms",
    icon: "bx bx-file",
    action: () => router.push("/conditions/terms-of-service"),
  },
  {
    labelKey: "policy",
    icon: "bx bx-shield",
    action: () => router.push("/conditions/privacy-policy"),
  },
  { labelKey: "signOut", icon: "bx bx-log-out", action: logout, danger: true },
];

function handleMenuClick(item: any) {
  item.action();
  userMenuOpen.value = false;
}

const currentLocale = computed(
  () => locales.find((l) => l.code === languageStore.lang) || locales[0]
);

const selectLocale = (code: string) => {
  languageStore.setLang(code);
  open.value = false;
};

const state = reactive({
  uuid: "",
});

const groupInfo = false;

const baseMenu = computed(() => [
  {
    to: state.uuid ? `/dashboard/s/${state.uuid}` : "/dashboard",
    icon: "bxr bx-home-alt-2",
    label: t("home"),
  },
  { to: "/dashboard", icon: "bxr bx-dashboard", label: t("dashboard") },
  { to: "/parcels", icon: "bx bx-location-alt-2", label: t("parcels") },
  { to: "/tasks", icon: "bx bx-task", label: t("tasks") },
  { to: "/yield-records", icon: "bx bx-bar-chart", label: t("yields") },
  { to: "/parcel-crops", icon: "bx bx-box", label: t("crops") },
]);

onMounted(() => {
  if (typeof window !== "undefined") {
    state.uuid = sessionStorage.getItem("uuid") || "";
  }
});

const fullMenu = [
  {
    to: "/dashboard/dashboardbi",
    icon: "bxr  bx-dashboard",
    label: t("dashboard"),
  },
  { to: "/group", icon: "bx bx-group", label: t("groups") },
  {
    to: "/management",
    icon: "bx bx-chart-stacked-rows",
    label: t("datamanagement"),
  },
  { to: "/profil", icon: "bx bx-user-circle", label: "Profil" },
  { to: "/certification", icon: "bx bx-badge-check", label: "Certification" },
  { to: "/rapports", icon: "bx bx-folder-open", label: "Rapports" },
  { to: "/parcels", icon: "bx bx-location-alt-2", label: t("parcels") },
  { to: "/tasks", icon: "bx bx-task", label: t("tasks") },
  { to: "/yield-records", icon: "bx bx-bar-chart", label: t("yields") },
  { to: "/parcel-crops", icon: "bx bx-box", label: t("crops") },
];

const sidebarMenu = computed(() => {
  return groupInfo.value ? fullMenu : baseMenu.value;
});

const user = ref<{ username: string; email: string } | null>(null);
const router = useRouter();

onMounted(async () => {
  const uuid = sessionStorage.getItem("uuid");
  const token = sessionStorage.getItem("token");

  if (!uuid || !token) {
    router.push("/login");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/users/${uuid}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
    const data = await response.json();
    user.value = { username: data.username, email: data.email };
  } catch (err) {
    console.error(err);
    router.push("/login");
  }
});

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.group:hover span {
  transition: opacity 0.2s ease-in-out;
}

::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 10px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
