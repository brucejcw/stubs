const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { resolveRoot } = require('./util')

const port = 5000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const router = express.Router()
const { requireNoCache, getFilePath, cleanupPathname } = require('./util')
const { getAllApis, setApi, setAll, getCache } = require('./sys')

app.use(express.static(resolveRoot('views/static')))
app.set('view engine', 'ejs')

app.use('*', (req, res, next) => {
  console.log('req.originalUrl ==> ', req.originalUrl)
  next()
})

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.use('/api', checkApiEnable, (req, res) => {
  const filePath = getFilePath(req)
  const json = requireNoCache(filePath)(req)
  res.json(json)
})

router.get('/stub/test/:api', (req, res, next) => {
  const api = decodeURIComponent(cleanupPathname(req.params.api)) + '.js'
  const item = getCache().find(_ => _.api === api)
  const status = !item || !item.enable ? 404 : 200
  res.status(status).send('奥利给')
})

router.get('/stub/all', (req, res) => {
  res.json({ data: getAllApis() })
})

router.post('/stub/setApi', (req, res) => {
  setApi(req.body)
  res.send('奥利给')
})

router.post('/stub/setAll', (req, res) => {
  setAll(req.body.enable)
  res.send('奥利给')
})

app.use('/', router)

app.listen(port, err => {
  if (err) throw err
  const url = `http://localhost:${port}`
  console.log(`> stubs is Ready on ${url}\n`)
})

function checkApiEnable(req, res, next) {
  const api = `${cleanupPathname(req.url)}.js`
  const item = getCache().find(_ => _.api === api)
  if (!item || !item.enable) {
    throw new Error(`api [${api}] not enable`)
  }
  next()
}
