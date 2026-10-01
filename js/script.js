document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const passwordToggle = document.getElementById('passwordToggle');
  const eyeIcon = document.getElementById('eyeIcon');
  const submitBtn = document.getElementById('submitBtn');

  // Password Visibility Toggle
  let isPasswordVisible = false;
  passwordToggle.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';

    if (isPasswordVisible) {
      eyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `;
    } else {
      eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
    }
  });

  // Client-side Validation Helper
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Clear errors on input
  emailInput.addEventListener('input', () => {
    emailError.classList.remove('active');
    emailError.textContent = '';
    emailInput.style.borderColor = '';
  });

  passwordInput.addEventListener('input', () => {
    passwordError.classList.remove('active');
    passwordError.textContent = '';
    passwordInput.style.borderColor = '';
  });

  // Form Submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    if (!emailValue) {
      emailError.textContent = 'Please enter your email address.';
      emailError.classList.add('active');
      emailInput.style.borderColor = '#ef4444';
      isValid = false;
    } else if (!validateEmail(emailValue)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailError.classList.add('active');
      emailInput.style.borderColor = '#ef4444';
      isValid = false;
    }

    if (!passwordValue) {
      passwordError.textContent = 'Please enter your password.';
      passwordError.classList.add('active');
      passwordInput.style.borderColor = '#ef4444';
      isValid = false;
    } else if (passwordValue.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters.';
      passwordError.classList.add('active');
      passwordInput.style.borderColor = '#ef4444';
      isValid = false;
    }

    if (!isValid) return;

    // Simulate submission state without faking backend API
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Signing in...';

    // Hook for your backend integration
    console.log('Login credentials ready for authentication dispatch:', {
      email: emailValue,
      rememberMe: document.getElementById('rememberMe').checked
    });

    setTimeout(() => {
      window.location.href = '../Dashboard/index.html';
    }, 700);
  });
});
