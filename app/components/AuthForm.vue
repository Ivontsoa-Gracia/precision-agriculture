<template>
  <div class="relative w-full">

    <div class="w-full relative z-0">
      <h2 class="">
        {{ title }}
      </h2>

      <form @submit.prevent="submit" class="space-y-6">
        <div v-for="field in fields" :key="field" class="relative">
          <div class="relative">
            <i
              :class="
                icons[field] +
                ' text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 text-lg'
              "
            ></i>

            <input
              v-model="formData[field]"
              :type="getInputType(field)"
              placeholder=" "
              class="peer w-full px-4 py-3 pl-10 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all"
            />

            <label
              :for="field"
              class="absolute left-10 small text-gray-400 text-sm pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-400 bg-white px-2"
              :class="[
                formData[field] || fieldHasFocus[field]
                  ? '-top-2.5 px-2 rounded'
                  : 'top-2.5 text-[#10b481]',
              ]"
            >
              {{ labels[field] || passwordLabel }}
            </label>

            <i
              v-if="field === 'password'"
              :class="[
                showPassword ? 'bx bx-hide' : 'bx bx-show',
                'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg cursor-pointer hover:text-[#10b481] transition',
              ]"
              @click="togglePassword"
            ></i>
          </div>

          <p
            v-if="errors[field]"
            class="text-red-500 text-sm mt-2 flex items-center gap-1 small"
          >
            <i class="bx bx-error-circle text-red-500"></i>
            {{ errors[field] }}
          </p>
        </div>

        <p v-if="errors.general" class="text-red-500 text-sm mt-2 text-center small">
          {{ errors.general }}
        </p>

        <div
          v-if="
            buttonText.toLowerCase().includes('sign') ||
            buttonText === 'S\'inscrire'
          "
          class="mt-2 text-sm text-gray-700"
        >
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="acceptedPolicy"
              class="h-4 w-4 accent-[#10b481]"
              required
            />
            <span>
              I agree to the
              <NuxtLink
                to="/privacy-policy"
                class="underline hover:text-[#10b481]"
              >
                Privacy Policy
              </NuxtLink>
              and
              <NuxtLink
                to="/terms-of-service"
                class="underline hover:text-[#10b481]"
              >
                Terms of Service
              </NuxtLink>
            </span>
          </label>
        </div>

        <button
          type="submit"
          :disabled="
            (buttonText.toLowerCase().includes('sign') ||
              buttonText === 'S\'inscrire') &&
            !acceptedPolicy
          "
          class="w-full btn-primary"
        >
          {{ buttonText }}
        </button>
      </form>

      <div class="mt-6 text-center text-gray-300 space-x-4">
        <slot name="footer-links"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const props = defineProps<{
  title: string;
  buttonText: string;
  fields: string[];
  passwordLabel?: string;
  errors?: any;
}>();

const emit = defineEmits<{
  (e: "submit", formData: Record<string, string>): void;
}>();

const acceptedPolicy = ref(false);
const formData = reactive<Record<string, string>>({});
props.fields.forEach((f) => (formData[f] = ""));

const fieldHasFocus = reactive<Record<string, boolean>>({});
props.fields.forEach((f) => (fieldHasFocus[f] = false));

const icons: Record<string, string> = {
  username: "bx bx-user",
  first_name: "bx bx-id-card",
  last_name: "bx bx-id-card",
  email: "bx bx-envelope",
  password: "bx bx-lock-alt",
};

const labels: Record<string, string> = {
  username: "Username",
  first_name: "First name",
  last_name: "Last name",
  email: "Email",
};

const showPassword = ref(false);
function togglePassword() {
  showPassword.value = !showPassword.value;
}
function getInputType(field: string) {
  return field === "password"
    ? showPassword.value
      ? "text"
      : "password"
    : "text";
}
const errors = reactive<Record<string, string>>({ ...props.errors });

watch(
  () => props.errors,
  (newErrors) => {
    if (!newErrors) return;
    Object.keys(errors).forEach((key) => delete errors[key]);
    Object.assign(errors, newErrors);
  },
  { deep: true, immediate: true } 
);

function submit() {
  emit("submit", { ...formData });
}
</script>
