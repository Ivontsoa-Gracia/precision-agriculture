<template>
  <div
    class="min-h-screen bg-[#212121] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-10 sm:py-12"
  >
    <AuthForm
      class="mt-6"
      title="Login"
      buttonText="Login"
      :fields="['username', 'password']"
      passwordLabel="Password"
      @submit="handleLogin"
    >
      <template #footer-links>
        <NuxtLink
          to="/signup"
          class="text-gray-400 hover:text-white hover:underline mr-4"
          >Sign Up</NuxtLink
        >
      </template>
    </AuthForm>

    <div class="flex items-center w-full max-w-md my-4 -mt-16">
      <hr class="flex-grow border-gray-700" />
      <span class="mx-2 text-gray-400">ou</span>
      <hr class="flex-grow border-gray-700" />
    </div>

    <div
      id="googleButton"
      class="w-full max-w-md bg-[#0f0f0f] hover:bg-[#1a1a1a] cursor-pointer flex items-center justify-center py-3 rounded-lg shadow-md transition-all duration-300 border border-gray-700"
    ></div>

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
          <!-- Icône -->
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
              notification.type === 'success'
                ? 'text-[#10b481]'
                : 'text-red-500',
            ]"
          >
            {{ notification.message }}
          </p>

          <!-- Message secondaire -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AuthForm from "~/components/AuthForm.vue";
import { API_URL } from "~/config";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoading = ref(false);
const notification = ref({ visible: false, message: "", type: "success" });
const googleLoaded = ref(false);

const showNotification = (
  message: string,
  type: "success" | "error" = "success",
  duration = 3000
) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => (notification.value.visible = false), duration);
};

const handleLogin = async (formData: {
  username: string;
  password: string;
}) => {
  if (!formData.username || !formData.password) {
    alert("Veuillez remplir tous les champs");
    return;
  }
  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      showNotification(data.detail || JSON.stringify(data), "error");
      setTimeout(() => {}, 3000);
      return;
    }
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("uuid", data.user.uuid);
    showNotification("You're signed in successfully.", "success");
    setTimeout(() => {
      router.push(`/dashboard/s/${data.user.uuid}`);
    }, 3000);
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
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("uuid", data.user.uuid);
        showNotification("You're signed in successfully.", "success");
        setTimeout(() => {
          router.push(`/dashboard/s/${data.user.uuid}`);
        }, 3000);
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
      theme: "outline",
      size: "large",
      type: "standard",
      shape: "rectangular",
      width: "100%",
    }
  );
};
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
