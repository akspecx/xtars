import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xtars.app',
  appName: 'xtars',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
