<template>
  <div class="relative flex flex-col h-full bg-gray-50">
    <!-- Messages -->
    <div
      class="absolute top-0 left-0 right-0 bottom-40 p-4 overflow-y-auto space-y-3"
      ref="chatContainer"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="flex"
        :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          :class="[
            'px-4 py-2 rounded-xl max-w-2xl break-words shadow-md',
            msg.sender === 'user'
              ? 'bg-[#10b481] text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none'
          ]"
        >
          <span v-html="formatMessage(msg.text)"></span>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-white text-gray-800 px-4 py-2 rounded-xl shadow-md">
          <span class="typing-dots"></span>
        </div>
      </div>
    </div>

    <!-- Bienvenue -->
    <div 
      v-if="showWelcome && messages.length === 0" 
      class="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 pointer-events-none"
    >
      <h1 class="text-4xl md:text-5xl font-extrabold text-[#222831] animate-fade-in">
        I'm <span class="text-[#10b481]">Sesile</span>, your Agronomist Assistant. <br/>Ask me your farming questions!
      </h1>

      <!-- Questions suggérées -->
      <div class="flex flex-wrap gap-3 justify-center pointer-events-auto">
        <button
          v-for="(q, i) in suggestedQuestions"
          :key="i"
          @click="askSuggestedQuestion(q)"
          class="px-4 py-2 text-sm bg-white border rounded-full shadow hover:bg-gray-100 transition"
        >
          {{ q }}
        </button>
      </div>
    </div>

    <!-- Input -->
    <div
      class="absolute left-0 right-0 flex items-center p-4 bg-white border-t shadow-lg"
      style="bottom: 10px;"
    >
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Écris un message..."
        class="flex-1 p-3 border rounded-l-full focus:outline-none"
      />
      <button
        @click="sendMessage"
        class="bg-black text-white p-3 rounded-r-full hover:bg-gray-800 flex items-center justify-center ml-2"
      >
        <i class="bx bx-up-arrow-alt text-2xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import axios from 'axios'
import { API_URL } from '~/config'

definePageMeta({
  layout: 'dashboard'
})

const messages = ref<{ sender: string; text: string }[]>([])
const inputMessage = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)
const showWelcome = ref(true)

// Questions recommandées
const suggestedQuestions = ref([
  "What is the best fertilizer for rice?",
  "How do I prevent maize pests?",
  "When should I plant cassava?",
  "What is the right spacing for tomato plants?",
  "How can I improve soil fertility?"
])

function formatMessage(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*)$/gm, '• $1')
    .replace(/\n/g, '<br>')
}

async function sendMessage() {
  if (!inputMessage.value.trim()) return

  if (showWelcome.value) {
    messages.value.push({
      sender: 'ai',
      text: "I’m **Sesile**, your Agronomist Assistant. Ask me your farming questions!"
    })
    showWelcome.value = false
  }

  messages.value.push({ sender: 'user', text: inputMessage.value })
  const userMessage = inputMessage.value
  inputMessage.value = ''

  await nextTick()
  chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' })

  try {
    isLoading.value = true
    const token = sessionStorage.getItem("token")
    const res = await axios.post(
      `${API_URL}/api/assistant-agronome/`,
      {
        question: userMessage,
        question_type: "general",
        parcel_id: null,
        crop_name: null,
        user_modules: {}
      },
      {
        headers: { Authorization: `Token ${token}` }
      }
    )

    isLoading.value = false
    messages.value.push({ sender: 'ai', text: res.data.answer })

  } catch (err: any) {
    console.error("Error API :", err)
    isLoading.value = false
    messages.value.push({
      sender: 'ai',
      text: "Error while communicating with the assistant."
    })
  }

  await nextTick()
  chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' })
}

// Envoi direct d’une question suggérée
function askSuggestedQuestion(question: string) {
  inputMessage.value = question
  sendMessage()
}
</script>

<style scoped>
.typing-dots {
  display: inline-block;
  width: 1.2em;
  text-align: left;
}

.typing-dots::after {
  content: "···";
  display: inline-block;
  animation: blink 1.5s infinite;
  font-weight: bold;
  letter-spacing: 2px;
}

@keyframes blink {
  0% {
    content: "·  ";
  }
  33% {
    content: "·· ";
  }
  66% {
    content: "···";
  }
  100% {
    content: "·  ";
  }
}
</style>
