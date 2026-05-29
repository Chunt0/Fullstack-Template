/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin. Empty = same-origin (window.location.origin). Never "/api". */
  readonly VITE_API_URL: string
  /** Shared bearer token (auth Mode B), baked into the bundle by design. */
  readonly VITE_AUTH_TOKEN: string
  /** Display name (browser title + sidebar/topbar). Defaults to "App". */
  readonly VITE_APP_NAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
