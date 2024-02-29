"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSimpleArrayHTML = void 0;
function generateSimpleArrayHTML(dataArray) {
    let html = '<ul>';
    // Iterate over the array and generate list items for each object
    dataArray.forEach(data => {
        html += `<li>Name: $ ${data}</li>`;
    });
    html += '</ul>';
    return html;
}
exports.generateSimpleArrayHTML = generateSimpleArrayHTML;
