/*
 * Needs these additional tags at top of including html page:
<script src="/Public/NetworkShortcuts.js"></script>
<script src='/Public/PageBuildingShortcuts.js'></script>
<link href="/Public/PageBuildingShortcuts.css" rel="stylesheet">
<link href="/Public/PluginListShortcuts.css" rel="stylesheet">
<script src='/Public/DataListShortcuts.js'></script>
* 
* 
* Intended to be used in conjunction with PluginListShortcuts.css
* */


const CREATE_PLUGIN_DEFAULT_NAME = 'Unnamed Plugin'

const ITEM_DATA_FIELD_NAME = 'itemData'

const NEW_PLUGIN_DEFAULT_OBJECT = {
  'name': CREATE_PLUGIN_DEFAULT_NAME
}

const PLUGIN_COLLETION_NAME = 'plugins'


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
  newPlugin = await saveNewDataListObject(newPlugin, PLUGIN_COLLETION_NAME)
  console.log('new plugin', newPlugin)
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
    for(let plugin of await Object.values(plugins[DATA_LIST_LIST_FIELD_NAME]))
    {
      await insertPluginToList(plugin, pluginListDiv)
    }
  }
}

async function retrieveAllPlugins()
{
  let plugins = await retrieveAlltemsFromDataList(PLUGIN_COLLETION_NAME)
  return plugins
}


async function getPluginEditUrl(plugin)
{
  let url = '/plugin/' + plugin['id'] + '/edit'
  return url
}

async function insertPluginToList(plugin, pluginListDiv)
{
  let listItemHolder = await addDiv(pluginListDiv)
  await addClassToElement(listItemHolder, 'pluginListItemHolder')
  let elementLink = await addLink(listItemHolder, await getPluginEditUrl(plugin))
  await addTextHoldingDiv(elementLink, 'Id: ' + plugin['id'])
  await addTextHoldingDiv(elementLink, 'Name: ' + plugin['name'])
  await addActionsButtonsToPluginElement(listItemHolder, plugin)
}

async function addActionsButtonsToPluginElement(listItemHolder, plugin)
{
  let actionButtonsHolder = await addDiv(listItemHolder)
  let deleteButton = await addGenericDeleteButton(actionButtonsHolder, 'Delete Plugin')
  await addClassToElement(actionButtonsHolder, 'pluginActionButtonsHolder')
  await addReactionToElement(deleteButton, 'click', await deletePluginButtonClicked.bind(null, plugin, listItemHolder))
  
}

async function deletePluginButtonClicked(plugin, listItemHolder)
{
  let shouldDelete = await promptShouldDelete()
  if(shouldDelete == true)
  {
    await deletePlugin(plugin, listItemHolder)
  }
}

async function promptShouldDelete()
{
  let shouldDelete = await window.confirm("Do you really want to delete this plugin?")
  return shouldDelete
}

async function deletePlugin(plugin, listItemHolder)
{
  console.log('plugin', plugin)
  await sendDeletePluginMessage(plugin)
  await deletePluginElementFromList(listItemHolder)
}

async function deletePluginElementFromList(listItemHolder)
{
  await listItemHolder.remove()
}

async function sendDeletePluginMessage(plugin)
{
  plugin = await deleteDataListItem(plugin, PLUGIN_COLLETION_NAME)
  return plugin
}
