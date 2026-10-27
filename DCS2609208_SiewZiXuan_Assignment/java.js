(function () {
    'use strict';

    var form = document.getElementById('loginForm');
    var pass = document.getElementById('password');
    var passMsg = document.getElementById('passwordMsg');
    var toggle = document.getElementById('toggle');

    if (!form || !pass || !passMsg || !toggle) {
        throw new Error('Login page is missing an element required by java.js.');
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

    pass.addEventListener('input', function () {
        validatePass(false);
    });

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
        validatePass(true);
    });
})();
