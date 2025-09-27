<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup lang="ts">
// inclure le CDN Boxicons via useHead
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'
    },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;700;800&display=swap' }
  ]
})
</script>