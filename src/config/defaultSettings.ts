interface Settings {
  pingUrls: string[]
  pingBoxTitle?: string
  pingMultiplier?: number
  timeout?: number
  debug?: boolean
  production: boolean
}

const IS_PROD = process.env.NODE_ENV === 'production'

const settings: Settings = {
  pingUrls: [
    'https://doh.futa.gg',
    'https://doh.futa.app',
    'https://dot.futa.gg',
  ],
  pingBoxTitle: '快☆樂☆表☆',
  pingMultiplier: 0.45,
  debug: !IS_PROD,
  production: IS_PROD,
}

export default settings
