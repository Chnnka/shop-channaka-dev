/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend, e.g. https://api.example.com. Leave unset in development to use the Vite proxy. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
