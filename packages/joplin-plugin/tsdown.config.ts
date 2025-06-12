import { createHash } from 'node:crypto'
import { mkdir } from 'node:fs/promises'
import { $, file, Glob } from 'bun'

import { create } from 'tar'
import { defineConfig } from 'tsdown'

const sourceDir = 'src'
const distDir = 'dist'
const publishDir = 'publish'
const archivePath = `${publishDir}/plugin.jpl`

const glob = new Glob('**/*')

const currentGitInfo = async () => {
  try {
    const branch = await $`git rev-parse --abbrev-ref HEAD`.text()
    const commit = await $`git rev-parse HEAD`.text()

    return `${branch.trim()}:${commit.trim()}`
  } catch (error) {
    const messages = error instanceof Error ? error.message.split('\n') : ['']

    console.info(
      'Could not get git commit (not a git repo?):',
      messages[0].trim(),
    )
    console.info('Git information will not be stored in plugin info file')

    return ''
  }
}

const fileSha256 = async (file: string) => {
  const buffer = await Bun.file(file).bytes()

  return createHash('sha256').update(buffer).digest('hex')
}

const createPluginArchive = async () => {
  await mkdir(publishDir, { recursive: true })

  const distFiles = [...glob.scanSync(distDir)]

  await create(
    {
      strict: true,
      portable: true,
      file: archivePath,
      cwd: distDir,
    },
    distFiles,
  )
}

const createPluginInfo = async () => {
  const manifest = await file(`${distDir}/manifest.json`).json()
  const hash = await fileSha256(archivePath)
  const content = {
    ...manifest,
    _publish_hash: `sha256:${hash}`,
    _publish_commit: await currentGitInfo(),
  }

  await file(`${publishDir}/manifest.json`).write(
    JSON.stringify(content, null, '\t'),
  )
}

export default defineConfig({
  clean: [distDir, publishDir],
  copy: `${sourceDir}/manifest.json`,
  entry: [`${sourceDir}/index.ts`, `${sourceDir}/contentScript.ts`],
  env: {
    PARSE_MODE: 'obsidian',
  },
  external: ['@codemirror/state', '@codemirror/view'],
  format: 'commonjs',
  outExtensions: () => ({
    js: '.js',
  }),
  hooks: {
    'build:done': async () => {
      await createPluginArchive()
      await createPluginInfo()
    },
  },
})
