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

  function setFieldErrorState(input, hasError) {
    var field = input.closest('.form-field');
    if (!field) return;
    field.classList.toggle('is-invalid', hasError);
  }

  function validateName() {
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Oops! it seems your name is missing';
      setFieldErrorState(nameInput, true);
      return false;
    }
    nameError.textContent = '';
    setFieldErrorState(nameInput, false);
    return true;
  }

  function validateEmail() {
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Hoppla! your email is required';
      setFieldErrorState(emailInput, true);
      return false;
    }
    if (!isValidEmail(emailInput.value)) {
      emailError.textContent = 'Hoppla! please check your email format';
      setFieldErrorState(emailInput, true);
      return false;
    }
    emailError.textContent = '';
    setFieldErrorState(emailInput, false);
    return true;
  }

  function validateMessage() {
    if (!messageInput.value.trim()) {
      messageError.textContent = 'What do you need to develop?';
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
    if (nameError.textContent) {
      validateName();
    }
    updateSubmitState();
  });

  emailInput.addEventListener('blur', function () {
    validateEmail();
    updateSubmitState();
  });

  emailInput.addEventListener('input', function () {
    if (emailError.textContent) {
      validateEmail();
    }
    updateSubmitState();
  });

  messageInput.addEventListener('blur', function () {
    validateMessage();
    updateSubmitState();
  });

  messageInput.addEventListener('input', function () {
    if (messageError.textContent) {
      validateMessage();
    }
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
    submitBtn.textContent = 'Message sent ✓';

    setTimeout(function () {
      submitBtn.textContent = submitBtn.dataset.en || 'Say Hello :)';
    }, 3000);
  });
})();
