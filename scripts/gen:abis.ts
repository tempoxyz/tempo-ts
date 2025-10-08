import * as Fs from 'node:fs'
import * as Path from 'node:path'

const out = Path.resolve(import.meta.dirname, `../src/viem/abis.ts`)

Fs.rmSync(out)
Fs.writeFileSync(
  out,
  "// Generated with `bun run gen:abis`. Do not modify manually.\n\nimport * as Abi from 'ox/Abi'\n\n",
)

// Build all contracts in `contracts/`.
for (const file of Fs.globSync(
  Path.resolve(import.meta.dirname, '../contracts/**/src/**/*.sol'),
)) {
  if (file.includes('lib/')) continue
  const name = Path.basename(file)
  // Extract project path up to (and including) what the first ** matched
  const project = file.slice(0, file.indexOf('/src/'))
  const outPath = Path.resolve(project, 'out', name)

  for (const file of Fs.readdirSync(outPath)) {
    const path = Path.resolve(outPath, file)
    const name = Path.basename(path, '.json')

    if (name.startsWith('I')) continue

    const exportName = name
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .split(/[_\-. \s]+/)
      .map((w, i) => (i ? w[0]!.toUpperCase() + w.slice(1) : w))
      .join('')

    const { abi } = JSON.parse(Fs.readFileSync(path, 'utf-8'))

    Fs.appendFileSync(
      out,
      `export const ${exportName}Abi = Abi.from(${JSON.stringify(abi)})\n\n`,
    )
  }
}
