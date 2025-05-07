<template>
  <main>
    <section class="relative py-20 text-white">
      <div
        class="introduction-bg absolute inset-0 h-full w-full bg-cover lg:bg-contain"
        style="background-image: url(assets/img/header.png)"
      />

      <div class="container mx-auto">
        <div class="main-header-content text-white">
          <h1 class="mb-5 text-4xl font-bold">This is a WIP project!</h1>

          <p class="w-full">
            Use the links below to see the source code, or to get in touch with the author.
          </p>
        </div>
      </div>
    </section>

    <section
      class="container mx-auto mt-6 grid max-w-5xl justify-items-center gap-3 text-center font-semibold md:grid-cols-3 md:px-8 dark:text-white"
    >
      <a href="https://github.com/dnet-o/quale-musica/" target="_blank" class="max-w-[300px]">
        <div
          class="rounded-sm bg-gray-200 px-6 py-6 hover:bg-gray-50 dark:bg-stone-700 dark:hover:bg-stone-600"
        >
          <i class="fab fa-github fa-7x" />

          <p class="mt-4 text-center text-2xl">
            App code @ GitHub
            <i class="fas fa-arrow-up-right-from-square fa-2xs text-xs" />
          </p>
        </div>
      </a>

      <article></article>

      <a href="https://www.linkedin.com/in/dnet-o/" target="_blank" class="max-w-[300px]">
        <div
          class="rounded-sm bg-gray-200 px-6 pt-6 pb-5 hover:bg-gray-50 dark:bg-stone-700 dark:hover:bg-stone-600"
        >
          <i class="fab fa-linkedin fa-7x" />

          <p class="mt-4 text-center text-2xl">
            Author's contact @ LinkedIn
            <i class="fas fa-arrow-up-right-from-square fa-2xs text-xs" />
          </p>
        </div>
      </a>
    </section>
  </main>
</template>
