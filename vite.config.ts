import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Shared Vite configuration for all packages
// Individual packages can extend this with package-specific settings
export default defineConfig({
  plugins: [
    react({
      // Fast Refresh is enabled by default in @vitejs/plugin-react
      // Babel options for JSX runtime
      babel: {
        plugins: []
      }
    })
  ],

  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, './packages/artifacts/shared/src'),
      '@design-system': resolve(__dirname, './packages/design-system/src'),
      '@main-site': resolve(__dirname, './packages/main-site/src'),
      '@assets': resolve(__dirname, './assets')
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Source maps for debugging
    sourcemap: true,
    // Optimize chunks
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom']
        },
        // File naming with hashes for cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Increase chunk size warning limit (default is 500kb)
    chunkSizeWarningLimit: 1000
  },

  // Development server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: false,
    // CORS configuration
    cors: true,
    // HMR configuration
    hmr: {
      overlay: true
    }
  },

  // Preview server configuration (for production builds)
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: false
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    },
    postcss: {
      plugins: []
    }
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
