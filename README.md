# stubs

## Startup

`cd stubs && npm run start`  
open stub management page on http&#x3A;//localhost:5000

## Integrate guide
#### Structure of your project
add stubs folder
```
├── src
└── stubs
   ├── api
   |  └── test.js
   ├── index.js
   └── config.json
   
```

put the following code to express, assuming `bff` is your api prefix. 
 

```javascript
// server.js 

if (process.env.NODE_ENV === 'development') {
   require('stubs-middleware')(server, require('../stubs/config.json'))
}

// ./stubs/config.json
{
  "port": 5000,
  "image": "brucejcw/stubs:1.0.1",
  "proxy": {
     "/bff": "/"
  }
}

// ./stubs/index.js

const config = require('.config')

const apiPath = __dirname + '/api'

var workerProcess = require('child_process').exec(
    `docker run -p ${config.port}:5000 -v ${apiPath}:/app/api {config.image}`,
    {},
)

workerProcess.stdout.on('data', function(data) {
    console.log('stdout: ' + data)
})

workerProcess.stderr.on('data', function(data) {
    console.log('stderr: ' + data)
})

// package.json, RUN with dev
// notice: proxy.skipToNextHandlerFilter won't work if stubs is not started.

"scripts": {
    "predev": "node ./stubs &"
}
```

## Manage apis

put all the api request files under `stubs/api/`, eg: `stubs/api/bff/user.js`

```javascript
module.exports = () => {
  return {
    hello: 'zzz',
  }
}
```

## example

