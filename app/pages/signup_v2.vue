<template>

<div class="h-screen flex bg-[#fafaf9]">
    <!-- LEFT: SCROLLABLE FORM -->
    <div class="flex-1 p-4 sm:p-12">
      <div class="max-w-2xl mx-auto">
        <div class="">
          <div class="text-left mb-6">
            <img src="/logo.png" class="h-16 mb-6" />
            <h2 class="">Créer votre compte</h2>
            <p class="mt-4 content">
              Rejoignez SmartSaha et commencez à vendre ou acheter en toute
              sécurité.
            </p>
          </div>

          <div class="w-full max-w-sm">
        <AuthForm
          title=""
          buttonText="Sign up"
          :fields="['first_name', 'last_name', 'email', 'password']"
          passwordLabel="Password"
          @submit="handleSignup"
        >
          <template #footer-links>
          </template>
        </AuthForm>
      </div>
        </div>
      </div>
    </div>

    <!-- RIGHT: FIXED PANEL -->

    <div
      class="hidden lg:flex w-2/5 h-screen sticky top-0 bg-[#fff] rounded-l-[2rem] text-white flex-col justify-center p-12 overflow-hidden relative"
    >
      <!-- Flare organiques -->
      <div
        class="absolute -top-24 -left-32 w-[500px] h-[500px] sm:bg-blue-500 opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div
        class="absolute top-40 -right-48 w-[400px] h-[600px] sm:bg-blue-400 opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div
        class="absolute -top-48 right-[-100px] w-[800px] h-[400px] sm:bg-[#10b481] opacity-30 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div
        class="absolute -bottom-48 right-[-100px] w-[800px] h-[400px] sm:bg-[#10b481] opacity-40 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] blur-3xl"
      ></div>

      <div
        class="relative z-50 flex flex-col justify-center h-full gap-y-8 px-4 sm:px-0"
      >

        <div class="flex flex-col justify-center gap-2">
          <h2 class="leading-snug text-2xl font-bold">
            Bienvenue sur SmartSaha
          </h2>
          <p class="text-gray-700 small text-sm max-w-xs">
            Marketplace agricole, sécurisez vos ventes et connectez-vous aux
            meilleurs clients.
          </p>
        </div>
        <div
          class="flex flex-col sm:flex-row items-center gap-1 self-start"
        >
          <p class="text-sm small text-[#112830] text-center sm:text-left">
            Déjà un compte ?
          </p>
          <NuxtLink
            to="/login"
            class="text-[#10b481] small text-sm font-medium underline cursor-pointer transition hover:bg-gray-100/10"
          >
            Se connecter
          </NuxtLink>
        </div>
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
          'bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4 w-[340px] text-center transition-all duration-300',
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
import AuthForm from "~/components/AuthForm.vue";
import { API_URL } from "~/config";
import { useRouter } from "vue-router";

const router = useRouter();

const isLoading = ref(false);

const notification = ref({
  visible: false,
  message: "",
  type: "success",
});

const showNotification = (
  message: string,
  type: "success" | "error" = "success",
  duration = 3000
) => {
  notification.value.message = message;
  notification.value.type = type;
  notification.value.visible = true;
  setTimeout(() => (notification.value.visible = false), duration);
};

const handleSignup = async (formData: {
  email: string;
  first_name?: string;
  last_name?: string;
  password: string;
}) => {
  if (!formData.email || !formData.password) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  isLoading.value = true;
  try {
    const response = await fetch(`${API_URL}/api/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.first_name,
        email: formData.email,
        first_name: formData.first_name || "",
        last_name: formData.last_name || "",
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errors = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      alert(errors);
      return;
    }
    showNotification("Signup successful!", "success");
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  } catch (error) {
    console.error("Erreur réseau:", error);
    showNotification("Network error, please check your server", "error");
  } finally {
    isLoading.value = false;
  }
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
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 3 + 1,
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
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
