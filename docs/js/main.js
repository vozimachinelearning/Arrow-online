// ===== Mobile Nav Toggle =====
(function () {
  const navToggle = document.getElementById('navToggle');
  const navTabs = document.getElementById('navTabs');

  if (navToggle && navTabs) {
    navToggle.addEventListener('click', function () {
      navTabs.classList.toggle('open');
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navTabs.contains(e.target)) {
        navTabs.classList.remove('open');
      }
    });
  }
})();

// ===== FAQ Accordion =====
(function () {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(function (question) {
    question.addEventListener('click', function () {
      const item = this.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all other FAQs
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) other.classList.remove('open');
      });

      // Toggle this one
      if (isOpen) {
        item.classList.remove('open');
      } else {
        item.classList.add('open');
      }
    });
  });
})();

// ===== Formspree Configuration =====
// Replace these IDs with your Formspree form hash IDs.
// Get them from https://formspree.io/forms (Integration tab -> "Your form's endpoint is")
// e.g., if endpoint is https://formspree.io/f/abc123, the ID is "abc123"
var FORMSPREE_CONTACT_ID = 'YOUR_CONTACT_FORM_ID';
var FORMSPREE_SUBSCRIBE_ID = 'YOUR_SUBSCRIBE_FORM_ID';

// ===== Contact Form (Formspree) =====
(function () {
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  var formMsg = document.getElementById('contactFormMsg');
  var submitBtn = document.getElementById('contactSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      var name = document.getElementById('contactName').value.trim();
      var email = document.getElementById('contactEmail').value.trim();
      var subject = document.getElementById('contactSubject').value;
      var message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        showFormMsg('Please fill in all required fields.', 'error');
        return;
      }

      if (FORMSPREE_CONTACT_ID === 'YOUR_CONTACT_FORM_ID') {
        showFormMsg('Form not configured yet. Please email us at arrowlocalpower@gmail.com', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      formMsg.style.display = 'none';

      try {
        var response = await fetch('https://formspree.io/f/' + FORMSPREE_CONTACT_ID, {
          method: 'POST',
          body: JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            message: message
          }),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        var result = await response.json();

        if (result.ok) {
          contactForm.style.display = 'none';
          formSuccess.style.display = 'block';
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } catch (err) {
        showFormMsg('Something went wrong. Please email us directly at arrowlocalpower@gmail.com', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message \u2192';
      }
    });
  }

  function showFormMsg(text, type) {
    formMsg.style.display = 'block';
    formMsg.textContent = text;
    if (type === 'error') {
      formMsg.style.background = 'rgba(244,67,54,0.12)';
      formMsg.style.border = '1px solid #f44336';
      formMsg.style.color = '#f44336';
    } else {
      formMsg.style.background = 'rgba(76,175,80,0.12)';
      formMsg.style.border = '1px solid #4CAF50';
      formMsg.style.color = '#4CAF50';
    }
  }
})();

// ===== Button Click Feedback =====
(function () {
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (this.closest('form') && this.type === 'submit') return;
      this.style.transform = 'scale(0.97)';
      setTimeout(function () {
        this.style.transform = '';
      }.bind(this), 150);
    });
  });
})();

// ===== Highlight active nav link based on current path =====
(function () {
  var path = window.location.pathname;
  document.querySelectorAll('.nav-tabs .tab-btn').forEach(function (link) {
    link.classList.remove('active');
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
})();

// ===== Subscription Modal =====
(function () {
  var modal = document.getElementById('subscribeModal');
  var form = document.getElementById('subscribeForm');
  var subSuccess = document.getElementById('subSuccess');
  var subBtn = document.getElementById('subBtn');

  // Open modal
  window.openSubscribeModal = function () {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  // Close modal
  window.closeSubscribeModal = function () {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Close on overlay click
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeSubscribeModal();
      }
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeSubscribeModal();
    }
  });

  // Form submission
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var name = document.getElementById('subName').value.trim();
      var email = document.getElementById('subEmail').value.trim();

      if (!name || !email) {
        alert('Please fill in all fields.');
        return;
      }

      if (FORMSPREE_SUBSCRIBE_ID === 'YOUR_SUBSCRIBE_FORM_ID') {
        alert('Subscription form not configured yet. Please email us at arrowlocalpower@gmail.com');
        return;
      }

      subBtn.disabled = true;
      subBtn.textContent = 'Sending...';

      try {
        var response = await fetch('https://formspree.io/f/' + FORMSPREE_SUBSCRIBE_ID, {
          method: 'POST',
          body: JSON.stringify({
            name: name,
            email: email
          }),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        var result = await response.json();

        if (result.ok) {
          form.style.display = 'none';
          var successDiv = subSuccess;
          successDiv.querySelector('h3').textContent = 'Thanks, ' + name + '!';
          successDiv.style.display = 'block';
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } catch (err) {
        alert('Something went wrong. Please email us directly at arrowlocalpower@gmail.com');
      } finally {
        subBtn.disabled = false;
        subBtn.textContent = 'Start Free Month →';
      }
    });
  }
})();
