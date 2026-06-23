function initContactForm() {
  const form = document.getElementById('enquiryForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';
    status.className = '';

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        status.textContent = '\u2713 Thanks! Your enquiry has been sent — we\'ll get back to you soon.';
        status.className = 'ok';
        form.reset();
      } else {
        status.textContent = '\u2717 Something went wrong. Please try again or email us directly.';
        status.className = 'err';
      }
    } catch (err) {
      status.textContent = '\u2717 Network error. Please check your connection and try again.';
      status.className = 'err';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

document.addEventListener('partialsLoaded', initContactForm);
