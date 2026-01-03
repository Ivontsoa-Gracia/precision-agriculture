<template>
  <div class="max-w-lg mx-auto py-10 px-6">
    <h2 class="text-2xl font-bold mb-6">Rejoindre un groupe existant</h2>

    <!-- Sélection du groupe -->
    <form @submit.prevent="joinGroup" class="space-y-4">
      <label class="block text-gray-700 font-medium">Sélectionnez un groupe</label>
      <select v-model="selectedGroup" class="w-full border rounded-lg p-3" required>
        <option value="" disabled>-- Choisissez un groupe --</option>
        <option v-for="group in groups" :key="group.uuid" :value="group.uuid">
          {{ group.name }} - {{ group.organisation?.name }}
        </option>
      </select>

      <!-- Sélection du rôle -->
      <div class="flex gap-2 items-center">
        <select v-model="selectedRole" class="flex-1 border rounded-lg p-3" required>
          <option value="" disabled>-- Choisissez un rôle --</option>
          <option v-for="role in roles" :key="role.uuid" :value="role.uuid">
            {{ role.name }}
          </option>
        </select>
        <button type="button" @click="showRoleForm = !showRoleForm" class="bg-green-500 text-white px-3 py-2 rounded-lg">
          + Ajouter un rôle
        </button>
      </div>

      <!-- Formulaire création rôle -->
      <div v-if="showRoleForm" class="space-y-2">
        <input v-model="newRoleName" placeholder="Nom du rôle" class="w-full border p-3 rounded-lg" />
        <select v-model="newRoleType" class="w-full border p-3 rounded-lg">
          <option value="" disabled>-- Type du rôle --</option>
          <option value="LEADER">LEADER</option>
          <option value="SECRETARY">SECRETARY</option>
          <option value="MEMBER">MEMBER</option>
          <option value="AUDITOR">AUDITOR</option>
          <option value="OTHER">OTHER</option>
        </select>
        <button type="button" @click="createRole" class="bg-blue-600 text-white px-3 py-2 rounded-lg">
          Créer rôle
        </button>
      </div>

      <button type="submit" class="w-full bg-green-600 text-white py-3 rounded-xl mt-4">
        Rejoindre le groupe
      </button>
    </form>

    <!-- Si aucun groupe trouvé -->
    <div class="text-center mt-8">
      <p class="text-gray-600 mb-3">Vous ne trouvez pas votre groupe ?</p>
      <button
        @click="router.push('/signup/group/create-organisation')"
        class="w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        Créer une organisation
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from "~/stores/userStore";

import { API_URL } from '~/config'

const router = useRouter()
const userStore = useUserStore()

const groups = ref([])
const roles = ref([])
const selectedGroup = ref('')
const selectedRole = ref('')
const showRoleForm = ref(false)
const newRoleName = ref('')
const newRoleType = ref('')
let token = ''

// Charger les groupes et rôles côté client
onMounted(async () => {
  token = sessionStorage.getItem('token') || ''

  try {
    const res = await $fetch(`${API_URL}/api/groups/groups/`, {
      headers: { Authorization: `Token ${token}` }
    })
    groups.value = res
  } catch (err) {
    console.error('Erreur lors du chargement des groupes', err)
  }

  try {
    const resRoles = await $fetch(`${API_URL}/api/groups/group-roles/`, {
      headers: { Authorization: `Token ${token}` }
    })
    roles.value = resRoles
  } catch (err) {
    console.error('Erreur lors du chargement des rôles', err)
  }
})

// Rejoindre un groupe
async function joinGroup() {
  if (!selectedGroup.value || !selectedRole.value) {
    alert('Veuillez choisir un groupe et un rôle.');
    return;
  }

  const token = sessionStorage.getItem('token') || '';
  const uuid = sessionStorage.getItem('uuid') || '';

  const payload = {
    user_id: uuid,
    group_id: selectedGroup.value,
    role_id: selectedRole.value,
    status: "ACTIVE"
  };

  console.log('Payload envoyé :', payload);

  try {
    await $fetch(`${API_URL}/api/groups/member-groups/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: payload
    });

    const groupRes = await fetch(
      `${API_URL}/api/groups/groups/${selectedGroup.value}/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    if (!groupRes.ok) throw new Error('Impossible de charger le groupe');

    const groupInfo = await groupRes.json();

    userStore.serverStore = {
      token,
      uuid,
      groupId: selectedGroup.value,
      groupInfo
    };

    alert('Vous avez rejoint le groupe !');
  } catch (err) {
    console.error('Erreur lors de la liaison du membre au groupe', err);
    alert('Impossible de rejoindre ce groupe.');
  }
}


// Créer un nouveau rôle
async function createRole() {
  if (!newRoleName.value || !newRoleType.value) {
    alert('Veuillez remplir le nom et le type du rôle')
    return
  }

  try {
    const res = await $fetch(`${API_URL}/api/groups/group-roles/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
      body: {
        name: newRoleName.value,
        role_type: newRoleType.value
      }
    })
    roles.value.push(res)
    newRoleName.value = ''
    newRoleType.value = ''
    showRoleForm.value = false
  } catch (err) {
    console.error('Erreur lors de la création du rôle', err)
    alert('Impossible de créer ce rôle.')
  }
}
</script>
