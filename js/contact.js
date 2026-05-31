// Contact form controller.
// Validates fields, manages button state, and submits to a configurable endpoint.
(function () {
  var form = document.getElementById('contactForm');
  var nameInput = document.getElementById('contactName');
  var emailInput = document.getElementById('contactEmail');
  var messageInput = document.getElementById('contactMessage');
  var privacyCheck = document.getElementById('privacyCheck');
  var submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  var nameError = document.getElementById('nameError');
  var emailError = document.getElementById('emailError');
  var messageError = document.getElementById('messageError');

  var fields = [
    { input: nameInput, error: nameError },
    { input: emailInput, error: emailError },
    { input: messageInput, error: messageError }
  ];

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isGermanActive() {
    var langDE = document.getElementById('langDE');
    return Boolean(langDE && langDE.classList.contains('is-active'));
  }

  function getCopy(key) {
    var de = {
      nameMissing: 'Hoppla! Dein Name fehlt',
      emailMissing: 'Hoppla! Deine E-Mail wird benötigt',
      emailInvalid: 'Hoppla! Bitte prüfe dein E-Mail-Format',
      messageMissing: 'Was möchtest du entwickeln?',
      draft: 'E-Mail-Entwurf geöffnet',
      sent: 'Nachricht gesendet ✓',
      sending: 'Wird gesendet...',
      failed: 'Senden fehlgeschlagen',
      notConfigured: 'Formular noch nicht verbunden'
    };

    var en = {
      nameMissing: 'Oops! it seems your name is missing',
      emailMissing: 'Oops! your email is required',
      emailInvalid: 'Oops! please check your email format',
      messageMissing: 'What do you need to develop?',
      draft: 'Email draft opened',
      sent: 'Message sent ✓',
      sending: 'Sending...',
      failed: 'Sending failed',
      notConfigured: 'Form not connected yet'
    };

    return (isGermanActive() ? de : en)[key];
  }

  function getSubmitLabel() {
    if (isGermanActive()) {
      return submitBtn.dataset.de || 'Hallo sagen :)';
    }

    return submitBtn.dataset.en || 'Say Hello :)';
  }

  function resetSubmitButton(delay) {
    setTimeout(function () {
      submitBtn.textContent = getSubmitLabel();
      updateSubmitState();
    }, delay || 3000);
  }

  function setFieldErrorState(input, hasError) {
    var field = input.closest('.form-field');
    if (!field) return;
    field.classList.toggle('is-invalid', hasError);
  }

  function validateName() {
    if (!nameInput.value.trim()) {
      nameError.textContent = getCopy('nameMissing');
      setFieldErrorState(nameInput, true);
      return false;
    }

    nameError.textContent = '';
    setFieldErrorState(nameInput, false);
    return true;
  }

  function validateEmail() {
    if (!emailInput.value.trim()) {
      emailError.textContent = getCopy('emailMissing');
      setFieldErrorState(emailInput, true);
      return false;
    }

    if (!isValidEmail(emailInput.value)) {
      emailError.textContent = getCopy('emailInvalid');
      setFieldErrorState(emailInput, true);
      return false;
    }

    emailError.textContent = '';
    setFieldErrorState(emailInput, false);
    return true;
  }

  function validateMessage() {
    if (!messageInput.value.trim()) {
      messageError.textContent = getCopy('messageMissing');
      setFieldErrorState(messageInput, true);
      return false;
    }

    messageError.textContent = '';
    setFieldErrorState(messageInput, false);
    return true;
  }

  function updateSubmitState() {
    var allValid =
      nameInput.value.trim() &&
      isValidEmail(emailInput.value) &&
      messageInput.value.trim() &&
      privacyCheck.checked;

    submitBtn.disabled = !allValid;
  }

  function getFormEndpoint() {
    return (form.dataset.formEndpoint || form.getAttribute('action') || '').trim();
  }

  function getFormMethod() {
    return (form.getAttribute('method') || 'POST').toUpperCase();
  }

  function openMailDraft() {
    var recipient = (form.dataset.formRecipient || '').trim();
    if (!recipient) return false;

    var subject = isGermanActive()
      ? 'Portfolio Anfrage von ' + nameInput.value.trim()
      : 'Portfolio inquiry from ' + nameInput.value.trim();

    var body = isGermanActive()
      ? [
          'Name: ' + nameInput.value.trim(),
          'E-Mail: ' + emailInput.value.trim(),
          '',
          'Nachricht:',
          messageInput.value.trim()
        ].join('\n')
      : [
          'Name: ' + nameInput.value.trim(),
          'Email: ' + emailInput.value.trim(),
          '',
          'Message:',
          messageInput.value.trim()
        ].join('\n');

    window.location.href =
      'mailto:' +
      encodeURIComponent(recipient) +
      '?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(body);

    return true;
  }

  nameInput.addEventListener('blur', function () {
    validateName();
    updateSubmitState();
  });

  nameInput.addEventListener('input', function () {
    updateSubmitState();
  });

  emailInput.addEventListener('blur', function () {
    validateEmail();
    updateSubmitState();
  });

  emailInput.addEventListener('input', function () {
    updateSubmitState();
  });

  messageInput.addEventListener('blur', function () {
    validateMessage();
    updateSubmitState();
  });

  messageInput.addEventListener('input', function () {
    updateSubmitState();
  });

  privacyCheck.addEventListener('change', updateSubmitState);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var isValid =
      validateName() && validateEmail() && validateMessage() && privacyCheck.checked;

    if (!isValid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = getCopy('sending');

    var endpoint = getFormEndpoint();

    // Without a backend endpoint we fall back to the visitor's mail client.
    if (!endpoint) {
      submitBtn.textContent = openMailDraft() ? getCopy('draft') : getCopy('notConfigured');
      resetSubmitButton(2600);
      return;
    }

    fetch(endpoint, {
      method: getFormMethod(),
      body: new FormData(form)
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Request failed');
        }

        form.reset();
        fields.forEach(function (field) {
          field.error.textContent = '';
          setFieldErrorState(field.input, false);
        });
        submitBtn.textContent = getCopy('sent');
        resetSubmitButton(3000);
      })
      .catch(function () {
        submitBtn.textContent = getCopy('failed');
        resetSubmitButton(3000);
      });
  });
})();
