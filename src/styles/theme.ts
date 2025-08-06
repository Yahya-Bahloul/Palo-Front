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

  background: "bg-[#588157] from-[#1E293B] via-[#334155] to-[#0F172A]",
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
    heading: "text-4xl font-bold text-[#f4f1de] drop-shadow-sm pt-4 pl-6",
    subheading: "text-xl font-semibold text-white",
    faded: "text-slate-300",
    playerName: "text-[11px] text-yellow-900 font-semibold truncate w-14",
    playerScore: "text-[10px] text-yellow-800 font-medium",
    label: "block text-amber-700 font-medium",
    label_admin: "block text-amber-700 font-semibold mb-2 ",
    helper: "mt-4 text-xs text-amber-700 text-center",
  },

  layout: {
    container: "min-h-screen flex items-center justify-center px-4",
    card: "w-full max-w-md space-y-6 text-center",
    padded: "p-6 sm:p-8",
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
    item: "flex items-center justify-between px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-200",
    baseBg: "bg-white/10 border border-white/10",
    highlight: "border-cyan-400 bg-cyan-500/10",
    hover: "hover:bg-white/10",
    newPlayer: "animate-pulse ring-2 ring-emerald-400/50",
    avatar:
      "w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-cyan-400",
    name: "text-sm text-white font-medium",
    badge: "bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded-md",
    placeholder:
      "text-center p-6 text-slate-400 italic bg-white/5 rounded-lg border border-white/10",
  },

  playerSection: {
    title:
      "text-xl font-semibold text-white flex items-center gap-2 text-[#f4a261]",
    online:
      "bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full",
    icon: "h-5 w-5 text-[#f4a261]",
  },

  avatarSelector: {
    container:
      "rounded-xl p-6 text-center space-y-6 backdrop-blur-md bg-white/5 border border-white/10 shadow-md",
    imageWrapper:
      "w-24 h-24 mx-auto rounded-full overflow-hidden bg-slate-100 border shadow ring-2 ring-white/30",
    button:
      "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-white text-[#283618] border border-[#283618] hover:bg-[#e9edc9]",
    icon: "w-4 h-4",
  },

  home: {
    wrapper: "min-h-screen flex items-center justify-center px-4",
    card: "w-full max-w-md bg-[#faedcd] border border-border shadow-xl rounded-3xl overflow-hidden py-0",
    cardContent: "space-y-6 p-6 py-4 pb-0",
    cardFooter: "px-6 p-6 pt-0",
    label: "text-gray-800 font-medium",
    input:
      "rounded-lg border-slate-300 focus:ring-2 focus:ring-cyan-500 text-gray-900 bg-white shadow-inner",
    actionButton:
      "w-full bg-[#f4a261] hover:bg-[#bc6c25] text-black py-3 rounded-xl font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
  },

  bluffSection: {
    card: "bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-lg border border-amber-200",
    text: {
      heading: "text-lg text-amber-800 mb-4 text-center",
      label: "text-gray-700 text-center",
      bluff: "bg-white p-3 rounded-lg font-medium text-black text-center",
      waiting: "text-sm text-gray-500 italic text-center",
      error:
        "text-sm text-red-600 text-center mt-2 flex items-center justify-center gap-2",
      warning: "flex items-center gap-2 text-sm text-yellow-400",
    },
    input:
      "w-full p-3 rounded-lg text-black bg-white border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-500 outline-none",
    button: {
      base: "w-full pt-2 p-4 py-3 px-4 rounded-lg font-medium text-center transition-all duration-300 flex items-center justify-center space-x-2",
      enabled:
        "bg-amber-600 hover:bg-amber-500 text-white shadow-md hover:shadow-lg",
      disabled: "bg-[#a3b18a] text-amber-100 cursor-not-allowed",
    },
    icon: {
      success: "w-6 h-6 mx-auto text-green-600",
      warning: "w-4 h-4",
    },
  },

  resultSection: {
    card: "bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-2xl shadow-xl border border-yellow-200 space-y-6",
    title: "text-2xl font-bold text-amber-700 text-center",
    topPlayer: "bg-yellow-400 text-black font-extrabold ring-2 ring-yellow-500",
    player: "bg-amber-200 text-amber-900",
    avatar: "w-10 h-10 rounded-full overflow-hidden border border-white shadow",
    playerName: "flex-1 text-left text-lg",
    playerScore: "text-md",
  },

  voteBreakdownSection: {
    container:
      "p-6 bg-amber-50 rounded-xl border border-amber-200 shadow space-y-6",
    title: "text-center text-2xl font-bold text-amber-700",
    question: "text-center text-sm italic text-amber-600",
    card: {
      base: "rounded-xl p-1 relative shadow border",
      correct: "bg-green-100 border-green-200 text-green-900",
      bluff: "bg-red-100 border-red-200 text-red-900",
    },
    text: {
      guess: "text-center font-semibold text-lg",
      author: "text-center text-sm italic mt-1",
    },
  },

  tabSelector: {
    trigger:
      "text-sm font-semibold tracking-wide data-[state=active]:bg-yellow-300 data-[state=active]:text-black data-[state=active]:ring-2 data-[state=active]:ring-[#f4a261]/70 rounded-lg transition-all",
  },
  border: {
    default: "border-yellow-300",
    current: "border-yellow-600 ring-2 ring-yellow-500",
  },

  avatar: {
    base: "w-12 h-12 rounded-full overflow-hidden shadow transition-all duration-300",
  },

  footer:
    "bg-gradient-to-r from-[#f4a261]  to-amber-400 border-t border-yellow-200",
};
