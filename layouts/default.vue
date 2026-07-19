<template>
    <div class="layout">
        <IntroCurtain />
        <FilmGrain />
        <CustomCursor />
        <ChapterRail />

        <AppHeader />
        <main class="layout__main">
            <slot />
        </main>
        <AppFooter />
    </div>
</template>

<style>
.layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100svh;
}

.layout__main {
    flex: 1;
    padding-top: var(--header-h);
}
</style>
