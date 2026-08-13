<template>
  <div class="relative">
    <!-- warm halo so the dark terminal sits on the bone background rather than
         floating on it -->
    <div
      class="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-primary-500/10 blur-2xl"
    ></div>

    <div
      class="relative overflow-hidden rounded-2xl border border-primary-500/30 bg-dark-950 shadow-card-hover"
    >
      <!-- window chrome -->
      <div class="flex items-center gap-2 border-b border-white/5 bg-black/30 px-4 py-2.5">
        <span class="h-3 w-3 rounded-full bg-[#ff5f57]"></span>
        <span class="h-3 w-3 rounded-full bg-[#febc2e]"></span>
        <span class="h-3 w-3 rounded-full bg-[#28c840]"></span>
        <span class="flex-1 truncate text-center font-mono text-[11px] text-dark-400">
          claude — {{ t('landing.terminal.cwd') }}
        </span>
        <!-- mirrors the traffic lights so the title stays optically centred -->
        <span class="w-[54px] shrink-0"></span>
      </div>

      <!-- terminal body -->
      <div class="relative px-5 py-5 font-mono text-[13px] leading-relaxed">
        <!-- welcome banner, as the CLI prints it on launch -->
        <div
          class="inline-flex items-center gap-2 rounded-lg border border-primary-500/70 px-3 py-2"
        >
          <span class="text-primary-400">✳</span>
          <span class="text-dark-200">
            Welcome to <span class="font-semibold text-white">Claude Code</span>
          </span>
        </div>

        <!-- session header -->
        <div class="mt-4 space-y-0.5 text-[12px]">
          <p>
            <span class="font-semibold text-white">Claude Code</span>
            <span class="ml-1.5 text-dark-400">v{{ CLI_VERSION }}</span>
          </p>
          <p class="text-dark-400">
            Claude Opus 4.6
            <span class="mx-1 text-dark-600">·</span>
            <span class="text-primary-400">{{ t('landing.terminal.connected') }}</span>
          </p>
          <p class="text-dark-500">{{ t('landing.terminal.cwd') }}</p>
        </div>

        <!-- transcript: fixed height so the card never resizes between phases -->
        <div class="mt-4 min-h-[4.25rem] pr-16 text-[12px]">
          <template v-if="phase === 'working'">
            <p class="flex flex-wrap items-center gap-x-2 text-dark-200">
              <span class="text-primary-400">{{ spinnerFrame }}</span>
              <span>{{ t('landing.terminal.working') }}…</span>
              <span class="text-dark-500">
                ({{ elapsedLabel }}s · ↑ {{ tokenCount.toLocaleString() }} tokens)
              </span>
            </p>
          </template>
          <template v-else-if="phase === 'done'">
            <p class="flex flex-wrap items-center gap-x-2">
              <span class="text-[#28c840]">●</span>
              <span class="text-dark-200">{{ t('landing.terminal.done') }}</span>
              <span class="text-dark-500">
                · {{ tokenCount.toLocaleString() }} tokens · {{ elapsedLabel }}s
              </span>
            </p>
            <p class="mt-1 pl-4 text-dark-500">{{ t('landing.terminal.doneDetail') }}</p>
          </template>
        </div>

        <!-- prompt input -->
        <div class="pr-16">
          <div class="rounded-lg border border-dark-600 px-3 py-2.5">
            <p class="min-h-[1.25rem] break-words text-dark-100">
              <span class="mr-2 text-primary-400">&gt;</span
              ><span>{{ typed }}</span
              ><span
                class="ml-px inline-block w-[7px] translate-y-[1px] bg-primary-400 align-baseline"
                :class="reducedMotion ? '' : 'animate-blink'"
                aria-hidden="true"
                >&nbsp;</span
              >
            </p>
          </div>
          <div class="mt-1.5 flex items-center justify-between text-[11px] text-dark-500">
            <span>{{ t('landing.terminal.hint') }}</span>
            <span>claude-opus-4-6</span>
          </div>
        </div>

        <!-- mascot: idles while you type, works while the request is in flight -->
        <div
          class="pointer-events-none absolute bottom-4 right-4"
          :class="mascotClasses"
          :style="idleDurationVars"
        >
          <!-- Thought bubble lives outside the width-stretched wrapper so its
               dots stay round instead of stretching into ellipses. -->
          <div
            v-if="idleAction === 'bubble'"
            class="crab-bubble absolute -top-2 right-0 flex items-end gap-0.5"
            aria-hidden="true"
          >
            <span class="crab-bubble-dot crab-bubble-dot--1 h-1 w-1 rounded-full bg-primary-300"></span>
            <span class="crab-bubble-dot crab-bubble-dot--2 h-1.5 w-1.5 rounded-full bg-primary-300"></span>
            <span class="crab-bubble-dot crab-bubble-dot--3 h-2 w-2 rounded-full bg-primary-300"></span>
          </div>

          <!-- Width-only stretch, isolated from the animated inner svg so it
               doesn't fight the fidget/tap keyframes' own transforms. -->
          <div class="[transform:scaleX(1.2)]">
          <svg
            class="crab-figure h-12 w-auto text-primary-400"
            viewBox="0 0 36 36"
            fill="currentColor"
            shape-rendering="crispEdges"
            role="img"
            :aria-label="mascotLabel"
          >
            <!--
              Flat single-colour blocks on a whole-unit grid, so edges stay hard
              at any size. Proportions follow the official mascot: the body is
              taller than it is wide (22×24), four legs rather than three, and
              the eyes sit wide apart near the outer edges.
            -->
            <rect class="crab-arm crab-arm--l" x="2" y="10" width="5" height="8" />
            <rect class="crab-arm crab-arm--r" x="29" y="10" width="5" height="8" />

            <rect x="7" y="2" width="22" height="24" />

            <rect x="7" y="26" width="4" height="8" />
            <rect x="13" y="26" width="4" height="8" />
            <rect x="19" y="26" width="4" height="8" />
            <rect x="25" y="26" width="4" height="8" />

            <!-- Two faces, same as the official mascot has: square eyes at
                 rest, a pleased `>` `<` squint while it's working. The idle
                 face keeps the same two squares for blink/yawn/bubble too —
                 those are layered on as animations, not separate art. -->
            <g v-if="crabWorking" fill="#12100e">
              <rect x="9" y="8" width="3" height="2" />
              <rect x="12" y="10" width="3" height="2" />
              <rect x="9" y="12" width="3" height="2" />
              <rect x="24" y="8" width="3" height="2" />
              <rect x="21" y="10" width="3" height="2" />
              <rect x="24" y="12" width="3" height="2" />
            </g>
            <g v-else fill="#12100e">
              <rect class="crab-eye crab-eye--l" x="10" y="9" width="4" height="4" />
              <rect class="crab-eye crab-eye--r" x="22" y="9" width="4" height="4" />
              <rect v-if="idleAction === 'yawn'" class="crab-mouth" x="16" y="17" width="4" height="3" />
            </g>
          </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Animated Claude Code session for the landing hero.
 *
 * Runs one prompt at a time through type → work → done → erase, so a visitor
 * sees what the service is actually for rather than a static diagram. Prompts
 * come from i18n, so the demo speaks whatever language the page is in; the loop
 * restarts on a locale switch instead of finishing the sentence in the old one.
 *
 * Everything here is decorative — no request is made and no figure is live.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

