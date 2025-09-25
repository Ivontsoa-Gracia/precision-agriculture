<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl">
    <!-- Header -->
    <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-3">
      <i class='bx bx-edit text-3xl text-[#10b481]'></i>
      Edit Yield Record
    </h2>

    <form @submit.prevent="update" class="space-y-6">
      <!-- Row 1: Date & Yield Amount -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="font-semibold mb-1">Date</label>
          <input v-model="form.date" type="date"
            class="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]" />
        </div>

        <div class="flex flex-col">
          <label class="font-semibold mb-1">Yield Amount</label>
          <input v-model.number="form.yield_amount" type="number" step="0.01"
            class="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]" />
        </div>
      </div>

      <!-- Row 2: Area & Notes -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div class="flex flex-col">
          <label class="font-semibold mb-1">Area</label>
          <input v-model.number="form.area" type="number" step="0.01"
            class="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]" />
        </div>

        <div class="flex flex-col">
          <label class="font-semibold mb-1">Notes</label>
          <textarea v-model="form.notes"
            class="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#212121]"></textarea>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit"
        class="w-full bg-gradient-to-r from-[#10b481] to-[#0a8f6e] text-white py-3 rounded-2xl text-lg flex justify-center items-center gap-2 hover:scale-105 transition-transform shadow-md">
        <i class='bx bx-save text-xl'></i>
        Update Yield
      </button>
    </form>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const form = ref({
  date: "",
  yield_amount: 0,
  area: 0,
  notes: "",
});

async function fetchYield() {
  const token = sessionStorage.getItem('token');
  if (!token) { router.push('/login'); return; }

  try {
    const res = await axios.get(
      `https://mvp-dvws.onrender.com/api/yield-records/${route.params.id}/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    form.value = {
      date: res.data.date || "",
      yield_amount: res.data.yield_amount || 0,
      area: res.data.area || 0,
      notes: res.data.notes || ""
    };
  } catch (err) {
    console.error(err);
  }
}

async function update() {
  const token = sessionStorage.getItem('token');
  if (!token) { router.push('/login'); return; }

  try {
    await axios.put(
      `https://mvp-dvws.onrender.com/api/yield-records/${route.params.id}/`,
      form.value,
      { headers: { Authorization: `Token ${token}` } }
    );
    router.push(`/yield-records`);
  } catch (err) {
    console.error(err);
  }
}

onMounted(fetchYield);
</script>
