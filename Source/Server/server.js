const express = require('express')
const path = require('path')
const fs = require('fs')


module.exports = {
  PORT: 3004,
  
  // data folder path
  DFP: '../data/',
  
  // text file path
  TFP: '../data/data.txt',
  
  RETRIEVE_ALL_PLUGINS_PATH: 'retrieveAllPlugins',
  
  
  
  createNewWebServer: async function()
  {
    const app = express()
    return app
  },
  
  
  defineRoutes: async function(app)
  {
    app.use('/Public', express.static(path.join(__dirname, '/../Client/Public')))
    
    app.get('/Plugins', function(req, res) {
        res.sendFile( path.resolve( __dirname + '/../Client/Specific/Plugins.html' ) );
    })
    
    app.post('/' + this.RETRIEVE_ALL_PLUGINS_PATH, await this.lookupAllPlugins.bind(this))
  },
  
  appListen: async function(app)
  {
    app.listen(this.PORT, () => {
      console.log(`Example app listening on port ${this.PORT}`)
    })
  },
  
  
  startUp: async function()
  {
    let app = await this.createNewWebServer()
    
    await this.defineRoutes(app)
    
    await this.appListen(app)
  },
  
  lookupAllPlugins: async function(req, res)
  {
    let d = req.body
    return res.json({'data': []})
  }

}
