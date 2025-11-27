<template>
  <div class="relative flex flex-col">
    <div
      v-if="isMounted"
      ref="chatContainer"
      class="flex-1 overflow-y-auto px-3 sm:px-24 pt-4 pb-28 space-y-3"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="flex"
        :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          :class="[
            'px-4 py-2 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-sm',
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
          class="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-sm flex items-center"
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
      class="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 pointer-events-none px-4 top-48"
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
  class="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-[900px] w-full bg-[#112830] rounded-lg border border-gray-300 shadow-md p-2 flex flex-col gap-2"
>
  <!-- Ligne de saisie + bouton -->
  <div class="flex w-full items-center gap-2 relative">
    <!-- Champ de saisie -->
    <button
      @click="showOptions = !showOptions"
      class="bg-white/10 text-white p-2 px-3 rounded hover:bg-gray-300 transition"
    >
    <i class='bxr  bx-plus'></i> 
    </button>
    <input
      v-model="inputMessage"
      @keyup.enter="sendMessage"
      type="text"
      :placeholder="t('ask')"
      class="bg-transparent text-white flex-1 p-2 text-sm outline-none"
    />

    <button
      @click="sendMessage"
      class="bg-[#10b481] text-white rounded p-2 px-3 hover:bg-[#0d946b] transition flex items-center justify-center"
    >
      <i class="bx bx-up-arrow-alt text-lg"></i>
    </button>

    <!-- Menu flottant au-dessus -->
    <transition name="fade">
      <div
        v-if="showOptions"
        class="absolute bottom-full left-0 mb-2 w-[400px] sm:w-[500px] bg-gray-50 border border-gray-200 rounded shadow-lg p-3 z-50"
      >
        <!-- Bouton X pour fermer -->
        <div class="flex justify-end mb-2">
          <button
            @click="showOptions = false"
            class="text-gray-500 hover:text-gray-700 font-bold"
          >
            &times;
          </button>
        </div>

        <!-- Parcelle + Crop -->
        <div class="flex flex-col sm:flex-row sm:gap-2 w-full text-sm mb-2">
          <div class="flex-1 flex flex-col">
            <label class="mb-1">Parcel</label>
            <select v-model="selectedParcel" class="w-full p-1 border rounded focus:ring-1 focus:ring-[#10b481]">
              <option v-for="parcel in parcels" :key="parcel.uuid" :value="parcel.uuid">
                {{ parcel.parcel_name }}
              </option>
            </select>
          </div>
          <div class="flex-1 flex flex-col">
            <label class="mb-1">Crop</label>
            <select v-model="selectedCrop" class="w-full p-1 border rounded focus:ring-1 focus:ring-[#10b481]">
              <option v-for="crop in crops" :key="crop.id" :value="crop.name">
                {{ crop.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Modules / checkboxes -->
        <div class="flex flex-wrap items-center gap-3 text-sm pt-1 border-t border-gray-200">
          <label v-for="module in moduleKeys" :key="module" class="flex items-center gap-1">
            <input type="checkbox" v-model="userModules[module]" class="w-3 h-3 accent-[#10b481]" />
            <span class="capitalize">{{ module.replace('_', ' ') }}</span>
          </label>
        </div>
      </div>
    </transition>
  </div>
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
const showOptions = ref(false);


const parcels = ref<any[]>([]);
const crops = ref<any[]>([]);
const selectedParcel = ref("");
const selectedCrop = ref("");
const moduleKeys = [
  "parcel",
  "crop",
  "soil",
  "weather",
  "tasks",
  "yield_records",
];
const userModules = ref<Record<string, boolean>>({
  parcel: false,
  crop: false,
  soil: false,
  weather: false,
  tasks: false,
  yield_records: false,
});

onMounted(async () => {
  isMounted.value = true;

  if (footer.value) {
    footerHeight.value = footer.value.offsetHeight + 10;
  }

  // Charger parcelles et cultures
  const token = sessionStorage.getItem("token");
  try {
    const [parcelsRes, cropsRes] = await Promise.all([
      axios.get(`${API_URL}/api/parcels/`, {
        headers: { Authorization: `Token ${token}` },
      }),
      axios.get(`${API_URL}/api/crops/`, {
        headers: { Authorization: `Token ${token}` },
      }),
    ]);

    parcels.value = parcelsRes.data;
    crops.value = cropsRes.data;
  } catch (err) {
    console.error("Error fetching parcels or crops", err);
  }
});

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

async function sendMessage(isSuggestion = false) {
  if (!inputMessage.value.trim()) return;

  if (showWelcome.value) {
    messages.value.push({
      sender: "ai",
      text: t("welcomeMessage"),
    });
    showWelcome.value = false;
  }

  const userMessage = inputMessage.value;
  messages.value.push({ sender: "user", text: userMessage });
  inputMessage.value = "";

  await nextTick();
  chatContainer.value?.scrollTo({
    top: chatContainer.value.scrollHeight,
    behavior: "smooth",
  });

  try {
    isLoading.value = true;
    const token = sessionStorage.getItem("token");

    // Définir les valeurs pour l’API
    const payload = {
      question: userMessage,
      question_type: "general",
      parcel_id: isSuggestion || !selectedParcel.value ? null : selectedParcel.value,
      crop_name: isSuggestion || !selectedCrop.value ? null : selectedCrop.value,
      user_modules:
        isSuggestion || Object.values(userModules.value).every(v => !v)
          ? {
              parcel: false,
              crop: false,
              soil: false,
              weather: false,
              tasks: false,
              yield_records: false,
            }
          : userModules.value,
    };

    const res = await axios.post(`${API_URL}/api/assistant-agronome/`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    isLoading.value = false;

    const text = res.data || "No response";
    messages.value.push({ sender: "ai", text });
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

// Pour les questions suggérées
function askSuggestedQuestion(question: string) {
  inputMessage.value = question;
  sendMessage(true);
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
