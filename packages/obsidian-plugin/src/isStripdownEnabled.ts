import type { App, TFile } from 'obsidian'

export const isStripdownEnabled = ({
  app,
  file,
}: {
  app: App
  file: TFile | null
}) => {
  if (!file) return false

  const tags: string[] | undefined =
    app.metadataCache.getFileCache(file)?.frontmatter?.tags

  return !!tags?.includes('stripdown')
}
