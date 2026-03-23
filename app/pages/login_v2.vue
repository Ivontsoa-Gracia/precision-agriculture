<template>
  <div
    class="relative h-screen flex flex-col lg:flex-row bg-white sm:bg-[#fafaf9] p-4 sm:p-12 overflow-hidden"
  >
  <canvas ref="aiCanvas" class="absolute inset-0 w-full h-full"></canvas>

      <div
        class="absolute -top-24 -left-32 w-[500px] h-[500px] sm:bg-blue-500 opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div
        class="absolute -top-48 -left-48 w-[1000px] h-[400px] sm:bg-[#10b481] opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div
        class="absolute -top-48 right-[-100px] w-[800px] h-[400px] sm:bg-[#10b481] opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div class="hidden lg:flex w-1/2 flex-col p-12 relative overflow-hidden">
        <div class="flex-1 flex items-center">
          <div class="relative max-w-md">
            <h2 class="mb-6 leading-tight">Optimize Your Farm</h2>

            <p class="content leading-relaxed">
              Sesily AI helps you analyze soil, crops, and weather to maximize your harvest efficiently.
            </p>
          </div>
        </div>

        <div class="relative">
          <div class="flex items-center justify-between">
            <div class="relative hidden sm:flex">
              <button
                @click="open = !open"
                class="flex items-center gap-2 px-3 py-2 transition"
              >
                <img :src="currentLocale.flag" class="w-5 h-5 rounded-full" />
                <span class="text-sm text-gray-700 small">
                  {{ currentLocale.name }}
                </span>
                <i class="bx bx-chevron-down text-sm text-gray-500"></i>
              </button>

              <transition name="fade">
                <ul
                  v-if="open"
                  class="absolute bottom-12 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
                >
                  <li
                    v-for="loc in locales"
                    :key="loc.code"
                    @click="selectLocale(loc.code)"
                    class="flex items-center gap-2 px-4 py-3 hover:bg-[#10b481]/10 cursor-pointer transition"
                  >
                    <img :src="loc.flag" class="w-5 h-5 rounded-full" />
                    <span class="text-sm text-gray-700">
                      {{ loc.name }}
                    </span>
                  </li>
                </ul>
              </transition>
            </div>

            <ul class="flex gap-6 text-sm">
              <li class="menu-item transition cursor-pointer">
                {{ t("terms") }}
              </li>
              <li class="menu-item transition cursor-pointer">
                <NuxtLink to="/market" class="block w-full h-full">
                  {{ t("home") }}
                </NuxtLink>
              </li>
              <li class="menu-item transition cursor-pointer">
                {{ t("contactus") }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        class="flex-1 flex items-center justify-center p-0 sm:px-6 p-2 sm:py-16"
      >
        <div
          class="w-full max-w-md bg-transparent sm:bg-white sm:rounded-3xl sm:shadow-xl p-0 sm:p-12 relative overflow-hidden"
        >
          <div class="text-left mb-10">
            <img src="/logo.png" alt="SmartSaha" class="h-16 rounded-xl mb-4" />
            <h2 class="mb-2">{{ t("login") }}</h2>
            <p class="content">{{ t("logintext") }}</p>
          </div>

          <AuthForm
          class="mt-6"
          title=""
          buttonText="Log in"
          :fields="['username', 'password']"
          :errors="errors"
          passwordLabel="Password"
          @submit="handleLogin"
        >
          <template #footer-links>
          </template>
        </AuthForm>

        <div class="flex items-center w-full my-4 -mt-16">
          <hr class="flex-grow border-gray-400" />
          <span class="mx-2 text-gray-400">ou</span>
          <hr class="flex-grow border-gray-400" />
        </div>

        <div
          id="googleButton"
          class="w-full gap-3 hover:scale-2 content cursor-pointer flex items-center justify-center py-2 rounded transition-all duration-300"
        >
          <img
            src="/Google__G__logo.svg.png"
            alt="Google"
            class="w-5 h-5 mr-2"
          />
          <span class="content">Sign in with Google</span>
        </div>

          <p class="text-center small text-sm text-gray-500 mt-8">
            {{ t("dontaccount") }}
            <NuxtLink
              to="/signup"
              class="text-[#10b481] font-medium hover:underline"
            >
              {{ t("createone") }}
            </NuxtLink>
          </p>
        </div>
      </div>
  </div>

  <div
    v-if="isLoading"
    class="absolute inset-0 bg-black/50 flex items-center justify-center"
  >
    <div
      class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"
    ></div>
  </div>

  <transition name="fade">
    <div
      v-if="notification.visible"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
    >
      <div
        :class="[
          'bg-white rounded shadow-2xl px-8 py-6 flex flex-col items-center gap-4 w-[340px] text-center transition-all duration-300',
          notification.type === 'success'
            ? 'border-t-4 border-[#10b481]'
            : 'border-t-4 border-red-500',
        ]"
      >
        <div
          v-if="notification.type === 'success'"
          class="w-16 h-16 rounded-full bg-[#10b481] flex items-center justify-center"
        >
          <i class="bx bx-check text-4xl font-extrabold text-white"></i>
        </div>
        <div
          v-else
          class="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
        >
          <i class="bx bx-x text-4xl font-extrabold text-white"></i>
        </div>

        <p
          :class="[
            'text-lg font-semibold',
            notification.type === 'success' ? 'text-[#10b481]' : 'text-red-500',
          ]"
        >
          {{ notification.message }}
        </p>

        <p class="text-gray-500 text-sm">
          {{
            notification.type === "success"
              ? "Redirecting to your dashboard..."
              : "Please try again."
          }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AuthForm from "~/components/AuthForm.vue";
import { API_URL } from "~/config";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/userStore";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
const languageStore = useLanguageStore();
const t = (key: string) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const locales = [
  { code: "en", name: "English", flag: "/flags/en.png" },
  { code: "fr", name: "Français", flag: "/flags/fr.png" },
  { code: "mg", name: "Malagasy", flag: "/flags/mg.png" },
];

const open = ref(false);
const currentLocale = computed(
  () => locales.find((l) => l.code === languageStore.lang) || locales[0]
);

const selectLocale = (code: string) => {
  languageStore.setLang(code);
  open.value = false;
};

const userStore = useUserStore();
const slides = [
  {
    title: "Meet Sesily AI",
    text: "Your smart agronomist assistant, ready to guide you through your data and provide actionable insights.",
    link: "/assistant/u",
  },
  {
    title: "Optimize Your Farm",
    text: "Sesily AI helps you analyze soil, crops, and weather to maximize your harvest efficiently.",
    link: "/assistant/u",
  },
  {
    title: "Lead with Data",
    text: "Make informed decisions with real-time recommendations from your AI assistant.",
    link: "/assistant/u",
  },
];

const currentIndex = ref(0);
let intervalId: number;

onMounted(() => {
  const allSlides = document.querySelectorAll<HTMLDivElement>(".slide");

  allSlides.forEach((slide) => {
    slide.style.opacity = "0";
    slide.style.transition = "opacity 2.5s ease-in-out";
  });

  setTimeout(() => {
    allSlides[currentIndex.value].style.opacity = "1";
  }, 50);

  const nextSlide = () => {
    allSlides.forEach((slide, idx) => {
      slide.style.opacity = idx === currentIndex.value ? "1" : "0";
    });
    currentIndex.value = (currentIndex.value + 1) % slides.length;
  };

  intervalId = window.setInterval(nextSlide, 20000);
});

const router = useRouter();
const isLoading = ref(false);
const notification = ref({ visible: false, message: "", type: "success" });
const googleLoaded = ref(false);
const errors = ref({ username: "", password: "", general: "" });

const showNotification = (
  message: string,
  type: "success" | "error" = "success",
  duration = 3000
) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => (notification.value.visible = false), duration);
};

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

