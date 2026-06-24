
import { Dexie, type EntityTable } from "dexie"
import type { BiliSong } from "../scripts/biliAudioCore"

// Format for each single song element in the song library
export interface SongDBItem {
    bvid: string,
    cid?: string,
    metadata?: BiliSong,
    audioAddress?: string,
    audioAddressUpdateAt?: number,
    audioAddressExpireAt?: number
}

// The global DB instance across application
export const playerDB = new Dexie("bili-player-db") as Dexie & {
    songs: EntityTable<SongDBItem, "bvid">
}

playerDB.version(1).stores({
    songs: "bvid, cid, audioAddressUpdateAt, audioAddressExpireAt"
})