const path = require('path')
const projectRoot = process.cwd()

const requireNoCache = (filePath) => {
  delete require.cache[filePath]
  return require(filePath)
}

/**
 * @param req
 * @returns {string}
 */
const getFilePath = (req) => {
  return resolveRoot(`./api/${cleanupPathname(req.url)}.js`)
}

/**
 * /usr/xxx/api/user.js => /user.js
 * @param p
 * @returns {*}
 */
const fmtPath = (p) => {
  return p.replace(resolveRoot('api'), '')
}

const resolveRoot = (p) => {
  return path.resolve(projectRoot, p)
}

const cleanupPathname = (url) => {
  return url.replace(/\?.*/, '')
}

module.exports = {
  requireNoCache,
  getFilePath,
  fmtPath,
  resolveRoot,
  cleanupPathname,
}
