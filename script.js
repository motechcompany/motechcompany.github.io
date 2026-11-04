const continueBtn = document.getElementById('continue-btn');
const splashScreen = document.getElementById('splash-screen');
const mainSite = document.getElementById('main-site');

const homeSection = document.getElementById('home-section');
const servicesSection = document.getElementById('services-section');
const contactSection = document.getElementById('contact-section');
const aboutUsSection = document.getElementById('about-us-section');

const electronicServicesPage = document.getElementById('electronic-services-page');
const electricalInstallationsPage = document.getElementById('electrical-installations-page');
const networkInstallationPage = document.getElementById('network-installation-page');

const navLinks = document.querySelectorAll('.nav-link');
const homeLink = navLinks[0];
const servicesLink = navLinks[1];
const contactLink = navLinks[2];
const aboutUsLink = navLinks[3];

const serviceButtons = document.querySelectorAll('.service-menu-btn');
const electronicServicesBtn = serviceButtons[0];
const electricalInstallationsBtn = serviceButtons[1];
const networkInstallationBtn = serviceButtons[2];

const electronicBackBtn = document.getElementById('electronic-back-btn');
const electricalBackBtn = document.getElementById('electrical-back-btn');
const networkBackBtn = document.getElementById('network-back-btn');

function hideAllSections() {
    homeSection.style.display = 'none';
    servicesSection.style.display = 'none';
    contactSection.style.display = 'none';
    aboutUsSection.style.display = 'none';
    electronicServicesPage.style.display = 'none';
    electricalInstallationsPage.style.display = 'none';
    networkInstallationPage.style.display = 'none';
}

function updateActiveNavbar(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

continueBtn.addEventListener('click', function() {
    splashScreen.style.display = 'none';
    mainSite.style.display = 'block';
});

homeLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    homeSection.style.display = 'block';
    updateActiveNavbar(homeLink);
});

servicesLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    servicesSection.style.display = 'block';
    updateActiveNavbar(servicesLink);
});

contactLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    contactSection.style.display = 'block';
    updateActiveNavbar(contactLink);
});

aboutUsLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideAllSections();
    aboutUsSection.style.display = 'block';
    updateActiveNavbar(aboutUsLink);
});

electronicServicesBtn.addEventListener('click', function() {
    hideAllSections();
    electronicServicesPage.style.display = 'block';
    window.scrollTo(0, 0);
});

electricalInstallationsBtn.addEventListener('click', function() {
    hideAllSections();
    electricalInstallationsPage.style.display = 'block';
    window.scrollTo(0, 0);
});

networkInstallationBtn.addEventListener('click', function() {
    hideAllSections();
    networkInstallationPage.style.display = 'block';
    window.scrollTo(0, 0);
});

electronicBackBtn.addEventListener('click', function() {
    hideAllSections();
    servicesSection.style.display = 'block';
});

electricalBackBtn.addEventListener('click', function() {
    hideAllSections();
    servicesSection.style.display = 'block';
});

networkBackBtn.addEventListener('click', function() {
    hideAllSections();
    servicesSection.style.display = 'block';
});
