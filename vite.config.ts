import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    lib: { entry: "src/cards.ts", formats: ["es"], fileName: () => "registros-camaras-cards.js" },
    target: "es2022",
  },
});