/** Matches the CLI version the gateway mimics (`claude.CLICurrentVersion`). */
const CLI_VERSION = '2.1.220'

/** Prompt keys under `landing.terminal.prompts`, cycled in order. */
const PROMPT_KEYS = ['p1', 'p2', 'p3', 'p4', 'p5'] as const

const SPINNER = ['✳', '✶', '✻', '✽'] as const

const TYPE_MS = 45
const ERASE_MS = 16
const WORK_MS = 1900
const DONE_MS = 1400
const GAP_MS = 450
/** Ticks the working phase is split into — drives spinner, timer and counter. */
const WORK_STEPS = 16

/**
 * Idle micro-animations, layered on top of the always-on fidget rather than
 * replacing it — an arcade sprite still shifts its weight while it blinks.
 * `none` just means "no accent this beat," not "hold still."
 */
type IdleAction = 'none' | 'blink' | 'yawn' | 'bubble'
const IDLE_ACCENTS: Exclude<IdleAction, 'none'>[] = ['blink', 'yawn', 'bubble']
/** How often the mascot re-rolls what to do next, in ms. */
const IDLE_ROLL_MIN_MS = 1800
const IDLE_ROLL_MAX_MS = 3400
/** P(an accent plays at all) this beat; the rest is a plain fidget beat. */
const IDLE_ACCENT_CHANCE = 0.5
const IDLE_ACTION_DURATION_MS: Record<Exclude<IdleAction, 'none'>, number> = {
  blink: 420,
  yawn: 1100,
  bubble: 1400
}

