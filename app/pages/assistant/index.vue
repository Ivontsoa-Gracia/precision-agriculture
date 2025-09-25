<template>
    <div class="relative flex flex-col h-full bg-gray-50">
      
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
  
      <div 
        v-if="showWelcome && messages.length === 0" 
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <h1 class="text-4xl md:text-5xl font-extrabold text-[#222831] text-center animate-fade-in">
          👩‍🌾 Je suis <span class="text-green-600">Sesile</span>, votre assistant Agronomist.<br>
          Posez-moi vos questions agricoles !
        </h1>
      </div>
  
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
  
  definePageMeta({
    layout: 'dashboard'
  })
  
  const messages = ref<{ sender: string; text: string }[]>([])
  const inputMessage = ref('')
  const chatContainer = ref<HTMLElement | null>(null)
  const isLoading = ref(false)
  const showWelcome = ref(true)
  
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
        text: "👩‍🌾 Je suis **Sesile**, votre assistant Agronomist. Posez-moi vos questions agricoles !"
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
        "https://mvp-dvws.onrender.com/api/assistant-agronome/",
        {
          question: userMessage,
          question_type: "general",
          parcel_id: null,
          crop_name: null,
          user_modules: {}
        },
        { headers: { Authorization: `Token ${token}` } }
      )
  
      isLoading.value = false
      messages.value.push({ sender: 'ai', text: res.data.answer })
  
    } catch (err: any) {
      console.error("Erreur API :", err)
      isLoading.value = false
      messages.value.push({
        sender: 'ai',
        text: "⚠️ Erreur lors de la communication avec l'assistant."
      })
    }
  
    await nextTick()
    chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' })
  }
  </script>
  
  <style scoped>
  html, body { margin: 0; padding: 0; height: 100%; }
  
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #f0f0f0; }
  ::-webkit-scrollbar-thumb { background: #c0c0c0; border-radius: 4px; }
  
  .typing-dots::after {
    content: '...';
    animation: dots 1.5s steps(5, end) infinite;
  }
  @keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
  }
  
  @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
  .animate-fade-in { animation: fade-in 1.2s ease-in-out; }
  </style>
  