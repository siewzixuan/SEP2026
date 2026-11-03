(function () {
    'use strict';

    var form = document.getElementById('loginForm');
    var userMsg = document.getElementById('usernameMsg');
    var user = document.getElementById('username');
    var pass = document.getElementById('password');
    var passMsg = document.getElementById('passwordMsg');
    var toggle = document.getElementById('toggle');
    var alertMessage = document.getElementById('alertMessage');

    if (!form || !pass || !passMsg || !toggle || !userMsg || !user || !alertMessage) {
        throw new Error('Login page is missing an element required by java.js.');
    }

    function validateUser(showEmptyMessage) {
        var message = '';
        if (!user.value && showEmptyMessage) {
            message = 'Enter your Email/Username.';
        }
        userMsg.textContent = message;
        user.setAttribute('aria-invalid', String(Boolean(message)));
        return !message;
    }

    function validatePass(showEmptyMessage) {
        var message = '';
        if (!pass.value && showEmptyMessage) {
            message = 'Enter your password.';
        } else if (pass.value && pass.value.length < 8) {
            message = 'Password must be at least 8 characters.';
        }

        passMsg.textContent = message;
        pass.setAttribute('aria-invalid', String(Boolean(message)));
        return !message;
    }

    function showAlert(type, message) {
        alertMessage.textContent = message;
        alertMessage.className = 'alert ' + type;
        alertMessage.style.display = 'block';
    }


    toggle.addEventListener('click', function () {
        var show = pass.type === 'password';
        pass.type = show ? 'text' : 'password';
        toggle.textContent = show ? 'Hide' : 'Show';
        toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        toggle.setAttribute('aria-pressed', String(show));
        pass.focus();
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var isValidPass = validatePass(true);
        var isValidUser = validateUser(true);

        if (!isValidUser || !isValidPass) {
            return;
        }

        showAlert('success', 'Login Successful! Welcome back, ' + user.value.trim() + '.');
        var loginBtn = form.querySelector('button[type="submit"]');
        loginBtn.textContent = 'Logged In';
        loginBtn.disabled = true;
    });

    pass.addEventListener('input', function () {
        validatePass(false);
    });

})();
