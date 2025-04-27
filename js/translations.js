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

// Função para buscar as traduções
async function fetchTranslations(lang) {
  const response = await fetch(`./translations/${lang}.json`);
  return response.json();
}

// Função para aplicar as traduções
async function applyTranslations(lang) {
  const translations = await fetchTranslations(lang);

  // Atualizar o conteúdo do intro-pre
  const introPre = document.getElementById('intro-pre');
  if (introPre) {
    introPre.innerHTML = translations.introText || '';
  }
}

// Função para atualizar o texto da página
async function updatePageLanguage(lang) {
  // Carrega as traduções se ainda não estiverem carregadas
  if (!translations[lang]) {
    await loadTranslations(lang);
  }

  // Destacar o idioma ativo
  document
    .querySelectorAll('.navbar-nav .nav-link[data-lang]')
    .forEach((link) => {
      // Remover a classe active de todos os links de idioma
      link.classList.remove('active');

      // Adicionar a classe active apenas ao idioma selecionado
      if (link.getAttribute('data-lang') === lang) {
        link.classList.add('active');
      }
    });

  // Atualiza os links do menu
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    const key = link.getAttribute('data-translate');
    if (key && translations[lang][key]) {
      link.textContent = translations[lang][key];
    }
  });

  // Atualiza o texto da seção de introdução
  const introPre = document.querySelector(
    '#intro-section .hello .role .world .tagline'
  );
  if (introPre) {
    introPre.textContent = translations[lang].hello;
  }

  // Atualiza o subtítulo
  const subtitle = document.querySelector('#intro-section p');
  if (subtitle) {
    subtitle.textContent = translations[lang].subtitle;
  }

  //Atualiza o theme mode
  const lightMode = document.querySelector(
    '.theme-toggle-wrapper .light-theme'
  );
  if (lightMode) {
    lightMode.textContent = translations[lang].light;
  }
  const darkMode = document.querySelector('.theme-toggle-wrapper .dark-theme');
  if (darkMode) {
    darkMode.textContent = translations[lang].dark;
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

  // Atualiza os itens de educação
  const educationItems = document.querySelectorAll(
    '#education-section ul li[data-translate]'
  );
  educationItems.forEach((item) => {
    const key = item.getAttribute('data-translate');
    if (key && translations[lang][key]) {
      // Preserva as quebras de linha do texto original
      item.innerHTML = translations[lang][key].replace(/\n/g, '<br />');
    }
  });

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

  // Atualiza o título dos projetos
  const myProjectsTitle = document.querySelector('#projects-section h2');
  if (myProjectsTitle) {
    myProjectsTitle.textContent = translations[lang].myProjects;
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
  document.querySelectorAll('footer ul li a').forEach((link) => {
    const key = link.getAttribute('data-translate');
    if (key && translations[lang][key]) {
      link.textContent = translations[lang][key];
    }
  });
  const footerText = document.querySelector('footer p');
  if (footerText) {
    footerText.innerHTML = `2025 ${translations[lang].programmingBy} <a href="">Rafael Matos</a> | ${translations[lang].webDesignBy} <a href="">Viviana Sousa</a>`;
  }
}

// Inicialização
async function initializeLanguage() {
  // Verifica se há uma preferência de idioma salva
  const savedLanguage = localStorage.getItem('language') || 'en';

  // Destaca o idioma padrão/salvo inicialmente
  document
    .querySelectorAll('.navbar-nav .nav-link[data-lang]')
    .forEach((link) => {
      if (link.getAttribute('data-lang') === savedLanguage) {
        link.classList.add('active');
      }
    });

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
