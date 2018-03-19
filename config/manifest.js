/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    name: "Firebass",
    short_name: "Firebass",
    description: "A Youtube music streaming project, powered by Firebase",
    start_url: "/",
    display: "standalone",
    background_color: "#F0F1F1",
    theme_color: "#25B7D3",
    icons: [
      {
        src: "/images/icons/logo.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/images/icons/logo.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/images/icons/logo.png",
        sizes: "180x180",
        type: "image/png",
        targets: ['apple']
      },
      {
        src: "/images/icons/logo.png",
        element: "square150x150logo",
        targets: ['ms']
      }
    ],
    ms: {
      tileColor: '#F0F1F1'
    }
  };
};
