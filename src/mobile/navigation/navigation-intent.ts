export type NavigationIntent = 'tab' | 'stack-push' | 'app-back' | 'replace' | null

let pendingNavigationIntent: NavigationIntent = null

export function setNavigationIntent(intent: NavigationIntent): void {
  pendingNavigationIntent = intent
}

export function consumeNavigationIntent(): NavigationIntent {
  const intent = pendingNavigationIntent
  pendingNavigationIntent = null
  return intent
}
