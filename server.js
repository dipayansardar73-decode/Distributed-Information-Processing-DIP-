import express from 'express'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const app = express()
const root = path.dirname(fileURLToPath(import.meta.url))

app.get('/api/health', (_req, res) => {
  res.json({ service: 'railblazers-demo', status: 'ready' })
})

app.use(express.static(path.join(root, 'dist')))
app.get(/.*/, (_req, res) => res.sendFile(path.join(root, 'dist', 'index.html')))

const port = process.env.PORT || 4174
app.listen(port, () => console.log(`RailBlazers running on http://localhost:${port}`))
