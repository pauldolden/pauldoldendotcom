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
  {#if show}
    <div class="flex flex-col flex-1 justify-center" transition:scale>
      <div class="container mx-auto">
        <section class="flex-1 flex justify-center flex-col">
          <h1 class="font-extrabold text-7xl text-editor-bg">Hey, I'm Paul.</h1>
          <div class="pt-4 max-w-lg">
            <p class="text-xl font-medium text-editor-bg">
              A full-stack developer from Essex, UK. I'm currently employed a React Native developer
              for 2Dmedia, building bespoke mobile applications.
            </p>
            <p class="text-xl font-medium text-editor-bg pt-2">
              My real passion, however, has always been building for the web and I most enjoy
              working on web applications with modern tools and frameworks like NextJS and
              SvelteKit.
            </p>
          </div>
        </section>
      </div>
    </div>
  {/if}
</div>
