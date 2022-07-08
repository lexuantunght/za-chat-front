export type OCRWorker = {
    terminate: CallableFunction;
    recognize: CallableFunction;
    load: CallableFunction;
    loadLanguage: CallableFunction;
    initialize: CallableFunction;
};

export class OCRAdapter {
    private worker;
    constructor(_worker: OCRWorker, language: string) {
        this.worker = _worker;
        this.preload(language);
    }

    private async preload(language: string) {
        await this.worker.load();
        await this.worker.loadLanguage(language);
        await this.worker.initialize(language);
    }

    public recognize(imageUrl: string, callback?: (text: string) => void) {
        this.worker
            .recognize(imageUrl, 'vie')
            .then((data: { data: { text: string } }) => callback?.(data.data.text));
    }

    public terminate() {
        this.worker.terminate();
    }
}
