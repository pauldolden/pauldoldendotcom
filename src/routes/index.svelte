<script lang="ts">
  const navigation = [
    { name: 'github', link: 'https://github.com/pauldolden', iconPath: '/svg/github.svg' },
    { name: 'twitter', link: 'https://twitter.com/pauldolden', iconPath: '/svg/twitter.svg' },
    { name: 'linkedin', link: 'https://linkedin.com/in/pauldolden', iconPath: '/svg/linkedin.svg' }
  ];
</script>

<section class="mx-40 mb-10">
  <h1 class="font-extrabold text-7xl text-white">Hey, I'm Paul.</h1>
  <div class="pt-4 max-w-lg">
    <p class="text-white text-xl font-medium">
      A full-stack developer from Essex, UK. A full-stack developer from Essex, UK.A full-stack
      developer from Essex, UK.A full-stack developer from Essex, UK.A full-stack developer from
      Essex, UK.
    </p>
  </div>
</section>
<section class="flex items-center gap-10 self-end py-10 text-2xl flex-1 justify-end mr-10">
  {#each navigation as item}
    <a
      class="flex items-center gap-2 font-extrabold cursor-pointer text-secondary-400"
      href={item.link}
    >
      <img src={item.iconPath} alt={item.name} />
      <p>{item.name}</p>
    </a>
  {/each}
</section>
