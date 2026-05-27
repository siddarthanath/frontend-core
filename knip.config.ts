import type { KnipConfig } from "knip"

const config: KnipConfig = {
  entry: [
    "src/app/**/page.tsx",
    "src/app/**/layout.tsx",
    "src/app/**/route.ts",
    "src/middleware.ts",
  ],
  project: ["src/**/*.{ts,tsx}"],
  ignore: [
    // shadcn-managed — these are used via dynamic imports or CLI
    "src/components/ui/**",
  ],
  ignoreDependencies: [
    // peer deps / PostCSS plugins not directly imported in TS
    "@tailwindcss/postcss",
  ],
}

export default config
