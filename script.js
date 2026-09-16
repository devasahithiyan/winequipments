$(document).ready(function () {

  // Loading Screen
  function hideLoader() {
    $('#loadingScreen').addClass('hidden');
    setTimeout(function () {
      $('#loadingScreen').remove();
    }, 500);
  }

  $(window).on('load', hideLoader);
  // Fail-safe: Force remove loader after 3 seconds
  setTimeout(hideLoader, 3000);

  // --- Inject Floating Widgets (WhatsApp & Mobile Bar & Quote Button) ---
  // Floating Quote Button (Desktop - Hidden initially)
  if ($('.floating-quote-btn').length === 0) {
    $('body').append(`
      <button class="floating-quote-btn" onclick="openContextualQuote()">
        <i class="fas fa-file-invoice-dollar"></i> Get a Quote
      </button>
    `);
  }

  // Floating WhatsApp Button (Desktop)
  if ($('.floating-whatsapp').length === 0) {
    $('body').append(`
      <a href="https://wa.me/919597228969?text=Hi%2C%20I%27m%20interested%20in%20your%20products." class="floating-whatsapp" target="_blank">
        <i class="fab fa-whatsapp"></i>
      </a>
    `);
  }

  // Sticky Mobile Bar
  if ($('.sticky-mobile-bar').length === 0) {
    $('body').append(`
      <div class="sticky-mobile-bar">
        <button onclick="openContextualQuote()" class="sticky-btn quote">
          <i class="fas fa-file-invoice"></i> Get Quote
        </button>
        <a href="tel:+919597228969" class="sticky-btn call">
          <i class="fas fa-phone-alt"></i> Call Now
        </a>
        <a href="https://wa.me/919597228969?text=Hi%2C%20I%27m%20interested%20in%20your%20products." class="sticky-btn whatsapp" target="_blank">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
      </div>
    `);
  }

  // Scroll Logic with Throttling
  let scrolling = false;
  $(window).scroll(function () {
    if (!scrolling) {
      window.requestAnimationFrame(function () {
        handleScrollLogic();
        scrolling = false;
      });
      scrolling = true;
    }
  });

  function handleScrollLogic() {
    const scrollTop = $(window).scrollTop();
    const windowHeight = window.innerHeight;

    // --- Hero Banner Zoom-Out Parallax ---
    // Start at 1.2, zoom out to 1.0 as we scroll down to 600px
    const zoomStart = 1.2;
    const zoomEnd = 1.0;
    const maxScroll = 600; // Pixel height to finish zoom

    let scale = zoomStart - ((scrollTop / maxScroll) * (zoomStart - zoomEnd));
    if (scale < zoomEnd) scale = zoomEnd; // Clamp at 1.0

    $('.hero-banner-img').css('transform', `scale(${scale})`);

    // Floating Quote Button Visibility
    if (scrollTop > 600) {
      $('.floating-quote-btn').addClass('visible');
    } else {
      $('.floating-quote-btn').removeClass('visible');
    }

    // Scroll Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    $(".scroll-progress-bar").css("width", scrolled + "%");

    // Counter Animation
    const $statsSection = $('.about-stats');
    if ($statsSection.length && !$statsSection.hasClass('started')) {
      const oTop = $statsSection.offset().top - window.innerHeight;
      if (scrollTop > oTop) {
        $statsSection.addClass('started');
        startCounterAnimation();
      }
    }
  }

  // Counter Animation Logic
  function startCounterAnimation() {
    $('.counter').each(function () {
      var $this = $(this),
        countTo = $this.attr('data-target');

      $({ countNum: 0 }).animate({
        countNum: countTo
      },
        {
          duration: 2000,
          easing: 'swing',
          step: function () {
            $this.text(Math.floor(this.countNum) + '+');
          },
          complete: function () {
            $this.text(this.countNum + '+');
          }
        }
      );
    });
  }

  // Domestic Clients Carousel (Ticker)
  $('.domestic-carousel').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 3000,
    cssEase: 'linear',
    arrows: false,
    dots: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  });

  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });

  // Blog Filtering Logic
  function handleBlogFiltering() {
    // Only run on blog.html
    if (window.location.pathname.indexOf('blog.html') === -1) return;

    setTimeout(function () { // Defer to ensure DOM is stable
      const hash = window.location.hash;
      const $cards = $('.blog-card');
      const $heroTitle = $('.blog-hero h1');
      const $heroDesc = $('.blog-hero p');

      // Reset visibility and titles
      $cards.fadeIn(300);

      // Explicitly check for "All Posts" or empty hash
      if (!hash || hash === '#' || hash === '#all') {
        $heroTitle.text('Industry Insights & Resources');
        $heroDesc.text('Expert knowledge on compressed air systems, cooling solutions, and industrial maintenance for Tamil Nadu\'s manufacturing sector.');
        return;
      }

      let filterLabel = '';

      // Scroll to grid slightly for better UX
      if (!window.isInitialLoad) {
        $('html, body').animate({
          scrollTop: $('.blog-grid-section').offset().top - 120
        }, 800);
      }
      window.isInitialLoad = false;

      if (hash === '#maintenance') {
        filterLabel = 'Maintenance Guides';
        $cards.each(function () {
          const cat = $(this).find('.blog-category').text().trim();
          if (cat !== 'Maintenance' && cat !== 'Local Service') {
            $(this).hide();
          }
        });
      }
      else if (hash === '#applications') {
        filterLabel = 'Industry Applications';
        $cards.each(function () {
          const cat = $(this).find('.blog-category').text().trim();
          if (cat !== 'Applications') {
            $(this).hide();
          }
        });
      }
      else if (hash === '#technical-guides') {
        filterLabel = 'Technical Guides';
        const technicalCats = ['Educational', 'Benefits', 'Comparison', 'Selection Guide', 'Troubleshooting', 'Pricing', 'ROI'];
        $cards.each(function () {
          const cat = $(this).find('.blog-category').text().trim();
          if (!technicalCats.includes(cat)) {
            $(this).hide();
          }
        });
      }

      if (filterLabel) {
        $heroTitle.text(filterLabel);
        $heroDesc.text('Showing filtered results for ' + filterLabel);
      }
    }, 100);
  }

  // Run on load
  window.isInitialLoad = true;
  handleBlogFiltering();

  // Run on hash change
  $(window).on('hashchange', function () {
    handleBlogFiltering();
  });

  // Re-run AOS to handle layout changes if needed, or just let it exist.
});

