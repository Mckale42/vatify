import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vatify.app',
  appName: 'VATIFY',
  webDir: 'public',
  server: {
    url: 'https://vatify.co.za/dashboard',
    androidScheme: 'https',
    // The host redirects between apex and www on some routes; without this,
    // Capacitor treats that redirect as leaving the app and hands it to Chrome.
    allowNavigation: ['vatify.co.za', 'www.vatify.co.za'],
  },
};

export default config;
