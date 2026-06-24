/**
 * biliAudioCore.ts
 *
 * A single-file, UI-agnostic core package for:
 * 1) parsing Bilibili source input (BV / fav / series / collection)
 * 2) fetching songs metadata (title, cover, cid, bvid)
 * 3) resolving final audio playback URL from Bilibili playurl API
 *
 * ---------------------------------------------------------------------------
 * Plain-language summary (easy version)
 * ---------------------------------------------------------------------------
 * Think of this file as a "data brain" for your app:
 * - You give it a user input (like BV id or collection link)
 * - It gives you a normalized source object
 * - It fetches all songs for that source
 * - When user clicks a song, it resolves the real audio URL
 *
 * It does NOT play audio. It only gives you the URL.
 * So in React Native you can plug any player later.
 */

/* -------------------------------------------------------------------------- */
/*                                  Public Types                              */
/* -------------------------------------------------------------------------- */

export type BiliSource =
  | { type: 'bvid'; bvid: string }
  | { type: 'fav'; mid: string }
  | { type: 'series'; mid: string; sid: string }
  | { type: 'collection'; mid: string; sid: string };

export interface BiliSong {
  /** cid (content id) in Bilibili APIs */
  id: string;
  /** BV id */
  bvid: string;
  /** display title (video title or part name) */
  name: string;
  /** uploader name */
  singer: string;
  /** uploader mid */
  singerId: string | number;
  /** cover image url */
  cover: string;
}

export interface ResolveAudioUrlInput {
  bvid: string;
  /** optional because some callers only know bvid; core can fetch cid */
  cid?: string;
}

export interface ResolveAudioUrlResult {
  bvid: string;
  cid: string;
  url: string;
  codec?: string;
  bandwidth?: number;
  fromCache: boolean;
}

export interface RefreshSongsResult {
  songs: BiliSong[];
  added: BiliSong[];
  removed: BiliSong[];
  unchangedCount: number;
}

export interface ParseSourceOptions {
  /**
   * Base URL for parsing relative links.
   * Usually you do not need to change this.
   */
  baseUrl?: string;
}

export interface RequestContext {
  endpoint: string;
  purpose:
    | 'video-info'
    | 'cid'
    | 'playurl'
    | 'fav-list'
    | 'series-list'
    | 'collection-list'
    | 'unknown';
}

export interface RequestConfig {
  /**
   * Force credentials include for this request.
   * Useful for private favorite lists requiring login cookie.
   */
  includeCredentials?: boolean;
  /** Abort signal from caller */
  signal?: AbortSignal;
  /** Retry override for a single request */
  maxAttempts?: number;
}

export interface SongsByBvidsPageOptions {
  /**
   * Start index in `bvids`.
   * Example: 0 for first page, 20 for second page when limit=20.
   */
  offset: number;

  /**
   * Number of BV items to resolve in this page.
   * This is BV-count based, not song-count based.
   */
  limit: number;

  /**
   * Metadata fetch concurrency for this page.
   * This method clamps it to 1..2 to reduce 403/429 risk.
   * Default is 2.
   */
  concurrency?: number;

  /**
   * Stop the page batch immediately when a 403/429 occurs.
   * Default true.
   */
  stopOnRateLimit?: boolean;

  /**
   * Wait time after 403/429 before returning.
   * Helps avoid immediate repeated throttling.
   * Default 1200ms.
   */
  cooldownMs?: number;
}

export type SongsByBvidsPageStoppedReason = 'rate_limited';

export interface SongsByBvidsPageResult {
  /** Flattened songs for this page (a BV may contain multiple parts) */
  songs: BiliSong[];
  /** BV page start index used for this request */
  offset: number;
  /** BV page size used for this request */
  limit: number;
  /** Next offset to request */
  nextOffset: number;
  /** Whether there are remaining BV ids after this page */
  hasMore: boolean;
  /** Total unique BV count in this loading session */
  totalBvids: number;
  /** BV ids that failed in this page */
  failedBvids: string[];
  /** Whether this page ended early */
  stopped: boolean;
  /** Why this page stopped early */
  stoppedReason?: SongsByBvidsPageStoppedReason;
}

export interface AudioUrlCache {
  get(key: string): Promise<string | undefined> | string | undefined;
  set(key: string, value: string): Promise<void> | void;
}

export interface SongMetadataCache {
  /** Cache key is recommended to be the normalized bvid */
  get(key: string): Promise<BiliSong[] | undefined> | BiliSong[] | undefined;
  /** Cache value is all song entries derived from one bvid */
  set(key: string, value: BiliSong[]): Promise<void> | void;
}

export interface CoreLogger {
  debug?: (...args: unknown[]) => void;
  info?: (...args: unknown[]) => void;
  warn?: (...args: unknown[]) => void;
  error?: (...args: unknown[]) => void;
}

export interface BiliCoreOptions {
  /**
   * Custom fetch implementation.
   * In React Native, default global fetch usually works.
   */
  fetcher?: typeof fetch;

