<script lang="ts">
  const navigation = [
    { name: 'home', link: '/' },
    { name: 'projects', link: '/projects' }
  ];
  const social = [
    { name: 'github', link: 'https://github.com/pauldolden', iconPath: '/svg/github.svg' },
    { name: 'twitter', link: 'https://twitter.com/pauldolden', iconPath: '/svg/twitter.svg' },
    { name: 'linkedin', link: 'https://linkedin.com/in/pauldolden', iconPath: '/svg/linkedin.svg' }
  ];
</script>

<div class="container mx-auto">
  <section
    class="flex flex-col md:flex-row items-center justify-between gap-10 text-xl md:text-2xl py-10"
  >
    <div class="flex items-center justify-between gap-10">
      {#each navigation as item}
        <a
          href={item.link}
          class="flex items-center gap-2 font-extrabold cursor-pointer text-tertiary-800 transition-transform hover:scale-125"
        >
          <p>{item.name}</p>
        </a>
      {/each}
    </div>
    <div class="flex items-center justify-between gap-10">
      {#each social as item}
        <a
          class="flex items-center gap-2 font-extrabold cursor-pointer text-tertiary-800 md:text-background transition-transform hover:scale-125"
          href={item.link}
        >
          <img src={item.iconPath} alt={item.name} class="fill-tertiary-800 md:fill-background" />
          <p>{item.name}</p>
        </a>
      {/each}
    </div>
  </section>
</div>
