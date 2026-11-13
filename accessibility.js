(() => {
  const main = document.querySelector('main');
  if (main) main.tabIndex = -1;
  document.querySelector('.skip')?.addEventListener('click', () => main?.focus());
  const form = document.querySelector('.intake-form');
  if (!form) return;
  const required = [...form.querySelectorAll('[required]')];
  const summary = document.createElement('div');
  summary.className = 'error-summary'; summary.tabIndex = -1; summary.hidden = true;
  form.before(summary);
  required.forEach(field => {
    const error = document.createElement('p');
    error.id = `${field.id}-error`; error.className = 'field-error'; error.hidden = true;
    field.after(error);
    field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'),error.id].filter(Boolean).join(' '));
    field.addEventListener('input', () => {
      if (field.validity.valid) {
        field.removeAttribute('aria-invalid'); error.hidden = true;
        summary.querySelector(`a[href="#${field.id}"]`)?.closest('li')?.remove();
        if (!summary.querySelector('li')) summary.hidden = true;
      }
    });
  });
  form.noValidate = true;
  form.addEventListener('submit', event => {
    required.filter(field => field.validity.valid).forEach(field => { field.removeAttribute('aria-invalid'); document.getElementById(`${field.id}-error`).hidden = true; });
    const invalid = required.filter(field => !field.validity.valid);
    if (!invalid.length) { summary.hidden = true; return; }
    event.preventDefault();
    summary.replaceChildren();
    const title = document.createElement('h2'); title.textContent = 'Please check these details';
    const list = document.createElement('ul'); summary.append(title,list);
    invalid.forEach(field => {
      const label = field.labels[0].textContent.replace('(required)','').trim();
      const message = field.validity.valueMissing ? `Enter ${label === 'What do you have in mind?' ? 'a short description of your project' : 'your '+label.toLowerCase()}.` : 'Enter a valid email address, such as name@example.com.';
      const error = document.getElementById(`${field.id}-error`); error.textContent = message; error.hidden = false;
      field.setAttribute('aria-invalid','true');
      const item = document.createElement('li'); const link = document.createElement('a');
      link.href = `#${field.id}`; link.textContent = message;
      link.addEventListener('click', e => { e.preventDefault(); field.focus(); });
      item.append(link); list.append(item);
    });
    summary.hidden = false; summary.focus();
  });
})();