  /** API origin, defaults to https://api.bilibili.com */
  apiOrigin?: string;

  /**
   * Global credentials policy.
   * - boolean: always include / always omit
   * - function: dynamic by endpoint
   */
  includeCredentials?: boolean | ((ctx: RequestContext) => boolean);

  /** Extra headers merged into each request */
  defaultHeaders?: Record<string, string>;

  /** Total request timeout in ms; 0 disables timeout. Default 15000 */
  requestTimeoutMs?: number;

  /** Retry count for transient failures. Default 2 */
  maxAttempts?: number;

  /** Retry backoff base in ms. Default 250 */
  retryBaseDelayMs?: number;

  /** Max page safety limit for multi-page APIs. Default 100 */
  maxPages?: number;

  /** Optional cache for song metadata in lazy loading */
  metadataCache?: SongMetadataCache;

  /** Optional simple cache for resolved audio URL */
  audioUrlCache?: AudioUrlCache;

  /** Optional logger */
  logger?: CoreLogger;
}

export interface BiliAudioCore {
  /** Parse user input into standardized source object */
  parseSource(input: string, options?: ParseSourceOptions): BiliSource | undefined;

  /**
   * Same as parseSource but throws if input cannot be parsed.
   * Helpful when you prefer fail-fast behavior.
   */
  parseSourceOrThrow(input: string, options?: ParseSourceOptions): BiliSource;

  /** Fetch all songs (metadata only) from a single BV id */
  getSongsByBvid(bvid: string, config?: RequestConfig): Promise<BiliSong[]>;

  /** Fetch all songs (metadata only) from any source */
  getSongsFromSource(source: BiliSource, config?: RequestConfig): Promise<BiliSong[]>;

  /**
   * Lazy-loading helper (step 1): fetch only BV ids from a source.
   *
   * Typical flow:
   * 1) getBvidsFromSource(source)
   * 2) getSongsByBvidsPage(bvids, { offset, limit })
   * 3) resolveSongAudioUrl(song) when user clicks play
   */
  getBvidsFromSource(source: BiliSource, config?: RequestConfig): Promise<string[]>;

  /**
   * Lazy-loading helper (step 2): fetch one metadata page by BV list.
   *
   * This method only resolves metadata for the current BV page.
   * It does NOT request playurl.
   */
  getSongsByBvidsPage(
    bvids: string[],
    options: SongsByBvidsPageOptions,
    config?: RequestConfig,
  ): Promise<SongsByBvidsPageResult>;

  /** Resolve final playable audio URL by bvid/cid */
  resolveAudioUrl(input: ResolveAudioUrlInput, config?: RequestConfig): Promise<ResolveAudioUrlResult>;

  /** Resolve final playable audio URL directly from song object */
  resolveSongAudioUrl(song: Pick<BiliSong, 'bvid' | 'id'>, config?: RequestConfig): Promise<ResolveAudioUrlResult>;

  /**
   * Refresh source and compare with old songs.
   * Useful for favorite list sync.
   */
  refreshSongs(source: BiliSource, existingSongs?: BiliSong[], config?: RequestConfig): Promise<RefreshSongsResult>;

  /** Utility: extract BV id from arbitrary text */
  extractBvid(input: string): string | undefined;
}

/* -------------------------------------------------------------------------- */
/*                                   Errors                                   */
/* -------------------------------------------------------------------------- */

export type BiliCoreErrorCode =
  | 'INVALID_INPUT'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'HTTP_ERROR'
  | 'NON_JSON_RESPONSE'
  | 'BILI_API_ERROR'
  | 'NO_CID'
  | 'NO_AUDIO_STREAM'
  | 'UNSUPPORTED_SOURCE';

export class BiliCoreError extends Error {
  public readonly code: BiliCoreErrorCode;
  public readonly endpoint?: string;
  public readonly status?: number;
  public readonly apiCode?: number;

