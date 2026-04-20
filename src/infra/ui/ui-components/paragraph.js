export function createParagraph(text) {
    const paragraph =  document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
}