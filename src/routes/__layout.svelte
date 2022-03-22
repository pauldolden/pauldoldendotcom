<script>
  import Footer from '$lib/components/Footer/Footer.svelte';
  import '../app.css';
</script>

<main
  class="flex flex-col min-h-screen min-w-screen font-rubik px-3 pt-5 lg:px-10 lg:pt-10 slice-h lg:slice-v"
>
  <slot />
  <Footer />
</main>
