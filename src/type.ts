export interface OSDetectionResult {
    isWinIE: boolean
    isWinIE64: boolean
    isLinuxX86: boolean
    isLinuxARM: boolean
}

export interface LodopConfig {
    mainJS?: string
    wsPort1?: number
    wsPort2?: number
    httpPort1?: number
    httpPort2?: number
    httpsPort?: number
    token?:string
}

export const DEFAULT_CONFIG: Required<LodopConfig> = {
    mainJS: 'CLodopfuncs.js',
    wsPort1: 8000,
    wsPort2: 18000,
    httpPort1: 8000,
    httpPort2: 18000,
    httpsPort: 8443,
    token:""
}
