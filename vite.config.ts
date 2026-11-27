import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from "node:fs";

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: "hacs-root-bundle",
      closeBundle() {
        copyFileSync("dist/registros-camaras-cards.js", "registros-camaras-cards.js");
      },
    },
  ],
  build: {
    lib: { entry: "src/cards.ts", formats: ["es"], fileName: () => "registros-camaras-cards.js" },
    target: "es2022",
  },
});
