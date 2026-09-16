// Navbar Configuration and Rendering Script

const navConfig = [
    { text: 'Home', href: 'index.html', type: 'link' },
    { text: 'About Us', href: 'about.html', type: 'link' },
    {
        text: 'Products',
        href: 'index.html#products',
        type: 'dropdown',
        items: [
            { text: 'Refrigeration Air Dryers', href: 'products/refrigerated_air_dryers.html' },
            { text: 'Round Cooling Towers', href: 'products/cooling_towers.html' },
            { text: 'Square Cooling Towers', href: 'products/rounded_cooling_towers.html' },
            { text: 'Aftercooler', href: 'products/aftercooler.html' },
            { text: 'Air Receiver', href: 'products/air_receiver.html' },
            { text: 'Coil Cooling', href: 'products/coil_cooling.html' },
            { text: 'Compressed Air Filter', href: 'products/compressed_air_filter.html' },
            { text: 'Desiccant Air Dryer', href: 'products/desiccant_air_dryer.html' },
            { text: 'Chiller', href: 'products/chiller.html' },
            { text: 'Automatic Drain Valve', href: 'products/automatic_drain_valve.html' }
        ]
    },
    {
        text: 'Blog',
        href: 'blog.html',
        type: 'dropdown',
        items: [
            { text: 'All Posts', href: 'blog.html' },
            { text: 'Technical Guides', href: 'blog.html#technical-guides' },
            { text: 'Maintenance', href: 'blog.html#maintenance' },
            { text: 'Applications', href: 'blog.html#applications' }
        ]
    },
    { text: 'Certifications', href: 'certifications.html', type: 'link' },
    { text: 'Installation', href: 'installation.html', type: 'link' },
    { text: 'Contact Us', href: 'contactus.html', type: 'button' }
];

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
});

function renderNavbar() {
    const navbarContainer = document.getElementById('navbar-placeholder');
    if (!navbarContainer) return;

    // Determine current path depth to adjust links
    const path = window.location.pathname;
    const isProductPage = path.includes('/products/');
    const isBlogPage = path.includes('/blog/') && !path.endsWith('blog.html');
    const isLocationPage = path.includes('/locations/');
    const isTamilPage = path.includes('/ta/');

    // Root level prefix
    let prefix = '';
    if (isProductPage || isBlogPage || isLocationPage || isTamilPage) {
        prefix = '../';
    }

    // Build HTML
    let navHtml = `
  <nav class="navbar">
    <div class="container nav-container">
      <div class="nav-brand">
        <a href="${prefix}index.html">
          <img src="${prefix}images/logo.png" alt="Win Equipments Logo">
        </a>
        <div class="cert-badges">
          <img src="${prefix}images/dac.png" alt="DAC" title="DAC Certified">
        </div>
      </div>

      <button class="menu-toggle" aria-label="Toggle Menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>

      <ul class="nav-links">
  `;

    const currentFile = path.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;

    navConfig.forEach(item => {
        let href = item.href;

        // Relative path adjustment
        if (!href.startsWith('http') && !href.startsWith('#')) {
            href = prefix + href;
        }

        // --- Active State Logic ---
        let isActive = false;

        if (item.href === 'index.html') {
            // Home Link: Active if on index.html with no hash, or root
            if ((currentFile === 'index.html' || currentFile === '') && !currentHash) {
                isActive = true;
            }
        }
        else if (item.href.includes('#')) {
            // Anchor Links (About, Services, Products section)
            // If we are on index.html AND the hash matches
            if ((currentFile === 'index.html' || currentFile === '') && currentHash === item.href.substring(item.href.indexOf('#'))) {
                isActive = true;
            }
        }
        else {
            // Standard Pages (Certifications, Contact)
            // Check if current file matches href filename
            const itemFilename = item.href.split('/').pop();
            if (currentFile === itemFilename) {
                isActive = true;
            }
        }

        // Special Parent Active Logic
        if (item.text === 'Blog') {
            if (path.includes('/blog/') || currentFile === 'blog.html') isActive = true;
        }
        if (item.text === 'Products') {
            if (path.includes('/products/')) isActive = true;
            // Also active if hash is #products
            if ((currentFile === 'index.html' || currentFile === '') && currentHash === '#products') {
                isActive = true;
            }
        }

        // Class construction
        let className = isActive ? 'active' : '';
        if (item.type === 'button') className += ' btn-nav';
        // Add ID for ScrollSpy targeting if it's an anchor link
        let linkId = '';
        if (item.href.includes('#')) {
            const hashPart = item.href.substring(item.href.indexOf('#') + 1);
            linkId = ` id="nav-${hashPart}"`;
        }

        if (item.type === 'dropdown') {
            navHtml += `
        <li class="dropdown">
          <a href="${href}" class="${className}"${linkId}>${item.text} <i class="fas fa-chevron-down"></i></a>
          <ul class="dropdown-menu">
      `;
            item.items.forEach(subItem => {
                let subHref = subItem.href;
                if (!subHref.startsWith('http')) subHref = prefix + subHref;
                navHtml += `<li><a href="${subHref}">${subItem.text}</a></li>`;
            });
            navHtml += `</ul></li>`;
        } else {
            navHtml += `<li><a href="${href}" class="${className}"${linkId}>${item.text}</a></li>`;
        }
    });

    navHtml += `
      </ul>
    </div>
  </nav>
  `;

    navbarContainer.innerHTML = navHtml;

    initNavbarInteractions();
}

function initNavbarInteractions() {
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.querySelector('body');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });
    }

    // 2. Mobile Dropdown Toggle
    // Use delegation or direct attach. Direct attach is fine here.
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function (e) {
            // Only toggle on mobile
            if (window.innerWidth <= 992) {
                e.preventDefault(); // Prevent navigation
                this.parentElement.classList.toggle('active');
            }
        });
    });

    // 3. Sticky Navbar & ScrollSpy Logic
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section'); // For ScrollSpy
    const navItems = document.querySelectorAll('.nav-links a');

    function handleScroll() {
        // Sticky
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.padding = '6px 0';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.padding = '8px 0';
        }

        // ScrollSpy (Only on Home Page)
        const path = window.location.pathname;
        const currentFile = path.split('/').pop() || 'index.html';

        if (currentFile === 'index.html' || currentFile === '') {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(li => {
                li.classList.remove('active');
                const href = li.getAttribute('href');

                // Standard Hash Match
                if (href.includes(`#${current}`)) {
                    li.classList.add('active');
                }
                // Special Override for About Us (Active when scrolling #about section)
                else if (current === 'about' && (href === 'about.html' || li.textContent.trim() === 'About Us')) {
                    li.classList.add('active');
                }

                // Parent Dropdown Activation
                if (li.classList.contains('active')) {
                    if (li.parentElement.parentElement.classList.contains('dropdown-menu')) {
                        li.parentElement.parentElement.previousElementSibling.classList.add('active');
                    }
                }
            });

            // Special fallback for top of page -> Home active
            if (window.scrollY < 100) {
                // Remove active from others
                navItems.forEach(a => a.classList.remove('active'));
                // Find Home link
                navItems.forEach(a => {
                    if (a.textContent === 'Home') a.classList.add('active');
                });
            }
        }
    }

    let navScrolling = false;
    window.addEventListener('scroll', () => {
        if (!navScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                navScrolling = false;
            });
            navScrolling = true;
        }
    });
    handleScroll(); // Initial check
}
