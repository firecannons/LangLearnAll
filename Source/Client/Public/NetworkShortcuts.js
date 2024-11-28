async function fetchDataShortcut(path, body)
{
  let output = fetchShortcut(path, 'data', body)
  return output
}

async function fetchShortcut(path, jsonAttribute, body)
{
  let inside = {
    method: "POST",
    body: await JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  }
  console.log('inside', inside)
  const response = await fetch(path, inside)
  let json = await response.json()
  let output = json[jsonAttribute]
  return output
}

async function fetchFileSendShortcut(path, jsonAttribute, body)
{
  let inside = {
    method: "POST",
    body: body
  }
  const response = await fetch(path, inside)
  let json = await response.json()
  let output = json[jsonAttribute]
  return output
}
