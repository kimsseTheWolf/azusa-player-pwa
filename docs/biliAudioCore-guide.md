# biliAudioCore 使用手册

本文档详细说明 src/scripts/biliAudioCore.ts 中所有公开方法的用途、参数、返回值、错误处理与示例。

## 1. 快速上手

### 1.1 创建 Core 实例

createBiliAudioCore(options?)

用途：
- 创建一个可复用的 core 实例。
- 建议在应用启动时创建一次，然后在页面或状态管理里复用。

常用配置项：
- fetcher: 自定义 fetch 实现（React Native 或特殊环境可传）。
- apiOrigin: API 域名，默认 https://api.bilibili.com。
- includeCredentials: 是否带 cookie。
- requestTimeoutMs: 请求超时（毫秒）。
- maxAttempts: 失败重试次数。
- maxPages: 拉分页接口时的最大页数保护。
- metadataCache: 懒加载元信息缓存（按 bvid）。
- audioUrlCache: 音频地址缓存（按 bvid:cid）。
- logger: debug/warn/error 日志钩子。

示例：

    import { createBiliAudioCore } from '../src/scripts/biliAudioCore';

    const core = createBiliAudioCore({
      includeCredentials: false,
      requestTimeoutMs: 12000,
      maxAttempts: 2,
      maxPages: 100,
      logger: {
        debug: console.log,
        warn: console.warn,
        error: console.error,
      },
    });

## 2. 输入解析相关

### 2.1 parseSource(input, options?)

返回：BiliSource 或 undefined

用途：
- 把用户输入解析成标准 source 对象。
- 支持 BV 号、收藏夹、系列、合集链接。
- 解析失败时返回 undefined，不抛异常。

适用场景：
- 表单实时校验。
- 你希望自己处理无效输入提示。

示例：

    const source = core.parseSource('https://space.bilibili.com/444180997/lists/828030?type=series');

    if (!source) {
      console.log('输入无效');
    } else {
      console.log(source);
    }

### 2.2 parseSourceOrThrow(input, options?)

返回：BiliSource

用途：
- 与 parseSource 类似，但失败时直接抛出 BiliCoreError(INVALID_INPUT)。

适用场景：
- 业务逻辑里希望 fail-fast。

示例：

    try {
      const source = core.parseSourceOrThrow('BV1Sr4y1d7EF');
      console.log(source.type);
    } catch (err) {
      console.error('输入解析失败', err);
    }

### 2.3 extractBvid(input)

返回：string 或 undefined

用途：
- 从任意文本里提取 BV 号。

适用场景：
- 用户可能粘贴整段文本、标题或 URL。

示例：

    const bvid = core.extractBvid('这个视频不错 https://www.bilibili.com/video/BV1Sr4y1d7EF');
    console.log(bvid); // BV1Sr4y1d7EF

## 3. 歌曲元信息获取

### 3.1 getSongsByBvid(bvid, config?)

返回：Promise<BiliSong[]>

用途：
- 获取单个 BV 对应的歌曲元信息。
- 若视频是多分 P，返回多条 BiliSong。

常见字段：
- id: cid
- bvid
- name
- singer
- singerId
- cover

示例：

    const songs = await core.getSongsByBvid('BV1Sr4y1d7EF');
    console.log('条数', songs.length);
    console.log('第一条', songs[0]);

### 3.2 getSongsFromSource(source, config?)

返回：Promise<BiliSong[]>

用途：
- 从任意 source 一次性拉取全部元信息。
- 对 fav/series/collection 会先拿 bvid 列表，再批量请求 view。

适用场景：
- 列表规模不大时的一次性加载。

示例：

    const source = core.parseSourceOrThrow('1042352181');
    const songs = await core.getSongsFromSource(source);
    console.log('总歌曲数', songs.length);

### 3.3 getBvidsFromSource(source, config?)

返回：Promise<string[]>

用途：
- 懒加载第 1 步，只拿 bvid 列表，不拿元信息。

适用场景：
- 大收藏夹/合集。
- 先展示骨架屏，再分批补元信息。

示例：

    const source = core.parseSourceOrThrow('https://space.bilibili.com/5109111/lists/6995126?type=season');
    const bvids = await core.getBvidsFromSource(source);
    console.log('BV 总数', bvids.length);

### 3.4 getSongsByBvidsPage(bvids, options, config?)

返回：Promise<SongsByBvidsPageResult>

用途：
- 懒加载第 2 步，按页获取 metadata。
- 只请求当前页，不请求 playurl。

关键参数 options：
- offset: 从哪个 bvid 下标开始。
- limit: 当前页 bvid 数量。
- concurrency: 并发数，内部会限制在 1 到 2。
- stopOnRateLimit: 遇到 403/429 是否立即停止当前页。
- cooldownMs: 遇限流后的冷却时间。

返回结果重点：
- songs: 当前页展开后的歌曲数组。
- nextOffset: 下一页 offset。
- hasMore: 是否还有下一页。
- failedBvids: 本页失败的 bvid。
- stopped/stoppedReason: 是否提前停止（如 rate_limited）。

示例：

    const bvids = await core.getBvidsFromSource(source);

    let offset = 0;
    const pageSize = 20;

    const page1 = await core.getSongsByBvidsPage(bvids, {
      offset,
      limit: pageSize,
      concurrency: 2,
      stopOnRateLimit: true,
      cooldownMs: 1200,
    });

    renderSongs(page1.songs);
    offset = page1.nextOffset;

    if (page1.hasMore) {
      const page2 = await core.getSongsByBvidsPage(bvids, { offset, limit: pageSize });
      appendSongs(page2.songs);
      offset = page2.nextOffset;
    }

