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

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validateName() {
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      return false;
    }
    nameError.textContent = '';
    return true;
  }

  function validateEmail() {
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      return false;
    }
    if (!isValidEmail(emailInput.value)) {
      emailError.textContent = 'Please enter a valid email address.';
      return false;
    }
    emailError.textContent = '';
    return true;
  }

  function validateMessage() {
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please enter a message.';
      return false;
    }
    messageError.textContent = '';
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

  emailInput.addEventListener('blur', function () {
    validateEmail();
    updateSubmitState();
  });

  messageInput.addEventListener('blur', function () {
    validateMessage();
    updateSubmitState();
  });

  privacyCheck.addEventListener('change', updateSubmitState);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var isValid = validateName() && validateEmail() && validateMessage() && privacyCheck.checked;
    if (!isValid) return;

    form.reset();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Message sent ✓';

    setTimeout(function () {
      submitBtn.textContent = submitBtn.dataset.en || 'Say Hello :)';
    }, 3000);
  });
})();
