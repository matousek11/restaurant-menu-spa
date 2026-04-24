/**
 * Creates a button element with the given text and click handler.
 *
 * @param {string} text text to display on the button.
 * @param {Function} onClick callback function for button click.
 * @param {string} className optional class name for the button.
 *
 * @returns {HTMLButtonElement} created button element.
 */
export function createButton(text, onClick, className = '') {
    const button = document.createElement('button');
    button.className = className;
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}