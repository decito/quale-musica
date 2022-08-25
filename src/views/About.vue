<template>
  <main>
    <section class="mb-8 py-20 text-white relative">
      <div
        class="absolute inset-0 w-full h-full bg-cover introduction-bg"
        style="background-image: url(assets/img/header.png)"
      />

      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">This is a WIP project!</h1>

          <p class="w-full">
            Use the links below to see the source code, or to get in touch with
            the author.
          </p>
        </div>
      </div>
    </section>

    <section
      class="container flex justify-around items-center mx-auto font-semibold flex-col md:flex-row text-center"
    >
      <div class="px-6 pt-6 pb-5">
        <a href="https://github.com/dnet-o/vue-music/" target="_blank">
          <i class="fab fa-github fa-7x" />

          <p class="text-2xl text-center mt-4">App code @ Github</p>
        </a>
      </div>

      <div class="px-6 pt-6 pb-5">
        <a href="https://www.linkedin.com/in/dnet-o/" target="_blank">
          <i class="fab fa-linkedin fa-7x" />

          <p class="text-2xl text-center mt-4">Author's contact @ LinkedIn</p>
        </a>
      </div>
    </section>
  </main>
</template>
