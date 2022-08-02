const glob = require('glob')
const { requireNoCache, string2bool, getPathname, resolveRoot } = require('./util')
const API = './api'
let apiList = []

const getAllApis = () => {
  const apis = glob.sync(`${API}/**/*.js`).map((str) => str.replace(API, '').replace(/\.js$/, ''))
  apiList = merge(apiList, apis)
  return apiList
}

const merge = (cache, origin) => {
  return origin.map((api) => {
    const found = cache.find(t => t.api === api)
    return {
      api,
      enabled: found ? found.enabled : false
    }
  })
}

const setApi = (newData) => {
  const found = apiList.find(t => t.api === newData.api)
  if (found) {
    found.enabled = string2bool(newData.enabled)
  }
}

const setAll = ({ enabled }) => {
  apiList.forEach(item => {
    item.enabled = string2bool(enabled)
  })
}

const getCache = () => {
  return apiList
}

const getApiData = (req) => {
  const api = getPathname(req.originalUrl)
  const filePath = resolveRoot(api) + '.js'
  return requireNoCache(filePath)(req)
}

module.exports = {
  getAllApis,
  setApi,
  setAll,
  getCache,
  getApiData,
}
