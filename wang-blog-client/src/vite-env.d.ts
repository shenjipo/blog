/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly NODE_ENV: string
    readonly VITE_APP_BASE_API: string
  

}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

type Nullable<T> = T | null | undefined 