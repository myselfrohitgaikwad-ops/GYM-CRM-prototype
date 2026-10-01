document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const signupForm = document.getElementById('signupForm');
  const gymNameInput = document.getElementById('gymName');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const timezoneHiddenInput = document.getElementById('timezone');
  
  const gymNameError = document.getElementById('gymNameError');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');
  const timezoneError = document.getElementById('timezoneError');
  
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const pwdEyeIcon = document.getElementById('pwdEyeIcon');
  const submitActionBtn = document.getElementById('submitActionBtn');

  // Custom Timezone Dropdown elements
  const timezoneWrapper = document.getElementById('timezoneSelectWrapper');
  const timezoneTrigger = document.getElementById('timezoneTrigger');
  const selectedTimezoneText = document.getElementById('selectedTimezoneText');
  const timezoneList = document.getElementById('timezoneList');
  const timezoneOptions = timezoneList.querySelectorAll('.select-option');

  // 1. Password Visibility Toggle
  let isPasswordRevealed = false;
  togglePasswordBtn.addEventListener('click', () => {
    isPasswordRevealed = !isPasswordRevealed;
    passwordInput.type = isPasswordRevealed ? 'text' : 'password';

    if (isPasswordRevealed) {
      pwdEyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `;
    } else {
      pwdEyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
    }
  });

  // 2. Custom Timezone Dropdown Logic
  timezoneTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = timezoneWrapper.classList.toggle('open');
    timezoneTrigger.setAttribute('aria-expanded', isOpen);
  });

  timezoneOptions.forEach(option => {
    option.addEventListener('click', () => {
      const val = option.getAttribute('data-value');
      const text = option.textContent.trim();

      timezoneHiddenInput.value = val;
      selectedTimezoneText.textContent = text;
      selectedTimezoneText.classList.remove('placeholder-text');

      timezoneOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      timezoneWrapper.classList.remove('open');
      timezoneTrigger.setAttribute('aria-expanded', 'false');

      // Clear timezone error if any
      timezoneError.classList.remove('active');
      timezoneError.textContent = '';
      timezoneTrigger.style.borderColor = '';
    });
  });

  // Close dropdown if clicking outside
  document.addEventListener('click', (e) => {
    if (!timezoneWrapper.contains(e.target)) {
      timezoneWrapper.classList.remove('open');
      timezoneTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  // 3. Clear errors on typing
  gymNameInput.addEventListener('input', () => {
    gymNameError.classList.remove('active');
    gymNameError.textContent = '';
    gymNameInput.style.borderColor = '';
  });

  usernameInput.addEventListener('input', () => {
    usernameError.classList.remove('active');
    usernameError.textContent = '';
    usernameInput.style.borderColor = '';
  });

  passwordInput.addEventListener('input', () => {
    passwordError.classList.remove('active');
    passwordError.textContent = '';
    passwordInput.style.borderColor = '';
  });

  // 4. Form Validation & Submission Handling
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    const gymName = gymNameInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const timezone = timezoneHiddenInput.value;

    // Gym Name
    if (!gymName) {
      gymNameError.textContent = 'Please enter your gym name.';
      gymNameError.classList.add('active');
      gymNameInput.style.borderColor = '#ef4444';
      valid = false;
    }

    // Username
    if (!username) {
      usernameError.textContent = 'Please create a username.';
      usernameError.classList.add('active');
      usernameInput.style.borderColor = '#ef4444';
      valid = false;
    } else if (username.length < 3) {
      usernameError.textContent = 'Username must be at least 3 characters.';
      usernameError.classList.add('active');
      usernameInput.style.borderColor = '#ef4444';
      valid = false;
    }

    // Password
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);

    if (!password) {
      passwordError.textContent = 'Please create a password.';
      passwordError.classList.add('active');
      passwordInput.style.borderColor = '#ef4444';
      valid = false;
    } else if (password.length < 8 || !hasLetters || !hasNumbers) {
      passwordError.textContent = 'Password must be at least 8 characters with a mix of letters and numbers.';
      passwordError.classList.add('active');
      passwordInput.style.borderColor = '#ef4444';
      valid = false;
    }

    // Timezone
    if (!timezone) {
      timezoneError.textContent = "Please select your gym's timezone.";
      timezoneError.classList.add('active');
      timezoneTrigger.style.borderColor = '#ef4444';
      valid = false;
    }

    if (!valid) return;

    // Button loading state
    submitActionBtn.disabled = true;
    submitActionBtn.querySelector('span').textContent = 'Account Created! Redirecting...';

    // Ready for backend integration
    console.log('Form data ready for registration API dispatch:', {
      gymName,
      username,
      timezone
    });

    // Redirect to Login page
    setTimeout(() => {
      window.location.href = '../Login/index.html';
    }, 800);
  });
});
