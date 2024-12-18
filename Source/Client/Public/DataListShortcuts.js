/*
* */


const RETRIEVE_ALL_DATA_LIST_ITEMS_PATH = '/retrieveAllDataListItems'
const SAVE_NEW_DATA_LIST_ITEM_PATH = '/saveNewDataListItem'
const DELETE_DATA_LIST_ITEM_PATH = '/deleteDataListItem'
const RETRIEVE_COMPLETE_DATA_LIST_ITEM_PATH = '/retrieveCompleteDataListItem'


const DATA_LIST_ID_FIELD_NAME = 'id'
const DATA_LIST_ALL_TIME_COUNT_FIELD_NAME = 'allTimeCount'
const DATA_LIST_LIST_FIELD_NAME = 'list'


const COLLECTION_FIELD_NAME = 'collection'

const INCOMING_ITEM_FIELD_NAME = 'item'
const INCOMING_ITEM_ID_FIELD_NAME = 'itemId'

const FILE_FIELD_TYPE = 'File'
const TEXT_FILE_FIELD_TYPE = 'Text'

async function addTextFileFieldToDataListItem(plugin, text, fieldId)
{
  let fileObject = {
    'fieldId': fieldId,
    'fieldType': FILE_FIELD_TYPE,
    'fieldSubType': TEXT_FILE_FIELD_TYPE,
    'value': text
  }
  plugin[fieldId] = fileObject
}

async function saveDataListObject(object, collectionName)
{
  let body = {[COLLECTION_FIELD_NAME]: collectionName, [INCOMING_ITEM_FIELD_NAME]: object}
  newPlugin = await fetchDataShortcut(SAVE_NEW_DATA_LIST_ITEM_PATH, body)
  return newPlugin
}

async function deleteDataListItem(object, collectionName)
{
  let body = {[COLLECTION_FIELD_NAME]: collectionName, [INCOMING_ITEM_FIELD_NAME]: object}
  newPlugin = await fetchDataShortcut(DELETE_DATA_LIST_ITEM_PATH, body)
  return newPlugin
}



async function retrieveAlltemsFromDataList(collectionName)
{
  let body = {[COLLECTION_FIELD_NAME]: collectionName}
  let plugins = await fetchDataShortcut(RETRIEVE_ALL_DATA_LIST_ITEMS_PATH, body)
  return plugins
}

async function retrieveCompleteDataListItem(collectionName, id)
{
  let body = {[COLLECTION_FIELD_NAME]: collectionName, [INCOMING_ITEM_ID_FIELD_NAME]: id}
  let plugins = await fetchDataShortcut(RETRIEVE_COMPLETE_DATA_LIST_ITEM_PATH, body)
  return plugins
}

