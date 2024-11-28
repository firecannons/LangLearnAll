const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')


module.exports = {
  PORT: 3004,
  
  DATA_FOLDER_NAME: 'Data/',
  
  PLUGINS_FOLDER_NAME: 'Plugins/',
  
  PATH_FROM_THIS_CODE_FILE_TO_REPO_BASE_LOCATION: '../../',
  
  
  PLUGINS_DATA_FILE_NAME: 'pluginsData.txt',
  
  
  
  
  RETRIEVE_ALL_PLUGINS_PATH: 'retrieveAllPlugins',
  
  
  SAVE_NEW_PLUGIN_PATH: 'saveNewPlugin',
  
  DATA_LIST_FILE_START_OBJECT: {'allTimeCount': 0, 'list': []},
  DATA_LIST_ID_FIELD_NAME: 'id',
  DATA_LIST_ALL_TIME_COUNT_FIELD_NAME: 'allTimeCount',
  DATA_LIST_LIST_FIELD_NAME: 'list',
  
  DEFAULT_RETURN_FIELD: 'data',
  
  
  
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
    
    app.post('/' + this.SAVE_NEW_PLUGIN_PATH, await this.saveNewPlugin.bind(this))
  },
  
  appListen: async function(app)
  {
    app.listen(this.PORT, () => {
      console.log(`Example app listening on port ${this.PORT}`)
    })
  },
  
  setupMiddleware: async function(app)
  {
    await app.use(await bodyParser.urlencoded({ extended: true }))
    await app.use(await bodyParser.json({limit: "100gb", extended: true}))
  },
  
  
  startUp: async function()
  {
    let app = await this.createNewWebServer()
    
    await this.setupMiddleware(app)
    
    await this.defineRoutes(app)
    
    await this.appListen(app)
  },
  
  lookupAllPlugins: async function(req, res)
  {
    let d = req.body
    await this.createFolderIfNotExist(await this.getDataFolderPath())
    await this.createFolderIfNotExist(await this.getPluginsFolderPath())
    let plugins = await this.readDataListFileJSON(await this.getPluginsDataFilePath())
    return res.json({[this.DEFAULT_RETURN_FIELD]: plugins})
  },
  
  readDataListFileJSON: async function(path)
  {
    let data = await this.readJSONDataFile(path)
    if(data == null)
    {
      data = await this.getDeepCopiedDataListStartObject()
    }
    return data
  },
  
  saveNewPlugin: async function(req, res)
  {
    let newPlugin = req.body
    await this.createFolderIfNotExist(await this.getDataFolderPath())
    await this.createFolderIfNotExist(await this.getPluginsFolderPath())
    await this.saveNewObjectToPluginsDataListFile(newPlugin)
    return res.json({[this.DEFAULT_RETURN_FIELD]: newPlugin})
  },
  
  saveNewObjectToPluginsDataListFile: async function(newPlugin)
  {
    await this.saveNewObjectToDataListFile(newPlugin, await this.getPluginsDataFilePath())
  },
  
  saveNewObjectToDataListFile: async function(newPlugin, path)
  {
    let data = await this.readJSONDataFile(path)
    if(data == null)
    {
      data = await this.getDeepCopiedDataListStartObject()
    }
    await this.addObjectToDataList(newPlugin, data)
    await this.writeJSONDataFile(path, data)
  },
  
  getDeepCopiedDataListStartObject: async function()
  {
    let object = await this.deepCopyObject(this.DATA_LIST_FILE_START_OBJECT)
    return object
  },
  
  // https://stackoverflow.com/questions/6089058/nodejs-how-to-clone-an-object
  deepCopyObject: async function(object)
  {
    return await JSON.parse(await JSON.stringify(object));
  },
  
  async addObjectToDataList(object, data)
  {
    object[this.DATA_LIST_ID_FIELD_NAME] = data[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME]
    await data[this.DATA_LIST_LIST_FIELD_NAME].push(object)
    await this.increaseDataListAllTimeCountByOne(data)
  },
  
  async increaseDataListAllTimeCountByOne(data)
  {
    data[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME] = data[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME] + 1
  },
  
  async writeJSONDataFile(path, inputJSON)
  {
    await this.writeDataFile(path, await JSON.stringify(inputJSON, null, 2))
  },
      
  async writeDataFile(path, inputText)
  {
    await fs.writeFileSync(path, inputText)
  },
  
  async readJSONDataFile(path)
  {
    let text = await this.readDataFile(path)
    let o = await JSON.parse(text)
    return o
  },
  
  async readDataFile(path)
  {
    let data = null
    try
    {
      data = await fs.readFileSync(path, 'utf8')
    }
    catch(e)
    {
    }
    return data
  },
  
  
  getThisCodeFilePath: async function()
  {
    let path = __dirname
    return path
  },
  
  
  getBaseRepoPath: async function()
  {
    let p = await path.join(await this.getThisCodeFilePath(), this.PATH_FROM_THIS_CODE_FILE_TO_REPO_BASE_LOCATION)
    return p
  },
  
  getDataFolderPath: async function()
  {
    let p = await path.join(await this.getBaseRepoPath(), this.DATA_FOLDER_NAME)
    return p
  },
  
  getPluginsFolderPath: async function()
  {
    let p = await path.join(await this.getDataFolderPath(), this.PLUGINS_FOLDER_NAME)
    return p
  },
  
  getPluginsDataFilePath: async function()
  {
    let p = await path.join(await this.getPluginsFolderPath(), this.PLUGINS_DATA_FILE_NAME)
    return p
  },
  
  createFolderIfNotExist: async function(path)
  {
    if (await fs.existsSync(path) == false)
    {
      await fs.mkdirSync(path)
    }
  }

}