/* --- Dynamic Quote Modal Logic --- */

// Product Field Configuration
const productFormConfig = {
  // 1. Refrigerated Air Dryer
  'ref_dryer': {
    title: 'Get Quote: Refrigerated Air Dryer',
    fields: [
      { label: 'Air Compressor HP / kW', name: 'compressor_power', type: 'text', placeholder: 'e.g., 50 HP / 37 kW' },
      { label: 'Air Flow (CFM)', name: 'flow_cfm', type: 'number', placeholder: 'e.g., 200 CFM' },
      { label: 'Operating Pressure', name: 'pressure', type: 'text', placeholder: 'e.g., 7 bar' },
      { label: 'Application', name: 'application', type: 'text', placeholder: 'e.g., Textile, CNC, Painting' }
    ]
  },
  // 2. Cooling Tower
  'cooling_tower': {
    title: 'Get Quote: Cooling Tower',
    fields: [
      { label: 'Water Flow Rate (LPM / m3/hr)', name: 'water_flow', type: 'text', placeholder: 'e.g., 500 LPM' },
      { label: 'Hot Water Inlet Temp (°C)', name: 'inlet_temp', type: 'number', placeholder: 'e.g., 50°C' },
      { label: 'Required Outlet Temp (°C)', name: 'outlet_temp', type: 'number', placeholder: 'e.g., 32°C' },
      { label: 'Type', name: 'tower_type', type: 'select', options: ['Round Bottle Type', 'Square Type'] }
    ]
  },
  // 3. Chiller
  'chiller': {
    title: 'Get Quote: Industrial Chiller',
    fields: [
      { label: 'Cooling Capacity (TR)', name: 'capacity_tr', type: 'number', placeholder: 'e.g., 5 TR' },
      { label: 'Required Water Temp (°C)', name: 'req_temp', type: 'number', placeholder: 'e.g., 10°C' },
      { label: 'Application', name: 'chiller_app', type: 'text', placeholder: 'e.g., Injection Molding, Medical' },
      { label: 'Ambine Temp', name: 'ambient_temp', type: 'text', placeholder: 'Normal / High Ambient' }
    ]
  },
  // 4. Air Receiver
  'air_receiver': {
    title: 'Get Quote: Air Receiver Tank',
    fields: [
      { label: 'Tank Capacity (Liters)', name: 'tank_capacity', type: 'number', placeholder: 'e.g., 500 Liters' },
      { label: 'Working Pressure', name: 'tank_pressure', type: 'text', placeholder: 'e.g., 10 bar' },
      { label: 'Material', name: 'tank_material', type: 'select', options: ['Mild Steel (MS)', 'Stainless Steel (SS)'] },
      { label: 'Orientation', name: 'tank_orientation', type: 'select', options: ['Vertical', 'Horizontal'] }
    ]
  },
  // 5. Default General
  'general': {
    title: 'Get a Quick Quote',
    fields: [
      { label: 'Product of Interest', name: 'product_interest', type: 'text', placeholder: 'Product Name...' },
      { label: 'Your Requirement', name: 'requirement_details', type: 'textarea', placeholder: 'Describe your need...' }
    ]
  }
};

