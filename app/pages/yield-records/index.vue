<template>
    <div class="p-6 mx-auto">
      <h2 class="text-3xl font-bold mb-6 text-[#212121] flex items-center gap-2">
      <i class='bx bx-bar-chart text-3xl text-[#10b481]'></i>
      Yield Records
    </h2>

    <div class="flex justify-end mb-4">
      <button @click="goToCreate" class="flex items-center gap-2 px-4 py-2 bg-[#10b481] text-white rounded-lg hover:bg-[#0da06a] transition">
        <i class='bx bx-plus text-lg'></i> Add Yield Record
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded-xl shadow p-4">
      <table class="min-w-full text-left border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-2 border-b">Date</th>
            <th class="px-6 py-2 border-b">Parcels</th>
            <th class="px-6 py-2 border-b">Area (ha)</th>
            <th class="px-6 py-2 border-b">Crop</th>
            <th class="px-6 py-2 border-b">Yield (kg)</th>
            <th class="px-6 py-2 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="y in paginatedYields" :key="y.id" class="hover:bg-gray-50">
            <td class="px-6 py-2 border-b">{{ y.date }}</td>
            <td class="px-6 py-2 border-b">
              {{ y.parcel_name || '-' }}
              <!-- <pre>{{ JSON.stringify(y.parcelCrop, null, 2) }}</pre> -->

            </td>
            <td class="px-6 py-2 border-b">{{ y.area }}</td>
            <td class="px-6 py-2 border-b">
              {{ y.parcelCrop ? `${y.parcelCrop.crop.name}` : '-' }}
            </td>
            <td class="px-6 py-2 border-b">{{ y.yield_amount }}</td>
            <td class="px-6 py-2 border-b text-center flex justify-center gap-2">
              <button @click="goToShow(y.id)" class="p-2 rounded-full hover:bg-[#10b481]/20">
                <i class="bx bx-show text-[#10b481] text-xl"></i>
              </button>
              <button @click="goToEdit(y.id)" class="p-2 rounded-full hover:bg-[#f4a261]/10">
                <i class="bx bx-edit text-[#f4a261] text-xl"></i>
              </button>
              <button @click="deleteYield(y.id)" class="p-2 rounded-full hover:bg-[#e63946]/10">
                <i class="bx bx-trash text-[#e63946] text-xl"></i>
              </button>
            </td>
          </tr>
          <tr v-if="yields.length === 0">
            <td colspan="6" class="p-6 text-center text-gray-500">No yield records found.</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4 mb-2">
        <button @click="prevPage" :disabled="currentPage === 1" class="flex items-center px-3 py-1 rounded disabled:opacity-50">
          <i class="bx bx-chevron-left"></i> Prev
        </button>

        <div class="flex items-center space-x-2">
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
            :class="['px-3 py-1 rounded', currentPage === page ? 'bg-[#10b481] text-white' : 'bg-gray-100 hover:bg-gray-200']"
            v-if="page !== '...'">
            {{ page }}
          </button>
          <span v-else class="px-2">...</span>
        </div>

        <button @click="nextPage" :disabled="currentPage === totalPages" class="flex items-center px-3 py-1 rounded disabled:opacity-50">
          Next <i class="bx bx-chevron-right"></i>
        </button>
    </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const yields = ref([]);
const currentPage = ref(1);
const perPage = 4; // nombre d'enregistrements par page
const router = useRouter();

const parcelCache = {} 

async function parcelName(id){
  // Retourne directement si déjà en cache
  if (parcelCache[id]) return parcelCache[id]

  const token = sessionStorage.getItem('token')
  if (!token) return id // fallback à l'ID si pas de token

  try {
    const res = await fetch(`https://mvp-dvws.onrender.com/api/parcels/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    })
    if (!res.ok) throw new Error('Parcel API error')
    const data = await res.json()
    parcelCache[id] = data.parcel_name
    return data.parcel_name
  } catch (err) {
    console.error('Erreur récupération parcel:', err)
    return id // fallback à l'ID en cas d'erreur
  }
}

async function fetchParcelCrop(id, token) {
  try {
    const res = await axios.get(`https://mvp-dvws.onrender.com/api/parcel-crops/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    });
    return res.data; // renvoie l'objet parcelCrop complet
  } catch (err) {
    console.error('Error fetching parcelCrop:', err);
    return null;
  }
}

async function fetchYields() {
  const token = sessionStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const res = await axios.get("https://mvp-dvws.onrender.com/api/yield-records/", {
      headers: { Authorization: `Token ${token}` }
    });

    // Pour chaque YieldRecord, récupérer le parcelCrop complet
    const yieldsWithParcelCrop = await Promise.all(
      res.data.map(async y => {
        if (y.parcelCrop) {
          y.parcelCrop = await fetchParcelCrop(y.parcelCrop, token);
          y.parcel_name = await parcelName(y.parcelCrop.parcel, token)
        }
        return y;
      })
    );

    yields.value = yieldsWithParcelCrop;
  } catch (err) {
    console.error(err);
  }
}

function goToCreate() { router.push("/yield-records/create"); }
function goToShow(id) { router.push(`/yield-records/show/${id}`); }
function goToEdit(id) { router.push(`/yield-records/edit/${id}`); }

async function deleteYield(id) {
  if (!confirm("Are you sure you want to delete this Yield Record?")) return;

  try {
    const token = sessionStorage.getItem('token');
    await axios.delete(`https://mvp-dvws.onrender.com/api/yield-records/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    });
    yields.value = yields.value.filter(y => y.id !== id);
    alert("Yield Record deleted successfully.");
  } catch (err) {
    console.error("Error deleting YieldRecord:", err);
    alert("Failed to delete Yield Record.");
  }
}

// Pagination logic
const totalPages = computed(() => Math.ceil(yields.value.length / perPage));
const paginatedYields = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return yields.value.slice(start, start + perPage);
});

function goToPage(page) { currentPage.value = page; }
function prevPage() { if(currentPage.value > 1) currentPage.value--; }
function nextPage() { if(currentPage.value < totalPages.value) currentPage.value++; }

const visiblePages = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  return pages;
});

onMounted(fetchYields);
</script>
