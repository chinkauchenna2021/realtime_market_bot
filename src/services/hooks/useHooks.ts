export function generateSimpleArrayHTML(dataArray: string[]) {
    let html = '<ul>';
  
    // Iterate over the array and generate list items for each object
    dataArray.forEach(data => {
      html += `<li>Name: $ ${data}</li>`;
    });
    html += '</ul>';
  
    return html;
  }