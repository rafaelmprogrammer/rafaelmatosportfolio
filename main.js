//DARK AND LIGHT MODE
const themeToggle = document.getElementById('theme-toggle');

//verificar se há preferência guardada no localStorage para o tema
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.checked = true;
}

//Listen if the toggle changed
themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
});

//Traduções - Idiomas
// Variável global para armazenar as traduções
let translations = {};

// Função para carregar as traduções
async function loadTranslations(lang) {
  try {
    const response = await fetch(`./translations/${lang}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    translations[lang] = await response.json();
    return translations[lang];
  } catch (error) {
    console.error('Error loading translations:', error);
    return null;
  }
}

// Função para atualizar o texto da página
async function updatePageLanguage(lang) {
  // Carrega as traduções se ainda não estiverem carregadas
  if (!translations[lang]) {
    await loadTranslations(lang);
  }

  // Atualiza os links do menu
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    const key = link.getAttribute('data-translate');
    if (key && translations[lang][key]) {
      link.textContent = translations[lang][key];
    }
  });

  // Atualiza o texto da seção de introdução
  const introPre = document.querySelector('#intro-section pre');
  if (introPre) {
    introPre.textContent = translations[lang].hello;
  }

  // Atualiza o subtítulo
  const subtitle = document.querySelector('#intro-section p');
  if (subtitle) {
    subtitle.textContent = translations[lang].subtitle;
  }

  // Atualiza a seção about
  const aboutTitle = document.querySelector('#about-section h1');
  if (aboutTitle) {
    aboutTitle.textContent = translations[lang].aboutTitle;
  }

  const aboutTexts = document.querySelectorAll('#about-section p');
  if (aboutTexts[0]) aboutTexts[0].textContent = translations[lang].aboutText1;
  if (aboutTexts[1]) aboutTexts[1].textContent = translations[lang].aboutText2;

  // Atualiza os títulos das seções
  const educationTitle = document.querySelector('#education-section h2');
  if (educationTitle) {
    educationTitle.textContent = translations[lang].education;
  }

  const experienceTitle = document.querySelector(
    '#education-section h2.text-end'
  );
  if (experienceTitle) {
    experienceTitle.textContent = translations[lang].experience;
  }

  // Atualiza as seções de linguagens e frameworks
  const languagesTitle = document.querySelector(
    '#curriculum-section h3.text-start'
  );
  if (languagesTitle) {
    languagesTitle.textContent = translations[lang].languages;
  }

  const frameworksTitle = document.querySelector(
    '#curriculum-section h3.text-end'
  );
  if (frameworksTitle) {
    frameworksTitle.textContent = translations[lang].frameworks;
  }

  // Atualiza a seção de contato
  const startProject = document.querySelector('#contact-section p');
  if (startProject) {
    startProject.textContent = translations[lang].startProject;
  }

  const letsDoThis = document.querySelector('#contact-section button');
  if (letsDoThis) {
    letsDoThis.textContent = translations[lang].letsDoThis;
  }

  // Atualiza o footer
  const footerText = document.querySelector('footer p');
  if (footerText) {
    footerText.innerHTML = `2025 ${translations[lang].programmingBy} <a href="">Rafael Matos</a> | ${translations[lang].webDesignBy} <a href="">Viviana Sousa</a>`;
  }
}

// Inicialização
async function initializeLanguage() {
  // Verifica se há uma preferência de idioma salva
  const savedLanguage = localStorage.getItem('language') || 'en';

  // Carrega as traduções iniciais
  await loadTranslations(savedLanguage);

  // Atualiza a página com o idioma salvo
  await updatePageLanguage(savedLanguage);

  // Adiciona os event listeners para os botões de idioma
  document
    .querySelectorAll('.navbar-nav .nav-link[data-lang]')
    .forEach((link) => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const lang = e.target.getAttribute('data-lang');
        localStorage.setItem('language', lang);
        await updatePageLanguage(lang);
      });
    });
}

// Inicia o sistema de idiomas quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeLanguage);
