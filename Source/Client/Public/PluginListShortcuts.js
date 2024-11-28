const RETRIEVE_ALL_PLUGINS_PATH = '/retrieveAllPlugins'


async function addPluginList(holdingDiv)
{
  let pluginListDiv = await addGenericList(holdingDiv)
  await retrieveAndInsertPluginsToList(pluginListDiv)
}

async function retrieveAndInsertPluginsToList(pluginListDiv)
{
  console.log('thrfewwef')
  let plugins = await retrieveAllPlugins()
  await insertPluginsToList(plugins, pluginListDiv)
}

async function insertPluginsToList(plugins, pluginListDiv)
{
  console.log('wfe', plugins)
  for(let plugin of plugins)
  {
    await insertPluginToList(plugin, pluginListDiv)
  }
}

async function retrieveAllPlugins()
{
  let plugins = await fetchDataShortcut(RETRIEVE_ALL_PLUGINS_PATH)
  console.log('wffde', plugins)
  return plugins
}

async function insertPluginToList()
{
  
}