// Helper: Determine Context
function openContextualQuote() {
  const path = window.location.pathname;
  let key = 'selector'; // Default to selector for Home/Generic pages

  if (path.includes('refrigerated_air_dryers')) key = 'ref_dryer';
  else if (path.includes('cooling_towers') || path.includes('rounded')) key = 'cooling_tower';
  else if (path.includes('desiccant')) key = 'ref_dryer';
  else if (path.includes('chiller')) key = 'chiller';
  else if (path.includes('air_receiver')) key = 'air_receiver';

  openQuoteModal(key);
}

// Open Modal Function
function openQuoteModal(productKey) {
  // Create Modal HTML if not exists
  if ($('#quoteModal').length === 0) {
    createModalHTML();
  }

  const $modal = $('#quoteModal');
  const $formContainer = $('#dynamicFormFields');
  const $commonFields = $('#commonFields, .modal-footer'); // Select common fields to toggle visibility
  const $submitBtn = $('#quoteForm button[type="submit"]');

  // Clear previous state
  $formContainer.empty();
  $('#quoteForm').off('submit').on('submit', handleQuoteSubmit); // Reset submit handler
  $commonFields.show(); // Ensure common fields are shown by default
  $submitBtn.show();

  // Mode: Product Selector (Step 1)
  if (productKey === 'selector') {
    $('#modalTitle').text('Select a Product');
    $('#formSubject').val('New Product Enquiry (Pending Selection)');

    // Hide common contact fields for Step 1
    $commonFields.hide();
    $submitBtn.hide();

    let html = `
      <div class="modal-form-group" style="text-align: center; padding: 20px 0;">
        <label style="font-size: 1.1rem; margin-bottom: 15px;">Which product are you interested in?</label>
        <div class="product-selector-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <button type="button" class="selector-btn" onclick="openQuoteModal('ref_dryer')">
            <i class="fas fa-wind"></i> Air Dryers
          </button>
          <button type="button" class="selector-btn" onclick="openQuoteModal('cooling_tower')">
            <i class="fas fa-broadcast-tower"></i> Cooling Towers
          </button>
          <button type="button" class="selector-btn" onclick="openQuoteModal('chiller')">
            <i class="fas fa-snowflake"></i> Chillers
          </button>
          <button type="button" class="selector-btn" onclick="openQuoteModal('air_receiver')">
            <i class="fas fa-box"></i> Air Receivers
          </button>
          <button type="button" class="selector-btn" onclick="openQuoteModal('general')">
            <i class="fas fa-comments"></i> General / Other
          </button>
        </div>
      </div>
    `;
    $formContainer.append(html);

  } else {
    // Mode: Specific Form (Step 2)
    const config = productFormConfig[productKey] || productFormConfig['general'];

    // Set Title
    $('#modalTitle').html(`${config.title} <br><small style="font-size: 0.8rem; font-weight: normal; opacity: 0.8;">Tell us your requirements</small>`);
    $('#formSubject').val(`New Enquiry: ${config.title}`);

    // Generate Fields
    config.fields.forEach(field => {
      let html = `<div class="modal-form-group">
                    <label>${field.label}</label>`;

      if (field.type === 'select') {
        html += `<select name="${field.name}" required>
                   ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                 </select>`;
      } else if (field.type === 'textarea') {
        html += `<textarea name="${field.name}" rows="3" placeholder="${field.placeholder}" required></textarea>`;
      } else {
        html += `<input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" required>`;
      }

      html += `</div>`;
      $formContainer.append(html);
    });

    // Add Back Button if coming from selector (optional logic, simplifed for now)
    if (!$('#backToSelector').length) {
      // logic to added back button could go here, but keeping it simple
    }
  }

  // Show Modal
  $modal.addClass('active');
  $('body').addClass('no-scroll');
}

