const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const port = 5000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const router = express.Router()
const { getPathname, resolveRoot } = require('./util')
const service = require('./service')

app.use(express.static(resolveRoot('views/static')))
app.set('view engine', 'ejs')

app.use('*', (req, res, next) => {
  console.log('req.originalUrl ==> ', req.originalUrl)
  res.header("X-Powered-By", 'Stubs')
  next()
})

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.use('/api', checkApiEnable, (req, res) => {
  const data = service.getApiData(req)
  res.json(data)
})

router.get('/stub/all', (req, res) => {
  const data = service.getAllApis()
  res.json({ data })
})

router.post('/stub/setApi', (req, res) => {
  service.setApi(req.body)
  res.json({ success: true })
})

router.post('/stub/setAll', (req, res) => {
  service.setAll(req.body)
  res.json({ success: true })
})

app.use('/', router)

app.listen(port, err => {
  if (err) throw err
  const url = `http://localhost:${port}`
  console.log(`> stubs is Ready on ${url}\n`)
})

function checkApiEnable(req, res, next) {
  const api = getPathname(req.url)
  const found = service.getCache().find(_ => _.api === api)
  if (!found || !found.enable) {
    return res.status(404).send(`Not found api => ${api}`)
  }
  next()
}
