import { createWorker } from 'tesseract.js';

const worker = createWorker({
    logger: (m) => console.log(m),
});

export default worker;
