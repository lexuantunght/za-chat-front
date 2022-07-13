import { createWorker } from 'tesseract.js';
import { WordRecognized } from '../../domain/model/FileData';
import { OCRAdapter } from './adapter';

export class TextRecognization {
    private adapter: OCRAdapter;
    constructor() {
        this.adapter = new OCRAdapter(
            createWorker({
                logger: (m) => console.log(m),
            }),
            'eng',
            80
        );
    }

    public recognize(imageUrl: string, callback?: (words: Array<WordRecognized>) => void) {
        this.adapter.recognize(imageUrl, callback);
    }

    public terminate() {
        this.adapter.terminate();
    }
}

export const recognization = new TextRecognization();
