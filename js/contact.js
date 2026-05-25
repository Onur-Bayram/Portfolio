// Contact form controller.
// Validates input fields, manages button state, and submits the form to Netlify.
(function () {
  // Collect the core form elements once so the rest of the script can reuse them.
  var form = document.getElementById('contactForm');
  var nameInput = document.getElementById('contactName');
  var emailInput = document.getElementById('contactEmail');
  var messageInput = document.getElementById('contactMessage');
  var privacyCheck = document.getElementById('privacyCheck');
  var submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  // Each field has a matching inline error container used during validation.
  var nameError = document.getElementById('nameError');
  var emailError = document.getElementById('emailError');
  var messageError = document.getElementById('messageError');

  var fields = [
    { input: nameInput, error: nameError },
    { input: emailInput, error: emailError },
    { input: messageInput, error: messageError }
  ];

  // Basic email format check for client-side validation feedback.
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  // The active language is derived from the shared language toggle buttons.
  function isGermanActive() {
    var langDE = document.getElementById('langDE');
    return Boolean(langDE && langDE.classList.contains('is-active'));
  }

  // Centralize validation and status copy so language switching stays consistent.
  function getCopy(key) {
    var de = {
      nameMissing: 'Hoppla! Dein Name fehlt',
      emailMissing: 'Hoppla! Deine E-Mail wird benötigt',
      emailInvalid: 'Hoppla! Bitte prüfe dein E-Mail-Format',
      messageMissing: 'Was möchtest du entwickeln?',
      sent: 'Nachricht gesendet ✓',
      sending: 'Wird gesendet...',
      failed: 'Senden fehlgeschlagen'
    };
    var en = {
      nameMissing: 'Oops! it seems your name is missing',
      emailMissing: 'Oops! your email is required',
      emailInvalid: 'Oops! please check your email format',
      messageMissing: 'What do you need to develop?',
      sent: 'Message sent ✓',
      sending: 'Sending...',
      failed: 'Sending failed'
    };

    return (isGermanActive() ? de : en)[key];
  }

  // Reset the submit button label to the language-specific default after feedback states.
  function getSubmitLabel() {
    if (isGermanActive()) {
      return submitBtn.dataset.de || 'Hallo sagen :)';
    }
    return submitBtn.dataset.en || 'Say Hello :)';
  }

  // Field wrappers receive an error class so CSS can style invalid inputs and labels together.
  function setFieldErrorState(input, hasError) {
    var field = input.closest('.form-field');
    if (!field) return;
    field.classList.toggle('is-invalid', hasError);
  }

  // Validate the name field and write the error message into the inline helper area.
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

  // Email validation first checks presence and then format.
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

  // The message field must not be empty before submission is allowed.
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

  // The submit button only becomes interactive when the form is complete and privacy is accepted.
  function updateSubmitState() {
    var allValid = nameInput.value.trim() && isValidEmail(emailInput.value) && messageInput.value.trim() && privacyCheck.checked;
    submitBtn.disabled = !allValid;
  }

  // Netlify expects classic form-urlencoded data when the form is sent with fetch.
  function encodeFormData(formData) {
    return new URLSearchParams(formData).toString();
  }

  // Validate on blur so users get explicit feedback after leaving a field.
  nameInput.addEventListener('blur', function () {
    validateName();
    updateSubmitState();
  });

  // Recompute button availability while users type, without showing errors too aggressively.
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

  // Submit the form asynchronously and surface a short success or failure message in the button.
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var isValid = validateName() && validateEmail() && validateMessage() && privacyCheck.checked;
    if (!isValid) return;

    // Lock the button while the request is in flight to prevent duplicate submissions.
    submitBtn.disabled = true;
    submitBtn.textContent = getCopy('sending');

    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodeFormData(new FormData(form))
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Request failed');
        }

        // Reset values and field states after a successful submission.
        form.reset();
        fields.forEach(function (field) {
          field.error.textContent = '';
          setFieldErrorState(field.input, false);
        });
        submitBtn.textContent = getCopy('sent');

        setTimeout(function () {
          submitBtn.textContent = getSubmitLabel();
          updateSubmitState();
        }, 3000);
      })
      .catch(function () {
        // Keep the form data in place on failure so the visitor can retry without retyping.
        submitBtn.textContent = getCopy('failed');

        setTimeout(function () {
          submitBtn.textContent = getSubmitLabel();
          updateSubmitState();
        }, 3000);
      });
  });
})();
