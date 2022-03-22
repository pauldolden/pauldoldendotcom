<script lang="ts">
  import chunk from 'lodash.chunk';
  import { projects } from '$lib/utils/projects';
  import { vsCodeMenu } from '$lib/utils/vsCodeMenu';
  import EditorSegment from '$lib/components/editorSegment/EditorSegment.svelte';
  import { scale } from 'svelte/transition';
  import { onMount } from 'svelte';
  const halfProjects = projects.length / 2;
  const chunkedProjects = chunk(projects, halfProjects);
  const leftProjects = chunkedProjects[2]
    ? chunkedProjects[0].concat(chunkedProjects[2])
    : chunkedProjects[0];
  const rightProjects = chunkedProjects[1];
  let activeLeft = 0;
  let activeRight = 0;
  let show = false;

  onMount(() => {
    setTimeout(() => {
      show = true;
    }, 400);
  });
</script>

{#if show}
  <div class="flex-1">
    <section
      transition:scale
      class="mx-auto my-auto bg-editor-bg rounded-lg font-fira flex flex-col justify-center w-full relative z-100 flex-1"
    >
      <div
        class="bg-editor-header text-gray-300 py-1 text-center font-extrabold flex flex-col rounded-t-lg"
      >
        <div class="flex px-2 items-center">
          <h2 class="flex-1">Stuff I've Built</h2>
          <div class="flex gap-2">
            <div class="h-4 w-4 bg-yellow-400 rounded-full" />
            <div class="h-4 w-4 bg-purple-800 rounded-full" />
            <div class="h-4 w-4 bg-red-600 rounded-full" />
          </div>
        </div>
        <div class="flex gap-4 px-2 text-xs font-semibold select-none overflow-hidden">
          {#each vsCodeMenu as menuItem}
            <div class="text-gray-600 font-medium select-none">{menuItem}</div>
          {/each}
        </div>
      </div>
      <div class="flex flex-1 max-h-full">
        <div class="flex flex-col flex-1 max-h-full">
          <div class="grid grid-cols-1 md:grid-cols-2 flex-1">
            <EditorSegment data={leftProjects} active={activeLeft} />
            <EditorSegment data={rightProjects} active={activeRight} />
          </div>
        </div>
        <div class="bg-editor-sidebar rounded-br-lg px-2">
          <img src="/images/icons.png" alt="icons" class="rounded-br-lg" />
        </div>
      </div>
    </section>
  </div>
{/if}
