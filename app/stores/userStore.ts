import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref, computed, watchEffect, onMounted } from "vue";

export const useUserStore = defineStore("userStore", () => {
  const serverStore = ref({} as Record<string, any>);

  onMounted(() => {
    const stored = useStorage("serverStore", {} as Record<string, any>);
    Object.assign(serverStore.value, stored.value);

    watchEffect(() => {
      stored.value = serverStore.value;
    });
  });

  const isGroupMember = computed(() => !!serverStore.value.groupInfo);
  const groupInfo = computed(() => serverStore.value.groupInfo || null);
  const token = computed(() => serverStore.value.token || null);
  const uuid = computed(() => serverStore.value.uuid || null);

  const setUserData = (data: Record<string, any>) => {
    Object.assign(serverStore.value, data);
  };

  const clearUserData = () => {
    serverStore.value = {};
  };

  return {
    serverStore,
    isGroupMember,
    groupInfo,
    token,
    uuid,
    setUserData,
    clearUserData,
  };
});
