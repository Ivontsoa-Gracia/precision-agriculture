<template>
  <nav
    aria-label="Breadcrumb"
    class="flex items-center gap-2 text-sm text-gray-500 mb-10"
  >
    <NuxtLink to="/dashboard/s" class="flex items-center hover:text-[#10b481]">
      {{ t("home") }}
    </NuxtLink>

    <template v-for="(item, index) in breadcrumbs" :key="item.to">
      <i class="bx bx-chevron-right text-gray-400"></i>

      <NuxtLink
        v-if="index < breadcrumbs.length - 1"
        :to="item.to"
        class="hover:text-[#10b481] capitalize"
      >
        {{ item.label }}
      </NuxtLink>

      <span v-else class="text-gray-800 font-semibold capitalize">
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const route = useRoute();
const languageStore = useLanguageStore();

const t = (key: string) => {
  const lang = languageStore.lang;
  return translate[lang][key] || key;
};

const labelMap: Record<string, string> = {
  dashboard: t("dashboard"),
  post: t("posts"),
  posts: t("posts"),
  categories: t("category"),
  products: t("product"),
  users: t("user"),
  admin: "Admin",
  bid: t("bid"),
  bids: t("bid"),
  chatbox: t("chatbox"),
  notification: t("notif"),
};

const breadcrumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  let fullPath = "";

  return segments.map((segment) => {
    fullPath += `/${segment}`;

    return {
      label: labelMap[segment] || segment.replace(/-/g, " "),
      to: fullPath,
    };
  });
});
</script>
