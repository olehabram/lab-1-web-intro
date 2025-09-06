/**
 * Універсальна функція для показу помилки для конкретного поля вводу.
 * @param {HTMLInputElement} inputElement - Елемент input, для якого сталася помилка.
 * @param {string} message - Повідомлення про помилку.
 */
function showError(inputElement, message) {
  const formGroup = inputElement.parentElement;
  const errorElement = formGroup.querySelector('.error-message');
  
  inputElement.classList.add('invalid');
  inputElement.classList.remove('valid');
  errorElement.textContent = message;
}

/**
 * Універсальна функція для позначення успішної валідації поля.
 * @param {HTMLInputElement} inputElement - Елемент input, який пройшов валідацію.
 */
function showSuccess(inputElement) {
  const formGroup = inputElement.parentElement;
  const errorElement = formGroup.querySelector('.error-message');

  inputElement.classList.add('valid');
  inputElement.classList.remove('invalid');
  errorElement.textContent = '';
}

// --- Частина 1: Завантаження даних з API ---

document.getElementById("load").addEventListener("click", async () => {
  const out = document.getElementById("out");
  out.textContent = "Завантаження...";
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    if (!res.ok) {
        throw new Error(`HTTP помилка! Статус: ${res.status}`);
    }
    const data = await res.json();
    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    out.textContent = "Помилка завантаження: " + e.message;
  }
});

// --- Частина 2: Індивідуальне завдання - Валідація форми ---

const form = document.getElementById('contactForm');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const formStatus = document.getElementById('formStatus');

// Функції для валідації
const validateEmail = () => {
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (email === '') {
    showError(emailInput, 'Поле Email не може бути порожнім.');
    return false;
  }
  if (!emailRegex.test(email)) {
    showError(emailInput, 'Будь ласка, введіть коректний email.');
    return false;
  }
  
  showSuccess(emailInput);
  return true;
};

const validatePhone = () => {
  const phone = phoneInput.value.trim();
  // Regex для українських номерів (+380..., 0...) з опціональними пробілами/дефісами
  const phoneRegex = /^(\+380|0)\d{9}$/;
  
  if (phone === '') {
    showError(phoneInput, 'Поле телефону не може бути порожнім.');
    return false;
  }
  if (!phoneRegex.test(phone)) {
    showError(phoneInput, 'Номер має бути у форматі +380XXXXXXXXX або 0XXXXXXXXX.');
    return false;
  }

  showSuccess(phoneInput);
  return true;
};

// Додаємо слухачів подій для валідації "на льоту"
emailInput.addEventListener('input', validateEmail);
phoneInput.addEventListener('input', validatePhone);

// Обробка відправки форми
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Запобігаємо стандартній відправці форми

  // Примусова валідація всіх полів перед відправкою
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();

  // Перевіряємо, чи всі поля валідні
  if (isEmailValid && isPhoneValid) {
    formStatus.textContent = 'Форму успішно надіслано!';
    formStatus.className = 'success';
    
    // Виводимо дані в консоль (симуляція відправки)
    console.log('Дані для відправки:', {
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim()
    });
    
    // Очищуємо форму після успішної відправки через 2 секунди
    setTimeout(() => {
        form.reset();
        emailInput.classList.remove('valid', 'invalid');
        phoneInput.classList.remove('valid', 'invalid');
        formStatus.textContent = '';
        formStatus.className = '';
    }, 2000);

  } else {
    formStatus.textContent = 'Будь ласка, виправте помилки у формі.';
    formStatus.className = 'error';
  }
});

