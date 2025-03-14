export interface OSDetectionResult {
    isWinIE: boolean;
    isWinIE64: boolean;
    isLinuxX86: boolean;
    isLinuxARM: boolean;
}
export interface LodopConfig {
    mainJS?: string;
    wsPort1?: number;
    wsPort2?: number;
    httpPort1?: number;
    httpPort2?: number;
    httpsPort?: number;
    token?: string;
}
export declare const DEFAULT_CONFIG: Required<LodopConfig>;
