// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
//
// Deploy target: Vercel.
// The Lovable config only runs Nitro automatically inside the Lovable sandbox,
// so self-hosted builds (Vercel) get a Vite-only output with NO server function,
// which makes every SSR route — including "/" — return 404 on Vercel.
// Forcing Nitro on with the "vercel" preset emits a Vercel Build Output API
// bundle (config.json + the SSR serverless function) so SSR routes work.
//
// The Lovable config defaults Nitro's output to dist/server + dist/client, which
// is NOT where Vercel looks. Vercel auto-detects the Build Output API at
// `.vercel/output/{config.json,static,functions/<name>.func}`. The vercel preset's
// config.json routes "/(.*)" -> "/__server", so the function MUST live at
// `.vercel/output/functions/__server.func`. We override the output dirs to match.
//
// Set NITRO_PRESET (e.g. "cloudflare-module") to target another platform.
const isVercelTarget = (process.env.NITRO_PRESET ?? "vercel") === "vercel";

const nitroConfig = isVercelTarget
  ? {
      preset: "vercel",
      output: {
        dir: ".vercel/output",
        publicDir: ".vercel/output/static",
        serverDir: ".vercel/output/functions/__server.func",
      },
    }
  : { preset: process.env.NITRO_PRESET };

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: nitroConfig,
});
