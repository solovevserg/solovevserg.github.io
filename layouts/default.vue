<template>
  <div class="layout">
    <LayoutAppHeader />
    <main class="layout__main">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>

<style>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.layout__main {
  flex: 1;
  padding-top: var(--header-h);
}
</style>
