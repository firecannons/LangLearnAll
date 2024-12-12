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


async function addPluginEditWidget(holdingDiv)
{
  await retrieveAndInsertPlugin(holdingDiv)
}

async function getPluginIdFromPluginEditUrl()
{
  let currentUrlText = window.location.href
  let currentUrlPathText = new URL(currentUrlText).pathname;
  let currentUrlPathParts = await currentUrlPathText.split('/')
  let pluginIdText = currentUrlPathParts[2]
  let pluginId = await parseInt(pluginIdText)
  return pluginId
}


async function retrieveAndInsertPlugin(holdingDiv)
{
  let plugin = await retrievePlugin(await getPluginIdFromPluginEditUrl())
  await insertPluginToPage(holdingDiv, plugin)
}

async function retrievePlugin(pluginId)
{
  let plugin = await retrieveCompleteDataListItem(PLUGIN_COLLETION_NAME, pluginId)
  return plugin
}

async function insertPluginToPage(holdingDiv, plugin)
{
  let itemHolder = await addDiv(holdingDiv)
  await addTopZone(itemHolder, plugin)
  await addCodeZone(itemHolder, plugin)
}

async function addTopZone(itemHolder, plugin)
{
  let topZoneHolder = await addDiv(itemHolder)
  await addTextHoldingDiv(topZoneHolder, 'Id: ' + plugin['id'])
  await addTextHoldingDiv(topZoneHolder, 'Name: ' + plugin['name'])
}

async function addCodeZone(itemHolder, plugin)
{
  let codeZoneHolder = await addDiv(itemHolder)
  await addTextHoldingDiv(codeZoneHolder, 'Web Browser HTML/CSS/JS Code: ')
  let webBrowserCodeElement = await addElement(codeZoneHolder, 'textarea')
  await addClassToElement(webBrowserCodeElement, 'webBrowserCode')
  await addTextHoldingDiv(codeZoneHolder, 'Web Server Node JS Code:')
  let webServerCodeElement = await addElement(codeZoneHolder, 'textarea')
  await addClassToElement(webServerCodeElement, 'webServerCode')
}
