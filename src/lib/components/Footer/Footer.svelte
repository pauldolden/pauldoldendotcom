<script lang="ts">
  const navigation = [
    { name: 'github', link: 'https://github.com/pauldolden', iconPath: '/svg/github.svg' },
    { name: 'twitter', link: 'https://twitter.com/pauldolden', iconPath: '/svg/twitter.svg' },
    { name: 'linkedin', link: 'https://linkedin.com/in/pauldolden', iconPath: '/svg/linkedin.svg' }
  ];
</script>

<div class="container mx-auto">
  <section class="flex items-center justify-between gap-10 text-2xl py-10">
    <div class="flex items-center justify-between gap-10">
      <a href="/" class="flex items-center gap-2 font-extrabold cursor-pointer text-white">
        <p>home</p>
      </a>
      <a href="/projects" class="flex items-center gap-2 font-extrabold cursor-pointer text-white">
        <p>projects</p>
      </a>
    </div>
    <div class="flex items-center justify-between gap-10">
      {#each navigation as item}
        <a
          class="flex items-center gap-2 font-extrabold cursor-pointer text-white"
          href={item.link}
        >
          <img src={item.iconPath} alt={item.name} />
          <p>{item.name}</p>
        </a>
      {/each}
    </div>
  </section>
</div>
