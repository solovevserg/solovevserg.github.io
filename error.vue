<script setup lang="ts">
defineProps<{ error: { statusCode: number; statusMessage?: string } }>()

const { init } = useTheme()
onMounted(init)

const handleHome = () => navigateTo('/')

// Deterministic pseudo-random so SSR and client values match
const lcg = (s: number) => ((s * 1664525 + 1013904223) >>> 0) / 0x100000000
const stars = Array.from({ length: 40 }, (_, i) => {
  const a = lcg(i * 7 + 1), b = lcg(i * 13 + 3), c = lcg(i * 17 + 5)
  return {
    x: (a * 100).toFixed(1),
    y: (b * 100).toFixed(1),
    s: (0.5 + c * 1.5).toFixed(2),
    d: ((i * 0.31) % 4).toFixed(2),
    dur: (2 + (i * 0.17) % 3).toFixed(2),
  }
})
</script>

<template>
  <div class="error-layout">
    <AppHeader />
    <main class="error-page dot-bg">
    <!-- Stars -->
    <div class="stars" aria-hidden="true">
      <span
        v-for="(star, i) in stars"
        :key="i"
        class="star"
        :style="`--x:${star.x}%;--y:${star.y}%;--s:${star.s}px;--d:${star.d}s;--dur:${star.dur}s`"
      />
    </div>

    <!-- Main content -->
    <div class="error-content">
      <!-- Planet -->
      <div class="planet-wrap" aria-hidden="true">
        <div class="planet">
          <span class="planet__num">404</span>
          <div class="planet__ring" />
          <div class="planet__ring planet__ring--2" />
        </div>
        <div class="orbit">
          <div class="orbit__dot" />
        </div>
        <div class="orbit orbit--2">
          <div class="orbit__dot orbit__dot--2" />
        </div>
      </div>

      <h1 class="error-title">Lost in space</h1>
      <p class="error-sub">The page you're looking for has drifted off the map.</p>

      <button class="beacon-btn" @click="handleHome">
        <span class="beacon-btn__pulse" aria-hidden="true" />
        <span class="beacon-btn__pulse beacon-btn__pulse--2" aria-hidden="true" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Return to base
      </button>
    </div>
    </main>
    <AppFooter />
  </div>
</template>

<style>
.error-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.error-page {
  flex: 1;
  padding-top: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-color: var(--bg);
}

/* ── Stars ────────────────────────────────────────── */
.stars { position: absolute; inset: 0; pointer-events: none; }
.star {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0;
  animation: twinkle var(--dur) var(--d) ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.4); }
}

/* ── Content ──────────────────────────────────────── */
.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  position: relative;
  z-index: 2;
  padding: 2rem;
}

/* ── Planet ───────────────────────────────────────── */
.planet-wrap {
  position: relative;
  width: 220px;
  height: 220px;
  margin-bottom: 0.5rem;
}

.planet {
  position: absolute;
  inset: 30px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, var(--accent), color-mix(in srgb, var(--accent) 40%, var(--bg)));
  box-shadow: 0 0 60px rgba(99,102,241,0.35), 0 0 120px rgba(99,102,241,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}
:root[data-theme="light"] .planet {
  box-shadow: 0 0 50px rgba(79,70,229,0.25), 0 0 100px rgba(79,70,229,0.1);
}

.planet__num {
  font-family: var(--font-mono);
  font-size: 2.4rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.04em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
}

.planet__ring {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 1.5px solid rgba(99,102,241,0.3);
  transform: rotateX(72deg);
}
.planet__ring--2 {
  inset: -26px;
  border-color: rgba(99,102,241,0.15);
}

/* Orbiting dots */
.orbit {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  animation: orbit 8s linear infinite;
}
.orbit--2 { animation-duration: 13s; animation-direction: reverse; }

.orbit__dot {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
}
.orbit__dot--2 {
  width: 5px;
  height: 5px;
  background: color-mix(in srgb, var(--accent) 60%, #fff);
  box-shadow: 0 0 8px var(--accent);
  top: 0;
}

@keyframes orbit {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ── Text ─────────────────────────────────────────── */
.error-title {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text);
  line-height: 1.1;
}

.error-sub {
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 340px;
  line-height: 1.6;
}

/* ── Beacon button ────────────────────────────────── */
.beacon-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: box-shadow 0.25s, transform 0.2s;
}
.beacon-btn:hover {
  box-shadow: var(--accent-glow);
  transform: translateY(-2px);
}
.beacon-btn:active { transform: translateY(0); }

.beacon-btn__pulse {
  position: absolute;
  inset: -1px;
  border-radius: 999px;
  border: 2px solid var(--accent);
  opacity: 0;
  animation: pulse-ring 2.5s ease-out infinite;
}
.beacon-btn__pulse--2 { animation-delay: 1.25s; }

@keyframes pulse-ring {
  0%   { transform: scale(1);    opacity: 0.6; }
  100% { transform: scale(1.45); opacity: 0; }
}
</style>
