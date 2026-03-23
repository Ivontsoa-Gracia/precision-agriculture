<template>
  <div class="flex h-screen bg-[#fafaf9] overflow-hidden">
    <aside
      :class="[
        'fixed md:relative z-40 h-full bg-[#112830] text-white flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed && !isMobile ? 'w-22' : 'w-64',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div class="flex items-center py-6 px-2 relative">
        <div
          :class="[
            'flex items-center w-full gap-1',
            isCollapsed && !isMobile ? 'justify-between' : 'justify-between',
          ]"
        >
          <div class="flex items-center justify-center px-3 relative gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              class="w-11 h-11 object-contain flex-shrink-0 rounded-xl"
            />

            <div v-if="!isCollapsed || isMobile" class="leading-tight">
              <h1 class="text-xl light-logo">SmartSaha</h1>
              <p class="text-xs light-sous-logo tracking-wide">
                Agricultural Marketplace
              </p>
            </div>
          </div>

          <button
            v-if="!isMobile"
            @click="toggleCollapse"
            class="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 z-50 flex items-center justify-center w-6 h-6 rounded-full bg-[#10b481] text-white shadow-lg hover:bg-[#10b481] hover:text-white transition-all duration-200"
          >
            <i
              :class="[
                'bx text-sm',
                isCollapsed ? 'bx-chevron-right' : 'bx-chevron-left',
              ]"
            ></i>
          </button>

          <button
            v-if="isMobile"
            @click="isMobileOpen = false"
            class="md:hidden p-1 rounded hover:bg-[#10b481]"
          >
            <i class="bx bx-chevron-left text-lg"></i>
          </button>
        </div>
      </div>

      <nav class="flex-1 px-2 space-y-1 overflow-y-auto">
        <div
          class="flex md:hidden items-center gap-2 py-3 border-b border-white/20 relative"
        >
          <button
            @click="open = !open"
            class="flex items-center gap-3 py-1.5 px-3 w-full rounded transition bg-transparent"
          >
            <img
              :src="currentLocale.flag"
              class="w-5 h-5 rounded-full ring-1 ring-white"
            />
            <span class="text-sm light-menu">{{ currentLocale.name }}</span>
            <i class="bx bx-chevron-down ml-auto"></i>
          </button>

          <transition name="fade">
            <ul
              v-if="open"
              class="absolute top-full left-0 mt-2 w-full bg-[#112830] border border-white/20 rounded shadow-md overflow-hidden z-50"
            >
              <li
                v-for="loc in locales"
                :key="loc.code"
                @click="selectLocale(loc.code)"
                class="flex items-center gap-2 px-3 py-2 hover:bg-[#10B481]/10 cursor-pointer"
              >
                <img :src="loc.flag" class="w-5 h-5 rounded-full" />
                <span class="text-sm">{{ loc.name }}</span>
              </li>
            </ul>
          </transition>
        </div>

        <NuxtLink
          to="/insights"
          :class="[
            'flex items-center transition-all duration-200 cursor-pointer',
            isCollapsed && !isMobile
              ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
              : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
          ]"
        >
          <i class="bxr bx-home-alt-2 text-xl"></i>
          <span v-if="!isCollapsed || isMobile" class="light-menu">
            {{ t("home") }}
          </span>
        </NuxtLink>

        <!-- menu groupe -->
        <template v-if="isGroup" class="light-menu">
          <NuxtLink
            to="/dashboard/dashboardbi"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-bar-chart-alt-2 text-xl"></i>

            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("dashboard") }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/group"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bxr bx-community text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("groups") }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/organisations"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bxr bx-enterprise text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("organisations") }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/reporting"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bxr bx-folder text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("reporting") }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/management"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-chart-stacked-row text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("datamanagement") }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/certifications/evaluation"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-badge-check text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              Certification
            </span>
          </NuxtLink>

          <NuxtLink
            to="/certifications/audit"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-badge-check text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              Audit
            </span>
          </NuxtLink>

          <NuxtLink
            to="/certifications/type"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-badge-check text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              Certification Type
            </span>
          </NuxtLink>

          <NuxtLink
            to="/rapports"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-folder-open text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              Rapports
            </span>
          </NuxtLink>
        </template>

        <template v-else class="">
          <!-- menu utilisateur -->
          <NuxtLink
            to="/dashboard"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481] '
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-bar-chart-alt-2 text-xl"></i>

            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("dashboard") }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/parcels"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-location-alt-2 text-xl"></i>

            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("parcels") }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/tasks"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-task text-xl"></i>

            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("tasks") }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/yield-records"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-bar-chart text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("yields") }}
            </span>
          </NuxtLink>
        </template>

        <NuxtLink
          to="/parcel-crops"
          :class="[
            'flex items-center relative transition-all duration-200 cursor-pointer mb-4',
            isCollapsed && !isMobile
              ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
              : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
          ]"
        >
          <i class="bx bx-box text-xl"></i>

          <!-- Texte -->
          <span v-if="!isCollapsed || isMobile" class="light-menu">
            {{ t("crops") }}
          </span>
        </NuxtLink>

        <div class="border-t border-white/10 pt-2">
          <NuxtLink
            to="/profil"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-user-circle text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t('account') }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/help"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-cog text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("help") }}
            </span>
          </NuxtLink>

          <NuxtLink
            @click="logout"
            :class="[
              'flex items-center transition-all duration-200 cursor-pointer',
              isCollapsed && !isMobile
                ? 'justify-center w-12 h-12 mx-auto rounded-2xl hover:bg-[#10b481] focus:bg-[#10b481]'
                : 'gap-3 px-3 py-3 rounded-lg hover:bg-[#10b481] focus:bg-[#10b481]',
            ]"
          >
            <i class="bx bx-log-out text-xl"></i>
            <span v-if="!isCollapsed || isMobile" class="light-menu">
              {{ t("logout") }}
            </span>
          </NuxtLink>
        </div>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col w-full">
      <header
        :class="[
          'flex items-center justify-between bg-[#FAFAF9] border-b px-4 sm:px-12 py-4 sm:py-7 transition-shadow duration-200',
          isScrolled ? 'shadow' : '',
        ]"
      >
        <button class="md:hidden text-gray-700" @click="isMobileOpen = true">
          <i class="bx bx-menu text-2xl"></i>
        </button>

        <h2 class="text-lg small text-gray-800 hidden sm:flex">
          <Breadcrumb />
        </h2>

        <div class="flex items-center gap-5">
          <div class="relative hidden sm:flex">
            <button
              @click="open = !open"
              class="flex items-center gap-2 py-1.5 px-3 transition"
            >
              <img :src="currentLocale.flag" class="w-5 h-5 rounded-full" />
              <span class="text-sm text-gray-700 small-medium">{{
                currentLocale.name
              }}</span>
              <i class="bx bx-chevron-down text-sm"></i>
            </button>

            <transition name="fade">
              <ul
                v-if="open"
                class="absolute top-10 z-50 w-40 bg-white border border-gray-100 rounded-lg shadow-md overflow-hidden"
              >
                <li
                  v-for="loc in locales"
                  :key="loc.code"
                  @click="selectLocale(loc.code)"
                  class="flex items-center gap-2 px-3 py-2 hover:bg-[#10b481]/10 cursor-pointer"
                >
                  <img :src="loc.flag" class="w-5 h-5 rounded-full" />
                  <span class="text-sm text-gray-700 small-medium">{{
                    loc.name
                  }}</span>
                </li>
              </ul>
            </transition>
          </div>

          <div class="flex items-center gap-3">
            <img
              v-if="user?.avatar_url"
              :src="user?.avatar_url"
              alt="avatar"
              class="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover ring-2 ring-[#10B481]/50"
            />

            <div
              v-else
              class="w-8 sm:w-10 h-8 sm:h-10 bg-[#10b481] text-white rounded-full username flex items-center justify-center font-bold text-lg ring-2 ring-[#10B481]/50"
            >
              {{ user?.username.charAt(0).toUpperCase() }}
            </div>
          </div>
        </div>
      </header>

      <main
        ref="mainContent"
        class="overflow-auto flex-1 bg-[#FAFAF9]"
        @scroll="handleScroll"
      >
        <NuxtPage />
      </main>
    </div>

    <div
      v-if="router.currentRoute.value.path !== '/assistant'"
      @click="router.push('/assistant')"
      class="hidden sm:flex fixed bottom-6 right-6 z-50 items-center gap-2 btn-primary cursor-pointer transition-all duration-500 ease-in-out"
      :class="[isScrolled ? 'px-3 py-3 w-auto justify-center' : '']"
    >
      <i class="bx bx-robot text-xl"></i>
      <transition name="fade">
        <span v-if="!isScrolled">{{ t("sesily") }}</span>
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
import { useUserStore } from "~/stores/userStore";
const userMenuOpen = ref(false);

