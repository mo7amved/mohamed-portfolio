const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = open ? '✕' : '☰';
});
document.querySelectorAll('#nav-links a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('visible'));
document.getElementById('year').textContent = new Date().getFullYear();
// Add your LinkedIn profile URL when you have it.
const linkedinUrl = '';
const linkedinLink = document.getElementById('linkedin-link');
if (linkedinUrl.trim()) linkedinLink.href = linkedinUrl;
else linkedinLink.hidden = true;
