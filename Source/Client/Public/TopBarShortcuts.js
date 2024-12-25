/*
 * Needs these additional tags at top of including html page:
<script src="/Public/NetworkShortcuts.js"></script>
<script src='/Public/PageBuildingShortcuts.js'></script>
<link href="/Public/PageBuildingShortcuts.css" rel="stylesheet">
* 
* 
* Intended to be used in conjunction with TopBarShortcuts.css
* */




async function addTopBar(holdingDiv)
{
  let topBarHolder = await addDiv(holdingDiv)
  await addClassToElement(topBarHolder, 'topBarHolder')
  await addLinksToTopBar(topBarHolder)
  return topBarHolder
}

async function addLinksToTopBar(topBarHolder)
{
  await addTopBarLink(topBarHolder, 'Run', '/run')
  await addTopBarLink(topBarHolder, 'All Plugins', '/plugins')
}

async function addTopBarLink(topBarHolder, linkText, linkLocation)
{
  let topBarLinkElement = await addLink(topBarHolder, linkLocation)
  await addTextHoldingDiv(topBarLinkElement, linkText)
  await addClassToElement(topBarLinkElement, 'topBarLink')
}
