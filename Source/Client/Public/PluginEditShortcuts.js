/*
 * Needs these additional tags at top of including html page:
<script src="/Public/NetworkShortcuts.js"></script>
<script src='/Public/PageBuildingShortcuts.js'></script>
<link href="/Public/PageBuildingShortcuts.css" rel="stylesheet">
<script src='/Public/DataListShortcuts.js'></script>
<link href="/Public/PluginEditShortcuts.css" rel="stylesheet">
<script src='/Public/WidgetShortcuts.js'></script>
* 
* 
* Intended to be used in conjunction with PluginListShortcuts.css
* */


const WIDGET_IS_SAVED_FIELD = 'isSaved'

const PLUGIN_NAME_FIELD_NAME = 'Name'


const PLUGIN_COLLETION_NAME = 'plugins'

const SAVE_BUTTON_TEXT = 'Save'

const CODE_TEXT_IDS = ['webBrowserCode', 'webServerCode']


async function addPluginEditWidget(holdingDiv)
{
  await retrieveAndInsertPlugin(holdingDiv)
  await addOnLeavingTrigger()
}

async function addOnLeavingTrigger()
{
  console.log('thr')
  await window.addEventListener('beforeunload', onLeavingPage)
}

async function onLeavingPage(e)
{
  let isSaved = await getIsWidgetSavedFromWindow()
  if(isSaved == false)
  {
    await e.preventDefault()
  }
}

async function getIsWidgetSavedFromWindow()
{
  let widgetData = await getWidgetDataOfFirstWidgetOnPage()
  let isSaved = await getIsWidgetSavedFromData(widgetData)
  return isSaved
}


async function getIsWidgetSavedFromData(widgetData)
{
  let isSaved = await widgetData[(await getWidgetStateFieldName())][WIDGET_IS_SAVED_FIELD]
  return isSaved
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
  await setAsTopLevelOfWidget(itemHolder)
  await addTopZone(itemHolder, plugin)
  await addCodeZone(itemHolder, plugin)
}

async function addTopZone(itemHolder, plugin)
{
  let topZoneHolder = await addDiv(itemHolder)
  await addTextHoldingDiv(topZoneHolder, 'Id: ' + await getDataListItemFieldValue('id', plugin))
  await addTextHoldingDiv(topZoneHolder, 'Name: ' + await getDataListItemFieldValue(PLUGIN_NAME_FIELD_NAME, plugin))
}

async function addCodeGroup(codeZoneHolder, explanationText, codeElementClass)
{
  let codeGroupHolder = await addCodeGroupHolder(codeZoneHolder)
  await addCodeGroupInside(codeGroupHolder, explanationText, codeElementClass)
}

async function addCodeGroupHolder(codeZoneHolder)
{
  let codeGroupHolder = await addDiv(codeZoneHolder)
  await addClassToElement(codeGroupHolder, 'codeGroupHolder')
  return codeGroupHolder
}

async function addCodeGroupInside(codeGroupHolder, explanationText, codeElementClass)
{
  await addTextHoldingDiv(codeGroupHolder, explanationText)
  let codeElement = await addElement(codeGroupHolder, 'textarea')
  await addClassToElement(codeElement, codeElementClass)
  await addCodeElementOnChangeTrigger(codeElement)
}

async function addCodeElementOnChangeTrigger(codeElement)
{
  await codeElement.addEventListener('input', onCodeElementChanged)
}

async function onCodeElementChanged(e)
{
  let codeElement = e.target
  await setWidgetStateToUnsaved(codeElement)
}

async function setWidgetStateToUnsaved(codeElement)
{
  await setIsWidgetSavedFromLowerElement(codeElement, false)
}

async function addCodeZone(itemHolder, plugin)
{
  let codeZoneHolder = await addDiv(itemHolder)
  await addCodeGroup(codeZoneHolder, 'Web Browser HTML/CSS/JS Code: ', CODE_TEXT_IDS[0])
  await addCodeGroup(codeZoneHolder, 'Web Server Node JS Code:', CODE_TEXT_IDS[1])
  await setCodeGroupCodeText(codeZoneHolder, plugin, CODE_TEXT_IDS[0], CODE_TEXT_IDS[0])
  await setCodeGroupCodeText(codeZoneHolder, plugin, CODE_TEXT_IDS[1], CODE_TEXT_IDS[1])
  await addWidgetSaveButton(codeZoneHolder, plugin)
}

async function setCodeGroupCodeText(codeZoneHolder, plugin, fieldName, codeElementClass)
{
  let value = await getDataListItemFieldValue(fieldName, plugin)
  let element = await codeZoneHolder.getElementsByClassName(codeElementClass)[0]
  element.value = value
  return value
}

async function addWidgetSaveButton(codeZoneHolder, plugin)
{
  let button = await addGenericSaveButton(codeZoneHolder, SAVE_BUTTON_TEXT)
  await addSaveButtonTrigger(button, plugin)
}

async function addSaveButtonTrigger(button, plugin)
{
  await button.addEventListener('click', await onSaveButtonClicked.bind(null, plugin))
}

async function onSaveButtonClicked(plugin, e)
{
  let codeElement = e.target
  await setWidgetStateToSaved(codeElement)
  await saveCodeTexts(codeElement, plugin)
}

async function saveCodeTexts(codeElement, plugin)
{
  let widgetHolder = await getWidgetHolderFromLowerElement(codeElement)
  await addCodeTextToPlugin(plugin, await getCodeFromCodeGroup(widgetHolder, CODE_TEXT_IDS[0]), CODE_TEXT_IDS[0])
  await addCodeTextToPlugin(plugin, await getCodeFromCodeGroup(widgetHolder, CODE_TEXT_IDS[1]), CODE_TEXT_IDS[1])
  console.log('plugin is', plugin)
  await saveDataListObject(plugin, PLUGIN_COLLETION_NAME)
}

async function addCodeTextToPlugin(plugin, text, fieldId)
{
  await addTextFileFieldToDataListItem(fieldId, text, plugin)
}

async function getCodeFromCodeGroup(widgetHolder, codeId)
{
  let codeElement = widgetHolder.getElementsByClassName(codeId)[0]
  let codeText = codeElement.value
  return codeText  
}

async function setWidgetStateToSaved(codeElement)
{
  await setIsWidgetSavedFromLowerElement(codeElement, true)
}

async function setIsWidgetSavedFromLowerElement(lowerElement, isSaved)
{
  let widgetData = await getWidgetDataFromElement(lowerElement)
  await setIsWidgetSavedFromData(widgetData, isSaved)
  await setWidgetDataFromElement(lowerElement, widgetData)
}

async function setIsWidgetSavedFromData(widgetData, isSaved)
{
  widgetData[(await getWidgetStateFieldName())][WIDGET_IS_SAVED_FIELD] = isSaved
}