## 4. 音频地址解析

### 4.1 resolveAudioUrl(input, config?)

返回：Promise<ResolveAudioUrlResult>

用途：
- 通过 bvid + cid（cid 可省略）获取最终可播放音频地址。
- 若未传 cid，会先请求 pagelist 获取 cid。
- 支持 audioUrlCache 缓存。

返回字段：
- bvid, cid, url
- codec, bandwidth
- fromCache

示例：

    const result = await core.resolveAudioUrl({
      bvid: 'BV1Sr4y1d7EF',
    });

    console.log(result.url, result.fromCache);

### 4.2 resolveSongAudioUrl(song, config?)

返回：Promise<ResolveAudioUrlResult>

用途：
- 通过已有 song（含 bvid 和 id/cid）直接解析音频地址。
- 懒加载链路里通常在用户点击播放时调用。

示例：

    const song = page1.songs[0];
    const play = await core.resolveSongAudioUrl(song);
    audioElement.src = play.url;

## 5. 刷新与对比

### 5.1 refreshSongs(source, existingSongs?, config?)

返回：Promise<RefreshSongsResult>

用途：
- 重新拉取 source 并和旧列表做 diff。

返回字段：
- songs: 最新全量列表
- added: 新增项
- removed: 删除项
- unchangedCount: 未变化数量

示例：

    const refresh = await core.refreshSongs(source, oldSongs);

    console.log('新增', refresh.added.length);
    console.log('删除', refresh.removed.length);
    console.log('不变', refresh.unchangedCount);

## 6. 缓存接口用法

### 6.1 metadataCache（SongMetadataCache）

作用：
- 缓存每个 bvid 的元信息数组，避免重复打 view 接口。

接口定义：
- get(key): 返回 BiliSong[] 或 undefined
- set(key, value): 写入 BiliSong[]

IndexedDB 风格示例：

    const coreWithMetadataCache = createBiliAudioCore({
      metadataCache: {
        async get(bvid) {
          return await readSongsFromIndexedDb(bvid);
        },
        async set(bvid, songs) {
          await writeSongsToIndexedDb(bvid, songs);
        },
      },
    });

### 6.2 audioUrlCache（AudioUrlCache）

作用：
- 缓存解析后的播放地址，减少重复 playurl 请求。

接口定义：
- get(key): key 形如 bvid:cid
- set(key, value): value 为 URL 字符串

示例：

    const memoryAudioUrlCache = new Map();

    const coreWithAudioCache = createBiliAudioCore({
      audioUrlCache: {
        get(key) {
          return memoryAudioUrlCache.get(key);
        },
        set(key, value) {
          memoryAudioUrlCache.set(key, value);
        },
      },
    });

## 7. RequestConfig 用法

几乎所有网络方法都支持 config：
- includeCredentials: 当前请求是否带 cookie
- signal: AbortSignal，用于取消请求
- maxAttempts: 覆盖本次重试次数

示例（支持取消）：

    const controller = new AbortController();

    const task = core.getSongsByBvid('BV1Sr4y1d7EF', {
      signal: controller.signal,
      maxAttempts: 1,
    });

    controller.abort();

    try {
      await task;
    } catch (err) {
      console.error('请求已取消或失败', err);
    }

## 8. 推荐调用模式

### 8.1 小列表（简单模式）

    const source = core.parseSourceOrThrow(input);
    const songs = await core.getSongsFromSource(source);
    const play = await core.resolveSongAudioUrl(songs[0]);

### 8.2 大收藏夹/合集（懒加载模式）

    const source = core.parseSourceOrThrow(input);
    const bvids = await core.getBvidsFromSource(source);

    let offset = 0;
    const limit = 20;

    while (true) {
      const page = await core.getSongsByBvidsPage(bvids, { offset, limit });
      appendSongs(page.songs);

      if (!page.hasMore || page.stopped) {
        break;
      }

      offset = page.nextOffset;
    }

    // 用户点击某一项时再拿 playurl
    // const play = await core.resolveSongAudioUrl(clickedSong)

## 9. 错误处理建议

核心错误类型是 BiliCoreError，常见 code：
- INVALID_INPUT: 输入无法解析或 bvid 不合法
- NETWORK_ERROR: 网络失败
- TIMEOUT: 请求超时/中断
- HTTP_ERROR: HTTP 非 2xx
- NON_JSON_RESPONSE: 返回不是 JSON
- BILI_API_ERROR: B 站接口 code 非 0
- NO_CID: 无法解析 cid
- NO_AUDIO_STREAM: 无可播放音频流
- UNSUPPORTED_SOURCE: source 类型不支持

建议：
- UI 层统一捕获 BiliCoreError 并按 code 显示用户提示。
- 懒加载模式下关注 stoppedReason 和 failedBvids，避免无限重试。

## 10. 完整示例（懒加载 + 点击播放）

    async function loadAndPlay(core, input) {
      const source = core.parseSourceOrThrow(input);
      const bvids = await core.getBvidsFromSource(source);

      const page = await core.getSongsByBvidsPage(bvids, {
        offset: 0,
        limit: 20,
        concurrency: 2,
        stopOnRateLimit: true,
        cooldownMs: 1200,
      });

      if (!page.songs.length) {
        return;
      }

      const firstSong = page.songs[0];
      const playback = await core.resolveSongAudioUrl(firstSong);
      console.log('play url', playback.url);
    }