// Create Modal DOM Structure
function createModalHTML() {
  const modalHTML = `
    <div id="quoteModal" class="quote-modal-overlay">
      <div class="quote-modal-container">
        <div class="quote-modal-header">
          <h3 id="modalTitle">Get a Quote</h3>
          <button class="close-modal-btn" onclick="closeQuoteModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="quote-modal-body">
          <form id="quoteForm" onsubmit="handleQuoteSubmit(event)">
            <input type="hidden" name="_captcha" value="false">
            <input type="hidden" name="_subject" id="formSubject" value="New Product Enquiry">
            <input type="text" name="_honey" style="display:none">
            
            <!-- Dynamic Fields Container -->
            <div id="dynamicFormFields" class="modal-form-grid"></div>

            <!-- Common Contact Fields (Always present) -->
            <div id="commonFields">
              <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
              <h4 style="margin-bottom: 15px; font-size: 1.1rem; color: var(--primary);">Contact Details</h4>
              
              <div class="modal-form-grid">
                <div class="modal-form-group">
                  <label>Name</label>
                  <input type="text" name="name" placeholder="Your Name" required>
                </div>
                <div class="modal-form-group">
                  <label>Company Name</label>
                  <input type="text" name="company" placeholder="Company Name" required>
                </div>
                <div class="modal-form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" placeholder="Mobile Number" required>
                </div>
                <div class="modal-form-group">
                  <label>City</label>
                  <input type="text" name="city" placeholder="Your City" required>
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Enquiry <i class="fas fa-paper-plane"></i></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  $('body').append(modalHTML);

  // Close on outside click
  $('#quoteModal').click(function (e) {
    if (e.target === this) {
      closeQuoteModal();
    }
  });
}

function closeQuoteModal() {
  $('#quoteModal').removeClass('active');
  $('body').removeClass('no-scroll');
}

function handleQuoteSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;

  // Loading State
  btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  const formData = new FormData(form);

  fetch('https://formsubmit.co/ajax/devasahithiyan@gmail.com', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      // Success
      alert("Thank you! Your enquiry has been sent. Our team will contact you shortly.");
      closeQuoteModal();
      form.reset();
    })
    .catch(error => {
      alert("Oops! Something went wrong. Please call us directly.");
      console.error(error);
    })
    .finally(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    });
}

// Home Page Form Submission Handler
function handleHomeFormSubmit() {
  console.log("Home form submission started");

  const form = document.getElementById('generalInquiryForm');
  const thankYouMessage = document.getElementById('homeThankYouMessage');

  if (!form || !thankYouMessage) {
    console.error("Form elements not found!");
    return;
  }

  // Check form validity
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitBtn = form.querySelector('.btn-submit') || form.querySelector('button');
  let originalBtnText = 'Send Message';

  // Loading State
  if (submitBtn) {
    originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
  }

  const formData = new FormData(form);

  // Send to FormSubmit.co AJAX endpoint
  fetch('https://formsubmit.co/ajax/devasahithiyan@gmail.com', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      form.reset();
      // Hide form and show thank you message
      form.style.display = 'none';
      thankYouMessage.style.display = 'block';
    })
    .catch(error => {
      console.error("Form submission error:", error);
      alert("Oops! There was a problem submitting your form. Please try again or contact us directly.");

      // Reset button state on error
      if (submitBtn) {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      }
    });
}