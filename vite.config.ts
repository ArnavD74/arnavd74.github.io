import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Content-Security-Policy, injected into the built index.html only.
 *
 * - `http-equiv`, not `name`: the policy the HTML previously carried used
 *   `name="Content-Security-Policy"`, which browsers ignore entirely. It had no
 *   effect at all.
 * - Build-only: the dev server serves an inline React Refresh preamble and a
 *   websocket for HMR, both of which this policy would block.
 * - `style-src` needs 'unsafe-inline' because Framer Motion animates via inline
 *   style attributes and the wave background injects a <style> element.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  // Stylesheets come from api.fontshare.com / fonts.googleapis.com, but the font
  // files they reference are served from different hosts — cdn.fontshare.com and
  // fonts.gstatic.com. Verified against both stylesheets; missing cdn.fontshare.com
  // here silently drops the display and body typefaces.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
  "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  // No frame-ancestors: browsers ignore it in a <meta> policy and log a warning.
  // It only works as a response header, which GitHub Pages cannot set.
].join('; ');

const cspPlugin = (): Plugin => ({
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
        injectTo: 'head-prepend',
      },
    ],
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), cspPlugin()],
  resolve: { alias: { '@': '/src' } },
  build: {
    target: 'es2022',
    // The vendor libraries are the bulk of the JS and change far less often than
    // the site content, so splitting them out keeps them cached across deploys
    // that only touch copy or styling.
    rollupOptions: {
      output: {
        manualChunks: (id: string) =>
          id.includes('node_modules') ? 'vendor' : undefined,
      },
    },
  },
  server: {
    host: true, // == 0.0.0.0
    port: 5173,
    strictPort: true,
  },
});
