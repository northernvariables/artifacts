#!/usr/bin/env node

/**
 * Build script for Northern Variables monorepo
 * Orchestrates building all packages and copies outputs to public/ directory
 */

import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Artifacts to build
const artifacts = [
  'vote-spectrum',
  // Add more artifacts as they're migrated:
  // 'finkelstein-playbook',
  // 'canadian-politics-survey',
  // 'canada-federal-election-45-tracker',
  // etc.
]

// Legacy HTML files to copy (static article pages)
const legacyHtmlFiles = [
  'broadcast-os-pitch.html',
  'canada-federal-election-45-tracker.html',
  'canada-map.html',
  'canadian-identity-network.html',
  'canadian-politics-survey.html',
  'cpc-opt-out.html',
  'cpc-privacy-policy-visual-analysis.html',
  'finkelstein-playbook.html',
  'vote-spectrum.html',
  'vote-spectrum-data.json',
  'submission-widget.js'
]

const log = {
  info: (msg) => console.log(`\x1b[36mℹ\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m✓\x1b[0m ${msg}`),
  error: (msg) => console.error(`\x1b[31m✗\x1b[0m ${msg}`),
  step: (msg) => console.log(`\n\x1b[1m→ ${msg}\x1b[0m`)
}

const exec = (command, options = {}) => {
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: rootDir,
      ...options
    })
  } catch (error) {
    log.error(`Command failed: ${command}`)
    throw error
  }
}

async function build() {
  try {
    log.step('Building Northern Variables...')

    // Step 1: Clean public directory
    log.info('Cleaning public/ directory...')
    await fs.emptyDir(path.join(rootDir, 'public'))
    log.success('Cleaned public/ directory')

    // Step 2: Build design system (if it has a build step)
    // Currently it's just TypeScript files imported directly, so skip for now
    log.info('Design system: No build needed (consumed by other packages)')

    // Step 3: Build main site (when it exists)
    const mainSitePath = path.join(rootDir, 'packages/main-site/package.json')
    if (await fs.pathExists(mainSitePath)) {
      log.step('Building main site...')
      exec('npm run build --workspace=packages/main-site')

      const mainSiteDist = path.join(rootDir, 'packages/main-site/dist')
      if (await fs.pathExists(mainSiteDist)) {
        await fs.copy(mainSiteDist, path.join(rootDir, 'public'))
        log.success('Main site built and copied to public/')
      }
    } else {
      log.info('Main site package not found - skipping')
    }

    // Step 4: Build each artifact
    for (const artifact of artifacts) {
      const artifactPath = path.join(rootDir, `packages/artifacts/${artifact}`)
      const artifactPackageJson = path.join(artifactPath, 'package.json')

      if (await fs.pathExists(artifactPackageJson)) {
        log.step(`Building ${artifact}...`)
        exec(`npm run build --workspace=packages/artifacts/${artifact}`)

        const artifactDist = path.join(artifactPath, 'dist')
        const publicArtifactPath = path.join(rootDir, `public/artifacts/${artifact}`)

        if (await fs.pathExists(artifactDist)) {
          await fs.copy(artifactDist, publicArtifactPath)
          log.success(`${artifact} built and copied to public/artifacts/${artifact}`)
        }
      } else {
        log.info(`Artifact ${artifact} not found - skipping`)
      }
    }

    // Step 5: Copy legacy HTML files (static article pages)
    log.step('Copying legacy HTML article files...')
    for (const file of legacyHtmlFiles) {
      const sourcePath = path.join(rootDir, file)
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, path.join(rootDir, 'public', file))
        log.success(`Copied ${file}`)
      }
    }

    // Step 6: Copy static assets
    log.step('Copying static assets...')

    const assetsPath = path.join(rootDir, 'assets')
    if (await fs.pathExists(assetsPath)) {
      await fs.copy(assetsPath, path.join(rootDir, 'public/assets'))
      log.success('Assets copied to public/assets')
    }

    // Step 7: Copy CNAME if it exists
    const cnamePath = path.join(rootDir, 'CNAME')
    if (await fs.pathExists(cnamePath)) {
      await fs.copy(cnamePath, path.join(rootDir, 'public/CNAME'))
      log.success('CNAME copied to public/')
    }

    // Step 8: Create .nojekyll file for GitHub Pages
    await fs.writeFile(path.join(rootDir, 'public/.nojekyll'), '')
    log.success('Created .nojekyll file')

    log.step('Build complete! 🎉')
    log.info(`Output directory: ${path.join(rootDir, 'public')}`)

  } catch (error) {
    log.error('Build failed!')
    console.error(error)
    process.exit(1)
  }
}

// Run the build
build()
