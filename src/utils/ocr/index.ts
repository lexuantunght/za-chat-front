import { OCRAdapter } from './adapter';
import worker from './ocr-create-worker';

class TextRecognization {
    private static instance: TextRecognization | null = null;
    private adapter: OCRAdapter;
    private constructor() {
        this.adapter = new OCRAdapter(worker, 'eng');
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new TextRecognization();
        }
        return this.instance;
    }

    public recognize(imageUrl: string, callback?: (text: string) => void) {
        this.adapter.recognize(imageUrl, callback);
    }

    public terminate() {
        this.adapter.terminate();
    }
}

export default TextRecognization;
