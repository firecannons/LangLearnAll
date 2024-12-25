const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')


module.exports = {
  PORT: 3004,
  
  
  
  
  DEFAULT_RETURN_FIELD: 'data',
  
  RETRIEVE_ALL_DATA_LIST_ITEMS_PATH: 'retrieveAllDataListItems',
  
  SAVE_DATA_LIST_ITEM_PATH: 'saveDataListItem',
  DELETE_DATA_LIST_ITEM_PATH: 'deleteDataListItem',
  RETRIEVE_COMPLETE_DATA_LIST_ITEM_PATH: 'retrieveCompleteDataListItem',
  
  
  DATA_LIST_FILE_START_OBJECT: {'allTimeCount': 0, 'list': {}},
  
  DATA_LIST_ID_FIELD_NAME: 'id',
  DATA_LIST_ALL_TIME_COUNT_FIELD_NAME: 'allTimeCount',
  DATA_LIST_LIST_FIELD_NAME: 'list',
  
  PATH_FROM_THIS_CODE_FILE_TO_REPO_BASE_LOCATION: '../../',
  DATA_FOLDER_NAME: 'Data',
  
  DATA_LISTS: {
    'plugins': {
      'folderName': 'plugins',
      'dataFileName': 'pluginsData.txt'
    }
  },
  
  COLLECTION_FIELD_NAME: 'collection',
  
  INCOMING_ITEM_FIELD_NAME: 'item',
  
  ITEM_DATA_FIELD_NAME: 'itemData',
  
  INCOMING_ID_FIELD_NAME: 'itemId',
  
  
  TEXT_FILE_FIELD_TYPE: 'File(text)',
  TEXT_FIELD_TYPE: 'Text',

  DATA_LIST_ITEM_FIELD_VALUE_FIELD_NAME: 'fieldValue',
  DATA_LIST_ITEM_FIELD_TYPE_FIELD_NAME: 'fieldType',
  DATA_LIST_ITEM_FIELD_NAME_FIELD_NAME: 'fieldName',
  
  DATA_LIST_ITEM_FILE_FIELDS_FOLDER_PATH: 'fieldFiles',
  
  RUN_PAGE_TEXT_TO_REPLACE: '<!--%-->',
  RUN_PAGE_DATA_LIST_MAIN_TYPE: 'plugins',
  
  
  CODE_TEXT_IDS: ['webBrowserCode', 'webServerCode'],
  
  
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
    
    app.get('/Plugin/:id/edit', function(req, res) {
        res.sendFile( path.resolve( __dirname + '/../Client/Specific/PluginEdit.html' ) );
    })
    
    app.get('/Run', await this.generateAndSendRunPageHtmlCode.bind(this))
    
    app.get('/', function (req, res) {
       res.redirect('/Run')
    })
    
    app.post('/' + this.RETRIEVE_ALL_DATA_LIST_ITEMS_PATH, await this.lookupAllDataListItems.bind(this))
    
    app.post('/' + this.SAVE_DATA_LIST_ITEM_PATH, await this.saveDataListItem.bind(this))
    
    app.post('/' + this.DELETE_DATA_LIST_ITEM_PATH, await this.deleteDataListItem.bind(this))
    
    app.post('/' + this.RETRIEVE_COMPLETE_DATA_LIST_ITEM_PATH, await this.retrieveCompleteDataListItem.bind(this))
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
  
  generateAndSendRunPageHtmlCode: async function(req, res)
  {
    let html = await this.generateRunPageHtmlCode(req, res)
    await res.set('Content-Type', 'text/html');
    await res.send(Buffer.from(html));
  },
  
  generateRunPageHtmlCode: async function(req, res)
  {
    let runPageHtmlCodeBase = await this.readRawTextFile('/../Client/Specific/Run.html')
    let pluginCode = await this.generateRunPagePluginCode()
    let runPageGeneratedHtmlCode = await runPageHtmlCodeBase.replace(this.RUN_PAGE_TEXT_TO_REPLACE, pluginCode)
    return runPageGeneratedHtmlCode
  },
  
  generateRunPagePluginCode: async function()
  {
    let collectionData = await this.getDataListCollectionFromColletionFieldName(this.RUN_PAGE_DATA_LIST_MAIN_TYPE)
    let dataList = await this.getAllDataListItems(collectionData)
    let generatedPluginCode = await this.getAllGeneratedPluginCode(collectionData, dataList)
  },
  
  getAllGeneratedPluginCode: async function(collectionData, dataList)
  {
    let allCode = ''
    let listDataItself = dataList[this.DATA_LIST_LIST_FIELD_NAME]
    let dataListKeys = await Object.keys(listDataItself)
    for(let itemKey of dataListKeys)
    {
      let dataItem = listDataItself[itemKey]
      let referenceObject = await this.getReferenceObject(dataItem, dataList)
      console.log('getting code' , collectionData, referenceObject, dataItem, dataList)
      completeDataItem = await this.readFileFields(collectionData, referenceObject, dataItem)
      let code = await this.getDataListItemFieldValue(this.CODE_TEXT_IDS[0], completeDataItem)
      allCode = code + '\n'
    }
    return dataList
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
      let dataItem = await this.getShallowDataListItem(collectionData, referenceObject)
      console.log('reading object correft', referenceObject, dataItem)
      listDataItself[itemKey] = dataItem
    }
    return dataList
  },
  
  getShallowDataListItem: async function(collectionData, referenceObject)
  {
    let dataItem = await this.readJSONDataListItemDataFile(collectionData, referenceObject)
    return dataItem
  },
  
  getDataListCollectionFromInput: async function(dataListSpecifierObject)
  {
    let collectionData = await this.getDataListCollectionFromColletionFieldName(dataListSpecifierObject[this.COLLECTION_FIELD_NAME])
    return collectionData
  },
  
  getDataListCollectionFromColletionFieldName: async function(colletionFieldName)
  {
    let collectionData = this.DATA_LISTS[colletionFieldName]
    return collectionData
  },
  
  saveDataListItem: async function(req, res)
  {
    let collectionData = await this.getDataListCollectionFromInput(req.body)
    let item = await this.getDataListIncomingItem(req.body)
    await this.createDataListFileAndPathIfNotExist(collectionData)
    await this.saveObjectToDataList(item, collectionData)
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
  
  saveObjectToDataList: async function(item, collectionData)
  {
    let dataList = await this.readJSONDataListDataFileFromCollectionData(collectionData)
    let referenceObject = await this.getOrAddReferenceObjectToDataList(item, dataList)
    await this.possiblyAssignIdToDataListItemIfNoId(item, dataList)
    await this.saveDataListItemDataFile(collectionData, referenceObject, item)
    await this.saveDataListDataFile(collectionData, dataList)
  },
  
  possiblyAssignIdToDataListItemIfNoId: async function(item, dataList)
  {
    if(await this.dataListItemFieldExists(item, this.DATA_LIST_ID_FIELD_NAME) == false)
    {
      await this.assignIdToDataListItem(item, dataList)
    }
  },
  
  assignIdToDataListItem: async function(item, dataList)
  {
    await this.setIdToObjectItemData(item, dataList)
    await this.increaseDataListAllTimeCountByOne(dataList)
  },
  
  dataListItemFieldExists: async function(item, fieldName)
  {
    let output = false
    if(item[fieldName] != null)
    {
      output = true
    }
    return output
  },
  
  retrieveCompleteDataListItem: async function(req, res)
  {
    let collectionData = await this.getDataListCollectionFromInput(req.body)
    let itemId = await this.getDataListIncomingId(req.body)
    let item = await this.getCompleteDataListItemFromId(collectionData, itemId)
    return res.json({[this.DEFAULT_RETURN_FIELD]: item})
  },
  
  getCompleteDataListItemFromId: async function(collectionData, itemId)
  {
    let dataList = await this.readJSONDataListDataFileFromCollectionData(collectionData)
    let dataListWithItems = await this.extractCompleteDataListItem(collectionData, dataList, itemId)
    return dataListWithItems
  },
  
    
  extractCompleteDataListItem: async function(collectionData, dataList, itemId)
  {
    let listDataItself = dataList[this.DATA_LIST_LIST_FIELD_NAME]
    let referenceObject = listDataItself[itemId]
    let dataItem = await this.collectCompleteDataListItem(collectionData, referenceObject)
    return dataItem
  },
  
  collectCompleteDataListItem: async function(collectionData, referenceObject)
  {
    let dataItem = await this.readJSONDataListItemDataFile(collectionData, referenceObject)
    dataItem = await this.readFileFields(collectionData, referenceObject, dataItem)
    console.log('dataItem', dataItem)
    return dataItem
  },
  
  readFileFields: async function(collectionData, referenceObject, item)
  {
    let itemKeys = await Object.keys(item)
    for(let itemKey of itemKeys)
    {
      let fieldObject = item[itemKey]
      item[itemKey] = await this.possiblyReadDataItemFieldFileIfFieldIsFile(collectionData, referenceObject, fieldObject)
    }
    return item
  },
  
  possiblyReadDataItemFieldFileIfFieldIsFile: async function(collectionData, referenceObject, fieldObject)
  {
    if(await this.getFieldTypeFromFieldObject(fieldObject) == this.TEXT_FILE_FIELD_TYPE)
    {
      fieldObject = await this.readDataItemFieldFile(collectionData, referenceObject, fieldObject)
    }
    return fieldObject
  },
  
  readDataItemFieldFile: async function(collectionData, referenceObject, fieldObject)
  {
    let filePath = await this.getDataItemFileFieldFilePath(collectionData, referenceObject, fieldObject)
    let value = await this.readRawTextFile(filePath)
    fieldObject = await this.setFieldValueFromFieldObject(fieldObject, value)
    return fieldObject
  },
  
  setFieldValueFromFieldObject: async function(fieldObject, value)
  {
    fieldObject[this.DATA_LIST_ITEM_FIELD_VALUE_FIELD_NAME] = value
    return fieldObject
  },
  
  
  getDataListIncomingId: async function(collectionData)
  {
    let item = collectionData[this.INCOMING_ID_FIELD_NAME]
    return item
  },
  
  setIdToObjectItemData: async function(item, dataList)
  {
    let value = dataList[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME].toString()
    await this.addTextFieldToDataListItem(this.DATA_LIST_ID_FIELD_NAME, value, item)
  },
  
  createDataListItemTextField: async function(fieldName, fieldValue)
  {
    let newDataOfItem = {
      [this.DATA_LIST_ITEM_FIELD_NAME_FIELD_NAME]: fieldName,
      [this.DATA_LIST_ITEM_FIELD_TYPE_FIELD_NAME]: this.TEXT_FIELD_TYPE,
      [this.DATA_LIST_ITEM_FIELD_VALUE_FIELD_NAME]: fieldValue
    }
    return newDataOfItem
  },
  
  addTextFieldToDataListItem: async function(fieldName, fieldValue, object)
  {
    let newField = await this.createDataListItemTextField(fieldName, fieldValue)
    object[fieldName] = newField
    return object
  },
  
  saveDataListItemDataFile: async function(collectionData, referenceObject, item)
  {
    await this.writeDataListItemDataFile(collectionData, referenceObject, item)
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
  
  writeFileFields: async function(collectionData, referenceObject, item)
  {
    let itemKeys = await Object.keys(item)
    for(let itemKey of itemKeys)
    {
      let fieldObject = item[itemKey]
      await this.possiblyWriteDataItemFieldFileIfFieldIsFile(collectionData, referenceObject, fieldObject)
    }
  },
  
  possiblyWriteDataItemFieldFileIfFieldIsFile: async function(collectionData, referenceObject, fieldObject)
  {
    if(await this.getFieldTypeFromFieldObject(fieldObject) == this.TEXT_FILE_FIELD_TYPE)
    {
      await this.writeDataItemFieldFile(collectionData, referenceObject, fieldObject)
    }
  },
  
  writeDataItemFieldFile: async function(collectionData, referenceObject, fieldObject)
  {
    let filePath = await this.getDataItemFileFieldFilePath(collectionData, referenceObject, fieldObject)
    let value = await this.getFieldValueFromFieldObject(fieldObject)
    console.log('writing text file field', filePath, value, fieldObject)
    await this.writeAndPossiblyCreatePathToRawTextFile(filePath, value)
  },
  
  writeAndPossiblyCreatePathToRawTextFile: async function(filePath, value)
  {
    await this.createFolderOfFilePathIfNotExist(filePath)
    await this.writeRawTextFile(filePath, value)
  },
  
  getFileNameForDataListFieldFile: async function(fieldObject)
  {
    let filePath = await this.getFieldNameFromFieldObject(fieldObject) + '.txt'
    return filePath
  },
  
  getDataItemFileFieldFilePath: async function(collectionData, referenceObject, fieldObject)
  {
    let filePath = await this.getFileNameForDataListFieldFile(fieldObject)
    let p = await path.join(await this.getDataItemFileFieldFolderPath(collectionData, referenceObject, fieldObject), filePath)
    return p
  },
  
  getDataItemFileFieldFolderPath: async function(collectionData, referenceObject, fieldObject)
  {
    let p = await path.join(await this.getDataListItemDataFolderPath(collectionData, referenceObject), this.DATA_LIST_ITEM_FILE_FIELDS_FOLDER_PATH)
    return p
  },
  
  getFieldObjectFromDataListItem: async function(fieldName, object)
  {
    let fieldObject = object[fieldName]
    return fieldObject
  },

  getDataListItemFieldValue: async function(fieldName, object)
  {
    let value = null
    let fieldObject = await this.getFieldObjectFromDataListItem(fieldName, object)
    if(fieldObject != null)
    {
      value = await this.getFieldValueFromFieldObject(fieldObject)
    }
    return value
  },

  getFieldValueFromFieldObject: async function(fieldObject)
  {
    let value = fieldObject[this.DATA_LIST_ITEM_FIELD_VALUE_FIELD_NAME]
    return value
  },

  getDataListItemFieldType: async function(fieldName, object)
  {
    let value = null
    let fieldObject = await this.getFieldObjectFromDataListItem(fieldName, object)
    if(fieldObject != null)
    {
      value = await this.getFieldTypeFromFieldObject(fieldObject)
    }
    return value
  },

  getFieldTypeFromFieldObject: async function(fieldObject)
  {
    let value = fieldObject[this.DATA_LIST_ITEM_FIELD_TYPE_FIELD_NAME]
    return value
  },
  
  getDataListItemFieldName: async function(fieldName, object)
  {
    let value = null
    let fieldObject = await this.getFieldObjectFromDataListItem(fieldName, object)
    if(fieldObject != null)
    {
      value = await this.getFieldNameFromFieldObject(fieldObject)
    }
    return value
  },

  getFieldNameFromFieldObject: async function(fieldObject)
  {
    let value = fieldObject[this.DATA_LIST_ITEM_FIELD_NAME_FIELD_NAME]
    return value
  },
  
  writeDataListItemDataFile: async function(collectionData, referenceObject, item)
  {
    console.log('ni', item, referenceObject)
    await this.createDataListItemDataFolderIfNotExists(collectionData, referenceObject)
    await this.writeFileFields(collectionData, referenceObject, item)
    await this.writeJSONToDataListItemDataFile(collectionData, referenceObject, item)
  },
  
  writeJSONToDataListItemDataFile: async function(collectionData, referenceObject, item)
  {
    let path = await this.getDataListItemDataFilePath(collectionData, referenceObject)
    console.log('writing data list item to path', path, item)
    await this.writeJSONTextFile(path, item)
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
  
  getOrAddReferenceObjectToDataList: async function(object, dataList)
  {
    let referenceObject = null
    if(await this.dataListItemFieldExists(object, this.DATA_LIST_ID_FIELD_NAME) == true)
    {
      referenceObject = await this.getReferenceObjectToDataList(object, dataList)
    }
    else
    {
      referenceObject = await this.addReferenceObjectToDataList(object, dataList)
    }
    console.log(dataList,' rerenceitem')
    return referenceObject
  },
  
  addReferenceObjectToDataList: async function(object, dataList)
  {
    let referenceObject = await this.createReferenceObjectFromId(dataList[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME])
    let list = await dataList[this.DATA_LIST_LIST_FIELD_NAME]
    list[dataList[this.DATA_LIST_ALL_TIME_COUNT_FIELD_NAME]] = referenceObject
    return referenceObject
  },
  
  getReferenceObjectToDataList: async function(object, dataList)
  {
    let referenceObject = await this.createReferenceObjectFromId(await this.getDataListItemFieldValue(this.DATA_LIST_ID_FIELD_NAME, object))
    return referenceObject
  },
  
  createReferenceObjectFromId: async function(id)
  {
    let textId = await id.toString()
    let referenceObject = {
      'id': textId,
      'dataItemFolderName': textId,
      'dataItemFileName': textId + '.txt'
    }
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
    await this.writeRawTextFile(path, await JSON.stringify(inputJSON, null, 2))
  },
      
  writeRawTextFile: async function(path, inputText)
  {
    await fs.writeFileSync(path, inputText)
  },
  
  async readJSONDataFile(path)
  {
    let text = await this.readRawTextFile(path)
    let o = await JSON.parse(text)
    return o
  },
  
  async readRawTextFile(path)
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
  
  createFolderOfFilePathIfNotExist: async function(filePath)
  {
    let folderPath = await path.dirname(filePath)
    await this.createFolderIfNotExist(folderPath)
  },
  
  createFolderIfNotExist: async function(path)
  {
    if (await fs.existsSync(path) == false)
    {
      await fs.mkdirSync(path, { recursive: true })
    }
  }

}
