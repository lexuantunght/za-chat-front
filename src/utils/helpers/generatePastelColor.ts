export default function generatePastelColor() {
    return (
        'hsl(' +
        360 * Math.random() +
        ',' +
        (25 + 70 * Math.random()) +
        '%,' +
        (85 + 10 * Math.random()) +
        '%)'
    );
}
