document.addEventListener("DOMContentLoaded", function() {
  
  /* =========================
     1) PRODUCT SLIDER (Slick)
  ========================== */
  if ($('.product-slider').length) {
    $('.product-slider').slick({
      dots: true,
      infinite: true,
      speed: 500,
      fade: true,
      cssEase: 'linear',
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false, // Clean look
      customPaging : function(slider, i) {
        return '<button type="button"></button>';
      }
    });
  }

  /* =========================
     1.5) 3D PARALLAX EFFECT
  ========================== */
  const heroSection = document.querySelector('.product-hero');
  const productVisual = document.querySelector('.product-visual');

  if (heroSection && productVisual) {
    heroSection.addEventListener('mousemove', (e) => {
      const { offsetWidth: width, offsetHeight: height } = heroSection;
      const { clientX: x, clientY: y } = e;

      // Calculate rotation based on mouse position (max +/- 10 degrees)
      const xRotation = ((y / height) - 0.5) * -20; // Invert Y for natural tilt
      const yRotation = ((x / width) - 0.5) * 20;

      // Apply transform
      productVisual.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    });

    // Reset on mouse leave
    heroSection.addEventListener('mouseleave', () => {
      productVisual.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }

  /* =========================
     2) TABS LOGIC
  ========================== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked button
      btn.classList.add('active');

      // Show corresponding content
      const tabId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  /* =========================
     3) FORM SUBMISSION HANDLING (Optional enhancement)
  ========================== */
  const contactForm = document.querySelector('form[action*="formsubmit.co"]');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // You can add validation or loading state here
      const btn = this.querySelector('.btn-submit');
      if(btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.style.opacity = '0.8';
      }
    });
  }

});
