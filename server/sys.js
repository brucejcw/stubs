const glob = require('glob')
const { fmtPath, resolveRoot } = require('./util')

let apiList = []

const getAllApis = () => {
  const memoryMap = array2map(apiList)
  apiList = loadApis().map((api) => ({
    api,
    enable: memoryMap[api] || false,
  }))
  return apiList
}

const setApi = (newData) => {
  apiList = apiList.map((item) => {
    return newData.api === item.api
      ? {
          ...item,
          enable: bugfix(newData.enable),
        }
      : item
  })
}

const loadApis = () => {
  return glob.sync(resolveRoot('./api/**/*.js')).map(fmtPath)
}

const setAll = (enable) => {
  enable = bugfix(enable)
  apiList = apiList.map((item) => ({
    ...item,
    enable,
  }))
}

const getCache = () => {
  return apiList
}

const array2map = (arr) => {
  return arr.reduce((result, next) => {
    result[next.api] = next.enable
    return result
  }, {})
}

function bugfix(enable) {
  // TODO, 传过来的变成了string 'false'
  return enable === 'false' ? false : enable
}

module.exports = {
  getAllApis,
  setApi,
  setAll,
  getCache,
}
