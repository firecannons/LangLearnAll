/*
* */


const RETRIEVE_ALL_DATA_LIST_ITEMS_PATH = '/retrieveAllDataListItems'
const SAVE_NEW_DATA_LIST_ITEM_PATH = '/saveNewDataListItem'
const DELETE_DATA_LIST_ITEM_PATH = '/deleteDataListItem'


const DATA_LIST_ID_FIELD_NAME = 'id'
const DATA_LIST_ALL_TIME_COUNT_FIELD_NAME = 'allTimeCount'
const DATA_LIST_LIST_FIELD_NAME = 'list'


const COLLECTION_FIELD_NAME = 'collection'

const INCOMING_ITEM_FIELD_NAME = 'item'

async function saveNewDataListObject(object, collectionName)
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
  let body = {'collection': collectionName}
  let plugins = await fetchDataShortcut(RETRIEVE_ALL_DATA_LIST_ITEMS_PATH, body)
  return plugins
}
