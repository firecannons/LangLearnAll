/*
* */


const RETRIEVE_ALL_DATA_LIST_ITEMS_PATH = '/retrieveAllDataListItems'
const SAVE_DATA_LIST_ITEM_PATH = '/saveDataListItem'
const DELETE_DATA_LIST_ITEM_PATH = '/deleteDataListItem'
const RETRIEVE_COMPLETE_DATA_LIST_ITEM_PATH = '/retrieveCompleteDataListItem'


const DATA_LIST_ID_FIELD_NAME = 'id'
const DATA_LIST_ALL_TIME_COUNT_FIELD_NAME = 'allTimeCount'
const DATA_LIST_LIST_FIELD_NAME = 'list'


const COLLECTION_FIELD_NAME = 'collection'

const INCOMING_ITEM_FIELD_NAME = 'item'
const INCOMING_ITEM_ID_FIELD_NAME = 'itemId'

const TEXT_FILE_FIELD_TYPE = 'File(text)'
const TEXT_FIELD_TYPE = 'Text'

const DATA_LIST_ITEM_FIELD_VALUE_FIELD_NAME = 'fieldValue'
const DATA_LIST_ITEM_FIELD_TYPE_FIELD_NAME = 'fieldType'
const DATA_LIST_ITEM_FIELD_NAME_FIELD_NAME = 'fieldName'



async function saveDataListObject(object, collectionName)
{
  let body = {[COLLECTION_FIELD_NAME]: collectionName, [INCOMING_ITEM_FIELD_NAME]: object}
  newPlugin = await fetchDataShortcut(SAVE_DATA_LIST_ITEM_PATH, body)
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

async function createTextField(fieldName, fieldValue)
{
  let newDataOfItem = {
    [DATA_LIST_ITEM_FIELD_NAME_FIELD_NAME]: fieldName,
    [DATA_LIST_ITEM_FIELD_TYPE_FIELD_NAME]: TEXT_FIELD_TYPE,
    [DATA_LIST_ITEM_FIELD_VALUE_FIELD_NAME]: fieldValue
  }
  return newDataOfItem
}

async function createTextFileField(fieldName, fieldValue)
{
  let newDataOfItem = {
    [DATA_LIST_ITEM_FIELD_NAME_FIELD_NAME]: fieldName,
    [DATA_LIST_ITEM_FIELD_TYPE_FIELD_NAME]: TEXT_FILE_FIELD_TYPE,
    [DATA_LIST_ITEM_FIELD_VALUE_FIELD_NAME]: fieldValue
  }
  return newDataOfItem
}

async function addTextFieldToDataListItem(fieldName, fieldValue, object)
{
  let newField = await createTextField(fieldName, fieldValue)
  object[fieldName] = newField
  return object
}

async function addTextFileFieldToDataListItem(fieldName, fieldValue, object)
{
  let newField = await createTextFileField(fieldName, fieldValue)
  object[fieldName] = newField
  return object
}




async function getFieldObjectFromDataListItem(fieldName, object)
{
  let fieldObject = object[fieldName]
  return fieldObject
}

async function getDataListItemFieldValue(fieldName, object)
{
  let value = null
  let fieldObject = await getFieldObjectFromDataListItem(fieldName, object)
  if(fieldObject != null)
  {
    value = await getFieldValueFromFieldObject(fieldObject)
  }
  console.log('object', value, fieldObject, fieldName, object)
  return value
}

async function getFieldValueFromFieldObject(fieldObject)
{
  let value = fieldObject[DATA_LIST_ITEM_FIELD_VALUE_FIELD_NAME]
  console.log('tr', fieldObject, value)
  return value
}

async function getDataListItemFieldType(fieldName, object)
{
  let value = null
  let fieldObject = await getFieldObjectFromDataListItem(fieldName, object)
  if(fieldObject != null)
  {
    value = await getFieldValueFromFieldObject(fieldObject)
  }
  return value
}

async function getFieldTypeFromFieldObject(fieldObject)
{
  let value = fieldObject[DATA_LIST_ITEM_FIELD_TYPE_FIELD_NAME]
  return value
}
