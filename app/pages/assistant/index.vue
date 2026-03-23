<template>
  <div class="relative flex flex-col small">
    <div
      v-if="isMounted"
      ref="chatContainer"
      class="flex-1 overflow-y-auto px-3 sm:px-60 pt-4 pb-28 space-y-3 small"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="flex"
        :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          :class="[
            'px-4 py-2 rounded-xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-sm small',
            msg.sender === 'user'
              ? 'bg-[#10b481] text-white rounded-br-md'
              : 'bg-white text-gray-700 rounded-bl-md border border-gray-200',
          ]"
        >
          <span v-html="formatMessage(msg.text)"></span>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-start">
        <div
          class="bg-white text-gray-700 rounded-bl-none border border-gray-200 px-4 py-2 rounded-lg shadow-sm flex items-center"
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
      <h2
        class="text-2xl sm:text-4xl font-extrabold text-[#222831] animate-fade-in"
        v-html="t('heroTitle')"
      ></h2>

      <div
        class="flex flex-wrap gap-2 sm:gap-3 justify-center pointer-events-auto max-w-5xl"
      >
        <button
          v-for="(q, i) in suggestedQuestions"
          :key="i"
          @click="askSuggestedQuestion(q)"
          class="px-3 sm:px-4 py-2 text-sm content sm:text-base bg-white border rounded-full border border-gray-200 hover:bg-[#fafaf9] transition"
        >
          {{ q }}
        </button>
      </div>
    </div>

    <div class="fixed bottom-6 left-0 w-full z-40 relative">

      <div class="absolute bottom-0 left-0 w-full h-32 bg-[#fafaf9]"></div>

      <div
        class="absolute bottom-32 left-0 w-full h-16 bg-gradient-to-t from-[#fafaf9] to-transparent"
      ></div>

      <div class="relative flex justify-center pb-6">
        <div class="w-full max-w-3xl px-4">
          <div
            class="relative flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl px-3 py-2"
          >
            <button
              @click="showOptions = !showOptions"
              class="text-gray-500 hover:text-[#10b481] transition p-2"
            >
              <i class="bx bx-plus text-lg"></i>
            </button>

            <input
              v-model="inputMessage"
              @keyup.enter="sendMessage"
              type="text"
              :placeholder="t('ask')"
              class="flex-1 bg-transparent outline-none content placeholder-gray-400"
            />

            <button
              @click="sendMessage"
              class="bg-[#10b481] text-white rounded-xl px-3 py-2 hover:bg-[#0d946b] transition shadow"
            >
              <i class="bx bx-up-arrow-alt text-lg"></i>
            </button>

            <transition name="fade">
              <div
                v-if="showOptions"
                class="absolute bottom-full left-0 mb-3 w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 max-w-xl"
              >
                <div class="flex justify-between items-center mb-3">
                  <span class="subtitle">
                    Options
                  </span>
                  <button
                    @click="showOptions = false"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <i class="bx bx-x"></i>
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label class="label mb-1 block">
                      {{ t("parcels") }}
                    </label>
                    <select v-model="selectedParcel" class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all">
                      <option
                        v-for="parcel in parcels"
                        :key="parcel.uuid"
                        :value="parcel.uuid"
                      >
                        {{ parcel.parcel_name }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="label mb-1 block">
                      {{ t("crops") }}
                    </label>
                    <select v-model="selectedCrop" class="w-full px-4 py-3 small text-sm text-gray-700 text-sm rounded-xl border border-gray-200 focus:border-[#10b481] focus:ring-4 focus:ring-[#10b481]/10 outline-none transition-all">
                      <option
                        v-for="crop in crops"
                        :key="crop.id"
                        :value="crop.name"
                      >
                        {{ crop.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="flex flex-wrap gap-8 border-t pt-3">
                  <label
                    v-for="module in moduleKeys"
                    :key="module"
                    class="flex items-center gap-1"
                  >
                    <input
                      type="checkbox"
                      v-model="userModules[module]"
                      class="accent-[#10b481]"
                    />
                    <span class="capitalize label">
                      {{ module.replace("_", " ") }}
                    </span>
                  </label>
                </div>
              </div>
            </transition>
          </div>
        </div>
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

const parcelCrops = ref<any[]>([]);
const parcels = ref<any[]>([]);
const crops = ref<any[]>([]);
const cachedParcels = useState<any[]>("cachedParcels", () => []);
const cachedCrops = useState<any[]>("cachedCrops", () => []);
const cachedParcelCrops = useState<Record<string, any[]>>(
  "cachedParcelCrops",
  () => ({})
);
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

  const token = sessionStorage.getItem("token");

  if (!cachedParcels.value.length) {
    try {
      const parcelsRes = await axios.get(`${API_URL}/api/parcels/`, {
        headers: { Authorization: `Token ${token}` },
      });
      cachedParcels.value = parcelsRes.data;
    } catch (err) {
      console.error("Error fetching parcels:", err);
      cachedParcels.value = [];
    }
  }
  parcels.value = cachedParcels.value;

  if (!cachedCrops.value.length) {
    try {
      const cropsRes = await axios.get(`${API_URL}/api/crops/`, {
        headers: { Authorization: `Token ${token}` },
      });
      cachedCrops.value = cropsRes.data;
    } catch (err) {
      console.error("Error fetching crops:", err);
      cachedCrops.value = [];
    }
  }
  crops.value = cachedCrops.value;
});

async function fetchParcelCrops(parcelId: string) {
  if (!parcelId) {
    parcelCrops.value = [];
    return;
  }

  if (cachedParcelCrops.value[parcelId]) {
    parcelCrops.value = cachedParcelCrops.value[parcelId];
    return;
  }

  const token = sessionStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/api/parcel-crops/`, {
      headers: { Authorization: `Token ${token}` },
    });

    const cropsForParcel = res.data
      .filter((pc: any) => pc.parcel === parcelId)
      .map((pc: any) => pc.crop);

    cachedParcelCrops.value[parcelId] = cropsForParcel;
    parcelCrops.value = cropsForParcel;
  } catch (err) {
    console.error("Error fetching parcel crops:", err);
    parcelCrops.value = [];
  }
}

watch(selectedParcel, (newParcel) => {
  fetchParcelCrops(newParcel);
  selectedCrop.value = "";
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
  text = text.replace(/((?:\|.*\|\n)+)/g, (table) => {
    const rows = table.trim().split("\n");

    const cleanRows = rows.filter((row, index) => index !== 1);

    const htmlRows = cleanRows.map((row, index) => {
      const cells = row
        .split("|")
        .filter((cell) => cell.trim() !== "")
        .map((cell) =>
          index === 0 ? `<th>${cell.trim()}</th>` : `<td>${cell.trim()}</td>`
        )
        .join("");

      return `<tr>${cells}</tr>`;
    });

    return `<table>${htmlRows.join("")}</table>`;
  });

  text = text.replace(/^###\s+(.*)$/gm, "<strong>$1</strong>");
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
  text = text.replace(/^- (.*)$/gm, "• $1");
  text = text.replace(/^---$/gm, "<hr>");
  text = text.replace(/^\d+\.\s+(.*)$/gm, "• $1");
  text = text.replace(/\n/g, "<br>");

  return text;
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
      parcel_id:
        isSuggestion || !selectedParcel.value ? null : selectedParcel.value,
      crop_name:
        isSuggestion || !selectedCrop.value ? null : selectedCrop.value,
      user_modules:
        isSuggestion || Object.values(userModules.value).every((v) => !v)
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

    const res = await axios.post(
      `${API_URL}/api/assistant-agronome/`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

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