  constructor(
    code: BiliCoreErrorCode,
    message: string,
    options: { endpoint?: string; status?: number; apiCode?: number; cause?: unknown } = {},
  ) {
    super(message);
    this.name = 'BiliCoreError';
    this.code = code;
    this.endpoint = options.endpoint;
    this.status = options.status;
    this.apiCode = options.apiCode;
    if (options.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                           Bilibili API payload types                        */
/* -------------------------------------------------------------------------- */

type BiliApiEnvelope<T> = {
  code?: number;
  message?: string;
  msg?: string;
  data?: T;
};

type VideoInfoPayload = {
  title?: string;
  pic?: string;
  owner?: {
    name?: string;
    mid?: string | number;
  };
  pages?: Array<{
    cid?: string | number;
    part?: string;
  }>;
};

type CidPayload = Array<{
  cid?: string | number;
}>;

type PlayUrlPayload = {
  dash?: {
    audio?: Array<{
      id?: number;
      bandwidth?: number;
      codecs?: string;
      baseUrl?: string;
      base_url?: string;
      backupUrl?: string[];
      backup_url?: string[];
    }>;
  };
};

type FavListPayload = {
  info?: {
    media_count?: number;
  };
  medias?: Array<{
    bvid?: string;
  }>;
};

type SeriesListPayload = {
  archives?: Array<{
    bvid?: string;
  }>;
};

type CollectionListPayload = {
  meta?: {
    total?: number;
  };
  page?: {
    page_size?: number;
  };
  archives?: Array<{
    bvid?: string;
  }>;
};

/* -------------------------------------------------------------------------- */
/*                             Internal default values                          */
/* -------------------------------------------------------------------------- */

const DEFAULTS = {
  API_ORIGIN: 'https://api.bilibili.com',
  REQUEST_TIMEOUT_MS: 15000,
  MAX_ATTEMPTS: 2,
  RETRY_BASE_DELAY_MS: 250,
  MAX_PAGES: 100,
  LAZY_PAGE_CONCURRENCY: 2,
  LAZY_PAGE_COOLDOWN_MS: 1200,
};

const NUMERIC_PATTERN = /^\d+$/;
const BVID_PATTERN = /(BV[a-zA-Z0-9]{10})/;

/* -------------------------------------------------------------------------- */
/*                                  Public API                                 */
/* -------------------------------------------------------------------------- */

/**
 * Create a reusable Bilibili audio core instance.
 *
 * Plain-language version:
 * - Call this once in app startup.
 * - Keep returned instance in a singleton/service.
 * - Use its methods whenever you need to parse source, list songs, or resolve audio URL.
 *
 * @example
 * ```ts
 * import { createBiliAudioCore } from './biliAudioCore';
 *
 * const core = createBiliAudioCore({
 *   includeCredentials: false,
 *   requestTimeoutMs: 12000,
 * });
 *
 * const source = core.parseSourceOrThrow('BV1Sr4y1d7EF');
 * const songs = await core.getSongsFromSource(source);
 * const play = await core.resolveSongAudioUrl(songs[0]);
 * console.log(play.url);
 * ```
 */
export function createBiliAudioCore(options: BiliCoreOptions = {}): BiliAudioCore {
  const fetcher = options.fetcher ?? getGlobalFetchOrThrow();
  const apiOrigin = trimTrailingSlash(options.apiOrigin || DEFAULTS.API_ORIGIN);
  const requestTimeoutMs = options.requestTimeoutMs ?? DEFAULTS.REQUEST_TIMEOUT_MS;
  const maxAttempts = Math.max(1, options.maxAttempts ?? DEFAULTS.MAX_ATTEMPTS);
  const retryBaseDelayMs = Math.max(0, options.retryBaseDelayMs ?? DEFAULTS.RETRY_BASE_DELAY_MS);
  const maxPages = Math.max(1, options.maxPages ?? DEFAULTS.MAX_PAGES);
  const logger = options.logger;

  const logDebug = (...args: unknown[]) => logger?.debug?.('[bili-core]', ...args);
  const logWarn = (...args: unknown[]) => logger?.warn?.('[bili-core]', ...args);

  const requestJson = async <T>(pathOrAbsoluteUrl: string, ctx: RequestContext, config?: RequestConfig): Promise<T> => {
    const url = toAbsoluteApiUrl(apiOrigin, pathOrAbsoluteUrl);
    const requestIncludeCredentials =
      typeof options.includeCredentials === 'function'
        ? options.includeCredentials(ctx)
        : (config?.includeCredentials ?? options.includeCredentials ?? false);

    const attempts = Math.max(1, config?.maxAttempts ?? maxAttempts);

    let lastError: unknown;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const controller = requestTimeoutMs > 0 ? new AbortController() : undefined;
      const signal = mergeAbortSignals(config?.signal, controller?.signal);
      const timer =
        controller && requestTimeoutMs > 0
          ? setTimeout(() => {
              controller.abort(new Error(`Request timeout: ${requestTimeoutMs}ms`));
            }, requestTimeoutMs)
          : undefined;

      try {
        logDebug('request', { endpoint: ctx.endpoint, attempt, attempts, requestIncludeCredentials });
        const response = await fetcher(url, {
          method: 'GET',
          signal,
          credentials: requestIncludeCredentials ? 'include' : 'omit',
          headers: {
            Accept: 'application/json, text/plain, */*',
            ...(options.defaultHeaders || {}),
          },
        });

        if (!response.ok) {
          throw new BiliCoreError('HTTP_ERROR', `HTTP ${response.status} from ${ctx.endpoint}`, {
            endpoint: ctx.endpoint,
            status: response.status,
          });
        }

        const contentType = response.headers.get('content-type') || '';
        const text = await response.text();

        if (!contentType.toLowerCase().includes('application/json')) {
          throw new BiliCoreError(
            'NON_JSON_RESPONSE',
            `Expected JSON but got '${contentType || 'unknown'}' from ${ctx.endpoint}. preview=${text.slice(0, 160)}`,
            { endpoint: ctx.endpoint },
          );
        }

        return JSON.parse(text) as T;
      } catch (error) {
        lastError = normalizeRequestError(error, ctx.endpoint);
        if (timer) clearTimeout(timer);

        if (attempt >= attempts || !isRetryableError(lastError)) {
          throw lastError;
        }

        const delayMs = computeBackoffDelay(retryBaseDelayMs, attempt);
        logWarn('retrying request', { endpoint: ctx.endpoint, attempt, delayMs });
        await sleep(delayMs);
      } finally {
        if (timer) clearTimeout(timer);
      }
    }

    throw normalizeRequestError(lastError, ctx.endpoint);
  };

  const ensureBiliSuccess = <T>(envelope: BiliApiEnvelope<T>, endpoint: string): T => {
    if (typeof envelope?.code === 'number' && envelope.code !== 0) {
      throw new BiliCoreError(
        'BILI_API_ERROR',
        envelope.message || envelope.msg || `Bilibili API error ${envelope.code} at ${endpoint}`,
        {
          endpoint,
          apiCode: envelope.code,
        },
      );
    }
    return (envelope?.data as T | undefined) ?? ({} as T);
  };

  const fetchCidByBvid = async (bvid: string, config?: RequestConfig): Promise<string> => {
    const endpoint = '/x/player/pagelist';
    const json = await requestJson<BiliApiEnvelope<CidPayload>>(
      buildUrl(endpoint, { bvid, jsonp: 'jsonp' }),
      { endpoint, purpose: 'cid' },
      config,
    );
    const data = ensureBiliSuccess(json, endpoint);
    const cid = String(data?.[0]?.cid || '');
    if (!cid) {
      throw new BiliCoreError('NO_CID', `Cannot find cid for bvid=${bvid}`, { endpoint });
    }
    return cid;
  };

  const fetchVideoInfo = async (bvid: string, config?: RequestConfig): Promise<VideoInfoPayload> => {
    const endpoint = '/x/web-interface/view';
    const json = await requestJson<BiliApiEnvelope<VideoInfoPayload>>(
      buildUrl(endpoint, { bvid }),
      { endpoint, purpose: 'video-info' },
      config,
    );
    return ensureBiliSuccess(json, endpoint);
  };

  const fetchFavBvids = async (mid: string, config?: RequestConfig): Promise<string[]> => {
    const endpoint = '/x/v3/fav/resource/list';

    const fetchPage = (page: number, includeCredentialsOverride?: boolean) =>
      requestJson<BiliApiEnvelope<FavListPayload>>(
        buildUrl(endpoint, {
          media_id: mid,
          pn: String(page),
          ps: '20',
          keyword: '',
          order: 'mtime',
          type: '0',
          tid: '0',
          platform: 'web',
          jsonp: 'jsonp',
        }),
        { endpoint, purpose: 'fav-list' },
        {
          ...(config || {}),
          includeCredentials:
            typeof includeCredentialsOverride === 'boolean' ? includeCredentialsOverride : config?.includeCredentials,
        },
      );

    let firstPageEnvelope: BiliApiEnvelope<FavListPayload>;
    try {
      firstPageEnvelope = await fetchPage(1);
    } catch (error) {
      const normalized = normalizeRequestError(error, endpoint);
      logWarn('fav first page request failed, retrying with credentials include', normalized);
      firstPageEnvelope = await fetchPage(1, true);
    }

    const firstPage = ensureBiliSuccess(firstPageEnvelope, endpoint);
    const total = Number(firstPage?.info?.media_count || 0);
    const totalPages = Math.min(maxPages, Math.max(1, Math.ceil(total / 20)));

    const restPages =
      totalPages <= 1
        ? []
        : await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map(async (page) => {
              try {
                return await fetchPage(page);
              } catch {
                return fetchPage(page, true);
              }
            }),
          );

    const allEnvelopes = [firstPageEnvelope, ...restPages];
    const bvids: string[] = [];

    for (const envelope of allEnvelopes) {
      const pageData = ensureBiliSuccess(envelope, endpoint);
      const values = (pageData?.medias || []).map((m) => String(m?.bvid || '')).filter(Boolean);
      bvids.push(...values);
    }

    return dedupePreserveOrder(bvids);
  };

  const fetchSeriesBvids = async (mid: string, sid: string, config?: RequestConfig): Promise<string[]> => {
    const endpoint = '/x/series/archives';
    const pageSize = 30;
    const bvids: string[] = [];

    for (let page = 1; page <= maxPages; page += 1) {
      const json = await requestJson<BiliApiEnvelope<SeriesListPayload>>(
        buildUrl(endpoint, {
          mid,
          series_id: sid,
          only_normal: 'true',
          sort: 'desc',
          pn: String(page),
          ps: String(pageSize),
        }),
        { endpoint, purpose: 'series-list' },
        config,
      );

      const data = ensureBiliSuccess(json, endpoint);
      const archives = data?.archives || [];
      const pageBvids = archives.map((item) => String(item?.bvid || '')).filter(Boolean);
      bvids.push(...pageBvids);

      if (archives.length < pageSize) break;
    }

    return dedupePreserveOrder(bvids);
  };

  const fetchCollectionBvids = async (mid: string, sid: string, config?: RequestConfig): Promise<string[]> => {
    const endpoint = '/x/polymer/web-space/seasons_archives_list';

    const fetchPage = (page: number) =>
      requestJson<BiliApiEnvelope<CollectionListPayload>>(
        buildUrl(endpoint, {
          mid,
          season_id: sid,
          sort_reverse: 'false',
          page_num: String(page),
          page_size: '30',
        }),
        { endpoint, purpose: 'collection-list' },
        config,
      );

    const firstEnvelope = await fetchPage(1);
    const firstData = ensureBiliSuccess(firstEnvelope, endpoint);

    const totalCount = Number(firstData?.meta?.total || 0);
    const pageSize = Number(firstData?.page?.page_size || 30);
    const totalPages = Math.min(maxPages, Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1))));

    const restEnvelopes =
      totalPages <= 1
        ? []
        : await Promise.all(Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2)));

    const allEnvelopes = [firstEnvelope, ...restEnvelopes];
    const bvids: string[] = [];

    for (const envelope of allEnvelopes) {
      const pageData = ensureBiliSuccess(envelope, endpoint);
      const pageBvids = (pageData?.archives || []).map((item) => String(item?.bvid || '')).filter(Boolean);
      bvids.push(...pageBvids);
    }

    return dedupePreserveOrder(bvids);
  };

  const videoInfoToSongs = (bvid: string, info: VideoInfoPayload): BiliSong[] => {
    const pages = info?.pages || [];
    const singer = String(info?.owner?.name || '');
    const singerId = info?.owner?.mid ?? '';
    const cover = String(info?.pic || '');
    const videoTitle = String(info?.title || bvid);

    if (pages.length <= 1) {
      const cid = String(pages[0]?.cid || '');
      if (!cid) return [];
      return [
        {
          id: cid,
          bvid,
          name: videoTitle,
          singer,
          singerId,
          cover,
        },
      ];
    }

    return pages
      .map((page) => {
        const cid = String(page?.cid || '');
        if (!cid) return undefined;
        return {
          id: cid,
          bvid,
          name: String(page?.part || videoTitle),
          singer,
          singerId,
          cover,
        } as BiliSong;
      })
      .filter((song): song is BiliSong => !!song);
  };

  const getSongsByBvid = async (bvid: string, config?: RequestConfig): Promise<BiliSong[]> => {
    const normalizedBvid = normalizeBvidOrThrow(bvid);
    const info = await fetchVideoInfo(normalizedBvid, config);
    return videoInfoToSongs(normalizedBvid, info);
  };

  const getSongsFromSource = async (source: BiliSource, config?: RequestConfig): Promise<BiliSong[]> => {
    switch (source.type) {
      case 'bvid':
        return getSongsByBvid(source.bvid, config);
      case 'fav': {
        const bvids = await fetchFavBvids(source.mid, config);
        return fetchSongsByBvids(bvids, config);
      }
      case 'series': {
        const bvids = await fetchSeriesBvids(source.mid, source.sid, config);
        return fetchSongsByBvids(bvids, config);
      }
      case 'collection': {
        const bvids = await fetchCollectionBvids(source.mid, source.sid, config);
        return fetchSongsByBvids(bvids, config);
      }
      default:
        throw new BiliCoreError('UNSUPPORTED_SOURCE', `Unsupported source type: ${(source as { type?: string }).type || 'unknown'}`);
    }
  };

  const getBvidsFromSource = async (source: BiliSource, config?: RequestConfig): Promise<string[]> => {
    switch (source.type) {
      case 'bvid':
        return [normalizeBvidOrThrow(source.bvid)];
      case 'fav':
        return fetchFavBvids(source.mid, config);
      case 'series':
        return fetchSeriesBvids(source.mid, source.sid, config);
      case 'collection':
        return fetchCollectionBvids(source.mid, source.sid, config);
      default:
        throw new BiliCoreError('UNSUPPORTED_SOURCE', `Unsupported source type: ${(source as { type?: string }).type || 'unknown'}`);
    }
  };

  const getSongsByBvidWithCache = async (bvid: string, config?: RequestConfig): Promise<BiliSong[]> => {
    const normalized = normalizeBvidOrThrow(bvid);
    const cached = await options.metadataCache?.get(normalized);
    if (cached && cached.length) return cached;

    const info = await fetchVideoInfo(normalized, config);
    const songs = videoInfoToSongs(normalized, info);
    if (songs.length) {
      await options.metadataCache?.set(normalized, songs);
    }
    return songs;
  };

  const getSongsByBvidsPage = async (
    bvids: string[],
    pageOptions: SongsByBvidsPageOptions,
    config?: RequestConfig,
  ): Promise<SongsByBvidsPageResult> => {
    const uniqueBvids = dedupePreserveOrder(bvids.map((value) => String(value || '').trim()).filter(Boolean));
    const totalBvids = uniqueBvids.length;
    const offset = Math.max(0, Math.floor(pageOptions.offset));
    const limit = Math.max(1, Math.floor(pageOptions.limit));
    const stopOnRateLimit = pageOptions.stopOnRateLimit ?? true;
    const cooldownMs = Math.max(0, pageOptions.cooldownMs ?? DEFAULTS.LAZY_PAGE_COOLDOWN_MS);
    const concurrency = Math.max(1, Math.min(2, Math.floor(pageOptions.concurrency ?? DEFAULTS.LAZY_PAGE_CONCURRENCY)));

    if (!totalBvids || offset >= totalBvids) {
      return {
        songs: [],
        offset,
        limit,
        nextOffset: Math.min(offset + limit, totalBvids),
        hasMore: false,
        totalBvids,
        failedBvids: [],
        stopped: false,
      };
    }

    const end = Math.min(offset + limit, totalBvids);
    const pageBvids = uniqueBvids.slice(offset, end);
    const pageResults: BiliSong[][] = new Array(pageBvids.length).fill([] as BiliSong[]);
    const failedBvids: string[] = [];
    let stopped = false;
    let stoppedReason: SongsByBvidsPageStoppedReason | undefined;
    let nextIndex = 0;

    const runWorker = async () => {
      while (true) {
        if (stopped) return;

        const current = nextIndex;
        nextIndex += 1;
        if (current >= pageBvids.length) return;

        const bvid = pageBvids[current];
        try {
          pageResults[current] = await getSongsByBvidWithCache(bvid, config);
        } catch (error) {
          failedBvids.push(bvid);
          const normalized = normalizeRequestError(error, '/x/web-interface/view');
          logWarn('lazy page metadata request failed', { bvid, error: normalized });

          if (stopOnRateLimit && isRateLimitError(normalized)) {
            stopped = true;
            stoppedReason = 'rate_limited';
            return;
          }
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, pageBvids.length) }, () => runWorker()));

    if (stopped && stoppedReason === 'rate_limited' && cooldownMs > 0) {
      await sleep(cooldownMs);
    }

    return {
      songs: pageResults.flat(),
      offset,
      limit,
      nextOffset: end,
      hasMore: end < totalBvids,
      totalBvids,
      failedBvids,
      stopped,
      stoppedReason,
    };
  };

  const resolveAudioUrl = async (input: ResolveAudioUrlInput, config?: RequestConfig): Promise<ResolveAudioUrlResult> => {
    const bvid = normalizeBvidOrThrow(input.bvid);
    const cid = input.cid ? String(input.cid) : await fetchCidByBvid(bvid, config);
    const cacheKey = `${bvid}:${cid}`;

    const cachedUrl = await options.audioUrlCache?.get(cacheKey);
    if (cachedUrl) {
      return {
        bvid,
        cid,
        url: cachedUrl,
        fromCache: true,
      };
    }

    const endpoint = '/x/player/playurl';
    const json = await requestJson<BiliApiEnvelope<PlayUrlPayload>>(
      buildUrl(endpoint, {
        cid,
        bvid,
        qn: '64',
        fnval: '16',
      }),
      { endpoint, purpose: 'playurl' },
      config,
    );

    const data = ensureBiliSuccess(json, endpoint);
    const selected = selectBestAudioStream(data?.dash?.audio || []);

    if (!selected?.url) {
      throw new BiliCoreError('NO_AUDIO_STREAM', `No playable audio stream found for bvid=${bvid}, cid=${cid}`, {
        endpoint,
      });
    }

    await options.audioUrlCache?.set(cacheKey, selected.url);

    return {
      bvid,
      cid,
      url: selected.url,
      codec: selected.codec,
      bandwidth: selected.bandwidth,
      fromCache: false,
    };
  };

  const resolveSongAudioUrl = async (
    song: Pick<BiliSong, 'bvid' | 'id'>,
    config?: RequestConfig,
  ): Promise<ResolveAudioUrlResult> => {
    return resolveAudioUrl({ bvid: song.bvid, cid: song.id }, config);
  };

  const refreshSongs = async (
    source: BiliSource,
    existingSongs: BiliSong[] = [],
    config?: RequestConfig,
  ): Promise<RefreshSongsResult> => {
    const latest = await getSongsFromSource(source, config);

    const oldMap = new Map(existingSongs.map((song) => [song.id, song]));
    const newMap = new Map(latest.map((song) => [song.id, song]));

    const added = latest.filter((song) => !oldMap.has(song.id));
    const removed = existingSongs.filter((song) => !newMap.has(song.id));
    const unchangedCount = latest.length - added.length;

    return {
      songs: latest,
      added,
      removed,
      unchangedCount,
    };
  };

  const fetchSongsByBvids = async (bvids: string[], config?: RequestConfig): Promise<BiliSong[]> => {
    const unique = dedupePreserveOrder(bvids.map((v) => String(v || '')).filter(Boolean));
    if (!unique.length) return [];

    const infos = await mapWithConcurrency(unique, 5, async (bvid) => {
      try {
        const info = await fetchVideoInfo(bvid, config);
        return videoInfoToSongs(bvid, info);
      } catch (error) {
        logWarn('failed to fetch video info', { bvid, error });
        return [] as BiliSong[];
      }
    });

    return infos.flat();
  };

  const parseSource = (input: string, parseOptions?: ParseSourceOptions): BiliSource | undefined => {
    if (!input || !String(input).trim()) return undefined;

    const raw = String(input).trim();
    const bvid = extractBvid(raw);
    if (bvid) return { type: 'bvid', bvid };

    if (NUMERIC_PATTERN.test(raw)) {
      return { type: 'fav', mid: raw };
    }

    try {
      const url = new URL(raw, parseOptions?.baseUrl || 'https://www.bilibili.com/');
      if (url.hostname !== 'space.bilibili.com') return undefined;

      const parts = url.pathname.split('/').filter(Boolean);
      const mid = parts[0] || '';
      if (!NUMERIC_PATTERN.test(mid)) return undefined;

      if (parts[1] === 'favlist') {
        const fid = url.searchParams.get('fid');
        if (fid && NUMERIC_PATTERN.test(fid)) {
          return { type: 'fav', mid: fid };
        }
      }

      if (parts[1] === 'lists' && NUMERIC_PATTERN.test(parts[2] || '')) {
        const sid = parts[2];
        const listType = url.searchParams.get('type');
        if (listType === 'series') return { type: 'series', mid, sid };
        if (listType === 'season') return { type: 'collection', mid, sid };
      }

      if (parts[1] === 'channel' && parts[2] === 'seriesdetail') {
        const sid = url.searchParams.get('sid');
        if (sid && NUMERIC_PATTERN.test(sid)) {
          return { type: 'series', mid, sid };
        }
      }

      if (parts[1] === 'channel' && parts[2] === 'collectiondetail') {
        const sid = url.searchParams.get('sid');
        if (sid && NUMERIC_PATTERN.test(sid)) {
          return { type: 'collection', mid, sid };
        }
      }
    } catch {
      return undefined;
    }

    return undefined;
  };

  const parseSourceOrThrow = (input: string, parseOptions?: ParseSourceOptions): BiliSource => {
    const parsed = parseSource(input, parseOptions);
    if (!parsed) {
      throw new BiliCoreError('INVALID_INPUT', `Cannot parse source from input: ${input}`);
    }
    return parsed;
  };

  const extractBvid = (input: string) => String(input || '').match(BVID_PATTERN)?.[1];

  return {
    parseSource,
    parseSourceOrThrow,
    getSongsByBvid,
    getSongsFromSource,
    getBvidsFromSource,
    getSongsByBvidsPage,
    resolveAudioUrl,
    resolveSongAudioUrl,
    refreshSongs,
    extractBvid,
  };
}

