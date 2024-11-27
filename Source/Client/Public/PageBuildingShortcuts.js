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
  return holdingDiv
}

function addClassToElement(element, className)
{
  element.classList.add(className)
}
