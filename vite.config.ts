import { readFile } from 'node:fs/promises';
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

/**
 * Dev-only preview of the no-JS fallback, at /noscript.
 *
 * A browser only renders <noscript> when scripting is *disabled*, so dropping
 * the app's script tag is not enough to reveal it — the wrappers themselves
 * have to come off. This serves the real index.html with the <noscript> tags
 * unwrapped and the app script and mount point removed, which means the
 * preview is the markup that actually ships rather than a second copy of it
 * that can drift. Serving it raw (no transformIndexHtml) keeps the dev client
 * out of the page, so what renders is what a JS-less visitor would get.
 *
 * Dev-only on purpose: the live site should not carry a duplicate of its own
 * fallback at a second URL for search engines to find.
 */
const noscriptPreviewPlugin = (): Plugin => ({
  name: 'noscript-preview',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const path = (req.url ?? '').split('?')[0];
      if (path !== '/noscript' && path !== '/noscript/') return next();

      readFile(new URL('./index.html', import.meta.url), 'utf-8')
        .then((html) => {
          const unwrapped = html
            .replaceAll('<noscript>', '')
            .replaceAll('</noscript>', '')
            .replace(/<script type="module"[^>]*>\s*<\/script>/g, '')
            .replace('<div id="root"></div>', '');
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(unwrapped);
        })
        .catch(next);
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), cspPlugin(), noscriptPreviewPlugin()],
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
