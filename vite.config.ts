import svgr from "vite-plugin-svgr";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Use root-relative paths for Capacitor with 'https' scheme
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-charts': ['apexcharts', 'react-apexcharts'],
          'vendor-calendar': [
            '@fullcalendar/core',
            '@fullcalendar/daygrid',
            '@fullcalendar/interaction',
            '@fullcalendar/list',
            '@fullcalendar/react',
            '@fullcalendar/timegrid'
          ],
          'vendor-maps': ['leaflet', 'react-leaflet', '@react-jvectormap/core', '@react-jvectormap/world'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'swiper']
        }
      }
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});
