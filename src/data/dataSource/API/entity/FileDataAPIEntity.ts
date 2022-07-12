export interface FileDataAPIEntity {
    url?: string;
    name?: string;
    type?: string;
    width?: number;
    height?: number;
    size?: number;
    textContent?: Array<{
        text: string;
        bbox: { x0: number; y0: number; x1: number; y1: number };
        confidence: number;
    }>;
}
