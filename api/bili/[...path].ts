export default async function handler(req: any, res: any) {
  const path = req.query.path as string[]
  const targetPath = '/' + path.join('/')

  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue
    if (Array.isArray(value)) {
      for (const v of value) query.append(key, String(v))
    } else {
      query.set(key, String(value))
    }
  }

  const targetUrl = `https://api.bilibili.com${targetPath}?${query.toString()}`

  const biliRes = await fetch(targetUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      Referer: 'https://www.bilibili.com/',
      Origin: 'https://www.bilibili.com',
      Accept: 'application/json, text/plain, */*',
    },
  })

  const text = await biliRes.text()

  res.status(biliRes.status)
  res.setHeader('Content-Type', biliRes.headers.get('content-type') || 'application/json')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  res.send(text)
}