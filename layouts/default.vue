<template>
  <div
    class="min-h-screen flex flex-col items-center bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100"
  >
    <nav class="bg-primary-900 text-white w-full">
      <h1 class="text-2xl text-center p-4">Nothing to see here</h1>
    </nav>
    <div
      class="p-4 w-full md:max-w-lg xl:max-w-2xl flex flex-col grow gap-4 justify-between"
    >
      <slot />
    </div>
  </div>
</template>
