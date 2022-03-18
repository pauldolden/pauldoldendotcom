<script lang="ts">
  import type { Project as ProjectInterface } from '$lib/types/Project';
  import Project from '$lib/components/project/Project.svelte';
  import { blur } from 'svelte/transition';
  export let data: ProjectInterface[];
  export let active: number;

  export const generateNumbers = () => {
    const numbers = [];
    for (let i = 1; i < 26; i++) {
      numbers.push(i);
    }

    return numbers;
  };

  let numbers = generateNumbers();
</script>

<section
  class="justify-between rounded-lg border-r-black border-r bg-editor-bg  relative flex flex-1 flex-col h-full"
>
  <div class="flex flex-1 flex-col h-full max-h-full">
    <div in:blur={{ delay: 500 }} out:blur>
      <div>
        <div class="flex text-editor-textIcons text-sm bg-editor-tabBar gap-2">
          {#each data as project, i}
            <button
              on:click={() => (active = i)}
              class={`p-2 font-bold border-t-2 select-none cursor-pointer flex gap-2 ${
                active === i
                  ? 'text-editor-active border-editor-active bg-editor-tab'
                  : 'border-transparent'
              }`}
            >
              <img src={project.iconPath} alt="project icon" class="w-5" />
              <p>
                {project.name}
              </p>
            </button>
          {/each}
        </div>
        <div class="bg-editor-tabBarAlt px-2 py-1 text-xs text-gray-300 drop-shadow-md">
          <p>src > lib > work > {data[active].name}</p>
        </div>
      </div>
      <div class="flex">
        <div
          class="px-5 text-sm text-editor-textIcons flex flex-col border-r-editor-textIcons border-r max-h-full"
        >
          {#each numbers as number}
            <p>{number}</p>
          {/each}
        </div>
        <div class="flex-1 flex flex-col py-1 px-2">
          <Project project={data[active]} />
        </div>
      </div>
    </div>
  </div>
</section>
