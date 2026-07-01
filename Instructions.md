
## 最终我们要的东西

大概是这几层：

```txt
src/mobile/navigation/
  route-config.tsx
  mobile-shell.tsx
  mobile-routes.tsx
  route-transition.tsx
  tab-page.tsx
  stack-page.tsx
  nav-header.tsx
  bottom-chrome.tsx
  overlay-layer.tsx
  player-sheet.tsx
```

它们分别负责：

## 1. `route-config.tsx`

统一定义所有 route metadata。

```ts
{
  path: '/more/settings',
  type: 'stack',
  title: '设置',
  showBottomChrome: false,
}
```

以后判断：

* 当前是不是 tab 页面；
* 要不要显示 tabbar / mini player；
* 用什么动画；
* 属于哪个 tab；
* fallback 去哪里；

都从这里来。

---

## 2. `mobile-shell.tsx`

替代现在的 `AppShell`。

只负责：

```txt
手机容器
滚动 viewport
底部 MiniPlayer + TabBar
OverlayLayer
safe area
```

但它不再无脑显示底部 chrome，而是：

```tsx
<MobileShell showBottomChrome={currentRoute.type === 'tab'}>
```

---

## 3. `mobile-routes.tsx`

替代现在的 `AppRoutes`。

负责：

```txt
React Router Routes
RouteTransition
根据 route meta 包装页面
```

它必须继续用真正的 `<Routes>/<Route>`，不要回到手动 `matchPath`。

---

## 4. `route-transition.tsx`

统一管页面动画。

第一版只做：

```txt
tab: 轻微 fade/translate
stack: iOS-like slide from right
```

第二版再做：

```txt
push / pop 方向区分
interactive swipe progress
```

不要在页面组件里写 motion。

---

## 5. `tab-page.tsx`

一级页面模板：

```tsx
<TabPage title="首页" subtitle="今天想听点什么呢？" trailing={<Avatar />}>
  ...
</TabPage>
```

自带：

* 大标题；
* subtitle；
* trailing slot；
* 页面内容 gap；
* safe area spacing。

---

## 6. `stack-page.tsx`

二级页面模板：

```tsx
<StackPage title="设置" backTo="/more">
  ...
</StackPage>
```

自带：

* 返回按钮；
* 大 header；
* 右滑返回；
* 滚动后 compact sticky header；
* 页面内容 padding；
* 不显示底部 tabbar/mini player。

这个是核心。

---

## 7. `nav-header.tsx`

拆成两个状态：

```txt
large header：页面顶部原始大 header
compact sticky header：滚动后固定在顶部的小 header
```

`StackPage` 统一控制什么时候显示 compact header。

---

## 8. `bottom-chrome.tsx`

包装：

```txt
MiniPlayer
BottomTabBar
```

以后可以加：

* 显示/隐藏动画；
* stack 页面自动隐藏；
* player sheet 打开时隐藏 mini player；
* safe area 统一处理。

---

## 9. `overlay-layer.tsx`

统一放：

```txt
PlayerSheet
Dialog
Toast
ActionSheet
```

它不跟普通页面 route 混在一起。

