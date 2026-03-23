<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm">

    <template v-for="(item, index) in breadcrumbs" :key="item.to">
      <i class="bx bx-chevron-right text-gray-300 text-xs"></i>

      <NuxtLink
        v-if="index < breadcrumbs.length - 1"
        :to="item.to"
        class="px-2 text-gray-700 small text-sm hover:text-[#10b981] transition "
      >
        {{ item.label }}
      </NuxtLink>

      <span v-else class="px-2 text-[#10b981] small text-sm ">
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
  tasks: t("tasks"),
  "yield-records": t("yields"),
  insights: t("home"),
  parcels: t("parcel"),
  "parcel-crops": t("crops"),
  "crops": t("crops"),
  help: t("help"),
  profil: t("account"),
  create: t("create"),
  edit: t("edit"),
  show: t("show"), 
  assistant: "Sesily",
};

const isDynamicSegment = (segment: string) => {
  if (!isNaN(Number(segment))) return true;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (uuidRegex.test(segment)) return true;

  return false;
};

const breadcrumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  let fullPath = "";

  return segments
    .filter((segment) => !isDynamicSegment(segment))
    .map((segment) => {
      fullPath += `/${segment}`;

      return {
        label: labelMap[segment] || segment.replace(/-/g, " "),
        to: fullPath,
      };
    });
});
</script>
