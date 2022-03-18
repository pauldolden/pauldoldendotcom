<script>
  import Footer from '$lib/components/Footer/Footer.svelte';
  import '../app.css';
</script>

<main class="flex flex-col h-screen w-screen font-rubik px-10 pt-10">
  <slot />
  <Footer />
</main>
