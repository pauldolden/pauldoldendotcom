<script>
  import Footer from '$lib/components/Footer/Footer.svelte';
  import '../app.css';
</script>

<main class="flex flex-col min-h-screen min-w-screen font-rubik px-10 pt-10 slice-h md:slice-v">
  <slot />
  <Footer />
</main>
