<template>
  <div
    class="min-h-screen bg-[#212121] flex flex-col items-center justify-center"
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
      class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl"
    >
      <div
        class="w-12 h-12 border-4 border-t-[#10b481] border-white rounded-full animate-spin"
      ></div>
    </div>

    <transition name="fade">
      <div
        v-if="notification.visible"
        :class="[
          'fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold',
          notification.type === 'success' ? 'bg-[#10b481]' : 'bg-red-500',
        ]"
      >
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AuthForm from "~/components/AuthForm.vue";
import { API_URL } from "~/config";

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
      return;
    }
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("uuid", data.user.uuid);
    showNotification("Login successful!", "success");
    window.location.href = "/dashboard";
  } catch (error) {
    console.error(error);
    showNotification("Network error", "error");
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
          return;
        }
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("uuid", data.user.uuid);
        showNotification("Google login successful!", "success");
        window.location.href = "/dashboard";
      } catch (err) {
        console.error(err);
        showNotification("Google login failed", "error");
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
