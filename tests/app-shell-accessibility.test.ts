import assert from 'node:assert/strict'
import test from 'node:test'
import { readSource as read } from './helpers.ts'

test('AppShell provides a first, focus-revealed link to the focusable main landmark', () => {
  const shell = read('/src/widgets/app-shell/ui/AppShell.tsx')
  const styles = read('/src/widgets/app-shell/ui/AppShell.styles.ts')
  const skipLink = shell.indexOf('<S.SkipLink href="#main-content">본문 바로가기</S.SkipLink>')
  const sidebar = shell.indexOf('<Sidebar ')

  assert.notEqual(skipLink, -1)
  assert.ok(skipLink < sidebar)
  assert.match(shell, /<S\.Main id="main-content" tabIndex=\{-1\}>/)
  assert.match(styles, /transform: translateY\(-160%\);[\s\S]*&:focus-visible\s*\{\s*transform: translateY\(0\);[\s\S]*outline:/)
})
