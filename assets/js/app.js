// Mobile nav toggle
(function () {
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const menuOpen = document.getElementById('menu-open');
  const menuClose = document.getElementById('menu-close');
  if (toggle && mobileNav) {
    // ensure aria-expanded is present
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => {
      const opened = mobileNav.classList.contains('hidden');
      if (opened) {
        mobileNav.classList.remove('hidden');
        menuOpen.classList.add('hidden');
        menuClose.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        mobileNav.classList.add('hidden');
        menuOpen.classList.remove('hidden');
        menuClose.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Contact form validation and demo submit
  const form = document.getElementById('contact-form');
  if (form) {
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');
    const statusEl = document.getElementById('form-status');

    function showError(id, msg) {
      const el = document.getElementById(id);
      if (el) { el.textContent = msg; el.classList.remove('hidden'); }
    }
    function clearError(id) {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.add('hidden'); }
    }

    function validate() {
      let ok = true;
      clearError('err-name'); clearError('err-email'); clearError('err-message');
      if (!nameEl.value.trim()) { showError('err-name', 'Please enter your full name'); ok = false }
      if (!emailEl.value.trim()) { showError('err-email', 'Please enter your email'); ok = false }
      else if (!/^\S+@\S+\.\S+$/.test(emailEl.value)) { showError('err-email', 'Please enter a valid email'); ok = false }
      if (!messageEl.value.trim()) { showError('err-message', 'Please enter a message'); ok = false }
      return ok;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      statusEl.textContent = '';
      if (!validate()) return;
      // Demo behaviour: show a success message and clear form. In production this should POST to a server.
      statusEl.textContent = 'Thank you — your enquiry has been received (demo). We will respond soon.';
      form.reset();
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.textContent = '';
      if (!validate()) return;
      // POST to server endpoint
      try {
        const resp = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nameEl.value.trim(), email: emailEl.value.trim(), message: messageEl.value.trim() })
        });
        const data = await resp.json();
        if (resp.ok && data.ok) {
          statusEl.textContent = 'Thank you — your enquiry has been received. We will respond soon.';
          form.reset();
          statusEl.setAttribute('role', 'status');
          statusEl.focus?.();
        } else {
          statusEl.textContent = data.error || 'Failed to send enquiry. Please try later.';
          statusEl.setAttribute('role', 'alert');
        }
      } catch (err) {
        statusEl.textContent = 'Network error: could not send enquiry.';
        statusEl.setAttribute('role', 'alert');
      }
    });
  }
})();
