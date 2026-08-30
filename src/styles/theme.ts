// src/styles/theme.ts
export const theme = {
  colors: {
    white: "text-white",
    black: "text-black",
    positive: "text-green-400",
    negative: "text-[#d62828]",
    accent: "text-cyan-300",
    muted: "text-slate-400",
    highlight: "text-yellow-400",
    label: "text-gray-800", // 👈 plus lisible que white
    cyanText: "text-cyan-300",
    princaplLight: "text-[#e9c46a]",
  },

  panel: {
    base: `rounded-xl p-5 space-y-4`,
  },

  background: "neon-backdrop neon-grid font-arcade",
  card: "bg-slate-100 border border-slate-200 text-gray-900",
  card_admin: "bg-white border border-gray-300 text-gray-900 shadow-md",
  input: {
    base: "w-full p-3 pr-10 text-black bg-white border border-amber-300 rounded-lg shadow-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
  },

  button: {
    base: "w-full py-3 rounded-xl font-semibold text-base transition-all duration-200 ease-in-out shadow-md",
    primary: "bg-[#dda15e] hover:bg-[#bc6c25] text-white",
    secondary: "bg-emerald-500 hover:bg-emerald-600 text-white",
    start: "bg-[#f2cc8f] hover:bg-yellow-500 text-black", // ⬅️ plus de ring ni border
    danger: "bg-rose-500 hover:bg-rose-600 text-white",
    purple:
      "bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:scale-105",
    category:
      "bg-[#f4f1de] hover:bg-[#f2cc8f] text-black shadow-md hover:scale-105",
    enabled:
      "bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-md hover:shadow-lg",
    disabled: "bg-amber-300 text-amber-100 cursor-not-allowed",
  },

  text: {
    heading:
      "skin-category-title text-[color:var(--skin-primary)] neon-text-glow text-center leading-relaxed break-words",
    // compact category label shown above the in-game phase card
    gameCategory:
      "font-display uppercase tracking-[0.14em] text-sm sm:text-base text-[color:var(--skin-primary)] neon-text-glow text-center break-words",
    subheading: "text-xl font-display text-[color:var(--skin-text)]",
    faded: "text-slate-300",
    playerName:
      "text-[11px] text-[color:var(--skin-text)] font-arcade font-semibold truncate w-14",
    playerScore:
      "text-[10px] text-[color:var(--skin-primary)] font-arcade font-bold",
    label: "block text-amber-700 font-medium",
    label_admin: "block text-amber-700 font-semibold mb-2 ",
    helper: "mt-4 text-xs text-amber-700 text-center",
  },

  layout: {
    container:
      "min-h-dvh flex items-start justify-center px-4 pb-10 [padding-top:calc(env(safe-area-inset-top,0px)+4.5rem)]",
    card: "w-full max-w-md space-y-5 text-center",
    padded: "p-6 sm:p-8",
    roomCard:
      "w-full max-w-md neon-card rounded-[var(--skin-radius)] p-5 sm:p-6 space-y-5",
    // in-game: no frame; center the phase card in the space between the
    // top bar and the fixed action bar + player footer.
    // Bottom padding clears the fixed player bar, which only exists from `sm`
    // up — phones reserve just enough for the chat button and the safe area.
    roomShell:
      "w-full max-w-lg mx-auto flex flex-col items-center justify-center gap-5 min-h-[calc(100dvh-9rem)] pt-10 [padding-bottom:calc(env(safe-area-inset-bottom,0px)+4.5rem)] sm:[padding-bottom:calc(env(safe-area-inset-bottom,0px)+8rem)]",
    // lobby content scrolls; Start button floats over it
    lobbyScroll: "w-full max-w-md mx-auto space-y-5 pb-32",
  },

  effects: {
    transition: "transition-all duration-300 ease-in-out",
    shadow: "shadow-lg hover:shadow-xl",
    glow: "ring-2 ring-cyan-400/50 ring-offset-2",
    soft: "backdrop-blur-md bg-white/10 border border-white/10",
  },

  responsive: {
    fullWidth: "w-full sm:max-w-md",
    centered: "mx-auto",
  },

  playerCard: {
    container: "space-y-2",
    item: "skin-row flex items-center justify-between px-3 py-2",
    baseBg: "",
    highlight: "skin-row-active",
    hover: "hover:brightness-110",
    newPlayer: "neon-pulse",
    avatar:
      "w-10 h-10 rounded-full overflow-hidden bg-[color:var(--skin-bg)] border-2 border-[color:var(--skin-accent)]",
    name: "text-sm text-[color:var(--skin-text)] font-arcade font-semibold truncate",
    badge:
      "bg-[color:var(--skin-accent)] text-[color:var(--skin-bg)] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide",
    placeholder:
      "text-center p-6 text-[color:var(--skin-muted)] italic skin-panel",
  },

  playerSection: {
    title:
      "text-lg skin-section-title flex items-center gap-2",
    online:
      "flex items-center gap-1.5 text-[color:var(--skin-muted)] text-xs font-arcade font-semibold uppercase tracking-wide",
    icon: "h-5 w-5 text-[color:var(--skin-primary)]",
  },

  phase: {
    // every in-game phase renders in this centered card
    card: "skin-panel skin-panel--solid w-full max-w-sm mx-auto p-5 sm:p-6 flex flex-col items-center text-center gap-5",
    // frameless variant (category choice)
    bare: "w-full max-w-sm mx-auto flex flex-col items-center text-center gap-5",
    title: "font-display text-base sm:text-lg text-[color:var(--skin-text)] leading-snug",
    eyebrow:
      "font-arcade text-xs uppercase tracking-[0.2em] text-[color:var(--skin-accent)]",
    option:
      "neon-btn w-full py-3.5 rounded-xl text-base disabled:opacity-40",
    optionIdle: "skin-option",
    waiting:
      "text-sm text-[color:var(--skin-muted)] font-arcade",
  },

  lobby: {
    panel: "skin-panel p-4 sm:p-5 space-y-4",
    sectionTitle:
      "text-sm skin-section-title flex items-center gap-2",
    settingRow: "flex items-center justify-between gap-3",
    settingLabel:
      "text-sm font-arcade font-semibold text-[color:var(--skin-text)]",
    readout: "skin-readout px-4 py-1.5 text-sm min-w-[3.5rem] text-center",
    select:
      "skin-readout px-3 py-1.5 text-sm font-arcade focus:outline-none",
    chip: "skin-catchip px-3 py-1.5 text-sm inline-flex items-center gap-1.5",
    chipOn: "skin-catchip-on",
  },

  avatarSelector: {
    container:
      "rounded-2xl p-4 text-center bg-[color:var(--skin-bg-2)]/40 border border-[color:var(--skin-border)]",
    imageWrapper:
      "w-24 h-24 mx-auto rounded-full overflow-hidden bg-[color:var(--skin-card)] border-2 border-[color:var(--skin-accent)] neon-glow-cyan transition-transform active:scale-95",
    // Regenerate is a badge on the avatar rather than a row beneath it, so it
    // costs no vertical space. Visually 36px, but the tap area is padded out to
    // the 44px minimum.
    button:
      "absolute -bottom-1 -right-1 grid place-items-center w-11 h-11 rounded-full skin-chip !p-0 shadow-md transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--skin-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--skin-bg)]",
    icon: "w-4 h-4",
  },

  languageSelect: {
    trigger:
      "skin-chip flex items-center justify-center gap-2 w-40 px-3 py-2.5 text-sm",
    content:
      "w-40 rounded-xl bg-[color:var(--skin-card)] border border-[color:var(--skin-border)] text-[color:var(--skin-text)] font-arcade text-center",
  },

  home: {
    // proportional top spacer: ~18% of viewport height, clamped, + safe area.
    // Grows the card downward only, no forced scroll on short phones.
    wrapper:
      "min-h-dvh flex flex-col items-center px-4 [padding-top:calc(env(safe-area-inset-top,0px)+clamp(3rem,12dvh,8rem))] sm:[padding-top:calc(env(safe-area-inset-top,0px)+clamp(6rem,20dvh,14rem))] [padding-bottom:calc(env(safe-area-inset-bottom,0px)+1.5rem)]",
    card: "home-card w-full max-w-md overflow-hidden py-0 rounded-[var(--skin-radius)]",
    cardContent: "space-y-6 p-6 py-6 pb-0",
    cardFooter: "px-6 p-6 pt-0",
    label:
      "text-[color:var(--skin-muted)] font-arcade text-sm uppercase tracking-wider",
    input: "neon-input rounded-xl h-12 text-base",
    actionButton: "neon-btn w-full py-4 rounded-xl text-base disabled:opacity-40",
  },

  bluffSection: {
    // Frameless: the panel's opaque fill and border boxed in the question and
    // the input for no gain, and cost vertical room on phones.
    card: "w-full max-w-sm mx-auto p-5 sm:p-6 flex flex-col items-center text-center gap-5",
    text: {
      heading:
        "font-display text-base sm:text-lg text-[color:var(--skin-text)] leading-snug",
      label: "text-[color:var(--skin-muted)] text-center",
      bluff:
        "skin-readout px-4 py-2 font-arcade font-semibold text-center",
      waiting:
        "text-sm text-[color:var(--skin-muted)] font-arcade text-center",
      error:
        "text-sm text-[color:var(--skin-danger)] text-center flex items-center justify-center gap-2",
      warning:
        "flex items-center justify-center gap-2 text-sm text-[color:var(--skin-primary)]",
    },
    input: "neon-input rounded-xl h-12 w-full text-base text-center",
    button: {
      base: "neon-btn w-full py-3.5 rounded-xl text-base flex items-center justify-center gap-2",
      enabled: "",
      disabled: "",
    },
    icon: {
      success: "w-6 h-6 mx-auto text-green-500",
      warning: "w-4 h-4",
    },
  },

  resultSection: {
    card: "skin-panel w-full max-w-sm mx-auto p-5 sm:p-6 space-y-5",
    title: "skin-category-title text-[color:var(--skin-primary)] text-center [font-size:clamp(1.4rem,6vw,2rem)]",
    topPlayer:
      "bg-[color:var(--skin-primary)] text-[color:var(--skin-btn-color)] font-bold border-2 border-[color:var(--skin-primary-bright)]",
    player:
      "bg-[color:var(--skin-bg-2)] text-[color:var(--skin-text)] border-2 border-[color:var(--skin-border)]",
    avatar:
      "w-10 h-10 rounded-full overflow-hidden border-2 border-[color:var(--skin-accent)] shrink-0 bg-[color:var(--skin-card)]",
    playerName: "flex-1 text-left font-arcade text-base truncate",
    playerScore:
      "font-arcade font-bold text-sm tabular-nums shrink-0",
  },

  voteBreakdownSection: {
    container: "skin-panel skin-panel--solid w-full max-w-sm mx-auto p-5 sm:p-6 space-y-5",
    title: "text-center text-base skin-section-title",
    question:
      "text-center text-sm text-[color:var(--skin-muted)] font-arcade",
    card: {
      base: "rounded-xl p-4 pt-5 relative border-2",
      correct:
        "bg-[color:var(--skin-bg-2)] border-[color:var(--skin-accent)] text-[color:var(--skin-text)]",
      bluff:
        "bg-[color:var(--skin-bg-2)] border-[color:var(--skin-danger)]/60 text-[color:var(--skin-text)]",
    },
    text: {
      guess: "text-center font-arcade font-semibold text-base",
      author:
        "text-center text-xs text-[color:var(--skin-muted)] font-arcade mt-1",
    },
  },

  tabSelector: {
    list: "w-full grid grid-cols-2 items-stretch gap-2 h-auto min-h-[56px] p-1.5 rounded-xl bg-[color:var(--skin-bg-2)]/60 border border-[color:var(--skin-border)]",
    trigger: "skin-tab h-full",
  },
  border: {
    default: "border-[color:var(--skin-border)]",
    current: "border-[color:var(--skin-accent)] ring-2 ring-[color:var(--skin-accent)]",
  },

  avatar: {
    base: "w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-300",
  },

  footer:
    "bg-[color:var(--skin-card)]/95 backdrop-blur-md border-t-2 border-[color:var(--skin-border)]",
};
