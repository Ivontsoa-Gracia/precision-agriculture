<template>
  <div class="p-1 sm:p-6 max-w-[85vw] sm:max-w-[90vw] mb-10 sm:mb-1">
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1 lg:flex-[2] flex flex-col space-y-6 w-full lg:w-2/3">
        <div
          class="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto mt-6 mb-6"
        >
          <div
            v-if="currentWeather && todayForecast"
            class="flex-1 bg-gradient-to-br from-[#219ebc]/40 to-[#219ebc]/60 text-white rounded p-6 shadow-sm flex flex-col justify-between"
          >
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <div class="flex justify-between items-center w-full mb-2">
                  <p class="text-xl font-medium opacity-90">
                    {{ getDayName(todayForecast.date) }}
                  </p>
                </div>

                <p class="text-5xl font-bold">
                  {{ currentWeather.temperature }}°C
                </p>
                <p class="text-sm opacity-80 capitalize">
                  {{
                    translatedCurrentCondition ||
                    currentWeather.conditionOriginal ||
                    currentWeather.condition ||
                    "-"
                  }}
                </p>
              </div>
              <div>
                <p class="text-xl font-medium opacity-90 mb-2">
                  {{ currentTime }}
                </p>
                <Icon
                  :icon="getWeatherIcon(currentWeather.condition)"
                  class="text-7xl drop-shadow-sm"
                />
              </div>
            </div>

            <div
              class="mt-4 flex justify-start items-center gap-4 text-md opacity-90"
            >
              <p class="leading-tight">
                <strong
                  >{{ todayForecast.min_temp }}°C -
                  {{ todayForecast.max_temp }}°C</strong
                >
              </p>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2 text-sm opacity-90">
              <p class="leading-tight">
                {{ t("precipitation") }}:
                <strong>{{ todayForecast.total_precip }} mm</strong>
              </p>
              <p class="leading-tight">
                {{ t("humidity") }}:
                <strong>{{ currentWeather.humidity }}%</strong>
              </p>
              <p class="leading-tight">
                {{ t("vent") }}:
                <strong>{{ currentWeather.wind_speed }} km/h</strong>
              </p>
              <p class="leading-tight">
                {{ t("uvIndex") }}:
                <strong>{{ currentWeather.uv_index }}</strong>
              </p>
            </div>
          </div>

          <div v-if="forecastDays.length" class="flex-1 flex flex-col gap-4">
            <h2 class="text-xl font-bold mb-2 text-gray-700">
              {{ t("prevision") }}
            </h2>

            <div class="flex flex-col md:flex-row gap-4">
              <div
                v-for="day in forecastDays"
                :key="day.date"
                class="flex-1 bg-[#219ebc]/20 text-[#219ebc] rounded p-4 flex flex-col items-center shadow-sm"
              >
                <p class="font-semibold">{{ getDayNameShort(day.date) }}</p>

                <Icon
                  :icon="getWeatherIcon(day.condition)"
                  class="text-5xl my-2"
                />

                <p class="text-sm">
                  {{ day.min_temp }}°C - {{ day.max_temp }}°C
                </p>
                <p class="text-sm">
                  {{ day.chance_of_rain }}% {{ t("pluie") }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded shadow-sm overflow-hidden border border-gray-100 mb-6"
        >
          <div class="bg-gray-100 p-6 text-[#222831]">
            <h2 class="text-2xl font-bold flex items-center gap-2">
              <i class="bx bx-map-pin text-2xl"></i>
              {{ t("parceldetail") }}
            </h2>
            <p class="text-sm opacity-90 mt-1">
              {{ parcelData.parcel_name || "N/A" }}
            </p>
          </div>

          <div class="flex flex-col lg:flex-row">
            <div
              class="w-full lg:w-1/3 p-6 bg-gray-50 border-r border-gray-100"
            >
              <div class="space-y-5">
                <div
                  class="bg-white shadow-sm rounded p-4 border border-gray-200"
                >
                  <p class="text-xs text-gray-500 uppercase tracking-wide">
                    {{ t("owner") }}
                  </p>
                  <p class="text-gray-800 font-semibold mt-1">
                    {{ ownerData.first_name || "N/A" }}
                    {{ ownerData.last_name || "N/A" }}
                  </p>
                </div>

                <div
                  class="bg-white shadow-sm rounded p-4 border border-gray-200"
                >
                  <p class="text-xs text-gray-500 uppercase tracking-wide">
                    {{ t("thparcelname") }}
                  </p>
                  <p class="text-gray-800 font-semibold mt-1">
                    {{ parcelData.parcel_name || "N/A" }}
                  </p>
                </div>

                <div
                  class="bg-white shadow-sm rounded p-4 border border-gray-200"
                >
                  <p class="text-xs text-gray-500 uppercase tracking-wide">
                    {{ t("Area") }}
                  </p>
                  <p class="text-gray-800 font-semibold mt-1">
                    {{ formatM2(parcelAreaHa) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="w-full lg:flex-1 p-6">
              <div
                class="flex items-center gap-8 border-b border-gray-200 mb-6"
              >
                <span
                  @click="selectedTab = 'points'"
                  class="cursor-pointer pb-2 text-sm font-medium transition relative"
                  :class="
                    selectedTab === 'points'
                      ? 'text-[#10b481]'
                      : 'text-gray-500 hover:text-gray-700'
                  "
                >
                  {{ t("pointsParcel") }}

                  <span
                    v-if="selectedTab === 'points'"
                    class="absolute left-0 -bottom-[1px] w-full h-[2px] bg-[#10b481] rounded"
                  ></span>
                </span>

                <span
                  @click="selectedTab = 'crops'"
                  class="cursor-pointer pb-2 text-sm font-medium transition relative"
                  :class="
                    selectedTab === 'crops'
                      ? 'text-[#10b481]'
                      : 'text-gray-500 hover:text-gray-700'
                  "
                >
                  {{ t("croptype") }}

                  <span
                    v-if="selectedTab === 'crops'"
                    class="absolute left-0 -bottom-[1px] w-full h-[2px] bg-[#10b481] rounded"
                  ></span>
                </span>
              </div>

              <div v-if="selectedTab === 'points'">
                <h3
                  class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"
                >
                  <i class="bx bx-target-lock text-xl"></i>
                  {{ t("pointsParcel") }}
                </h3>

                <div v-if="parcelPoints.length" class="overflow-x-auto text-sm">
                  <table class="min-w-full border-separate border-spacing-y-2">
                    <thead>
                      <tr class="text-left text-gray-600">
                        <th
                          class="py-2 px-4 font-medium border-b border-gray-200"
                        >
                          #
                        </th>
                        <th
                          class="py-2 px-4 font-medium border-b border-gray-200"
                        >
                          {{ t("thlatitude") }}
                        </th>
                        <th
                          class="py-2 px-4 font-medium border-b border-gray-200"
                        >
                          {{ t("thlongitude") }}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        v-for="(point, i) in parcelPoints"
                        :key="i"
                        class="bg-white hover:bg-gray-50 transition rounded"
                      >
                        <td
                          class="py-2 px-4 text-gray-700 border-b border-gray-100"
                        >
                          {{ t("point") }} {{ i + 1 }}
                        </td>
                        <td
                          class="py-2 px-4 text-gray-700 border-b border-gray-100"
                        >
                          {{ point.lat?.toFixed(6) ?? "N/A" }}
                        </td>
                        <td
                          class="py-2 px-4 text-gray-700 border-b border-gray-100"
                        >
                          {{ point.lng?.toFixed(6) ?? "N/A" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p v-else class="text-gray-500 text-sm mt-4 italic">
                  {{ t("nopoinntsfound") }}
                </p>
              </div>

              <div v-if="selectedTab === 'crops'" class="mt-4">
                <h3
                  class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"
                >
                  <i class="bxr bx-leaf-alt text-lg"></i>
                  {{ t("croptype") }}
                </h3>
                <table
                  class="min-w-full border-separate border-spacing-y-2 text-sm"
                >
                  <thead>
                    <tr class="text-left text-gray-600">
                      <th
                        class="py-2 px-4 font-medium border-b border-gray-200"
                      >
                        {{ t("croptype") }}
                      </th>
                      <th
                        class="py-2 px-4 font-medium border-b border-gray-200"
                      >
                        {{ t("area") }}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="crop in filteredParcelCrops"
                      :key="crop.id"
                      class="bg-white hover:bg-gray-50 transition rounded"
                    >
                      <td
                        class="py-2 px-4 text-gray-700 border-b border-gray-100"
                      >
                        {{ crop.crop.name }}
                      </td>
                      <td
                        class="py-2 px-4 text-gray-700 border-b border-gray-100"
                      >
                        {{ crop.area }} m²
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p
                  v-if="!filteredParcelCrops.length"
                  class="text-gray-500 text-sm mt-4 italic"
                >
                  {{ t("noparcelsfound") }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 hidden">
          <div class="bg-white rounded shadow p-4">
            <h3 class="font-semibold text-gray-800 mb-2">
              {{ t("charttitleweather") }}
            </h3>
            <canvas id="weatherConditionChart"></canvas>
          </div>

          <div class="bg-white rounded shadow p-4">
            <h3 class="font-semibold text-gray-800 mb-2">
              {{ t("chartprecipitation") }}
            </h3>
            <canvas id="precipitationChart"></canvas>
          </div>
        </div>

        <div class="bg-white rounded shadow p-4 max-h-[350px] pb-16">
          <h3 class="font-semibold text-gray-800 mb-2">
            {{ t("charttitleyield") }}
          </h3>
          <canvas id="yieldEvolutionChart"></canvas>
        </div>
      </div>

      <div class="flex-1 flex flex-col space-y-6 w-full lg:w-1/3 text-gary-800">
        <div
          v-if="metadata.location"
          class="p-6 rounded mt-4 border border-gray-100 bg-gray-100"
        >
          <h3 class="text-lg font-semibold mb-2 text-[#222831]">
            {{ t("forecastInfo") }}
          </h3>
          <ul class="text-sm text-[#222831] space-y-1">
            <li>
              <strong>{{ t("locations") }}:</strong> {{ metadata.location }}
            </li>
            <li>
              <strong>{{ t("forecastPeriod") }}:</strong>
              {{ metadata.forecast_period }}
            </li>
            <li>
              <strong>{{ t("riskLevel") }}:</strong> {{ metadata.risk_level }}
            </li>
          </ul>
        </div>

        <div v-if="translatedAlerts.length" class="mt-6">
          <ul class="space-y-3">
            <li
              v-for="alert in translatedAlerts"
              :key="alert.type"
              class="flex items-start gap-3 p-4 rounded shadow-sm bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800 mb-1">
                  {{
                    alert.message ||
                    alert.messageOriginal ||
                    "No message available"
                  }}
                </p>
                <p class="text-xs text-gray-600">
                  {{ alert.action || alert.actionOriginal || "-" }}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div
          class="bg-white rounded shadow-sm p-6 space-y-4 border border-gray-100 mt-12"
        >
          <h3 class="text-lg font-semibold">{{ t("soilinfo") }}</h3>
          <div class="mt-4 space-y-3">
            <div
              v-for="(quality, index) in soilQualities"
              :key="index"
              class="p-3 rounded flex justify-between items-center border-l-[4px]"
              :style="{
                borderColor: colorMap[quality.name] || '#ccc',
                background: colorMap[quality.name]
                  ? `linear-gradient(to right, ${
                      colorMap[quality.name]
                    }33, #ffffff)`
                  : '#f0f0f0',
              }"
            >
              <div class="flex flex-col">
                <span class="font-semibold">{{ quality.name }}</span>
                <span class="text-gray-700 text-sm">{{ quality.unit }}</span>
              </div>
              <div class="font-bold text-lg">
                {{ quality.value }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedParcel" class="grid grid-cols-1 gap-6 mt-10">
          <h3 class="text-gray-800 mb-2 text-3xl font-semibold">
            {{ t("titleanalytics") }}
          </h3>
          <div
            class="relative flex items-center gap-4 p-6 bg-white rounded shadow-sm hover:shadow-sm transition border border-gray-100"
          >
            <div
              class="flex items-center justify-center w-16 h-16 rounded bg-[#222831]/10"
            >
              <i class="bx bx-bar-chart-alt-2 text-4xl text-[#222831]"></i>
            </div>
            <div class="flex flex-col text-left">
              <p class="text-3xl font-bold text-[#222831]">
                {{ selectedParcel.mean_yield?.toFixed(2) ?? "-" }} kg
              </p>
              <p class="text-sm font-medium text-[#222831]">
                {{ t("meanyield") }}
              </p>
            </div>
            <div
              class="absolute right-0 top-6 bottom-6 border-r-4 border-[#222831]"
            ></div>
          </div>

          <div
            class="relative flex items-center gap-4 p-6 bg-white rounded shadow-sm hover:shadow-sm transition border border-gray-100"
          >
            <div
              class="flex items-center justify-center w-16 h-16 rounded bg-[#6d4c41]/10"
            >
              <i class="bx bx-line-chart text-4xl text-[#6d4c41]"></i>
            </div>
            <div class="flex flex-col text-left">
              <p class="text-3xl font-bold text-[#6d4c41]">
                {{ selectedParcel.mean_yield_per_area?.toFixed(2) ?? "-" }}
                kg/ha
              </p>
              <p class="text-sm font-medium text-[#6d4c41]">
                {{ t("meanyieldperarea") }}
              </p>
            </div>
            <div
              class="absolute right-0 top-6 bottom-6 border-r-4 border-[#6d4c41]"
            ></div>
          </div>
        </div>
        <div
          v-if="selectedParcel"
          class="p-6 bg-white rounded shadow-sm hover:shadow-sm transition hidden"
        >
          <h3 class="font-semibold text-gray-800 mb-2">
            {{ t("charttitleyield") }}
          </h3>
          <canvas id="analyticsChart"></canvas>
        </div>
      </div>
    </div>

    <div class="flex flex-col space-y-6 mt-12">
      <div class="flex flex-col lg:flex-row gap-6">
        <div
          class="bg-white rounded shadow-sm p-6 w-full lg:w-2/3 space-y-4 border border-gray-100"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-bold text-gray-800">
                {{ t("titletaskperform") }}
              </h3>
              <NuxtLink
                to="/tasks"
                class="text-sm font-medium text-gray-600 hover:text-black hover:underline mt-4"
              >
                {{ t("seeall") }}
              </NuxtLink>
            </div>

            <div>
              <NuxtLink
                to="/tasks/create"
                class="flex items-center px-4 py-2 bg-[#10b481] text-white rounded shadow hover:bg-[#0da06a] transition"
              >
                <i class="bx bx-plus mr-2"></i>{{ t("addtask") }}
              </NuxtLink>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="task in nearestTasks"
              :key="task.id"
              class="flex justify-between items-start p-4 rounded border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              :class="{
                'border-l-4 border-l-[#10b481]': task.priority === 'Low',
                'border-l-4 border-l-[#f4a261]': task.priority === 'Medium',
                'border-l-4 border-l-[#e63946]': task.priority === 'High',
              }"
            >
              <div class="flex flex-col gap-1">
                <p class="font-semibold text-gray-900 text-base">
                  {{ task.name }}
                </p>

                <div
                  class="flex flex-col gap-3 text-xs text-gray-500 leading-tight"
                >
                  <span class="flex items-center gap-1">
                    <i class="bxr bx-calendar-star"></i>
                    <span class="capitalize">
                      {{ t("priority") }}:
                      {{ t("priority" + task.priority) }}
                    </span>
                  </span>

                  <span class="flex items-center gap-1">
                    <i class="bxr bx-calendar-alt-2"></i>
                    {{ t("due") }}: {{ formatDate(task.due_date) }}
                  </span>
                </div>
              </div>

              <div class="flex flex-col items-end gap-2">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium border transition',
                    task.status === 'Pending'
                      ? 'bg-orange-50 text-orange-600 border-orange-200'
                      : task.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : task.status === 'Done'
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : task.status === 'Cancelled'
                      ? 'bg-gray-50 text-gray-600 border-gray-300'
                      : 'bg-gray-100 text-gray-600 border-gray-300',
                  ]"
                >
                  {{ t("status" + task.status.replace(/ /g, "")) }}
                </span>

                <div class="relative">
                  <i
                    class="bx bx-dots-vertical-rounded cursor-pointer text-xl text-gray-500 hover:text-gray-800 transition"
                    @click="task.showMenu = !task.showMenu"
                  ></i>

                  <div
                    v-if="task.showMenu"
                    class="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-md border z-50 overflow-hidden animate-fadeIn"
                  >
                    <NuxtLink
                      :to="`/tasks/edit/${task.id}`"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      {{ t("edit") }}
                    </NuxtLink>

                    <NuxtLink
                      :to="`/tasks/show/${task.id}`"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      {{ t("show") }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded shadow p-6 w-full lg:w-1/3 flex flex-col border border-gray-100"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            {{ t("charttitletask") }}
          </h3>
          <canvas id="taskPerformanceChart" class="w-full aspect-square"></canvas>
        </div>
      </div>

      <div class="bg-white rounded space-y-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-[#212121]">
            {{ t("harvesthistory") }}
          </h3>

          <div class="flex space-x-3">
            <button
              @click="exportCSV"
              class="flex items-center px-3 py-2 bg-gray-100 text-gray-900 rounded hover:bg-gray-200"
            >
              <i class="bx bx-export mr-2"></i> {{ t("export") }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto bg-white">
          <table class="min-w-[700px] w-full text-left border-collapse">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-2 border-b">{{ t("thdate") }}</th>
                <th class="px-6 py-2 border-b">{{ t("thyield") }}</th>
                <th class="px-6 py-2 border-b hidden sm:table-cell">
                  {{ t("thtendance") }}
                </th>
                <th class="px-6 py-2 border-b text-center hidden sm:table-cell">
                  {{ t("thactions") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="record in paginatedHarvest"
                :key="record.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-2 border-b">{{ record.date }}</td>
                <td class="px-6 py-2 border-b">{{ record.quantity }}</td>
                <td class="px-6 py-2 border-b hidden sm:table-cell">
                  <i
                    v-if="record.trend === 'up'"
                    class="bx bx-trending-up text-[#10b481] text-xl"
                  ></i>
                  <i
                    v-else-if="record.trend === 'down'"
                    class="bx bx-trending-down text-[#e63946] text-xl"
                  ></i>
                  <i v-else class="bx bx-minus text-gray-500 text-xl"></i>
                  <span
                    v-if="record.trend !== 'neutral'"
                    :class="
                      record.trend === 'up'
                        ? 'text-[#10b481]'
                        : 'text-[#e63946]'
                    "
                  >
                    {{ record.trend === "up" ? "+" : "-"
                    }}{{ record.trendValue }} kg
                  </span>
                </td>
                <td class="p-3 border-b text-center hidden sm:table-cell">
                  <button
                    @click="deleteRecord(record.id)"
                    class="p-2 rounded-full hover:bg-red-100"
                  >
                    <i class="bx bx-trash text-[#e63946] text-xl"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedHarvest.length === 0">
                <td colspan="5" class="p-6 text-center text-gray-500">
                  {{ t("nohistoryfound") }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-between items-center mt-4 mb-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="flex items-center px-3 py-1 rounded disabled:opacity-50"
          >
            <i class="bx bx-chevron-left"></i> {{ t("prev") }}
          </button>

          <div class="flex items-center space-x-2">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-1 rounded',
                currentPage === page
                  ? 'bg-[#10b481] text-white'
                  : 'bg-gray-100 hover:bg-gray-200',
              ]"
              v-if="page !== '...'"
            >
              {{ page }}
            </button>
            <span v-else class="px-2">...</span>
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex items-center px-3 py-1 rounded disabled:opacity-50"
          >
            {{ t("next") }} <i class="bx bx-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gray-100 rounded p-4 mt-4 hidden">
    <h3 class="font-semibold text-gray-800 mb-2">Parcel Full Data (JSON)</h3>
    <pre class="text-sm text-gray-700 overflow-x-auto">
    {{ parcelFullDataJSON }}
  </pre
    >
  </div>
</template>

<script setup>
definePageMeta({ layout: "dashboard" });

import { useRoute } from "vue-router";
import { reactive, ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";
import { API_URL } from "~/config";
import { useLanguageStore } from "~/stores/language";
import { translate } from "~/utils/translate";
import { useRouter } from "vue-router";

import { Icon } from "@iconify/vue";

const router = useRouter();

const currentWeather = ref(null);
const forecastDays = ref([]);
const climate = ref(null);
const parcelPoints = ref([]);
const analysis = ref([]);
const alerts = ref([]);
const translatedAlerts = ref([]);
const metadata = ref({});
const selectedTab = ref("points");

function updateWeatherForecast(data) {
  const weatherData = data?.weather_data?.data;
  console.log("Weather Data:", weatherData);
  if (!weatherData) {
    climate.value = null;
    currentWeather.value = null;
    forecastDays.value = [];
    parcelPoints.value = [];
    alerts.value = [];
    metadata.value = {};
    return;
  }

  climate.value = weatherData;
  currentWeather.value = weatherData.current ?? null;
  forecastDays.value = weatherData.daily_forecast ?? [];
  parcelPoints.value = data?.parcel?.points ?? [];
  const today = new Date().toISOString().split("T")[0];
  alerts.value = (data?.weather_data?.analysis?.alerts ?? []).filter(
    (alert) => alert.date === today
  );

  const meta = data?.weather_data?.metadata;
  if (!meta) {
    metadata.value = {};
    return;
  }

  metadata.value = {
    location: meta.location_name,
    forecast_period: `${meta.start_date} → ${meta.end_date}`,
    forecast_days: meta.forecast_days,
    risk_level: meta.risk_level,
    last_update: meta.created_at,
  };
}

const todayForecast = computed(() => {
  if (!forecastDays.value.length) return null;

  const today = new Date().toISOString().split("T")[0];
  return forecastDays.value.find((day) => day.date === today);
});

function getDayName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(currentLocale.value, { weekday: "long" });
}

function getDayNameShort(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(currentLocale.value, { weekday: "short" });
}

const weatherIcons = {
  "Patchy rain nearby": "mdi:weather-rainy",
  "Moderate rain": "mdi:weather-pouring",
  Sunny: "mdi:weather-sunny",
  Clear: "mdi:weather-night",
  "Partly cloudy": "mdi:weather-partly-cloudy",
  Cloudy: "mdi:weather-cloudy",
  "Light rain": "mdi:weather-rainy",
  "Light rain shower": "mdi:weather-rainy",
  "Heavy rain": "mdi:weather-heavy-rain",
  Thunderstorm: "mdi:weather-lightning",
  Mist: "mdi:weather-fog",
  Fog: "mdi:weather-fog",
};

function getWeatherIcon(condition) {
  return weatherIcons[condition] ?? "mdi:help-circle";
}

const removeEmojis = (text) => {
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
    ""
  );
};

const currentTime = ref("");

const updateTime = () => {
  const now = new Date();
  currentTime.value = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

let intervalId;

onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const languageStore = useLanguageStore();

const t = (key) => translate[languageStore.lang][key] || key;

const currentLocale = computed(() => languageStore.lang);

const translationCache = useState("translationCache", () => ({}));

async function translateText(text, sourceLang = "fr") {
  const targetLang = currentLocale.value || "en";
  if (sourceLang === targetLang) return { translated: text, original: text };

  if (translationCache.value[text]) {
    return { translated: translationCache.value[text], original: text };
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${targetLang}`;

    const res = await fetch(url);
    const translatedText = res?.responseData?.translatedText || text;
    translationCache.value[text] = translatedText;

    return { translated: translatedText || text, original: text };
  } catch (error) {
    console.warn("Translation failed, using original text:", text, error);
    translationCache.value[text] = text;
    return { translated: text, original: text };
  }
}

async function translateAlerts(alerts) {
  translatedAlerts.value = await Promise.all(
    alerts.map(async (alert) => {
      const messageRes = await translateText(removeEmojis(alert.message));
      const actionRes = await translateText(removeEmojis(alert.action));
      return {
        ...alert,
        message: messageRes.translated,
        messageOriginal: messageRes.original,
        action: actionRes.translated,
        actionOriginal: actionRes.original,
      };
    })
  );
}

watch(alerts, () => {
  if (alerts.value.length) translateAlerts(alerts.value);
});

const translatedCurrentCondition = ref("");

async function translateCurrentWeatherCondition() {
  if (currentWeather.value && currentWeather.value.condition) {
    const res = await translateText(
      removeEmojis(currentWeather.value.condition)
    );
    translatedCurrentCondition.value = res.translated;
    currentWeather.value.conditionOriginal = res.original;
  } else {
    translatedCurrentCondition.value = "";
    currentWeather.value.conditionOriginal =
      currentWeather.value?.condition || "";
  }
}

watch(currentWeather, () => {
  translateCurrentWeatherCondition();
});

const parcelFullDataJSON = ref(null);

const route = useRoute();
const fieldIdParam = route.params.id ?? null;

const colorMap = {
  nitrogen: "#10b481",
  soc: "#c99383",
  clay: "#6d4c41",
  phh2o: "#5fd4a2",
  sand: "#f4a261",
  silt: "#219ebc",
};

const soilQualities = reactive([]);

const parcelFullData = reactive({});
const parcelData = reactive({});
const ownerData = reactive({});

const parcelAreaHa = computed(() => {
  return calculateParcelArea(parcelData.parcel_points);
});

const tasks = ref([]);
const cropsInfo = ref([]);

function updateTasks() {
  tasks.value = [];
  cropsInfo.value = [];

  if (parcelFullData.parcel_crops && parcelFullData.parcel_crops.length > 0) {
    parcelFullData.parcel_crops.forEach((crop) => {
      if (crop.tasks && crop.tasks.length > 0) {
        crop.tasks.forEach((task) => tasks.value.push(task));
      }

      cropsInfo.value.push({
        type: crop.crop?.name ?? "N/A",
        variety: crop.crop?.variety ?? "N/A",
      });
    });
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const nearestTasks = computed(() => {
  return [...tasks.value]
    .filter((task) => task.status !== "Cancelled" && task.status !== "Done")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 3);
});

let taskChart = null;

function updateTaskChart() {
  const allTasks = [];

  if (parcelFullData.parcel_crops && parcelFullData.parcel_crops.length > 0) {
    parcelFullData.parcel_crops.forEach((crop) => {
      if (crop.tasks && crop.tasks.length > 0) {
        crop.tasks.forEach((task) => allTasks.push(task));
      }
    });
  }

  const statusCount = allTasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const ctx = document.getElementById("taskPerformanceChart");
  if (!ctx) return;

  if (taskChart) {
    taskChart.destroy();
  }

  const translatedLabels = Object.keys(statusCount).map((statusKey) =>
    t(`status${statusKey.replace(/\s+/g, "")}`)
  );

  taskChart = new Chart(ctx.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: translatedLabels,
      datasets: [
        {
          label: t("chartTasksByStatus"),
          data: Object.values(statusCount),
          backgroundColor: ["#f4a261", "#10b481", "#219ebc", "#c99383"],
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

let yieldChart = null;

function updateYieldEvolutionChart() {
  const records = parcelFullData.yield_records ?? [];
  if (!records.length) return;

  const grouped = {};
  records.forEach((r) => {
    const date = new Date(r.date);
    const monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!grouped[monthYear]) grouped[monthYear] = 0;
    grouped[monthYear] += r.yield ?? 0;
  });

  const labels = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
  const data = labels.map((l) => grouped[l]);

  const ctx = document.getElementById("yieldEvolutionChart");
  if (!ctx) return;

  if (yieldChart) yieldChart.destroy();

  yieldChart = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: t("chartYieldEvolution"),
          data,
          backgroundColor: "#222831",
          borderRadius: 0,
          borderSkipped: false,
          barThickness: 30,
          hoverBackgroundColor: "#222831",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#fafafa",
          titleColor: "#222831",
          bodyColor: "#222831",
          bodyFont: { weight: "bold" },
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#222831", font: { size: 14, weight: "600" } },
        },
        y: {
          beginAtZero: true,
          max: Math.max(...data) * 1.2,
          grid: {
            drawBorder: false,
            color: "rgba(34, 40, 49, 0.1)",
          },
          ticks: { color: "#222831", font: { size: 14, weight: "600" } },
        },
      },
    },
  });
}

watch(() => parcelFullData.yield_records, updateYieldEvolutionChart, {
  immediate: true,
});

const harvestHistory = ref([]);

const climateData = reactive({
  temperature: [],
  precipitation: [],
  dates: [],
});

function updateClimateCharts(data) {
  const params = data?.weather_data?.properties?.parameter;

  if (!params) {
    console.warn("Aucune donnée climatique disponible");
    return;
  }

  const today = new Date();
  const dates = [];
  for (let i = 0; i <= 5; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  const temperature = dates.map((d) => {
    const val = params.T2M?.[d];
    return val === undefined || val === -999
      ? Math.floor(Math.random() * 7) + 22
      : val;
  });

  const precipitation = dates.map((d) => {
    const val = params.PRECTOTCORR?.[d];
    return val === undefined || val === -999
      ? Math.floor(Math.random() * 21)
      : val;
  });

  const allNullTemp = temperature.every((v) => v === null);
  const allNullPrecip = precipitation.every((v) => v === null);

  const weatherCanvas = document.getElementById("weatherConditionChart");
  if (weatherCanvas && !allNullTemp) {
    new Chart(weatherCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: t("chartTemperature"),
            data: temperature,
            borderColor: "#5fd4a2",
            backgroundColor: "rgba(16,180,129,0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: false } },
      },
    });
  } else {
    console.warn("Aucune donnée de température valide pour afficher le chart");
  }

  const precipCanvas = document.getElementById("precipitationChart");
  if (precipCanvas && !allNullPrecip) {
    new Chart(precipCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: dates,
        datasets: [
          {
            label: t("chartPrecipitation"),
            data: precipitation,
            backgroundColor: "#219ebc",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } },
      },
    });
  } else {
    console.warn(
      "Aucune donnée de précipitation valide pour afficher le chart"
    );
  }
}

function calculateTrends() {
  if (!harvestHistory.value || harvestHistory.value.length === 0) return;

  const grouped = harvestHistory.value.reduce((acc, record) => {
    const cropId = record.parcel_crop_id;
    if (!acc[cropId]) acc[cropId] = [];
    acc[cropId].push(record);
    return acc;
  }, {});

  Object.values(grouped).forEach((records) => {
    records.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 0; i < records.length; i++) {
      if (i === 0) {
        records[i].trend = "neutral";
        records[i].trendValue = 0;
      } else {
        const prev = records[i - 1].yield;
        const current = records[i].yield;

        if (current > prev) {
          records[i].trend = "up";
          records[i].trendValue = current - prev;
        } else if (current < prev) {
          records[i].trend = "down";
          records[i].trendValue = prev - current;
        } else {
          records[i].trend = "neutral";
          records[i].trendValue = 0;
        }
      }
    }
  });

  harvestHistory.value = Object.values(grouped).flat();
}

function updateSoilQualities(layers) {
  if (!layers || !Array.isArray(layers)) return;
  soilQualities.length = 0;
  layers.forEach((layer) => {
    const value = layer.depths?.[0]?.values?.mean ?? null;
    const unit = layer.unit_measure?.mapped_units ?? "";
    soilQualities.push({ name: layer.name, value, unit });
  });
}

async function fetchParcelData() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté");
    return;
  }
  if (!fieldIdParam) return;

  try {
    const fullDataResponse = await axios.get(
      `${API_URL}/api/parcels-full/${fieldIdParam}/full_data/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    Object.assign(parcelFullData, fullDataResponse.data);
    parcelFullDataJSON.value = JSON.stringify(fullDataResponse.data, null, 2);

    if (parcelFullData.weather_data) {
      updateWeatherForecast(parcelFullData);
    }

    updateSoilQualities(parcelFullData.soil_data?.data?.properties?.layers);

    updateTasks();
    updateTaskChart();
    updateYieldEvolutionChart();

    harvestHistory.value = parcelFullData.yield_records ?? [];
    calculateTrends();
    updatePaginatedHarvest();

    const parcelResponse = await axios.get(
      `${API_URL}/api/parcels/${fieldIdParam}/`,
      { headers: { Authorization: `Token ${token}` } }
    );
    Object.assign(parcelData, parcelResponse.data);

    const ownerId = parcelData.owner;
    if (ownerId) {
      const userResponse = await axios.get(`${API_URL}/api/users/${ownerId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      Object.assign(ownerData, userResponse.data);
    }
  } catch (error) {
    console.error("Error fetching parcel data:", error);
  }
}

onMounted(() => {
  fetchParcelData();
  fetchAnalyticsData();
  if (parcelFullData.weather_data) {
    updateWeatherForecast(parcelFullData);
  }
});

const paginatedHarvest = ref([]);

const itemsPerPage = 5;
const currentPage = ref(1);

const totalPages = computed(() => {
  return Math.ceil((harvestHistory.value ?? []).length / itemsPerPage) || 1;
});

const visiblePages = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

const updatePaginatedHarvest = () => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  paginatedHarvest.value = (harvestHistory.value ?? [])
    .slice(start, end)
    .map((r) => ({
      id: r.id ?? `${r.parcel_crop_id}-${r.date}`,
      date: r.date,
      quantity: r.yield,
      observation: r.notes,
      trend: r.trend ?? "neutral",
      trendValue: r.trendValue ?? 0,
    }));
};

watch(harvestHistory, updatePaginatedHarvest, { immediate: true });
watch(currentPage, updatePaginatedHarvest);

const exportCSV = () => {
  const data = paginatedHarvest.value;
  if (!data.length) return;

  const headers = Object.keys(data[0]);

  const csvRows = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => `"${row[h]}"`).join(",")),
  ];

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "harvest_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function goToPage(page) {
  currentPage.value = page;
}

const overallTrend = computed(() => {
  const ups = harvestHistory.value.filter((r) => r.trend === "up").length;
  const downs = harvestHistory.value.filter((r) => r.trend === "down").length;
  const neutrals = harvestHistory.value.filter(
    (r) => r.trend === "neutral"
  ).length;

  if (ups > downs && ups > neutrals) return "📈 Globalement en hausse";
  if (downs > ups && downs > neutrals) return "📉 Globalement en baisse";
  return "➖ Globalement stable";
});
const analyticsData = ref([]);
const selectedParcel = ref(null);

async function fetchAnalyticsData() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/analytics/yields/`, {
      headers: { Authorization: `Token ${token}` },
    });

    if (!res.ok) throw new Error("Failed to load analytics data");

    const data = await res.json();

    const parcelsArray = Object.values(data);

    analyticsData.value = parcelsArray.map((parcel) => ({
      ...parcel,
      dates: parcel.dates ?? [],
      years: parcel.years ?? [],
      yield: parcel.yield ?? [],
      yield_per_area: parcel.yield_per_area ?? [],
      mean_yield: parcel.mean_yield ?? 0,
      mean_yield_per_area: parcel.mean_yield_per_area ?? 0,
      parcel_name: parcel.parcel_name ?? "Unknown Parcel",
    }));
  } catch (err) {
    console.error("Error fetching analytics data:", err);
  }
}

watch(
  () => parcelData.parcel_name,
  (newName) => {
    if (!newName) return;

    const matched = analyticsData.value.find(
      (p) =>
        p.parcel_name?.trim().toLowerCase() ===
        String(newName).trim().toLowerCase()
    );

    if (matched) {
      selectedParcel.value = matched;
    } else {
      selectedParcel.value = null;
    }
  }
);

let analyticsChart = null;

watch(
  () => selectedParcel.value,
  async (parcel) => {
    if (!parcel) return;

    await nextTick();

    const canvas = document.getElementById("analyticsChart");
    if (!canvas) return;

    if (analyticsChart) analyticsChart.destroy();

    const ctx = canvas.getContext("2d");

    analyticsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: parcel.years,
        datasets: [
          {
            label: "Yield Amount (kg)",
            data: parcel.yield,
            backgroundColor: "#10b481",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
);

function calculateParcelArea(points) {
  if (!points || points.length < 3) return 0;

  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const { latitude: x1, longitude: y1 } = points[i];
    const { latitude: x2, longitude: y2 } = points[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }

  area = Math.abs(area / 2);

  const latitudes = points.map((p) => p.latitude);
  const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
  const meterPerDegLat = 111_000;
  const meterPerDegLng = 111_000 * Math.cos((avgLat * Math.PI) / 180);

  const areaMeters2 = area * meterPerDegLat * meterPerDegLng;

  const areaHa = areaMeters2 / 10_000;

  return areaHa.toFixed(2);
}

const formatM2 = (areaInHa) => {
  if (!areaInHa) return "- m²";
  return `${(areaInHa * 10000).toLocaleString()} m²`;
};

const parcelCrops = ref([]);

const cropStatusKeyMap = {
  Planned: "cropStatusPlanned",
  Planted: "cropStatusPlanted",
  Germinated: "cropStatusGerminated",
  Growing: "cropStatusGrowing",
  Flowering: "cropStatusFlowering",
  Fruiting: "cropStatusFruiting",
  Mature: "cropStatusMature",
  Harvested: "cropStatusHarvested",
  "Post-Harvest": "cropStatusPostHarvest",
  Failed: "cropStatusFailed",
};

const statusClasses = (statusName) => {
  switch (statusName) {
    case "Planned":
      return "bg-[#219ebc]/10 text-[#219ebc] border border-[#219ebc]/50";
    case "Planted":
      return "bg-[#10b481]/10 text-[#10b481] border border-[#10b481]/50";
    case "Germinated":
      return "bg-[#5fd4a2]/10 text-[#0c9069] border border-[#0c9069]/40";
    case "Growing":
      return "bg-[#c99383]/10 text-[#c99383] border border-[#c99383]/50";
    case "Flowering":
      return "bg-[#f4a261]/10 text-[#f4a261] border border-[#f4a261]/50";
    case "Fruiting":
      return "bg-[#6d4c41]/10 text-[#6d4c41] border border-[#6d4c41]/40";
    case "Mature":
      return "bg-[#10b481]/10 text-[#0c9069] border border-[#10b481]/40";
    case "Harvested":
      return "bg-[#222831]/10 text-[#222831] border border-[#222831]/40";
    case "Post-Harvest":
      return "bg-[#7a7a7a]/10 text-[#7a7a7a] border border-[#7a7a7a]/40";
    case "Failed":
      return "bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/50";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-300";
  }
};

async function fetchParcelCrops() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  if (!fieldIdParam) return;
  try {
    const response = await fetch(`${API_URL}/api/parcel-crops/`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    console.log("Données des cultures de parcelle récupérées :", data);
    parcelCrops.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    parcelCrops.value = [];
  }
}

const filteredParcelCrops = computed(() => {
  return Array.isArray(parcelCrops.value)
    ? parcelCrops.value.filter((crop) => crop.parcel === fieldIdParam)
    : [];
});

onMounted(() => {
  fetchParcelCrops();
});
</script>
<style scoped>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