/* -------------------------------------------------------------------------- */
/*                              Usage Docs (exported)                          */
/* -------------------------------------------------------------------------- */

/**
 * Quick start usage docs in one string (for copy/paste into your app docs).
 *
 * Plain-language version:
 * If you want to show onboarding tips in your own project,
 * this string is ready to print in README or dev notes.
 */
export const BILI_AUDIO_CORE_DOCS = `
# biliAudioCore quick usage

## 1) Create core

const core = createBiliAudioCore({
  requestTimeoutMs: 12000,
  maxAttempts: 2,
  includeCredentials: false,
});

## 2) Parse user input

const source = core.parseSourceOrThrow(input);

Supported input examples:
- BV1Sr4y1d7EF
- 1042352181 (favorite id)
- https://space.bilibili.com/444180997/lists/828030?type=series
- https://space.bilibili.com/5109111/lists/6995126?type=season

## 3) Get songs metadata list

const songs = await core.getSongsFromSource(source);

Each song includes: id(cid), bvid, name, singer, singerId, cover

## 4) Resolve audio URL when user clicks a song

const playback = await core.resolveSongAudioUrl(songs[0]);
console.log(playback.url);

## 5) Optional refresh diff

const refresh = await core.refreshSongs(source, oldSongs);
console.log(refresh.added, refresh.removed);

## 6) Lazy loading for large favorite/collection sources

const source = core.parseSourceOrThrow(input);

// Step 1: fetch BV list only
const bvids = await core.getBvidsFromSource(source);

// Step 2: load first metadata page only
let offset = 0;
const pageSize = 20;

let page1 = await core.getSongsByBvidsPage(bvids, {
  offset,
  limit: pageSize,
  concurrency: 2,
  stopOnRateLimit: true,
  cooldownMs: 1200,
});

renderSongs(page1.songs);
offset = page1.nextOffset;

// Step 3: load next page on scroll
if (page1.hasMore) {
  const page2 = await core.getSongsByBvidsPage(bvids, { offset, limit: pageSize });
  appendSongs(page2.songs);
  offset = page2.nextOffset;
}

// Step 4: resolve playurl only when user clicks one song
const playback = await core.resolveSongAudioUrl(clickedSong);
console.log(playback.url);

## 7) Optional metadata cache hook (e.g. IndexedDB)

const coreWithCache = createBiliAudioCore({
  metadataCache: {
    async get(bvid) {
      return await readSongsFromIndexedDb(bvid); // return BiliSong[] | undefined
    },
    async set(bvid, songs) {
      await writeSongsToIndexedDb(bvid, songs);
    },
  },
});
`;

