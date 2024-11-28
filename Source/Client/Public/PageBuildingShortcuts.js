// To be used in conjunction with PageBuildShortcuts.css

function addGenericTitle(holdingElement, text)
{
  let titleDiv = addDiv(holdingElement)
  addClassToElement(titleDiv, 'genericTitleHolder')
  let title = addElement(titleDiv, 'h1')
  setElementText(title, text)
  return titleDiv
}

function addDiv(holdingElement)
{
  let element = addElement(holdingElement, 'div')
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
  textHoldingDiv.innerText = text
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
