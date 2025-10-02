<template>
  <div class="flex flex-col items-center justify-center h-screen bg-[#212121] text-white relative">
    <transition name="fade-zoom">
      <div v-if="showLogo" class="flex flex-col items-center">
        <img
          src="/logo.png"
          alt="SmartSaha"
          class="w-28 h-28 mb-4 animate-scale-in rounded-lg"
        />
        <h1 class="text-4xl font-bold tracking-wide">SmartSaha</h1>
        <p class="mt-2 text-md text-gray-300">Nurture data. Harvest impact</p>
      </div>
    </transition>

    <div
      v-if="showLogo"
      class="absolute bottom-24 w-64 h-1 bg-gray-600 rounded-full overflow-hidden"
    >
      <div class="h-1 bg-gradient-to-r from-[#10b481] to-[#00c3ff] animate-loading"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const token = computed(() => authStore.token)
const uuid = computed(() => authStore.uuid)

const router = useRouter();
const showLogo = ref(true);

onMounted(() => {
  setTimeout(() => {
    showLogo.value = false;
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, 8000); // 7 secondes
});
</script>

<style scoped>
/* Zoom + fade logo */
@keyframes scale-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-scale-in {
  animation: scale-in 1.5s ease forwards;
}

/* Loading bar futuriste */
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.animate-loading {
  width: 100%;
  animation: loading 2s linear infinite;
}

/* Transition apparition */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.8s ease;
}
.fade-zoom-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