const languageStore = useLanguageStore();
const t = (key: string) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const isScrolled = ref(false);
const mainContent = ref(null);

const handleScroll = () => {
  if (!mainContent.value) return;
  isScrolled.value = mainContent.value.scrollTop > 5;
};

onMounted(() => {
  if (mainContent.value) {
    isScrolled.value = mainContent.value.scrollTop > 5;
  }
});

const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const isMobile = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

onMounted(() => {
  const checkScreen = () => {
    isMobile.value = window.innerWidth < 768;
  };

  checkScreen();
  window.addEventListener("resize", checkScreen);
});

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
  localStorage.removeItem("hideGroupCTA");
  userStore.clearUserData();
  router.push("/");
};

const showGroupCTA = ref(true);

onMounted(() => {
  const hidden = localStorage.getItem("hideGroupCTA");
  if (hidden === "true") showGroupCTA.value = false;
});

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
const userStore = useUserStore();

const isGroup = computed(() => {
  return !!userStore.serverStore.value?.groupInfo;
});

onMounted(() => {
  if (typeof window !== "undefined") {
    state.uuid = sessionStorage.getItem("uuid") || "";
  }
});

const user = ref<{ username: string; email: string } | null>(null);
const router = useRouter();

const checkGroupMembership = async (uuid: string, token: string) => {
  try {
    const userRes = await fetch(`${API_URL}/api/users/${uuid}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!userRes.ok) return null;
    const userData = await userRes.json();
    const username = userData.username;
    console.log("Username", username);

    const membersRes = await fetch(`${API_URL}/api/groups/member-groups/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!membersRes.ok) return null;
    const members = await membersRes.json();
    console.log("Membres", members);

    const match = members.find((m: { user: string }) => m.user === username);
    if (!match) return null;
    console.log("Groupe trouvé", match.group.uuid);

    const groupRes = await fetch(
      `${API_URL}/api/groups/groups/${match.group.uuid}/`,
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    if (!groupRes.ok) return null;

    const groupInfo = await groupRes.json();
    console.log("Groupe info", groupInfo);

    userStore.serverStore.value = {
      token,
      uuid,
      groupId: match.group.uuid,
      groupInfo,
    };

    return groupInfo;
  } catch (e) {
    console.error("Erreur lors de la vérification du groupe :", e);
    return null;
  }
};

onMounted(async () => {
  const uuid = sessionStorage.getItem("uuid");
  const token = sessionStorage.getItem("token");
  await checkGroupMembership(uuid, token);
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