const handleLogin = async (formData: {
  username: string;
  password: string;
}) => {
  errors.value = { username: "", password: "", general: "" };

  if (!formData.username) errors.value.username = "Please enter your username";
  if (!formData.password) errors.value.password = "Please enter your password";

  if (errors.value.username || errors.value.password) return;

  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 400) {
        errors.value.username = "Incorrect username ";
        errors.value.password = "Incorrect password";
      } else {
        errors.value.general = "Login failed. Please try again.";
      }

      return;
    }

    const token = data.token;
    const uuid = data.user.uuid;
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("uuid", data.user.uuid);
    const groupInfo = await checkGroupMembership(uuid, token);
    if (groupInfo) {
      showNotification("You're signed in successfully.", "success");
      setTimeout(() => {
        router.push("/dashboard/dashboardbi");
      }, 3000);
    } else {
      showNotification("You're signed in successfully.", "success");
      setTimeout(() => {
        router.push("/dashboard/s");
      }, 3000);
    }
  } catch (error) {
    console.error(error);
    showNotification("Network error", "error");
    setTimeout(() => {}, 3000);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (!window.google) {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      googleLoaded.value = true;
      renderGoogleButton();
    };
    document.head.appendChild(script);
  } else {
    googleLoaded.value = true;
    renderGoogleButton();
  }
});

