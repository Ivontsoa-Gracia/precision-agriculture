<template>
  <div
    class="max-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-[#0f0f0f] to-[#121212]"
  >
    <div
      class="md:w-1/3 flex flex-col justify-center items-center p-8 bg-[#f9f9f9] relative"
    >
      <div class="absolute top-8 left-8 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Smartsaha Logo"
          class="w-10 h-10 object-contain"
        />
        <div class="flex flex-col">
          <h1 class="text-md font-bold text-gray-800">Smartsaha</h1>
          <p class="text-gray-500 text-xs">Nurture Data, Harvest Impact.</p>
        </div>
      </div>

      <div class="w-full max-w-sm mt-16 p-6">
        <AuthForm
          title="Sign up"
          buttonText="Sign up"
          :fields="['first_name', 'last_name', 'email', 'password']"
          passwordLabel="Password"
          @submit="handleSignup"
        >
          <template #footer-links>
            <!-- <NuxtLink to="/login" class="text-white-600 hover:underline"
              >Already have an account? Log in</NuxtLink
            > -->
          </template>
        </AuthForm>
      </div>
    </div>

    <div
      class="hidden md:flex md:w-2/3 flex-col justify-between p-10 relative shadow-xl overflow-hidden bg-gray-900"
    >
      <canvas ref="aiCanvas" class="absolute inset-0 w-full h-full"></canvas>

      <div
        class="absolute inset-0 bg-[#10b481]/10 backdrop-blur-xs pointer-events-none"
      ></div>

      <div class="relative flex justify-end items-center mb-10 z-10 gap-4">
        <p class="text-sm text-gray-300 font-medium">
          Already have an account?
        </p>
        <NuxtLink
          to="/login"
          class="px-6 py-2 bg-transparent border border-white text-gray-50 text-sm rounded hover:scale-105 transition-transform transform hover:-translate-y-0.5 duration-300"
        >
          Log In
        </NuxtLink>
      </div>

      <div
        class="slider relative flex-1 flex flex-col justify-center items-center"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="slide absolute left-8 flex flex-col justify-end items-start transition-opacity duration-700 opacity-0 text-gray-50 max-w-xl"
        >
          <h2 class="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
            {{ slide.title }}
          </h2>
          <p class="text-lg md:text-xl mb-6 text-gray-200">
            {{ slide.text }}
          </p>
          <NuxtLink
            :to="slide.link"
            class="inline-flex items-center gap-2 text-white"
          >
            <span class="underline decoration-1 decoration-white">
              Learn More
            </span>
            <i class="bx bx-right-arrow-alt text-lg"></i>
          </NuxtLink>

          <div class="mb-6"></div>
        </div>
      </div>

      <div class="absolute bottom-6 left-16 flex gap-2">
        <span
          v-for="(_, i) in slides"
          :key="i"
          :class="{
            'bg-[#10b481] w-6 h-1 transition-all duration-300': true,
            'opacity-100 scale-125': i === currentIndex,
            'opacity-50 scale-100': i !== currentIndex,
          }"
        ></span>
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
