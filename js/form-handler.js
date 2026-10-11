(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    message: form.querySelector('#message')
  };

  const status = form.querySelector('.form-status');
  const honeypot = form.querySelector('.honeypot');

  function sanitize(value) {
    return value.replace(/[<>]/g, '').trim();
  }

  function showError(field, message) {
    const group = field.closest('.field-group');
    const errorEl = group.querySelector('.error-message');
    group.classList.add('invalid');
    errorEl.textContent = message;
    field.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    const group = field.closest('.field-group');
    const errorEl = group.querySelector('.error-message');
    group.classList.remove('invalid');
    errorEl.textContent = '';
    field.setAttribute('aria-invalid', 'false');
  }

  function validateField(name, value) {
    if (name === 'name') {
      const clean = sanitize(value);
      if (clean.length < 2) {
        showError(fields.name, 'Please enter a valid name.');
        return false;
      }
      clearError(fields.name);
      return true;
    }

    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value.trim())) {
        showError(fields.email, 'Please enter a valid email address.');
        return false;
      }
      clearError(fields.email);
      return true;
    }

    if (name === 'message') {
      const clean = sanitize(value);
      if (clean.length < 10) {
        showError(fields.message, 'Your message should be at least 10 characters long.');
        return false;
      }
      clearError(fields.message);
      return true;
    }

    return true;
  }

  Object.entries(fields).forEach(([name, field]) => {
    field.addEventListener('input', () => {
      validateField(name, field.value);
    });
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (honeypot && honeypot.value) {
      status.textContent = 'Form rejected.';
      status.className = 'form-status error';
      return;
    }

    let isValid = true;
    Object.entries(fields).forEach(([name, field]) => {
      const ok = validateField(name, field.value);
      if (!ok) isValid = false;
    });

    if (!isValid) {
      status.textContent = 'Please fix the highlighted fields and try again.';
      status.className = 'form-status error';
      return;
    }

    status.textContent = 'Sending your message...';
    status.className = 'form-status';

    const data = new FormData(form);
    const payload = {
      name: sanitize(data.get('name') || ''),
      email: sanitize(data.get('email') || ''),
      message: sanitize(data.get('message') || '')
    };

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      form.reset();
      status.textContent = 'Thanks! Your message has been sent successfully.';
      status.className = 'form-status success';
    } catch (error) {
      status.textContent = 'Something went wrong. Please email waquarsk1@gmail.com directly.';
      status.className = 'form-status error';
    }
  });
})();
