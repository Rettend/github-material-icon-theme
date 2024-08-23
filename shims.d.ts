declare module '*.svg' {
  const content: string
  export default content
}

declare const browser = await import('webextension-polyfill')
