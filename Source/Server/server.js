const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')


module.exports = {
  PORT: 3004,
  
  
  
  
  DEFAULT_RETURN_FIELD: 'data',
  
  RETRIEVE_ALL_DATA_LIST_ITEMS_PATH: 'retrieveAllDataListItems',
  
  SAVE_NEW_DATA_LIST_ITEM_PATH: 'saveNewDataListItem',
  DELETE_DATA_LIST_ITEM_PATH: 'deleteDataListItem',
  
  
  DATA_LIST_FILE_START_OBJECT: {'allTimeCount': 0, 'list': {}},
  
  DATA_LIST_ID_FIELD_NAME: 'id',
  DATA_LIST_ALL_TIME_COUNT_FIELD_NAME: 'allTimeCount',
  DATA_LIST_LIST_FIELD_NAME: 'list',
  
  PATH_FROM_THIS_CODE_FILE_TO_REPO_BASE_LOCATION: '../../',
  DATA_FOLDER_NAME: 'data',
  
  DATA_LISTS: {
    'plugins': {
      'folderName': 'plugins',
      'dataFileName': 'pluginsData.txt'
    }
  },
  
  COLLECTION_FIELD_NAME: 'collection',
  
  INCOMING_ITEM_FIELD_NAME: 'item',
  
  ITEM_DATA_FIELD_NAME: 'itemData',
  
  
  
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
    
    app.post('/' + this.RETRIEVE_ALL_DATA_LIST_ITEMS_PATH, await this.lookupAllDataListItems.bind(this))
    
    app.post('/' + this.SAVE_NEW_DATA_LIST_ITEM_PATH, await this.saveNewDataListItem.bind(this))
    
    app.post('/' + this.DELETE_DATA_LIST_ITEM_PATH, await this.deleteDataListItem.bind(this))
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
  
  lookupAllDataListItems: async function(req, res)
  {
    let collectionData = await this.getDataListCollectionFromInput(req.body)
    await this.createDataListFileAndPathIfNotExist(collectionData)
    let dataItems = await this.getAllDataListItems(collectionData)
    return res.json({[this.DEFAULT_RETURN_FIELD]: dataItems})
  },
  
  getAllDataListItems: async function(collectionData)
  {
    let dataList = await this.readJSONDataListDataFileFromCollectionData(collectionData)
    let dataListWithItems = await this.readDataListItems(collectionData, dataList)
    return dataListWithItems
  },
  
  readDataListItems: async function(collectionData, dataList)
  {
    let listDataItself = dataList[this.DATA_LIST_LIST_FIELD_NAME]
    let dataListKeys = await Object.keys(listDataItself)
    for(let itemKey of dataListKeys)
    {
      let referenceObject = listDataItself[itemKey]
      let dataItem = await this.readJSONDataListItemDataFile(collectionData, referenceObject)
      listDataItself[itemKey][this.ITEM_DATA_FIELD_NAME] = dataItem
    }
    return dataList
  },
  
  getDataListCollectionFromInput: async function(dataListSpecifierObject)
  {
    let collectionData = this.DATA_LISTS[dataListSpecifierObject[this.COLLECTION_FIELD_NAME]]
    return collectionData
  },
  
  saveNewDataListItem: async function(req, res)
  {
    let collectionData = await this.getDataListCollectionFromInput(req.body)
    let item = await this.getDataListIncomingItem(req.body)
    await this.createDataListFileAndPathIfNotExist(collectionData)
    await this.saveNewObjectToDataListDataFile(item, collectionData)
    console.log('return item', item)
    return res.json({[this.DEFAULT_RETURN_FIELD]: item})
  },
  
  deleteDataListItem: async function(req, res)
  {
    let collectionData = await this.getDataListCollectionFromInput(req.body)
    let item = await this.getDataListIncomingItem(req.body)
    await this.createDataListFileAndPathIfNotExist(collectionData)
    await this.deleteItemFromDataList(item, collectionData)
    return res.json({[this.DEFAULT_RETURN_FIELD]: item})
  },
  
  deleteItemFromDataList: async function(item, collectionData)
  {
    await this.deleteItemSelfDataFile(item, collectionData)
    await this.deleteItemFromDataListDataFile(item, collectionData)
  },
  
  deleteItemFromDataListDataFile: async function(item, collectionData)
  {
    let dataList = await this.readJSONDataListDataFileFromCollectionData(collectionData)
    let referenceObject = await this.getReferenceObject(item, dataList)
    await this.deleteDataListItemFromDataList(item, dataList)
    await this.writeJSONDataListDataFileFromCollectionData(collectionData, dataList)
  },
  
  deleteItemSelfDataFile: async function(item, collectionData)
  {
    let dataList = await this.readJSONDataListDataFileFromCollectionData(collectionData)
    let referenceObject = await this.getReferenceObject(item, dataList)
    console.log('efw', referenceObject, dataList)
    await this.deleteDataListItemFolder(collectionData, referenceObject)
  },
  
  getReferenceObject: async function(item, dataList)
  {
    let referenceObject = dataList[this.DATA_LIST_LIST_FIELD_NAME][item[this.DATA_LIST_ID_FIELD_NAME]]
    return referenceObject
  },
  
  deleteDataListItemFolder: async function(collectionData, referenceObject)
  {
    let path = await this.getDataListItemDataFolderPath(collectionData, referenceObject)
    await fs.rmSync(path, { recursive: true, force: true });
  },
  
  deleteDataListItemFromDataList: async function(item, dataList)
  {
    console.log('fire', item, dataList)
    let listData = dataList[this.DATA_LIST_LIST_FIELD_NAME]
    await delete listData[item[this.DATA_LIST_ID_FIELD_NAME]]
    console.log('datalist delete', dataList, listData, item)
  },
  
  getDataListIncomingItem: async function(collectionData)
  {
    let item = collectionData[this.INCOMING_ITEM_FIELD_NAME]
    return item
  },
  
  saveNewObjectToDataListDataFile: async function(newItem, collectionData)
  {
    let dataList = await this.readJSONDataListDataFileFromCollectionData(collectionData)
    let referenceObject = await this.addReferenceObjectToDataList(newItem, dataList)
    await this.setIdToObjectItemData(newItem, dataList)
    await this.increaseDataListAllTimeCountByOne(dataList)
    await this.saveDataListItemDataFile(collectionData, referenceObject, newItem)
    await this.saveDataListDataFile(collectionData, dataList)
  },
  
  setIdToObjectItemData: async function(item, dataList)
  {
    let itemData = await this.getItemDataFromDataListItem(item)
    itemData[this.DATA_LIST_ID_FIELD_NAME] = dataList[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME]
  },
  
  saveDataListItemDataFile: async function(collectionData, referenceObject, newItem)
  {
    let itemData = await this.getItemDataFromDataListItem(newItem)
    await this.writeDataListItemDataFile(collectionData, referenceObject, itemData)
  },
  
  saveDataListDataFile: async function(collectionData, data)
  {
    await this.writeJSONDataListDataFileFromCollectionData(collectionData, data)
  },
  
  getItemDataFromDataListItem: async function(item)
  {
    let itemData = item[this.ITEM_DATA_FIELD_NAME]
    return itemData
  },
  
  writeDataListItemDataFile: async function(collectionData, referenceObject, newItem)
  {
    await this.createDataListItemDataFolderIfNotExists(collectionData, referenceObject)
    await this.writeJSONToDataListItemDataFile(collectionData, referenceObject, newItem)
  },
  
  writeJSONToDataListItemDataFile: async function(collectionData, referenceObject, newItem)
  {
    let path = await this.getDataListItemDataFilePath(collectionData, referenceObject)
    await this.writeJSONTextFile(path, newItem)
  },
  
  readJSONDataListItemDataFile: async function(collectionData, referenceObject)
  {
    let path = await this.getDataListItemDataFilePath(collectionData, referenceObject)
    let data = await this.readJSONDataFile(path)
    return data
  },
  
  createDataListItemDataFolderIfNotExists: async function(collectionData, referenceObject)
  {
    let path = await this.getDataListItemDataFolderPath(collectionData, referenceObject)
    await this.createFolderIfNotExist(path)
  },
  
  readJSONDataListDataFileFromCollectionData: async function(collectionData)
  {
    let path = await this.getDataListFolderDataFilePath(collectionData)
    let data = await this.readJSONDataFile(path)
    return data
  },
  
  writeJSONDataListDataFileFromCollectionData: async function(collectionData, data)
  {
    let path = await this.getDataListFolderDataFilePath(collectionData)
    await this.writeJSONTextFile(path, data)
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
  
  async addReferenceObjectToDataList(object, dataList)
  {
    let referenceObject = {
      'id': dataList[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME],
      'dataItemFolderName': dataList[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME],
      'dataItemFileName': dataList[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME] + '.txt'
    }
    let list = await dataList[this.DATA_LIST_LIST_FIELD_NAME]
    list[dataList[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME]] = referenceObject
    return referenceObject
  },
  
  async increaseDataListAllTimeCountByOne(data)
  {
    data[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME] = data[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME] + 1
  },
  
  createDataListFileAndPathIfNotExist: async function(collectionData)
  {
    await this.createDataListFolderIfNotExistsFromCollectionData(collectionData)
    await this.createDataListFileIfNotExist(collectionData)
  },
  
  createDataListFolderIfNotExistsFromCollectionData: async function(collectionData)
  {
    let path = await this.getDataListFolderPath(collectionData)
    await this.createFolderIfNotExist(path)
  },
  
  createDataListFileIfNotExist: async function(collectionData)
  {
    let path = await this.getDataListFolderDataFilePath(collectionData)
    if (await fs.existsSync(path) == false)
    {
      await this.createDefaultDataListFile(path)
    }
  },
  
  createJsonTextFileIfNotExist: async function(path, data)
  {
    if (await fs.existsSync(path) == false)
    {
      await this.writeJSONTextFile(path, data)
    }
  },
  
  createDefaultDataListFile: async function(path)
  {
    data = await this.getDeepCopiedDataListStartObject()
    await this.createJsonTextFileIfNotExist(path, data)
  },
  
  writeJSONTextFile: async function(path, inputJSON)
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
  
  getDataListFolderPath: async function(collectionData)
  {
    let p = await path.join(await this.getDataFolderPath(), collectionData['folderName'])
    return p
  },
  
  getDataListItemDataFolderPath: async function(collectionData, referenceObject)
  {
    let p = await path.join(await this.getDataListFolderPath(collectionData), referenceObject['dataItemFolderName'].toString())
    return p
  },
  
  getDataListItemDataFilePath: async function(collectionData, referenceObject)
  {
    let p = await path.join(await this.getDataListItemDataFolderPath(collectionData, referenceObject), referenceObject['dataItemFileName'])
    return p
  },
  
  getDataListFolderDataFilePath: async function(collectionData, referenceObject)
  {
    let p = await path.join(await this.getDataListFolderPath(collectionData), collectionData['dataFileName'])
    return p
  },
  
  createFolderIfNotExist: async function(path)
  {
    if (await fs.existsSync(path) == false)
    {
      await fs.mkdirSync(path, { recursive: true })
    }
  }

}
