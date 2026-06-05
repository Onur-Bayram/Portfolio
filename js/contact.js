// Contact form controller.
// Validates fields, manages button state, and submits the form to the local endpoint.
(function () {
  var form = document.getElementById('contactForm');
  var nameInput = document.getElementById('contactName');
  var emailInput = document.getElementById('contactEmail');
  var messageInput = document.getElementById('contactMessage');
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
   * @property {HTMLInputElement|HTMLTextAreaElement} input The form control that is being validated.
   * @property {HTMLElement} error The element that renders the validation message for that control.
   */

  /** @type {FormField[]} */
  var fields = [
    { input: nameInput, error: nameError },
    { input: emailInput, error: emailError },
    { input: messageInput, error: messageError }
  ];

  /**
   * Validates an email address against the project's lightweight contact form pattern.
   *
   * @param {string} value The email value that should be validated.
   * @returns {boolean} Returns true when the email matches the expected format.
   */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  /**
   * Reads the active desktop language toggle to decide which localized copy should be used.
   *
   * @returns {boolean} Returns true when German is currently the active UI language.
   */
  function isGermanActive() {
    var langDE = document.getElementById('langDE');
    return Boolean(langDE && langDE.classList.contains('is-active'));
  }

  /**
   * Returns localized validation, button, and status copy for the contact form.
   *
   * @param {string} key The message key that should be resolved for the active language.
   * @returns {string} The localized string associated with the requested key.
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
   * Resolves the submit button label for the active language.
   *
   * @returns {string} The localized default label for the submit button.
   */
  function getSubmitLabel() {
    if (isGermanActive()) {
      return submitBtn.dataset.de || 'Hallo sagen :)';
    }

    return submitBtn.dataset.en || 'Say Hello :)';
  }

  /**
   * Clears any visible success or error feedback below the submit button.
   *
   * @returns {void}
   */
  function clearFormStatus() {
    if (!formStatus) return;
    formStatus.hidden = true;
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }

  /**
   * Renders a localized form status message in the matching visual state.
   *
   * @param {'success'|'error'} type Controls the visual modifier class that is applied.
   * @param {string} messageKey The localized status key that should be rendered.
   * @returns {void}
   */
  function showFormStatus(type, messageKey) {
    if (!formStatus) return;
    formStatus.hidden = false;
    formStatus.textContent = getCopy(messageKey);
    formStatus.className = 'form-status is-' + type;
  }

  /**
   * Restores the submit button label after a temporary sending, success, or error state.
   *
   * @param {number} delay The delay in milliseconds before the label should be reset.
   * @returns {void}
   */
  function resetSubmitButton(delay) {
    window.setTimeout(function () {
      submitBtn.textContent = getSubmitLabel();
      updateSubmitState();
    }, delay || 3000);
  }

  /**
   * Toggles the invalid styling and ARIA state for a single text input or textarea field.
   *
   * @param {HTMLInputElement|HTMLTextAreaElement} input The control whose invalid state should be updated.
   * @param {boolean} hasError Controls whether the invalid state should be shown.
   * @returns {void}
   */
  function setFieldErrorState(input, hasError) {
    var field = input.closest('.form-field');
    if (!field) return;

    field.classList.toggle('is-invalid', hasError);
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  /**
   * Toggles the invalid styling and ARIA state for the privacy checkbox row.
   *
   * @param {boolean} hasError Controls whether the privacy field should be marked invalid.
   * @returns {void}
   */
  function setPrivacyErrorState(hasError) {
    var privacyField = privacyCheck.closest('.form-privacy');
    if (privacyField) {
      privacyField.classList.toggle('is-invalid', hasError);
    }

    privacyCheck.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  /**
   * Validates the name field and writes the matching localized error message when needed.
   *
   * @returns {boolean} Returns true when the name field is filled in.
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
   * Validates the email field for presence and format.
   *
   * @returns {boolean} Returns true when the email field is filled in with a valid address.
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
   * Validates the message textarea for required content.
   *
   * @returns {boolean} Returns true when the message contains non-whitespace content.
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
   * Validates whether the privacy consent checkbox has been accepted.
   *
   * @returns {boolean} Returns true when privacy consent is active.
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
   * Enables or disables the submit button based on the current field values and privacy state.
   *
   * @returns {void}
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
   * Reads the submission endpoint from the form action attribute.
   *
   * @returns {string} The endpoint URL that should receive the form request.
   */
  function getFormEndpoint() {
    return (form.getAttribute('action') || '').trim();
  }

  /**
   * Reads the configured HTTP method from the form element.
   *
   * @returns {string} The uppercased request method for the form submission.
   */
  function getFormMethod() {
    return (form.getAttribute('method') || 'POST').toUpperCase();
  }

  /**
   * Removes all inline validation messages and invalid field states.
   *
   * @returns {void}
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
   * Clears transient status feedback and refreshes the current submit button state after input changes.
   *
   * @returns {void}
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
