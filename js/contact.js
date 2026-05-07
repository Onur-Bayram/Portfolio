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
      sent: 'Nachricht gesendet ✓'
    };
    var en = {
      nameMissing: 'Oops! it seems your name is missing',
      emailMissing: 'Oops! your email is required',
      emailInvalid: 'Oops! please check your email format',
      messageMissing: 'What do you need to develop?',
      sent: 'Message sent ✓'
    };

    return (isGermanActive() ? de : en)[key];
  }

  function getSubmitLabel() {
    if (isGermanActive()) {
      return submitBtn.dataset.de || 'Hallo sagen :)';
    }
    return submitBtn.dataset.en || 'Say Hello :)';
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
    var allValid = nameInput.value.trim() && isValidEmail(emailInput.value) && messageInput.value.trim() && privacyCheck.checked;
    submitBtn.disabled = !allValid;
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
    var isValid = validateName() && validateEmail() && validateMessage() && privacyCheck.checked;
    if (!isValid) return;

    form.reset();
    fields.forEach(function (field) {
      setFieldErrorState(field.input, false);
    });
    submitBtn.disabled = true;
    submitBtn.textContent = getCopy('sent');

    setTimeout(function () {
      submitBtn.textContent = getSubmitLabel();
    }, 3000);
  });
})();