/* -------------------------------------------------------------------------- */
/*                                 Utilities                                   */
/* -------------------------------------------------------------------------- */

function getGlobalFetchOrThrow(): typeof fetch {
  if (typeof fetch === 'function') {
    return fetch.bind(globalThis) as typeof fetch;
  }
  throw new BiliCoreError(
    'INVALID_INPUT',
    'No fetch implementation found. Please pass `fetcher` in createBiliAudioCore(options).',
  );
}

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function toAbsoluteApiUrl(apiOrigin: string, pathOrAbsoluteUrl: string): string {
  if (/^https?:\/\//i.test(pathOrAbsoluteUrl)) {
    return pathOrAbsoluteUrl;
  }
  if (pathOrAbsoluteUrl.startsWith('/')) {
    return `${apiOrigin}${pathOrAbsoluteUrl}`;
  }
  return `${apiOrigin}/${pathOrAbsoluteUrl}`;
}

function buildUrl(path: string, query: Record<string, string>): string {
  const search = new URLSearchParams(query);
  return `${path}?${search.toString()}`;
}

function normalizeBvidOrThrow(bvid: string): string {
  const normalized = String(bvid || '').trim();
  if (!normalized || !BVID_PATTERN.test(normalized)) {
    throw new BiliCoreError('INVALID_INPUT', `Invalid bvid: ${bvid}`);
  }
  return normalized.match(BVID_PATTERN)?.[1] || normalized;
}

