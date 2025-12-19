/* sidebar.js — sidebar toggle + auto-close */
(function(){
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('closeBtn');
  const backdrop = document.getElementById('backdrop');
  const firstLink = sidebar.querySelector('nav a');

  function open() {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
    menuBtn.setAttribute('aria-expanded','true');
    sidebar.setAttribute('aria-hidden','false');
    firstLink && firstLink.focus();
  }
  function close() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
    menuBtn.setAttribute('aria-expanded','false');
    sidebar.setAttribute('aria-hidden','true');
    menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  // Auto-close sidebar when selecting a navigation link
  const sidebarLinks = sidebar.querySelectorAll('nav a');
  sidebarLinks.forEach(link => link.addEventListener('click', () => {
    // close after following link
    close();
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}());