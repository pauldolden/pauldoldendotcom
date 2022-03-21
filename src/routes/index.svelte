<script lang="ts">
  import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';

  let show = false;

  onMount(() => {
    setTimeout(() => {
      show = true;
    }, 400);
  });
</script>

<div class="flex flex-1">
  <!-- Link -->
  {#if show}
    <div class="flex flex-col flex-1 justify-center" transition:scale>
      <div class="container mx-auto flex flex-col md:flex-row justify-between">
        <section class="flex-1 flex justify-center items-center md:items-start flex-col">
          <h1 class="font-extrabold text-7xl text-white">Hey, I'm Paul.</h1>
          <div class="pt-4 max-w-lg">
            <p class="text-xl font-medium text-white">
              A full-stack developer from Essex, UK. I'm currently employed as a React Native
              developer for 2Dmedia, building bespoke mobile applications.
            </p>
            <p class="text-xl font-medium text-white pt-2">
              My real passion, however, has always been building for the web and I most enjoy
              working on web applications with modern tools and frameworks like NextJS and
              SvelteKit.
            </p>
          </div>
        </section>
        <section class="flex-1 flex items-center pt-10 md:pt-0 md:items-end flex-col">
          <img
            src="/images/Paul.png"
            class="h-[400px] w-[400px]"
            alt="Paul Dolden, sitting in his car feeling barbershop fresh."
          />
        </section>
      </div>
    </div>
  {/if}
</div>
