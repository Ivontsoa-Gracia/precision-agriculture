<template>
  <div
    class="min-h-screen bg-cover bg-center flex items-center justify-center px-4 sm:px-6 md:px-8 py-10 sm:py-12"
    style="background: #212121"
  >
    <AuthForm
      title="Sign up"
      buttonText="Sign up"
      :fields="['first_name', 'last_name', 'email', 'password']"
      passwordLabel="Password"
      @submit="handleSignup"
    >
      <template #footer-links>
        <NuxtLink to="/login" class="text-white-600 hover:underline"
          >Already have an account? Log in</NuxtLink
        >
      </template>
    </AuthForm>
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
