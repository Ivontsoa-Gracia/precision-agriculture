<template>
  <div class="relative flex flex-col h-full bg-gray-50">
    <div class="absolute top-4 right-4 z-50">
      <button
        @click="$router.back()"
        class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full shadow hover:bg-gray-200 transition"
      >
        <i class="bx bx-x text-2xl"></i>
      </button>
    </div>

    <div
      ref="chatContainer"
      class="absolute top-0 left-0 right-0 bottom-64 p-4 overflow-y-auto space-y-3"
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
              : 'bg-white text-gray-800 rounded-bl-none',
          ]"
        >
          <span v-html="formatMessage(msg.text)"></span>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-white px-4 py-2 rounded-xl shadow-md animate-pulse">
          <span class="typing-dots"></span>
        </div>
      </div>
    </div>

    <div
      v-if="showWelcome && messages.length === 0"
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <h1
        class="text-4xl md:text-5xl font-extrabold text-[#222831] text-center animate-fade-in"
      >
        I'm <span class="text-[#10b481]">Sesile</span>, your Agronomist
        Assistant. <br />Ask me your farming questions!
      </h1>
    </div>

    <div
      class="absolute left-0 right-0 bottom-24 p-4 bg-white border-t shadow-lg flex flex-wrap gap-3"
    >
      <label
        v-for="module in modulesList"
        :key="module"
        class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200"
      >
        <input
          type="checkbox"
          v-model="selectedModules"
          :value="module"
          class="accent-green-500"
        />
        <span class="text-gray-800">{{ module }}</span>
      </label>
    </div>

    <div
      class="absolute left-0 right-0 flex items-center p-4 bg-white border-t shadow-lg"
      style="bottom: 10px"
    >
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Écris un message..."
        class="flex-1 p-3 border rounded-l-full focus:outline-none focus:ring-2 focus:ring-green-400"
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
import { ref, nextTick } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { API_URL } from "~/config";

definePageMeta({ layout: "dashboard" });

const route = useRoute();
const parcelId = route.params.id;

const messages = ref<{ sender: string; text: string }[]>([]);
const inputMessage = ref("");
const chatContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const showWelcome = ref(true);

const modulesList = [
  "Parcel",
  "Soil",
  "Taches",
  "Culture",
  "Meteo",
  "Historique de rendement",
];
const selectedModules = ref<string[]>([]);

function formatMessage(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)$/gm, "• $1")
    .replace(/\n/g, "<br>");
}

function buildModulesPayload() {
  const payload: Record<string, boolean> = {};
  modulesList.forEach((module) => {
    payload[module] = selectedModules.value.includes(module);
  });
  return payload;
}

async function sendMessage() {
  if (!inputMessage.value.trim()) return;

  if (showWelcome.value) {
    messages.value.push({
      sender: "ai",
      text: "I’m **Sesile**, your Agronomist Assistant. Ask me your farming questions!",
    });
    showWelcome.value = false;
  }

  messages.value.push({ sender: "user", text: inputMessage.value });
  const userMessage = inputMessage.value;
  inputMessage.value = "";

  await nextTick();
  chatContainer.value?.scrollTo({
    top: chatContainer.value.scrollHeight,
    behavior: "smooth",
  });

  try {
    isLoading.value = true;
    const token = sessionStorage.getItem("token");

    const res = await axios.post(
      `${API_URL}/api/assistant-agronome/`,
      {
        question: userMessage,
        question_type: "general",
        parcel_id: parcelId,
        crop_name: null,
        user_modules: buildModulesPayload(),
      },
      {
        headers: { Authorization: `Token ${token}` },
      }
    );

    messages.value.push({ sender: "ai", text: res.data.answer });
  } catch (err: any) {
    console.error("Erreur API :", err);
    messages.value.push({
      sender: "ai",
      text: "⚠️ Erreur lors de la communication avec l'assistant.",
    });
  } finally {
    isLoading.value = false;
    await nextTick();
    chatContainer.value?.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: "smooth",
    });
  }
}
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f0f0f0;
}
::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.typing-dots::after {
  content: "...";
  animation: dots 1.5s steps(5, end) infinite;
}
@keyframes dots {
  0%,
  20% {
    content: ".";
  }
  40% {
    content: "..";
  }
  60%,
  100% {
    content: "...";
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.animate-fade-in {
  animation: fade-in 1.2s ease-in-out;
}
</style>
