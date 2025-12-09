import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.methode.erpr',       // Identifiant unique Android/iOS
  appName: 'Méthode ERPR',         // Nom de ton application
  webDir: 'www',                   // Dossier local vide pour la synchronisation Capacitor
  server: {
    url: 'https://methode-erpr-by-arabeimportance.vercel.app', // Ton app Next.js en ligne
    cleartext: true                // Laisse "true" pour éviter les blocages HTTP (utile en dev)
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,    // Splash screen visible 3 secondes
      launchAutoHide: true         // Se ferme automatiquement
    }
  }
};

export default config;
