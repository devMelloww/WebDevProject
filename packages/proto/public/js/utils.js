// public/js/utils

export function prepareTemplate(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template;
  }
  
  export function loadJSON(src, renderFn) {
    fetch(src)
      .then(response => response.json())
      .then(data => renderFn(data))
      .catch(error => console.error('Error loading JSON:', error));
  }
  