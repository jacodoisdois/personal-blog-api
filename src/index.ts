import express from 'express'
import yargParser from 'yargs-parser'
import dotenv from 'dotenv'

const args = process.argv.slice(2)
const argv = yargParser(args, {
  boolean: ['dev']
})

if (argv.dev === true) dotenv.config()

const app = express()
const PORT = process.env.SERVER_PORT

app.listen(3000, () => {
  console.log(`🚀 Service started on localhost:${PORT}`)
})
