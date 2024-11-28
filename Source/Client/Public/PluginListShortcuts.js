/*
 * Needs these additional tags at top of including html page:
<script src="/Public/NetworkShortcuts.js"></script>
<script src='/Public/PageBuildingShortcuts.js'></script>
<link href="/Public/PageBuildingShortcuts.css" rel="stylesheet">
<link href="/Public/PluginListShortcuts.css" rel="stylesheet">
* 
* 
* Intended to be used in conjunction with PluginListShortcuts.css
* */


const RETRIEVE_ALL_DATA_LIST_ITEMS_PATH = '/retrieveAllDataListItems'
const SAVE_NEW_PLUGIN_PATH = '/saveNewPlugin'

const CREATE_PLUGIN_DEFAULT_NAME = 'Unnamed Plugin'

const NEW_PLUGIN_DEFAULT_OBJECT = {'name': CREATE_PLUGIN_DEFAULT_NAME}


const DATA_LIST_ID_FIELD_NAME = 'id'
const DATA_LIST_ALL_TIME_COUNT_FIELD_NAME = 'allTimeCount'
const DATA_LIST_LIST_FIELD_NAME = 'list'


async function createPlugin(pluginList)
{
  let newPlugin = await deepCopyObject(NEW_PLUGIN_DEFAULT_OBJECT)
  newPlugin = await saveNewPlugin(newPlugin)
  await insertPluginToList(newPlugin, pluginList)
}

// https://stackoverflow.com/questions/6089058/nodejs-how-to-clone-an-object
async function deepCopyObject(object)
{
  return await JSON.parse(await JSON.stringify(object));
}

async function saveNewPlugin(newPlugin)
{
  let body = newPlugin
  newPlugin = await fetchDataShortcut(SAVE_NEW_PLUGIN_PATH, body)
  return newPlugin
}

async function addPluginCreateButton(holdingDiv)
{
  let createButton = await addGenericCreateButton(holdingDiv, 'Create Plugin')
  return createButton
}

async function addPluginsListWidget(holdingDiv)
{
  let createButton = await addPluginCreateButton(holdingDiv)
  let pluginList = await addPluginList(holdingDiv)
  await addReactionToElement(createButton, 'click', await createPlugin.bind(null, pluginList))
}

async function addReactionToElement(element, typeReaction, callbackFunction)
{
  await element.addEventListener(typeReaction, callbackFunction)
}

async function addPluginList(holdingDiv)
{
  let pluginListDiv = await addGenericList(holdingDiv)
  await retrieveAndInsertPluginsToList(pluginListDiv)
  return pluginListDiv
}

async function retrieveAndInsertPluginsToList(pluginListDiv)
{
  let plugins = await retrieveAllPlugins()
  await insertPluginsToList(plugins, pluginListDiv)
}

async function insertPluginsToList(plugins, pluginListDiv)
{
  if(plugins != null)
  {
    for(let plugin of plugins[DATA_LIST_LIST_FIELD_NAME])
    {
      await insertPluginToList(plugin, pluginListDiv)
    }
  }
}

async function retrieveAllPlugins()
{
  let body = {'collection': 'plugins'}
  let plugins = await fetchDataShortcut(RETRIEVE_ALL_DATA_LIST_ITEMS_PATH, body)
  return plugins
}

async function insertPluginToList(plugin, pluginListDiv)
{
  let listItemHolder = await addDiv(pluginListDiv)
  await addClassToElement(listItemHolder, 'pluginListItemHolder')
  await addTextHoldingDiv(listItemHolder, 'Id: ' + plugin['id'])
  await addTextHoldingDiv(listItemHolder, 'Name: ' + plugin['name'])
}