function normalizeRequestError(error: unknown, endpoint: string): BiliCoreError {
  if (error instanceof BiliCoreError) return error;

  const maybeError = error as Error | undefined;
  const message = String(maybeError?.message || error || 'Unknown network error');

  if (/timeout/i.test(message) || /aborted/i.test(message)) {
    return new BiliCoreError('TIMEOUT', `Request timeout at ${endpoint}: ${message}`, {
      endpoint,
      cause: error,
    });
  }

  return new BiliCoreError('NETWORK_ERROR', `Network error at ${endpoint}: ${message}`, {
    endpoint,
    cause: error,
  });
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof BiliCoreError)) return true;

  if (error.code === 'TIMEOUT' || error.code === 'NETWORK_ERROR') return true;

  if (error.code === 'HTTP_ERROR') {
    return typeof error.status === 'number' && error.status >= 500;
  }

  return false;
}

function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof BiliCoreError)) return false;
  if (error.code !== 'HTTP_ERROR') return false;
  return error.status === 403 || error.status === 429;
}

function computeBackoffDelay(baseDelayMs: number, attempt: number): number {
  const jitter = Math.floor(Math.random() * 80);
  return baseDelayMs * Math.pow(2, Math.max(0, attempt - 1)) + jitter;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mergeAbortSignals(...signals: Array<AbortSignal | undefined>): AbortSignal | undefined {
  const valid = signals.filter(Boolean) as AbortSignal[];
  if (!valid.length) return undefined;
  if (valid.length === 1) return valid[0];

  const controller = new AbortController();
  const onAbort = () => {
    controller.abort();
    for (const signal of valid) {
      signal.removeEventListener('abort', onAbort);
    }
  };

  for (const signal of valid) {
    if (signal.aborted) {
      onAbort();
      break;
    }
    signal.addEventListener('abort', onAbort, { once: true });
  }

  return controller.signal;
}

function dedupePreserveOrder(values: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (!items.length) return [];

  const workers = Math.max(1, Math.min(concurrency, items.length));
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  const runWorker = async () => {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      if (currentIndex >= items.length) return;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  };

  await Promise.all(Array.from({ length: workers }, () => runWorker()));
  return results;
}

function selectBestAudioStream(
  audioList: Array<{
    id?: number;
    bandwidth?: number;
    codecs?: string;
    baseUrl?: string;
    base_url?: string;
    backupUrl?: string[];
    backup_url?: string[];
  }>,
): { url?: string; codec?: string; bandwidth?: number } {
  if (!audioList.length) return {};

  const sorted = [...audioList].sort((a, b) => {
    const scoreA = Number(a.bandwidth || a.id || 0);
    const scoreB = Number(b.bandwidth || b.id || 0);
    return scoreB - scoreA;
  });

  const preferred = sorted.find((item) => String(item.codecs || '').includes('mp4a')) || sorted[0];

  return {
    url:
      preferred.baseUrl ||
      preferred.base_url ||
      preferred.backupUrl?.[0] ||
      preferred.backup_url?.[0] ||
      undefined,
    codec: preferred.codecs,
    bandwidth: preferred.bandwidth,
  };
}
