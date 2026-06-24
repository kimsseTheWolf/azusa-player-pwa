
import { type BiliSong } from "../scripts/biliAudioCore";
import { playerDB, type SongDBItem } from "./database";

/**
 * Add a song with only bvid into database. Will be used for lazy
 * load, and metadata will be upserted later
 * @param bvid BV of video
 */
export async function addSongWithBV(bvid:string) {
    return playerDB.songs.put({
        bvid,
    })
}

/**
 * Append song metadata into database. Will create a new entry 
 * if bvid does not exists.
 * @param song Song metadata in `BiliSong`
 */
export async function upsertSongMetadata(song:BiliSong) {
    const isExists = await playerDB.songs.get(song.bvid)
    if (isExists === undefined) {
        // Song does not exists in database, add first
        await addSongWithBV(song.bvid)
    }

    // Append information
    return playerDB.songs.update(song.bvid, {
        cid: song.id,
        metadata: song
    })
}

/**
 * Remove a song with its bvid.
 * @param bvid BV of video
 */
export async function removeSong(bvid:string) {
    return playerDB.songs.delete(bvid)
}

/**
 * Update the audio address of the song, in case the url of the 
 * audio is changed
 * @param bvid BV of video
 * @param newAudioAddress New addres to the audio
 * @param expireAt New audio link expiration time
 */
export async function updateAudioAddress(bvid:string, newAudioAddress:string, expireAt?:number) {
    return playerDB.songs.update(bvid, {
        audioAddress: newAudioAddress,
        audioAddressUpdateAt: Date.now(),
        audioAddressExpireAt: expireAt
    })
}
/**
 * Returns the song information according to the bvid
 * @param bvid BV of video
 */
export async function getSong(bvid:string): Promise<SongDBItem | undefined> {
    return playerDB.songs.get(bvid)
}