import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    alias: {
      "@assets": path.resolve(__dirname, 'src/asset/*'),
      "@components": path.resolve(__dirname, 'src/components/*'),
      "@configs": path.resolve(__dirname, 'src/configs/*'),
      "@hooks": path.resolve(__dirname, 'src/hooks/*'),
      "@libs": path.resolve(__dirname, 'src/libs/*'),
      "@store": path.resolve(__dirname, 'src/store/*'),
      "@providers": path.resolve(__dirname, 'src/providers/*'),
      "@models": path.resolve(__dirname, 'src/models/*'),
      "@utils": path.resolve(__dirname, 'src/utils/*'),
      "@routers": path.resolve(__dirname, 'src/routers/*'),
    },
  },
});