const renderGoogleButton = () => {
  if (!googleLoaded.value || !window.google) return;

  window.google.accounts.id.initialize({
    client_id:
      "972113542805-n0fujnh22t4jkejhvda051oml965limf.apps.googleusercontent.com",
    callback: async (response: any) => {
      try {
        isLoading.value = true;
        const res = await fetch(`${API_URL}/api/google-login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        });
        const data = await res.json();
        if (!res.ok) {
          showNotification(JSON.stringify(data), "error");
          setTimeout(() => {}, 3000);
          return;
        }
        const token = data.token;
        const uuid = data.user.uuid;
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("uuid", data.user.uuid);

        const groupInfo = await checkGroupMembership(uuid, token);

        if (groupInfo) {
          showNotification("You're signed in successfully.", "success");
          setTimeout(() => {
            router.push("/dashboard/dashboardbi");
          }, 3000);
        } else {
          showNotification("You're signed in successfully.", "success");
          setTimeout(() => {
            router.push("/dashboard/s");
          }, 3000);
        }
      } catch (err) {
        console.error(err);
        showNotification("Google login failed", "error");
        setTimeout(() => {}, 3000);
      } finally {
        isLoading.value = false;
      }
    },
    auto_select: false,
  });

  window.google.accounts.id.renderButton(
    document.getElementById("googleButton"),
    {
      size: "large",
      type: "standard",
      shape: "rectangular",
      width: "100%",
      theme: "outline",
      text: "continue_with",
    }
  );
};

const aiCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (!aiCanvas.value) return;

  const canvas = aiCanvas.value;
  const ctx = canvas.getContext("2d")!;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
  }[] = [];
  const numParticles = 50;

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      size: Math.random() * 2 + 1,
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "#10b481";
      ctx.fill();
      ctx.closePath();
    });

    // Draw lines between close particles
    for (let i = 0; i < numParticles; i++) {
      for (let j = i + 1; j < numParticles; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(16,180,129,${1 - dist / 100})`;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }

    requestAnimationFrame(animate);
  };

  animate();

  window.addEventListener("resize", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  });
});
</script>

<style scoped>
#googleButton .G_idSignIn {
  background: transparent !important;
  border: none !important;
  width: 100% !important;
  box-shadow: none !important;
  padding: 0 !important;
}

#googleButton .G_idSignIn {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulse 4s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce {
  animation: bounce 6s infinite;
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 5s infinite;
}

.swiper-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.swiper-pagination-bullet {
  background-color: #10b481;
  opacity: 0.8;
}
</style>
