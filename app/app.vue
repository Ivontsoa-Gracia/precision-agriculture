<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup lang="ts">
useHead({
  title: "SmartSaha – Agriculture intelligente, durable et connectée à Madagascar",
  meta: [
    {
      name: "description",
      content:
        "SmartSaha est une plateforme d’agriculture intelligente à Madagascar. Elle aide les agriculteurs à recevoir des recommandations personnalisées sur la santé des sols, les conditions météo, la végétation et les risques environnementaux. SmartSaha intègre aussi un marketplace agricole et un assistant agronome alimenté par l’IA."
    },
    {
      name: "keywords",
      content:
        "SmartSaha, agriculture intelligente, Madagascar, agriculture de précision, marketplace agricole, traçabilité, assistant agronome IA, gestion des parcelles, prévision météo, durabilité, data management, suivi et évaluation"
    },
    {
      name: "author",
      content: "SmartSaha Team"
    },
    // Open Graph pour Facebook, WhatsApp, LinkedIn
    {
      property: "og:title",
      content: "SmartSaha – Agriculture intelligente et durable à Madagascar"
    },
    {
      property: "og:description",
      content:
        "SmartSaha relie les petits producteurs, entreprises et coopératives agricoles à des outils d’agriculture de précision, un assistant agronome IA et un marché mondial équitable pour les produits agricoles."
    },
    {
      property: "og:type",
      content: "website"
    },
    {
      property: "og:url",
      content: "https://app.smart-saha.com/"
    },
    {
      property: "og:image",
      content: "https://app.smart-saha.com/logo.png"
    },
    // Twitter Cards
    {
      name: "twitter:card",
      content: "summary_large_image"
    },
    {
      name: "twitter:title",
      content: "SmartSaha – Plateforme d’agriculture intelligente à Madagascar"
    },
    {
      name: "twitter:description",
      content:
        "Optimisez vos cultures, suivez vos parcelles et accédez à un marché mondial équitable grâce à SmartSaha, la plateforme d’agriculture intelligente pour producteurs et entreprises à Madagascar."
    },
    {
      name: "twitter:image",
      content: "https://app.smart-saha.com/logo.png"
    },
    // Langue et géolocalisation
    {
      name: "geo.region",
      content: "MG"
    },
    {
      name: "geo.placename",
      content: "Madagascar"
    },
    {
      name: "geo.position",
      content: "-18.8792;47.5079"
    }
  ],
  link: [
    {
      rel: "canonical",
      href: "https://app.smart-saha.com/"
    },
    {
      rel: "stylesheet",
      href: "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;700;800&display=swap"
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png"
    }
  ],
  htmlAttrs: {
    lang: "fr"
  }
});

</script>