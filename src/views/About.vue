<template>
  <main>
    <section class="py-20 text-white relative">
      <div
        class="absolute inset-0 w-full h-full bg-cover lg:bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      />

      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-4xl mb-5">This is a WIP project!</h1>

          <p class="w-full">
            Use the links below to see the source code, or to get in touch with
            the author.
          </p>
        </div>
      </div>
    </section>

    <section
      class="container grid justify-items-center mx-auto font-semibold md:grid-cols-3 text-center gap-3 dark:text-white max-w-5xl mt-6 md:px-8"
    >
      <a
        href="https://github.com/dnet-o/quale-musica/"
        target="_blank"
        class="max-w-[300px]"
      >
        <div
          class="px-6 py-6 bg-gray-200 dark:bg-stone-700 hover:bg-gray-50 dark:hover:bg-stone-600 rounded"
        >
          <i class="fab fa-github fa-7x" />

          <p class="text-2xl text-center mt-4">
            App code @ GitHub
            <i class="fas fa-arrow-up-right-from-square fa-2xs text-xs" />
          </p>
        </div>
      </a>

      <article></article>

      <a
        href="https://www.linkedin.com/in/dnet-o/"
        target="_blank"
        class="max-w-[300px]"
      >
        <div
          class="px-6 pt-6 pb-5 bg-gray-200 dark:bg-stone-700 hover:bg-gray-50 dark:hover:bg-stone-600 rounded"
        >
          <i class="fab fa-linkedin fa-7x" />

          <p class="text-2xl text-center mt-4">
            Author's contact @ LinkedIn
            <i class="fas fa-arrow-up-right-from-square fa-2xs text-xs" />
          </p>
        </div>
      </a>
    </section>
  </main>
</template>
