// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
export const backgroundLoaders = {
  home: () => import('../components/backgrounds/LetterGlitch'),
  nexis: () => import('../components/backgrounds/Grainient'),
  ateru: () => import('../components/backgrounds/Threads'),
  biblelm: () => import('../components/backgrounds/Dither'),
  halcyra: () => import('../components/backgrounds/GhostFibers'),
  logscope: () => import('../components/backgrounds/FaultyTerminal'),
}
