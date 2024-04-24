import 'reflect-metadata'
import express from 'express'
import yargParser from 'yargs-parser'
import dotenv from 'dotenv'
import { InversifyExpressServer } from 'inversify-express-utils'
import { PostContainer } from './container/container'
import cors from 'cors'

const args = process.argv.slice(2)
const argv = yargParser(args, {
  boolean: ['dev']
})

if (argv.dev === true) dotenv.config()

const container = PostContainer()
const server = new InversifyExpressServer(container)
server.setConfig((app) => {
  app.use(express.json())
  app.use(cors({
    credentials: true
  }))
})
const app = server.build()
const PORT = process.env.SERVER_PORT

app.listen(PORT, () => {
  console.log(`🚀 Service started on localhost:${PORT}`)
})
