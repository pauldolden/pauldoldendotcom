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
      <div class="container mx-auto flex flex-col lg:flex-row justify-between">
        <section
          class="flex-1 flex justify-center items-start md:items-center lg:items-start flex-col"
        >
          <h1 class="font-extrabold text-5xl md:text-6xl lg:text-7xl  text-[#009999]">
            Hey, I'm Paul.
          </h1>
          <div class="pt-5 lg:pt-10 max-w-lg">
            <p class="text-lg lg:text-xl font-medium text-white">
              A full-stack developer from Essex, UK. I'm currently working as a React Native
              developer for 2Dmedia, building bespoke mobile applications.
            </p>
            <p class="text-lg lg:text-xl font-medium text-white pt-2">
              I most enjoy working on web applications with modern tools and frameworks like NextJS
              and SvelteKit.
            </p>
          </div>
        </section>
        <section class="flex-1 flex items-center pt-20 lg:pt-0 lg:items-end flex-col">
          <img
            src="/images/Paul-1.png"
            class="h-[300px] w-[300px] md:h-[400px] md:w-[400px]"
            alt="Paul Dolden, sitting in his car feeling barbershop fresh."
          />
        </section>
      </div>
    </div>
  {/if}
</div>
