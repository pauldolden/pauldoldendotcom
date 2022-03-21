<script>
  import Footer from '$lib/components/Footer/Footer.svelte';
  import '../app.css';
</script>

<main class="flex flex-col h-screen w-screen font-rubik px-10 pt-10 slice">
  <slot />
  <Footer />
</main>

<style>
  .slice {
    background-color: #013a6b;
    background-image: linear-gradient(80deg, #00001e 50%, #009999 50%);
  }
</style>
