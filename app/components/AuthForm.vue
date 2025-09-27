<template>
  <div class="relative w-full max-w-md mx-auto my-20">
    <!-- Logo -->
    <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
      <img src="/logo.png" alt="Logo" class="h-24 w-auto rounded-full border-4 border-white shadow-lg" />
    </div>

    <div class="bg-[#101010] p-8 pt-20 rounded-3xl shadow-xl w-full relative z-0">
      <h2 class="text-3xl font-bold mb-6 text-center text-white">{{ title }}</h2>
      
      <form @submit.prevent="submit" class="space-y-4">
        <div v-for="field in fields" :key="field" class="relative">
          <!-- Icon mapping -->
          <i 
            :class="icons[field] + ' text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 text-lg'">
          </i>

          <!-- Input -->
          <input
            v-model="formData[field]"
            :type="field === 'password' ? 'password' : 'text'"
            placeholder=" "
            class="peer w-full p-3 pl-10 rounded-lg border border-gray-600 bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10b481]"
          />

          <!-- Label -->
          <label
            :for="field"
            class="absolute left-10 text-gray-400 text-base pointer-events-none transition-all duration-200
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#10b481] peer-focus:bg-[#101010] px-2 rounded"
                  :class="[
                'absolute left-10 px-2 rounded transition-all duration-200 pointer-events-none',
                (formData[field] || fieldHasFocus[field])
                  ? '-top-3 text-sm text-[#10b481] bg-[#101010]'
                  : 'top-3 text-base text-[#10b481]'
              ]"
          >
            {{ labels[field] || passwordLabel }}
          </label>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          class="w-full py-3 bg-gradient-to-r from-[#10b481] to-[#0a8f6e] text-white font-bold rounded-lg hover:bg-[#0da06a] transition-all duration-300 shadow-md"
        >
          {{ buttonText }}
        </button>
      </form>

      <!-- Footer links slot -->
      <div class="mt-6 text-center text-gray-300 space-x-4">
        <slot name="footer-links"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{
  title: string
  buttonText: string
  fields: string[]
  passwordLabel?: string
}>()

const emit = defineEmits<{
  (e: 'submit', formData: Record<string,string>): void
}>()

// Initialise les champs dynamiquement
const formData = reactive<Record<string,string>>({})
props.fields.forEach(f => formData[f] = '')

// Suivi du focus de chaque champ
const fieldHasFocus = reactive<Record<string, boolean>>({})
props.fields.forEach(f => fieldHasFocus[f] = false)

// Mapping icônes et labels
const icons: Record<string,string> = {
  username: 'bx bx-user',
  first_name: 'bx bx-id-card',
  last_name: 'bx bx-id-card',
  email: 'bx bx-envelope',
  password: 'bx bx-lock-alt'
}

const labels: Record<string,string> = {
  username: "Username",
  first_name: "First name",
  last_name: "Last name",
  email: "Email"
}

// Submit
function submit() {
  emit('submit', { ...formData })
}
</script>
