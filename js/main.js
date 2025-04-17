//DARK AND LIGHT MODE
const themeToggle = document.getElementById('theme-toggle');

//verificar se há preferência guardada no localStorage para o tema
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.checked = true;
} else {
  document.body.classList.add('light-mode');
}

//Listen if the toggle changed
themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }
});

// Header scroll behavior
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');

  // Adiciona classe 'scrolled' ao header quando o usuário rola a página
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Verifica a posição inicial da página
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  }
});

// Menu item highlighting based on scroll position
document.addEventListener('DOMContentLoaded', () => {
  // Get all sections
  const sections = document.querySelectorAll('section[id]');
  let isScrolling = false;

  // Debounce function to limit how often the scroll handler fires
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Function to update active menu item
  function updateActiveMenuItem() {
    if (isScrolling) return;

    // Get current scroll position with a small offset
    const scrollPosition = window.scrollY + 100;

    // Find the current section
    let currentSection = null;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = sectionId;
      }
    });

    // Update menu items
    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
      // Não remover a classe active dos links de idioma
      if (!link.closest('.lang-switch')) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const sectionId = href.substring(1);
          if (sectionId === currentSection) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      }
    });
  }

  // Create debounced version of updateActiveMenuItem
  const debouncedUpdate = debounce(updateActiveMenuItem, 100);

  // Update on scroll
  window.addEventListener('scroll', () => {
    isScrolling = true;
    debouncedUpdate();
    setTimeout(() => {
      isScrolling = false;
    }, 150);
  });

  // Update on page load
  updateActiveMenuItem();

  // Gerenciar os links de idioma
  const langLinks = document.querySelectorAll('.lang-switch .nav-link');

  langLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Remover a classe active de todos os links de idioma
      langLinks.forEach((l) => l.classList.remove('active'));

      // Adicionar a classe active ao link clicado
      link.classList.add('active');

      // Aqui você pode adicionar a lógica para mudar o idioma
      const lang = link.getAttribute('data-lang');
      console.log(`Mudando para o idioma: ${lang}`);

      // Salvar a preferência de idioma no localStorage
      localStorage.setItem('language', lang);
    });
  });

  // Verificar se há uma preferência de idioma salva
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    const langLink = document.querySelector(
      `.lang-switch .nav-link[data-lang="${savedLanguage}"]`
    );
    if (langLink) {
      langLink.classList.add('active');
    }
  }
});
