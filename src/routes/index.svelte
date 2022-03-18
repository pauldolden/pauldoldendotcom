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

{#if show}
  <div class="flex flex-col flex-1 justify-center" transition:scale>
    <section class="flex-1 p-40">
      <h1 class="font-extrabold text-7xl text-white">Hey, I'm Paul.</h1>
      <div class="pt-4 max-w-lg">
        <p class="text-white text-xl font-medium">
          A full-stack developer from Essex, UK. A full-stack developer from Essex, UK.A full-stack
          developer from Essex, UK.A full-stack developer from Essex, UK.A full-stack developer from
          Essex, UK.
        </p>
      </div>
    </section>
  </div>
{/if}