const { t, locale } = useI18n()

type Phase = 'typing' | 'working' | 'done' | 'erasing'

const typed = ref('')
const phase = ref<Phase>('typing')
const spinnerIndex = ref(0)
const elapsed = ref(0)
const tokenCount = ref(0)
const idleAction = ref<IdleAction>('none')

const reducedMotion = ref(false)

const spinnerFrame = computed(() => SPINNER[spinnerIndex.value % SPINNER.length])
const elapsedLabel = computed(() => elapsed.value.toFixed(1))
const crabWorking = computed(() => phase.value === 'working')

const mascotClasses = computed(() =>
  crabWorking.value ? ['is-coding'] : ['is-idle', `idle-${idleAction.value}`]
)

const mascotLabel = computed(() => {
  if (crabWorking.value) return t('landing.terminal.crabCoding')
  if (idleAction.value === 'yawn') return t('landing.terminal.crabYawning')
  if (idleAction.value === 'bubble') return t('landing.terminal.crabThinking')
  return t('landing.terminal.crabIdle')
})

// Durations as CSS custom properties so the JS timers that add/remove the
// idle-* class and the keyframes that animate it can't drift out of sync.
const idleDurationVars = {
  '--blink-ms': `${IDLE_ACTION_DURATION_MS.blink}ms`,
  '--yawn-ms': `${IDLE_ACTION_DURATION_MS.yawn}ms`,
  '--bubble-ms': `${IDLE_ACTION_DURATION_MS.bubble}ms`
}

const prompts = computed(() => PROMPT_KEYS.map((key) => t(`landing.terminal.prompts.${key}`)))

/**
 * Pending timers, so unmounting mid-animation doesn't leave callbacks writing
 * to refs that no longer render anything.
 */
const timers = new Set<number>()

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const id = window.setTimeout(() => {
      timers.delete(id)
      resolve()
    }, ms)
    timers.add(id)
  })
}

