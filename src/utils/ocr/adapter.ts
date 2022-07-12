import { WordRecognized } from '../../domain/model/FileData';

type TextRecognizationResult = {
    data: {
        words: Array<{
            text: string;
            confidence: number;
            bbox: { x0: number; y0: number; x1: number; y1: number };
        }>;
    };
};

export type OCRWorker = {
    terminate: CallableFunction;
    recognize: CallableFunction;
    load: CallableFunction;
    loadLanguage: CallableFunction;
    initialize: CallableFunction;
    setParameters: CallableFunction;
};

export class OCRAdapter {
    private worker;
    private targetConfidence;
    constructor(_worker: OCRWorker, language: string, _targetConfidence = 50) {
        this.worker = _worker;
        this.targetConfidence = _targetConfidence;
        this.preload(language);
    }

    private async preload(language: string) {
        await this.worker.load();
        await this.worker.loadLanguage(language);
        await this.worker.initialize(language);
        this.worker.setParameters({
            tessedit_char_whitelist:
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',
            preserve_interword_spaces: '1',
        });
    }

    public recognize(imageUrl: string, callback?: (words: Array<WordRecognized>) => void) {
        this.worker.recognize(imageUrl).then((data: TextRecognizationResult) => {
            callback?.(data.data.words.filter((word) => word.confidence >= this.targetConfidence));
        });
    }

    public terminate() {
        this.worker.terminate();
    }
}
