import { createJiti } from 'jiti'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const projectRoot = fileURLToPath(new URL('..', import.meta.url))

export const createTestJiti = () =>
  createJiti(projectRoot, { alias: { '@': `${projectRoot}/src` } })

export const readSource = (path: string) => readFileSync(`${projectRoot}${path}`, 'utf8')
export const readSources = (paths: string[]) =>
  paths.filter((path) => existsSync(`${projectRoot}${path}`)).map(readSource).join('\n')
