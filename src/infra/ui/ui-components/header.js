export function createHeader(title, size = 'h1') {
    const header = document.createElement(size);
    header.textContent = title;
    return header;
}