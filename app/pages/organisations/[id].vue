<template>
  <section class="max-w-7xl mx-auto px-4 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 1/3 — PANNEAU ORGANISATION -->
      <aside class="lg:col-span-4">
        <div class="relative bg-white rounded border shadow-sm p-6 space-y-6">
          <!-- ICON EDIT (TOP RIGHT) -->
          <NuxtLink
            :to="`/organisations/edit/${org.uuid}`"
            class="absolute top-4 right-4 text-gray-400 hover:text-[#10b481] transition"
            title="Modifier l’organisation"
          >
            <i class="bx bx-edit text-lg"></i>
          </NuxtLink>

          <!-- Titre -->
          <div>
            <h1 class="text-2xl font-bold text-[#112830] leading-tight">
              {{ org.name }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              {{ org.org_type }}
            </p>
          </div>

          <!-- Infos clés -->
          <div class="space-y-4 text-sm">
            <div>
              <p class="text-gray-400">Email</p>
              <p class="font-medium break-all">
                {{ org.contact_email || "—" }}
              </p>
            </div>

            <div>
              <p class="text-gray-400">Téléphone</p>
              <p class="font-medium">
                {{ org.phone || "—" }}
              </p>
            </div>

            <div>
              <p class="text-gray-400">Adresse</p>
              <p class="font-medium">
                {{ org.address || "—" }}
              </p>
            </div>

            <div>
              <p class="text-gray-400">Description</p>
              <p class="leading-relaxed">
                {{ org.description || "—" }}
              </p>
            </div>
          </div>

          <!-- Meta -->
          <div class="pt-4 border-t text-xs text-gray-400">
            Créée le {{ formatDate(org.created_at) }}
          </div>
        </div>
      </aside>

      <!-- 2/3 — CONTENU GROUPES -->
      <main class="lg:col-span-8 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-[#112830]">Groupes</h2>
          <span class="text-sm text-gray-500">
            {{ groups.length }} groupe(s)
          </span>
        </div>

        <p v-if="groups.length === 0" class="text-sm text-gray-500">
          Aucun groupe lié à cette organisation.
        </p>

        <!-- Liste groupes -->
        <div class="space-y-4">
          <div
            v-for="group in groups"
            :key="group.uuid"
            class="bg-white rounded border px-6 py-4 hover:shadow transition"
          >
            <!-- Header groupe -->
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <h3 class="text-lg font-semibold text-[#112830]">
                  {{ group.name }}
                </h3>
                <p class="text-xs text-gray-500">
                  {{ group.type?.name || "—" }}
                </p>
              </div>

              <span class="badge" :class="statusClass(group.status)">
                {{
                  group.status
                    ? group.status.charAt(0).toUpperCase() +
                      group.status.slice(1).toLowerCase()
                    : ""
                }}
              </span>
            </div>

            <div class="mt-4">
              <div v-if="group.members?.length" class="space-y-5">
                <div
                  v-for="(roleGroup, roleType) in groupMembersByRole(
                    group.members
                  )"
                  :key="roleType"
                  class="space-y-2"
                >
                  <p
                    class="text-xs font-semibold uppercase tracking-wide"
                    :class="
                      roleType === 'LEADER' ? 'text-[#10b481]' : 'text-gray-500'
                    "
                  >
                    {{ roleGroup.role_name }}
                  </p>

                  <div class="flex flex-wrap gap-3">
                    <div
                      v-for="member in roleGroup.members"
                      :key="member.uuid"
                      class="flex items-center gap-2 rounded-full pr-3 transition"
                      :class="isLeader(member) ? 'bg-gray-50' : 'bg-gray-50'"
                    >
                      <!-- Avatar -->
                      <div
                        :class="[
                          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold relative',
                          memberColor(member),
                          isLeader(member) ? 'ring-2 ring-[#10b481]' : '',
                        ]"
                      >
                        {{ member.username.charAt(0).toUpperCase() }}
                      </div>

                      <span
                        class="text-sm font-medium text-gray-800 max-w-[120px] truncate"
                      >
                        {{ member.username }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p v-else class="text-xs text-gray-400">Aucun membre</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard" });

import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";

const languageStore = useLanguageStore();
const t = (key: string) => translate[languageStore.lang][key] || key;
const currentLocale = computed(() => languageStore.lang);

const route = useRoute();
const token = sessionStorage.getItem("token") || "";
const org = ref<any>({});
const groups = ref<any[]>([]);
const isLeader = (member: any) => member.role_type === "LEADER";

const fetchOrg = async () => {
  const res = await fetch(
    `${API_URL}/api/groups/organisations/${route.params.id}/`,
    {
      headers: { Authorization: `Token ${token}` },
    }
  );
  org.value = await res.json();
};

const fetchGroupsWithMembers = async () => {
  try {
    const res = await fetch(
      `${API_URL}/api/groups/groups/?organisation=${route.params.id}`,
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    if (!res.ok) throw new Error("Impossible de récupérer les groupes");
    const groupsData: any[] = await res.json();

    const enrichedGroups = await Promise.all(
      groupsData.map(async (group) => {
        try {
          const resMembers = await fetch(
            `${API_URL}/api/groups/groups/${group.uuid}/members/`,
            {
              headers: { Authorization: `Token ${token}` },
            }
          );
          if (!resMembers.ok)
            throw new Error("Impossible de récupérer les membres");
          const membersData: any[] = await resMembers.json();
          console.log(
            "Membres bruts pour le groupe",
            group.uuid,
            ":",
            membersData
          );

          // Récupération complète des membres
          const enrichedMembers = await Promise.all(
            membersData.map(async (m) => {
              const resUser = await fetch(
                `${API_URL}/api/users/${m.user.uuid}/`,
                {
                  headers: { Authorization: `Token ${token}` },
                }
              );

              const user = await resUser.json();

              return {
                ...user,
                role: m.role,
                role_type: m.role?.role_type,
                role_name: m.role?.name,
                status: m.status,
                joined_at: m.joined_at,
              };
            })
          );

          return {
            ...group,
            members: enrichedMembers,
          };
        } catch (err) {
          console.error(`Erreur pour le groupe ${group.uuid}:`, err);
          return { ...group, members: [] };
        }
      })
    );

    groups.value = enrichedGroups;
    console.log("Groups", groups.value);
  } catch (err) {
    console.error("Erreur globale:", err);
    groups.value = [];
  }
};

const groupMembersByRole = (members: any[]) => {
  return members.reduce((acc: any, member: any) => {
    const roleType = member.role_type || "OTHER";

    if (!acc[roleType]) {
      acc[roleType] = {
        role_name: member.role_name || "Autre",
        members: [],
      };
    }

    acc[roleType].members.push(member);
    return acc;
  }, {});
};

// const formatDate = (d: string) => new Date(d).toLocaleDateString();
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(languageStore.lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
const statusClass = (status: string) => {
  if (status === "ACTIVE") return "badge-active";
  if (status === "INACTIVE") return "badge-inactive";
  return "badge-suspended";
};

const memberColor = (member: any) => {
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-red-100 text-red-600",
  ];
  const index = member.username.charCodeAt(0) % colors.length;
  return colors[index];
};

onMounted(() => {
  fetchOrg();
  fetchGroupsWithMembers();
});
</script>

<style scoped>
.btn-primary {
  background: #10b481;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.btn-secondary {
  background: #f1f5f9;
  color: #112830;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.badge {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 600;
}

.badge-active {
  background: rgba(16, 180, 129, 0.15);
  color: #10b481;
}

.badge-inactive {
  background: rgba(148, 163, 184, 0.2);
  color: #64748b;
}

.badge-suspended {
  background: rgba(230, 57, 70, 0.15);
  color: #e63946;
}
</style>
