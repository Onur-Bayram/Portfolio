// Contact form.
(function () {
  var form = document.getElementById('contactForm');
  var nameInput = document.getElementById('contactName');
  var emailInput = document.getElementById('contactEmail');
  var messageInput = document.getElementById('contactMessage');
  var honeypotInput = document.getElementById('contactWebsite');
  var privacyCheck = document.getElementById('privacyCheck');
  var submitBtn = document.getElementById('submitBtn');
  var formStatus = document.getElementById('formStatus');

  if (!form) return;

  var nameError = document.getElementById('nameError');
  var emailError = document.getElementById('emailError');
  var messageError = document.getElementById('messageError');
  var privacyError = document.getElementById('privacyError');

  /**
   * @typedef {Object} FormField
   * @property {HTMLInputElement|HTMLTextAreaElement} input Field element.
   * @property {HTMLElement} error Error element.
   */

  /** @type {FormField[]} */
  var fields = [
    { input: nameInput, error: nameError },
    { input: emailInput, error: emailError },
    { input: messageInput, error: messageError }
  ];

  /**
   * Checks whether an email looks valid.
   *
   * @param {string} value Email text.
   * @returns {boolean}
   */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  /**
   * Checks whether German is active.
   *
   * @returns {boolean}
   */
  function isGermanActive() {
    var langDE = document.getElementById('langDE');
    return Boolean(langDE && langDE.classList.contains('is-active'));
  }

  /**
   * Returns translated form copy.
   *
   * @param {string} key Copy key.
   * @returns {string}
   */
  function getCopy(key) {
    var de = {
      nameMissing: 'Hoppla! Dein Name fehlt',
      emailMissing: 'Hoppla! Deine E-Mail wird ben\u00f6tigt',
      emailInvalid: 'Hoppla! Bitte pr\u00fcfe dein E-Mail-Format',
      messageMissing: 'Was m\u00f6chtest du entwickeln?',
      privacyMissing: 'Bitte akzeptiere die Datenschutzrichtlinie.',
      sent: 'Nachricht erfolgreich gesendet.',
      sending: 'Wird gesendet...',
      failed: 'Senden fehlgeschlagen. Bitte versuche es erneut.',
      notConfigured: 'Formular ist noch nicht verbunden.'
    };

    var en = {
      nameMissing: 'Oops! it seems your name is missing',
      emailMissing: 'Oops! your email is required',
      emailInvalid: 'Oops! please check your email format',
      messageMissing: 'What do you need to develop?',
      privacyMissing: 'Please accept the privacy policy.',
      sent: 'Message sent successfully.',
      sending: 'Sending...',
      failed: 'Sending failed. Please try again.',
      notConfigured: 'Form is not connected yet.'
    };

    return (isGermanActive() ? de : en)[key];
  }

  /**
   * Returns the default submit label.
   *
   * @returns {string}
   */
  function getSubmitLabel() {
    if (isGermanActive()) {
      return submitBtn.dataset.de || 'Hallo sagen :)';
    }

    return submitBtn.dataset.en || 'Say Hello :)';
  }

  /**
   * Clears the form status text.
   */
  function clearFormStatus() {
    if (!formStatus) return;
    formStatus.hidden = true;
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }

  /**
   * Shows a form status message.
   *
   * @param {'success'|'error'} type Status type.
   * @param {string} messageKey Copy key.
   */
  function showFormStatus(type, messageKey) {
    if (!formStatus) return;
    formStatus.hidden = false;
    formStatus.textContent = getCopy(messageKey);
    formStatus.className = 'form-status is-' + type;
  }

  /**
   * Resets the submit button after a delay.
   *
   * @param {number} delay Delay in ms.
   */
  function resetSubmitButton(delay) {
    window.setTimeout(function () {
      submitBtn.textContent = getSubmitLabel();
      updateSubmitState();
    }, delay || 3000);
  }

  /**
   * Marks or clears an invalid field state.
   *
   * @param {HTMLInputElement|HTMLTextAreaElement} input Field element.
   * @param {boolean} hasError Whether the field is invalid.
   */
  function setFieldErrorState(input, hasError) {
    var field = input.closest('.form-field');
    if (!field) return;

    field.classList.toggle('is-invalid', hasError);
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  /**
   * Marks or clears the privacy error state.
   *
   * @param {boolean} hasError Whether the field is invalid.
   */
  function setPrivacyErrorState(hasError) {
    var privacyField = privacyCheck.closest('.form-privacy');
    if (privacyField) {
      privacyField.classList.toggle('is-invalid', hasError);
    }

    privacyCheck.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  /**
   * Validates the name field.
   *
   * @returns {boolean}
   */
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

  /**
   * Validates the email field.
   *
   * @returns {boolean}
   */
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

  /**
   * Validates the message field.
   *
   * @returns {boolean}
   */
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

  /**
   * Validates the privacy checkbox.
   *
   * @returns {boolean}
   */
  function validatePrivacy() {
    if (!privacyCheck.checked) {
      privacyError.textContent = getCopy('privacyMissing');
      setPrivacyErrorState(true);
      return false;
    }

    privacyError.textContent = '';
    setPrivacyErrorState(false);
    return true;
  }

  /**
   * Updates the submit button state.
   */
  function updateSubmitState() {
    var contentValid =
      nameInput.value.trim() &&
      isValidEmail(emailInput.value) &&
      messageInput.value.trim();

    var allValid = contentValid && privacyCheck.checked;
    submitBtn.disabled = !allValid;

    if (!privacyCheck.checked && contentValid) {
      validatePrivacy();
      return;
    }

    if (privacyError.textContent) {
      validatePrivacy();
    }
  }

  /**
   * Returns the form action.
   *
   * @returns {string}
   */
  function getFormEndpoint() {
    return (form.getAttribute('action') || '').trim();
  }

  /**
   * Returns the form method.
   *
   * @returns {string}
   */
  function getFormMethod() {
    return (form.getAttribute('method') || 'POST').toUpperCase();
  }

  /**
   * Clears all field errors.
   */
  function clearFieldErrors() {
    fields.forEach(function (field) {
      field.error.textContent = '';
      setFieldErrorState(field.input, false);
    });

    privacyError.textContent = '';
    setPrivacyErrorState(false);
  }

  /**
   * Reacts to field input.
   */
  function handleFieldInteraction() {
    clearFormStatus();
    updateSubmitState();
  }

  nameInput.addEventListener('blur', function () {
    validateName();
    updateSubmitState();
  });

  nameInput.addEventListener('input', handleFieldInteraction);

  emailInput.addEventListener('blur', function () {
    validateEmail();
    updateSubmitState();
  });

  emailInput.addEventListener('input', handleFieldInteraction);

  messageInput.addEventListener('blur', function () {
    validateMessage();
    updateSubmitState();
  });

  messageInput.addEventListener('input', handleFieldInteraction);

  privacyCheck.addEventListener('change', function () {
    clearFormStatus();
    validatePrivacy();
    updateSubmitState();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearFormStatus();

    var isValid =
      validateName() && validateEmail() && validateMessage() && validatePrivacy();

    if (!isValid) return;

    var endpoint = getFormEndpoint();
    if (!endpoint) {
      showFormStatus('error', 'notConfigured');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = getCopy('sending');

    if (honeypotInput) {
      honeypotInput.value = '';
    }

    fetch(endpoint, {
      method: getFormMethod(),
      headers: {
        Accept: 'application/json'
      },
      body: new FormData(form)
    })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return null;
          })
          .then(function (payload) {
            if (!response.ok || !payload || payload.ok !== true) {
              throw new Error('Request failed');
            }

            form.reset();
            clearFieldErrors();
            clearFormStatus();
            showFormStatus('success', 'sent');
            submitBtn.textContent = getCopy('sent');
            resetSubmitButton(3000);
          });
      })
      .catch(function () {
        showFormStatus('error', 'failed');
        submitBtn.textContent = getCopy('failed');
        resetSubmitButton(3000);
      });
  });
})();
