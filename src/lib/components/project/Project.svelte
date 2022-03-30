<script lang="ts">
  import type { Project } from '$lib/types/Project';
  export let project: Project;
</script>

<article
  class="text-white font-medium text-sm flex flex-col bg-editor-bg overflow-y-scroll scrollbar scrollbar-track-editor-bg scrollbar-thumb-editor-scrollBar"
>
  <div class="flex-1">
    <span class="text-editor-syntax-blue">{'<article>'}</span>
    <div class="pl-4 flex flex-col gap-3">
      <div>
        <p class="text-editor-textIcons">// Click the title to view site</p>
        <a href={project.data.href}>
          <p>
            <span class="text-editor-syntax-blue">{'<h2>'}</span>
            {project.name}
            <span class="text-editor-syntax-blue">{'</h2>'}</span>
          </p>
        </a>
      </div>
      <div>
        <p>
          <span class="text-editor-syntax-blue">{'<h3>'}</span>
          Status
          <span class="text-editor-syntax-blue">{'</h3>'}</span>
        </p>
        <div>
          <span class="text-editor-syntax-blue">{'<p>'}</span>
          <p class="pl-4">{project.data.status}</p>
          <span class="text-editor-syntax-blue">{'</p>'}</span>
        </div>
      </div>
      <div>
        <p>
          <span class="text-editor-syntax-blue">{'<h3>'}</span>
          Description
          <span class="text-editor-syntax-blue">{'</h3>'}</span>
        </p>
        <div>
          <span class="text-editor-syntax-blue">{'<p>'}</span>
          <p class="pl-4">{project.data.desc}</p>
          <span class="text-editor-syntax-blue">{'</p>'}</span>
        </div>
      </div>

      <div>
        <p>
          <span class="text-editor-syntax-blue">{'<h3>'}</span>
          My Role
          <span class="text-editor-syntax-blue">{'</h3>'}</span>
        </p>
        <div>
          <span class="text-editor-syntax-blue">{'<p>'}</span>
          <p class="pl-4">{project.data.role}</p>
          <span class="text-editor-syntax-blue">{'</p>'}</span>
        </div>
      </div>
      <div>
        <p>
          <span class="text-editor-syntax-blue">{'<h3>'}</span>
          Stack
          <span class="text-editor-syntax-blue">{'</h3>'}</span>
        </p>
        <div>
          <span class="text-editor-syntax-blue">{'<ul>'}</span>
          <ul>
            {#each project.data.stack as item}
              <li class="pl-4">
                <span class="text-editor-syntax-blue">{'<li>'}</span>
                {item}
                <span class="text-editor-syntax-blue">{'</li>'}</span>
              </li>
            {/each}
          </ul>

          <span class="text-editor-syntax-blue">{'</ul>'}</span>
        </div>
      </div>
    </div>
    <span class="text-editor-syntax-blue">{`</article>`}</span>
  </div>
</article>
