import { spawn } from 'node:child_process'
import process from 'node:process'

/**
 * @typedef {'npm' | 'yarn' | 'pnpm'} PackageManager
 */

/**
 * @returns {PackageManager | null}
 */
function detectPackageManager() {
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

/**
 * 
 * @param {string} command 
 * @param {string[]} args 
 * @param {{ stdio?: 'inherit' }} options 
 * @returns {Promise<{ stdout: string, stderr: string }>}
 */
function execCommand(
  command,
  args,
  options,
) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options?.stdio || 'pipe',
      shell: true,
    })
    let stdout = ''
    let stderr = ''
    if (child.stdout) {
      child.stdout.on('data', (data) => {
        stdout += data.toString()
      })
    }
    if (child.stderr) {
      child.stderr.on('data', (data) => {
        stderr += data.toString()
      })
    }
    child.on('close', () => {
      resolve({ stdout, stderr })
    })
    child.on('error', (error) => {
      reject(error)
    })
  })
}

/**
 * @returns {Promise<boolean>}
 */
async function verifyDependencies() {
  const packageManager = detectPackageManager() || 'npm'
  let installCmd = ['', []]
  switch (packageManager) {
    case 'npm':
      installCmd = ['npm', ['ls', '--ignore-scripts']]
      break
    case 'yarn':
      installCmd = ['yarn', ['check', '--integrity', '--ignore-scripts']]
      break
  }
  const result = await execCommand(installCmd[0], installCmd[1])
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

/**
 * @returns {Promise<void>}
 */
async function installDependencies() {
  const packageManager = detectPackageManager() || 'npm'
  let installCmd = ['', []]
  switch (packageManager) {
    case 'npm':
      installCmd = ['npm', ['install', '--ignore-scripts']]
      break
    case 'yarn':
      installCmd = ['yarn', ['install', '--ignore-scripts']]
      break
  }
  await execCommand(installCmd[0], installCmd[1], { stdio: 'inherit' })
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
