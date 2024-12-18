const WIDGET_HOLDER_CLASS = 'widgetHolder'

const STATE_FIELD = 'state'

const WIDGET_DATA_DEFAULT = {
  [STATE_FIELD]: {}
}

async function setAsTopLevelOfWidget(element)
{
  await addClassToElement(element, WIDGET_HOLDER_CLASS)
  await setWidgetDataFromHolder(element, await deepCopyObject(WIDGET_DATA_DEFAULT))
}

async function getWidgetHolderFromLowerElement(lowerElement)
{
  let widgetHolder = await lowerElement.closest(await '.' + WIDGET_HOLDER_CLASS)
  return widgetHolder
}

async function getWidgetDataFromElement(lowerElement)
{
  let widgetHolder = await getWidgetHolderFromLowerElement(lowerElement)
  let widgetData = await getWidgetDataFromHolder(widgetHolder)
  return widgetData
}

async function getWidgetDataFromHolder(widgetHolder)
{
  let widgetData = await JSON.parse(widgetHolder.dataset.widgetdata)
  return widgetData
}

async function setWidgetDataFromElement(lowerElement, widgetData)
{
  let widgetHolder = await getWidgetHolderFromLowerElement(lowerElement)
  await setWidgetDataFromHolder(widgetHolder, widgetData)
}

async function setWidgetDataFromHolder(widgetHolder, widgetData)
{
  widgetHolder.dataset.widgetdata = await JSON.stringify(widgetData)
}

async function getWidgetStateFieldName()
{
  return STATE_FIELD
}

async function getHolderOfFirstWidgetOnPage()
{
  let widgetHolder = await document.getElementsByClassName(WIDGET_HOLDER_CLASS)[0]
  return widgetHolder
}

async function getWidgetDataOfFirstWidgetOnPage()
{
  let widgetHolder = await document.getElementsByClassName(WIDGET_HOLDER_CLASS)[0]
  let widgetData = await getWidgetDataFromHolder(widgetHolder)
  return widgetData
}

