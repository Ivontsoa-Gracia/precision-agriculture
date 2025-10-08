<template>
  <div class="relative flex flex-col h-screen mb-10 sm:mb-1">
    <div
      v-if="isMounted"
      class="absolute top-0 left-0 right-0 p-2 sm:p-4 overflow-y-auto space-y-3"
      :style="{ bottom: footerHeight + 'px' }"
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
            'px-3 sm:px-4 py-2 sm:py-3 rounded-xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg break-words shadow-md',
            msg.sender === 'user'
              ? 'bg-[#10b481] text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none',
          ]"
        >
          <span v-html="formatMessage(msg.text)"></span>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-start">
        <div
          class="bg-white text-gray-800 px-4 py-2 rounded-xl shadow-md flex items-center"
        >
          <span class="typing-dots flex space-x-1">
            <span
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            ></span>
            <span
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"
            ></span>
            <span
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"
            ></span>
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="showWelcome && messages.length === 0"
      class="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 pointer-events-none px-4"
    >
      <h1
        class="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#222831] animate-fade-in"
        v-html="t('heroTitle')"
      ></h1>

      <div
        class="flex flex-wrap gap-2 sm:gap-3 justify-center pointer-events-auto"
      >
        <button
          v-for="(q, i) in suggestedQuestions"
          :key="i"
          @click="askSuggestedQuestion(q)"
          class="px-3 sm:px-4 py-2 text-sm sm:text-base bg-white border rounded-full shadow hover:bg-gray-100 transition"
        >
          {{ q }}
        </button>
      </div>
    </div>

    <div
    ref="footer"
    class="fixed left-0 right-0 flex items-center p-2 sm:p-4 chat-footer mb-12 sm:mb-1 bg-white z-10"
    style="bottom: 0"
  >
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        type="text"
        :placeholder="t('ask')"
        class="flex-1 p-2 sm:p-3 border rounded-l-full focus:outline-none text-sm sm:text-base"
      />
      <button
        @click="sendMessage"
        class="bg-black text-white p-2 sm:p-3 rounded-r-full ml-2 hover:bg-gray-800 flex items-center justify-center"
      >
        <i class="bx bx-up-arrow-alt text-xl sm:text-2xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import axios from "axios";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
definePageMeta({ layout: "dashboard" });
const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;

const messages = ref<{ sender: string; text: string }[]>([]);
const inputMessage = ref("");
const chatContainer = ref<HTMLElement | null>(null);
const footer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const showWelcome = ref(true);
const suggestedQuestions = ref(t("suggestedQuestions"));
const footerHeight = ref(80); 
const isMounted = ref(false); 

onMounted(() => {
  isMounted.value = true;

  if (footer.value) {
    footerHeight.value = footer.value.offsetHeight + 10;
  }
});

function formatMessage(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)$/gm, "• $1")
    .replace(/\n/g, "<br>");
}

async function sendMessage() {
  if (!inputMessage.value.trim()) return;

  if (showWelcome.value) {
    messages.value.push({
      sender: "ai",
      text: t("welcomeMessage"),
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
        parcel_id: null,
        crop_name: null,
        user_modules: {},
      },
      {
        headers: { Authorization: `Token ${token}` },
      }
    );

    isLoading.value = false;
    messages.value.push({ sender: "ai", text: res.data.answer });
  } catch (err: any) {
    console.error("Error API :", err);
    isLoading.value = false;
    messages.value.push({
      sender: "ai",
      text: "Error while communicating with the assistant.",
    });
  }

  await nextTick();
  chatContainer.value?.scrollTo({
    top: chatContainer.value.scrollHeight,
    behavior: "smooth",
  });
}

function askSuggestedQuestion(question: string) {
  inputMessage.value = question;
  sendMessage();
}
</script>

<style scoped>
.typing-dots span {
  display: inline-block;
  animation: bounce 0.6s infinite alternate;
}
.typing-dots span.delay-150 {
  animation-delay: 0.15s;
}
.typing-dots span.delay-300 {
  animation-delay: 0.3s;
}

@keyframes bounce {
  from {
    transform: translateY(0);
    opacity: 0.3;
  }
  to {
    transform: translateY(-6px);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
