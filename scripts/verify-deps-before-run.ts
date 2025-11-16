import type { Nullable } from '@antfu/utils'
import process from 'node:process'
import { x } from 'tinyexec'

type PackageManager = 'npm' | 'yarn' | 'pnpm'

function detectPackageManager(): Nullable<PackageManager & {}> {
  const userAgent = process.env.npm_config_user_agent || ''
  const execPath = process.env.npm_execpath || ''
  if (userAgent.includes('pnpm') || execPath.includes('pnpm'))
    return 'pnpm'
  if (userAgent.includes('yarn') || execPath.includes('yarn'))
    return 'yarn'
  if (userAgent.includes('npm') || execPath.includes('npm'))
    return 'npm'
  return null
}

async function verifyDependencies(): Promise<boolean> {
  const packageManager = detectPackageManager() || 'npm'
  let installCmd: [string, string[]] = ['', []]
  switch (packageManager) {
    case 'npm':
      installCmd = ['npm', ['ls', '--ignore-scripts']]
      break
    case 'yarn':
      installCmd = ['yarn', ['check', '--integrity', '--ignore-scripts']]
      break
  }
  const result = await x(installCmd[0], installCmd[1])
  if (result.stderr.includes('npm error missing:') || result.stderr.includes('npm error invalid:')) {
    console.warn('⚠️ Dependencies version invalid. Trigger `npm install`.')
    return false
  }
  if (result.stderr.includes('error Lockfile does not contain pattern:')) {
    console.warn('⚠️ Dependencies version invalid. Trigger `yarn install`.')
    return false
  }
  return true
}

async function installDependencies(): Promise<void> {
  const packageManager = detectPackageManager() || 'npm'
  let installCmd: [string, string[]] = ['', []]
  switch (packageManager) {
    case 'npm':
      installCmd = ['npm', ['install', '--ignore-scripts']]
      break
    case 'yarn':
      installCmd = ['yarn', ['install', '--ignore-scripts']]
      break
  }
  await x(installCmd[0], installCmd[1], { nodeOptions: { stdio: 'inherit' } })
}

async function main() {
  const packageManager = detectPackageManager()
  if (!packageManager || packageManager === 'pnpm')
    process.exit(0)
  console.info('👾 Verifying dependencies...')
  if (await verifyDependencies()) {
    console.info('✅ Dependencies are valid.')
    process.exit(0)
  }
  await installDependencies()
}

/**
 * Top-level await is only available in ES modules.
 *
 * If you need port this script to CommonJS, wrap the call to `main` in an async
 * IIFE (Immediately Invoked Function Expression):
 *
 * (async () => { await main()
 * })();
 */
await main()
