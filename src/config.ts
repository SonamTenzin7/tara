/// <reference types="vite/client" />
// ============================================================
//   APP CONFIGURATION
// ============================================================

const config = {
  // ----------------------------------------------------------
  // APP INFO
  // ----------------------------------------------------------
  appName: "Tara",
  appDescription: "Tara App",

  // ----------------------------------------------------------
  // TELEGRAM BOT
  // ----------------------------------------------------------
  botUsername: import.meta.env.VITE_BOT_USERNAME ?? "Tara_parimutuel_bot",
  botToken: import.meta.env.VITE_BOT_TOKEN ?? "",

  // ----------------------------------------------------------
  // DEPLOYMENT URL
  // The public URL where your app will be hosted
  // Examples:
  //   GitHub Pages:  'https://yourusername.github.io/tara'
  //   Vercel:        'https://tara.vercel.app'
  //   Custom domain: 'https://tara.yourdomain.com'
  // ----------------------------------------------------------
  appUrl: "https://tara-parimutuel.vercel.app",

  // ----------------------------------------------------------
  // TON CONNECT (for crypto wallet connection)
  // Use the same appUrl above, or a custom icon URL
  // ----------------------------------------------------------
  tonConnectIconUrl:
    "https://tara-parimutuel.vercel.app/icons/icon-192x192.png",
};

export default config;
