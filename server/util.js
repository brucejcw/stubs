const path = require('path')
const urlUtil = require('url')
const projectRoot = process.cwd()

const requireNoCache = (filePath) => {
  delete require.cache[filePath]
  return require(filePath)
}

const resolveRoot = (p) => {
  return path.resolve(projectRoot, './' + p)
}

const getPathname = (url) => {
  return urlUtil.parse(url).pathname
}

const string2bool = (string) => {
  return string === 'true' || string === true
}

module.exports = {
  requireNoCache,
  resolveRoot,
  getPathname,
  string2bool,
}
