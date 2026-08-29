import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.palo.game',
  appName: 'Palo',
  webDir: 'out',
  plugins: {
    Keyboard: {
      // resize the webview so the layout (100dvh) shrinks with the keyboard,
      // keeping focused inputs visible instead of hidden behind it
      resize: 'native',
    },
  },
};

export default config;