function clearTimers(): void {
  timers.forEach((id) => window.clearTimeout(id))
  timers.clear()
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/**
 * Independent of the typing loop, so switching locale mid-blink doesn't reset
 * it. Runs for the component's lifetime once started; `idleAnimationsActive`
 * is the only stop signal it needs.
 */
let idleAnimationsActive = false

/**
 * Sleeps in short chunks instead of one long timer, so a roll or a held
 * accent can be cut short the moment `crabWorking` flips true — the idle-*
 * class stops rendering the instant the coding face takes over anyway, so
 * there's nothing to keep counting down for. Returns false if the sleep was
 * cut short (by work starting, or unmount) rather than completed in full.
 */
async function idleSleep(ms: number): Promise<boolean> {
  const CHUNK_MS = 100
  let remaining = ms
  while (remaining > 0) {
    if (!idleAnimationsActive || crabWorking.value) return false
    await sleep(Math.min(CHUNK_MS, remaining))
    remaining -= CHUNK_MS
  }
  return idleAnimationsActive && !crabWorking.value
}

async function runIdleAnimations(): Promise<void> {
  while (idleAnimationsActive) {
    // Don't spend a roll while the coding face is up — it isn't rendered
    // then, so any accent chosen during it would just be silently discarded,
    // which is what was quietly cutting the accent rate below 50%.
    while (idleAnimationsActive && crabWorking.value) {
      await sleep(150)
    }
    if (!idleAnimationsActive) return

    const waitedFully = await idleSleep(randomBetween(IDLE_ROLL_MIN_MS, IDLE_ROLL_MAX_MS))
    if (!idleAnimationsActive) return
    // Work started mid-wait — skip this roll rather than fire it into a
    // hidden state; loop back and re-wait for idle to try a fresh beat.
    if (!waitedFully) continue

    if (Math.random() >= IDLE_ACCENT_CHANCE) {
      idleAction.value = 'none'
      continue
    }

    const chosen = IDLE_ACCENTS[Math.floor(Math.random() * IDLE_ACCENTS.length)]
    idleAction.value = chosen
    await idleSleep(IDLE_ACTION_DURATION_MS[chosen])
    if (!idleAnimationsActive) return
    idleAction.value = 'none'
  }
}

/**
 * Bumped on every (re)start. A loop that finds its generation stale — because
 * the locale changed or the component unmounted — returns instead of racing the
 * loop that replaced it.
 */
let generation = 0

async function run(): Promise<void> {
  generation += 1
  const gen = generation
  clearTimers()

  // A visitor who asked for less motion gets the finished state, not a loop.
  if (reducedMotion.value) {
    typed.value = prompts.value[0] ?? ''
    phase.value = 'done'
    tokenCount.value = 1284
    elapsed.value = 0.9
    return
  }

  let index = 0
  while (gen === generation) {
    const text = prompts.value[index % prompts.value.length] ?? ''
    // Plausible-looking totals derived from the prompt so they stay stable
    // across a cycle instead of jittering at random.
    const tokenTarget = 780 + text.length * 26
    const seconds = WORK_MS / 1000

    phase.value = 'typing'
    tokenCount.value = 0
    elapsed.value = 0
    for (let cut = 1; cut <= text.length; cut += 1) {
      typed.value = text.slice(0, cut)
      await sleep(TYPE_MS)
      if (gen !== generation) return
    }

    phase.value = 'working'
    for (let step = 1; step <= WORK_STEPS; step += 1) {
      spinnerIndex.value = step
      elapsed.value = (step / WORK_STEPS) * seconds
      tokenCount.value = Math.round((step / WORK_STEPS) * tokenTarget)
      await sleep(WORK_MS / WORK_STEPS)
      if (gen !== generation) return
    }

    phase.value = 'done'
    await sleep(DONE_MS)
    if (gen !== generation) return

    phase.value = 'erasing'
    for (let cut = text.length - 1; cut >= 0; cut -= 1) {
      typed.value = text.slice(0, cut)
      await sleep(ERASE_MS)
      if (gen !== generation) return
    }

    await sleep(GAP_MS)
    if (gen !== generation) return
    index += 1
  }
}

onMounted(() => {
  reducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  void run()

  // A visitor who asked for less motion gets a still figure, not a slower loop.
  if (!reducedMotion.value) {
    idleAnimationsActive = true
    void runIdleAnimations()
  }
})

// Finish the switch immediately rather than typing out the rest of a sentence
// in the language the visitor just navigated away from.
watch(locale, () => {
  void run()
})

onBeforeUnmount(() => {
  generation += 1
  idleAnimationsActive = false
  clearTimers()
})
</script>

<style scoped>
/* Arms alternate rather than move together, which reads as typing. Stepped,
   not eased — the mascot is pixel art, so it should snap between poses. */
.is-coding .crab-arm--l {
  animation: crab-tap 240ms steps(1, end) infinite;
}

.is-coding .crab-arm--r {
  animation: crab-tap 240ms steps(1, end) 120ms infinite;
}

@keyframes crab-tap {
  0%,
  49% {
    transform: translateY(0);
  }
  50%,
  100% {
    transform: translateY(-2.5px);
  }
}

/* Base layer: always running while idle, like an arcade sprite's stand
   animation — a weight-shift bob plus a slight rotate, never fully still.
   Every idle-* accent below animates a *different* element (eyes, arms, the
   bubble), so this keeps playing underneath all of them instead of being
   overridden by them. */
.is-idle .crab-figure {
  animation: crab-fidget 3.4s ease-in-out infinite;
  transform-origin: 50% 100%;
}

@keyframes crab-fidget {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  18% {
    transform: translateY(-1px) rotate(-1deg);
  }
  36% {
    transform: translateY(0) rotate(0deg);
  }
  54% {
    transform: translateY(0) rotate(1deg);
  }
  72% {
    transform: translateY(-1.5px) rotate(0deg);
  }
}

.crab-eye {
  transform-box: fill-box;
  transform-origin: center;
}

/* Accent 1/3: a quick double-blink, eyes only. */
.idle-blink .crab-eye {
  animation: crab-blink-once var(--blink-ms, 420ms) ease-in-out;
}

.idle-blink .crab-eye--r {
  animation-delay: 40ms;
}

@keyframes crab-blink-once {
  0%,
  100% {
    transform: scaleY(1);
  }
  25%,
  60% {
    transform: scaleY(0.15);
  }
  40% {
    transform: scaleY(1);
  }
}

/* Accent 2/3: eyes shut longer, mouth opens, both arms stretch up. */
.idle-yawn .crab-eye {
  animation: crab-yawn-eyes var(--yawn-ms, 1100ms) ease-in-out;
}

.crab-mouth {
  transform-box: fill-box;
  transform-origin: center;
  animation: crab-yawn-mouth var(--yawn-ms, 1100ms) ease-in-out;
}

@keyframes crab-yawn-eyes {
  0%,
  100% {
    transform: scaleY(1);
  }
  20%,
  75% {
    transform: scaleY(0.1);
  }
}

@keyframes crab-yawn-mouth {
  0%,
  15%,
  100% {
    opacity: 0;
    transform: scaleY(0.3);
  }
  30%,
  65% {
    opacity: 1;
    transform: scaleY(1);
  }
}

.idle-yawn .crab-arm--l {
  animation: crab-stretch-l var(--yawn-ms, 1100ms) ease-in-out;
}

.idle-yawn .crab-arm--r {
  animation: crab-stretch-r var(--yawn-ms, 1100ms) ease-in-out;
}

@keyframes crab-stretch-l {
  0%,
  100% {
    transform: translate(0, 0);
  }
  30%,
  65% {
    transform: translate(-1px, -3px);
  }
}

@keyframes crab-stretch-r {
  0%,
  100% {
    transform: translate(0, 0);
  }
  30%,
  65% {
    transform: translate(1px, -3px);
  }
}

/* Accent 3/3: a small "thinking" bubble of three dots above the head. */
.crab-bubble-dot {
  opacity: 0;
  animation: crab-bubble-pulse var(--bubble-ms, 1400ms) ease-in-out;
}

.crab-bubble-dot--2 {
  animation-delay: 120ms;
}

.crab-bubble-dot--3 {
  animation-delay: 240ms;
}

@keyframes crab-bubble-pulse {
  0% {
    opacity: 0;
    transform: scale(0.4) translateY(2px);
  }
  20%,
  70% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.4) translateY(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .crab-figure,
  .crab-arm,
  .crab-eye,
  .crab-mouth,
  .crab-bubble-dot {
    animation: none !important;
  }
}
</style>
