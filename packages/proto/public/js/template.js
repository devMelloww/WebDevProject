export function prepareTemplate(templateString) {
    const template = document.createElement('template');
    template.innerHTML = templateString;
    return template;
  }
  