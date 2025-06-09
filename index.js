// ✅ Wait for the DOM to load before accessing elements
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registrationForm');
  const dobInput = document.getElementById('dob');
  const dobError = document.getElementById('dobError');
  const tableBody = document.getElementById('userTableBody');

  // ✅ Set age limits on the DOB input (18 to 55 years old)
   function setDOBConstraints() {
  const today = new Date();
  const currentYear = today.getFullYear();

  const minDob = new Date(currentYear - 55, 0, 1); // Jan 1, 1970 (55 years ago)
  const maxDob = new Date(currentYear - 18, 11, 31); // Dec 31, 2007 (18 years ago)

  dobInput.min = minDob.toISOString().split('T')[0];
  dobInput.max = maxDob.toISOString().split('T')[0];
}

  // Accurate age validator (18–55 years old)
  function validateDOB(dobStr) {
  if (!dobStr) return false;

  const dobYear = new Date(dobStr).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - dobYear;

  return age >= 18 && age <= 55;
}



  // ✅ Validate email using regex
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ✅ Load users from localStorage
  function loadUsers() {
    const usersJSON = localStorage.getItem('users');
    if (!usersJSON) return [];
    try {
      return JSON.parse(usersJSON);
    } catch {
      return [];
    }
  }

  // ✅ Save users back to localStorage
  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // ✅ Add a single user to the HTML table
  function addUserToTable(user) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="border px-4 py-2">${user.name}</td>
      <td class="border px-4 py-2">${user.email}</td>
      <td class="border px-4 py-2">${user.password}</td>
      <td class="border px-4 py-2">${user.dob}</td>
      <td class="border px-4 py-2">${user.termsAccepted ? 'true' : 'false'}</td>
    `;
    tableBody.appendChild(tr);
  }

  // ✅ Render all users from localStorage
  function renderUsers() {
    const users = loadUsers();
    tableBody.innerHTML = ''; // clear previous entries
    users.forEach(addUserToTable);
  }

  // ✅ Initial setup
  setDOBConstraints();
  renderUsers();

  // ✅ Form submission handler
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    let valid = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const dob = form.dob.value;
    const termsAccepted = form.terms.checked;

    // ❗ Validate DOB
    if (!validateDOB(dob)) {
      dobError.classList.remove('hidden');
      valid = false;
    } else {
      dobError.classList.add('hidden');
    }

    // ❗ Validate Email
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      valid = false;
    }

    // ❗ Check if terms are accepted
    if (!termsAccepted) {
      alert("Please accept the terms and conditions.");
      valid = false;
    }

    if (!valid) return; // stop if any validation failed

    // ✅ Save and display the user
    const users = loadUsers();
    const newUser = { name, email, password, dob, termsAccepted };
    users.push(newUser);
    saveUsers(users);
    addUserToTable(newUser); // immediately show new entry

    form.reset(); // clear the form
    setDOBConstraints(); // reset DOB min/max
  });
});
