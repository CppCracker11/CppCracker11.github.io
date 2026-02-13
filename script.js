// =========================================================
// 1. DUAL-PANE NAVIGATION LOGIC (MASTER-DETAIL)
// =========================================================
const navItems = document.querySelectorAll('.nav-item');
const paneScreens = document.querySelectorAll('.pane-screen');
const contentPane = document.getElementById('content-pane');
const emptyState = document.getElementById('empty-state');
const backButtons = document.querySelectorAll('.mobile-back-btn');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // 1. Manage Active States in the Left Sidebar
        navItems.forEach(nav => nav.classList.remove('active-nav'));
        item.classList.add('active-nav');

        // 2. Hide all screens in the Right Pane
        paneScreens.forEach(screen => screen.classList.remove('active'));

        // 3. Find and Show the Target Screen
        const targetId = item.getAttribute('data-target');
        const targetScreen = document.getElementById(targetId);

        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.scrollTop = 0; // Reset scroll to top
        }

        // 4. ANIMATION MAGIC: Tell the pane it has a selection
        // This triggers the CSS to shrink the clock and move it to the corner
        contentPane.classList.add('has-selection');

        // 5. Mobile Logic: Slide the Right Pane over the screen
        if (window.innerWidth < 768) {
            contentPane.classList.add('mobile-open');
        }
    });
});

// =========================================================
// 2. MOBILE BACK BUTTON LOGIC (<)
// =========================================================
backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Slide the Right Pane away
        contentPane.classList.remove('mobile-open');

        // Optional: clear the active state so the menu looks fresh
        setTimeout(() => {
            navItems.forEach(nav => nav.classList.remove('active-nav'));
            paneScreens.forEach(screen => screen.classList.remove('active'));
            emptyState.classList.add('active');

            // Bring the big clock back to the center when returning home
            contentPane.classList.remove('has-selection');
        }, 350); // Wait for the slide-out animation to finish
    });
});

// =========================================================
// 3. DYNAMIC SCROLLING HEADER (LEFT PANE)
// =========================================================
const sidebarContent = document.querySelector('.sidebar-content');
const mainHeader = document.getElementById('main-header');

const scrollTarget = window.innerWidth < 768 ? document.getElementById('sidebar') : sidebarContent;

if (scrollTarget && mainHeader) {
    scrollTarget.addEventListener('scroll', () => {
        if (scrollTarget.scrollTop > 30) {
            mainHeader.classList.add('is-scrolled');
        } else {
            mainHeader.classList.remove('is-scrolled');
        }
    });
}

// =========================================================
// =========================================================
// 4. SMART ACCORDION LOGIC (EXCLUSIVE DROPDOWNS)
// =========================================================
function toggleAccordion(buttonElement) {
    // 1. Check if the button we just clicked is already open
    const isCurrentlyActive = buttonElement.classList.contains("active");

    // 2. Find the current screen/pane we are in
    const parentPane = buttonElement.closest('.pane-content');

    // 3. Find ALL open accordions in this specific pane and close them
    if (parentPane) {
        const activeHeaders = parentPane.querySelectorAll('.accordion-header.active');
        activeHeaders.forEach(header => {
            header.classList.remove('active');
            header.nextElementSibling.style.maxHeight = null;
        });
    }

    // 4. If the button we clicked wasn't open, open it now!
    // (If it was already open, step 3 just closed it, which is the perfect toggle behavior)
    if (!isCurrentlyActive) {
        buttonElement.classList.add("active");
        const content = buttonElement.nextElementSibling;
        content.style.maxHeight = content.scrollHeight + 20 + "px";
    }
}

// =========================================================
// 5. THEME TOGGLER (TRUE OLED DARK / LIGHT)
// =========================================================
const toggleBtn = document.getElementById('theme-toggle-btn');
const themeStatusText = document.getElementById('theme-status');
const body = document.body;

const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeText(savedTheme);

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        let currentTheme = body.getAttribute('data-theme');
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeText(newTheme);
    });
}

function updateThemeText(theme) {
    if (themeStatusText) {
        themeStatusText.innerText = theme.charAt(0).toUpperCase() + theme.slice(1);
    }
}

// =========================================================
// 6. SAMSUNG CLOCK & GREETING ENGINE
// =========================================================
function updateClockAndGreeting() {
    const timeElement = document.getElementById('clock-time');
    const dateElement = document.getElementById('clock-date');
    const greetingElement = document.getElementById('greeting-text');

    const now = new Date();

    // 1. Calculate Time
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // 2. Calculate Greeting based on the hour
    // 2. Calculate Greeting based on the hour
    let greeting;
    if (hours >= 5 && hours < 12) {
        greeting = 'Good morning,';
    } else if (hours >= 12 && hours < 18) {
        greeting = 'Good afternoon,';
    } else if (hours >= 18 && hours <= 23) {
        greeting = 'Good evening,';
    } else {
        // This catches 12:00 AM to 4:59 AM
        greeting = 'Up late coding,';
    }

    // 3. Format the numbers (12-hour clock)
    hours = hours % 12;
    hours = hours ? hours : 12; // '0' becomes '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    if(timeElement) timeElement.innerText = `${hours}:${minutes}`;

    // 4. Format Date (e.g., Fri, February 13)
    const options = { weekday: 'short', month: 'long', day: 'numeric' };
    if(dateElement) dateElement.innerText = now.toLocaleDateString('en-US', options);

    // 5. Update Greeting (Only update if it changed)
    if(greetingElement && greetingElement.innerText !== greeting) {
        greetingElement.innerText = greeting;
    }
}

// Start the clock instantly, then update every second
updateClockAndGreeting();
setInterval(updateClockAndGreeting, 1000);