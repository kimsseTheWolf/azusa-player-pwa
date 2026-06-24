import { createRoot } from 'react-dom/client'
import { createBiliAudioCore } from "./scripts/biliAudioCore"

const audioFetchCore = createBiliAudioCore({
  includeCredentials: false,
  requestTimeoutMs: 12000,
  apiOrigin: "/api/bili"
})

async function simpleFetchAudioExample() {
  const source = audioFetchCore.parseSourceOrThrow('BV1Sr4y1d7EF');
  const songs = await audioFetchCore.getSongsFromSource(source);
  const play = await audioFetchCore.resolveSongAudioUrl(songs[0]);

  console.log(play.url)
}

createRoot(document.getElementById('root')!).render(
  <button onClick={simpleFetchAudioExample}>Click here to test</button>
)
