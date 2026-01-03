<template>
  <div class="p-1 sm:p-6">
    <div class="relative z-10 mb-6">
      <h2
        class="text-xl sm:text-3xl font-bold text-[#212121] flex items-center gap-2"
      >
        Group Overview
      </h2>
      <p class="text-gray-500">
        Comprehensive information about your group at a glance.
      </p>
    </div>
    <div class=" space-y-12">
      <section v-if="groupInfo" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-4">
            <i class="bx bx-group text-gray-400 text-xl"></i>
            <h3 class="text-lg font-medium text-gray-700">Group Name</h3>
          </div>
          <p class="text-gray-900 text-xl">{{ groupInfo.name }}</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-4">
            <i class="bx bx-activity text-gray-400 text-xl"></i>
            <h3 class="text-lg font-medium text-gray-700">Status</h3>
          </div>
          <span
            :class="
              groupInfo.status === 'ACTIVE'
                ? 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'
                : 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800'
            "
          >
            {{ groupInfo.status }}
          </span>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-4">
            <i class="bx bx-user-plus text-gray-400 text-xl"></i>
            <h3 class="text-lg font-medium text-gray-700">Created by</h3>
          </div>
          <p class="text-gray-900">
            {{ groupInfo.created_by || "Loading..." }}
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-4">
            <i class="bx bx-calendar text-gray-400 text-xl"></i>
            <h3 class="text-lg font-medium text-gray-700">Created at</h3>
          </div>
          <p class="text-gray-900">{{ formatDate(groupInfo.created_at) }}</p>
        </div>
      </section>

      <section v-if="groupInfo && groupInfo.organisation">
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div class="flex items-start">
            <div class="w-2 bg-blue-500 h-full"></div>
            <div class="p-6 w-full">
              <div class="flex items-center gap-3 mb-6">
                <i class="bxr  bx-backpack-star text-gray-400 text-xl"></i>
                <h3 class="text-lg font-medium text-gray-700">Organisation</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Name</p>
                  <p class="text-gray-900">
                    {{ groupInfo?.organisation?.name }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Type</p>
                  <p class="text-gray-900">
                    {{ groupInfo?.organisation?.org_type }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Email</p>
                  <p class="text-gray-900">
                    {{ groupInfo?.organisation?.contact_email }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">Members</h2>
          <button
            v-if="isCreator"
            @click="addMember"
            class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
          >
            <i class="bx bx-plus w-4 h-4"></i>
            <span>Add Member</span>
          </button>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div
            v-for="member in groupMembers"
            :key="member.uuid"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all group"
          >
            <div class="flex items-center gap-4 max-w-xl">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium',
                  memberColor(member),
                ]"
              >
                {{ member.user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 truncate">
                  {{ member.user.username }}
                </h3>
                <p class="text-sm text-gray-500 truncate">
                  {{ member.user.email }}
                </p>
              </div>
              <div class="text-sm text-gray-700">
                <span
                  class="px-2 py-1 rounded-full text-sm"
                  :class="
                    member.role.name === 'Admin'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  "
                >
                  {{ member.role.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "~/stores/userStore";
import axios from "axios";
import { API_URL } from "~/config";
definePageMeta({ layout: "dashboard" });

const userStore = useUserStore();
const groupInfo = computed(
  () => userStore.serverStore.value?.groupInfo || null
);

const groupMembers = ref<any[]>([]);
const currentUser = ref<{ username: string } | null>(null);
const isCreator = computed(
  () => currentUser.value?.username === groupInfo.value?.created_by
);

const fetchGroupMembers = async () => {
  if (!groupInfo.value) return;
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${API_URL}/api/groups/groups/${groupInfo.value.uuid}/members/`,
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    groupMembers.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const fetchUser = async () => {
  const token = sessionStorage.getItem("token");
  const uuid = sessionStorage.getItem("uuid");
  if (!uuid) return;
  try {
    const userRes = await fetch(`${API_URL}/api/users/${uuid}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!userRes.ok) return;
    const userData = await userRes.json();
    currentUser.value = { username: userData.username };
  } catch (error) {
    console.error(error);
  }
};

const addMember = () => alert("Redirect to Add Member page/modal");

onMounted(() => {
  fetchUser();
  fetchGroupMembers();
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const memberColor = (member: any) => {
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-indigo-100 text-indigo-600",
    "bg-green-100 text-green-600",
    "bg-pink-100 text-pink-600",
  ];
  const index = member.user.username.charCodeAt(0) % colors.length;
  return colors[index];
};
</script>
