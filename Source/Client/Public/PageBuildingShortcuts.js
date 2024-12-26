// To be used in conjunction with PageBuildShortcuts.css

const LINK_ELEMENT_TYPE = 'a'

function addGenericTitle(holdingElement, text)
{
  let titleDiv = addTextHoldingDiv(holdingElement, text)
  addClassToElement(titleDiv, 'genericTitleHolder')
  setElementText(titleDiv, text)
  return titleDiv
}

function addDiv(holdingElement)
{
  let element = addElement(holdingElement, 'div')
  return element
}

function addLink(holdingElement, url)
{
  let element = addElement(holdingElement, LINK_ELEMENT_TYPE)
  element.href = url
  return element
}

function addElement(holdingElement, newElementType)
{
  let newElement = document.createElement(newElementType)
  holdingElement.append(newElement)
  return newElement
}

function setElementText(element, text)
{
  element.innerText = text
}

function addGenericList(holdingElement)
{
  let genericList = addDiv(holdingElement)
  addClassToElement(genericList, 'genericList')
  return genericList
}

function addPageHoldingDiv()
{
  let holdingDiv = addDiv(document.body)
  addClassToElement(holdingDiv, 'pageHoldingDiv')
  return holdingDiv
}

function addClassToElement(element, className)
{
  element.classList.add(className)
}

function addTextHoldingDiv(holdingElement, text)
{
  let textHoldingDiv = addDiv(holdingElement)
  setElementText(textHoldingDiv, text)
  return textHoldingDiv
}

function addGenericButton(holdingElement, text)
{
  let genericButton = addTextHoldingDiv(holdingElement, text)
  addClassToElement(genericButton, 'genericButton')
  return genericButton
}

function addGenericCreateButton(holdingElement, text)
{
  let buttonHolder = addDiv(holdingElement)
  let genericCreateButton = addGenericButton(buttonHolder, text)
  addClassToElement(genericCreateButton, 'createButton')
  return genericCreateButton
}

function addGenericSaveButton(holdingElement, text)
{
  let buttonHolder = addDiv(holdingElement)
  let button = addGenericButton(buttonHolder, text)
  addClassToElement(button, 'saveButton')
  return button
}

function addGenericDeleteButton(holdingElement, text)
{
  let buttonHolder = addDiv(holdingElement)
  let genericButton = addGenericButton(buttonHolder, text)
  addClassToElement(genericButton, 'deleteButton')
  return genericButton
}

async function deepCopyObject(object)
{
  return await JSON.parse(await JSON.stringify(object));
}






const CALLBACK_REGISTER_STATUS_FIELD_NAME = 'status'
const CALLBACK_REGISTER_STATUS_TRIGGERED = 'triggered'
const CALLBACK_REGISTER_STATUS_UNTRIGGERED = 'untriggered'

const CALLBACK_REGISTER_CALLBACK_FUNCTIONS_FIELD_NAME = 'callbackFunctions'

const CALLBACK_REGISTER_DATA_FIELD_NAME = 'data'

var globalCallbacks = {}

async function createCallbackRegister(id)
{
  globalCallbacks[id] = {[CALLBACK_REGISTER_STATUS_FIELD_NAME]: CALLBACK_REGISTER_STATUS_UNTRIGGERED,
    [CALLBACK_REGISTER_CALLBACK_FUNCTIONS_FIELD_NAME]: []}
}

async function triggerCallbackRegister(id, data)
{
  await createCallbackRegisterIfNotCreated(id)
  await setCallbackRegisterData(id, data)
  globalCallbacks[id][CALLBACK_REGISTER_STATUS_FIELD_NAME] = CALLBACK_REGISTER_STATUS_TRIGGERED
  await runAllRegisteredCallbackFunctions(id)
}

async function runAllRegisteredCallbackFunctions(id)
{
  let callbackFunctions = globalCallbacks[id][CALLBACK_REGISTER_CALLBACK_FUNCTIONS_FIELD_NAME]
  for(let callbackFunction of callbackFunctions)
  {
    await callbackFunction(await getCallbackRegisterData(id))
  }
}

async function registerCallbackFunction(id, callbackFunction)
{
  await createCallbackRegisterIfNotCreated(id)
  await globalCallbacks[id][CALLBACK_REGISTER_CALLBACK_FUNCTIONS_FIELD_NAME].push(callbackFunction)
  if(await isCallbackRegisterTriggered(id) == true)
  {
    let callbackFunction = await globalCallbacks[CALLBACK_REGISTER_CALLBACK_FUNCTIONS_FIELD_NAME].slice(-1)
    await callbackFunction(await getCallbackRegisterData(id))
  }
}

async function createCallbackRegisterIfNotCreated(id)
{
  if(await doesCallbackRegisterExist(id) == false)
  {
    await createCallbackRegister(id)
  }
}

async function doesCallbackRegisterExist(id)
{
  let doesExist = false
  if(globalCallbacks[id] != null)
  {
    doesExist = true
  }
  return doesExist
}

async function isCallbackRegisterTriggered(id)
{
  let isTriggered = false
  if(globalCallbacks[id][CALLBACK_REGISTER_STATUS_FIELD_NAME] == CALLBACK_REGISTER_STATUS_TRIGGERED)
  {
    isTriggered = true
  }
  return isTriggered
}

async function getCallbackRegisterStatus(id)
{
  let status = globalCallbacks[id][CALLBACK_REGISTER_STATUS_FIELD_NAME]
  return status
}

async function getCallbackRegisterData(id)
{
  let data = globalCallbacks[id][CALLBACK_REGISTER_DATA_FIELD_NAME]
  return data
}

async function setCallbackRegisterData(id, data)
{
  globalCallbacks[id][CALLBACK_REGISTER_DATA_FIELD_NAME] = data
}
