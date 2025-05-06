// Traduções - Idiomas
/* Variável global para armazenar as traduções */
let translations = {};

// Função para carregar as traduções
async function loadTranslations(lang) {
  try {
    console.log(`Carregando traduções para o idioma: ${lang}`);
    // Caminho para os arquivos JSON
    const response = await fetch(
      `./translations/${lang}.json?cacheBust=${Date.now()}`
    );
    if (!response.ok) {
      throw new Error(
        `Erro ao carregar o arquivo de tradução: ${response.status}`
      );
    }
    const data = await response.json();
    translations[lang] = data; // Armazena as traduções no objeto global
    console.log(`Traduções carregadas para o idioma: ${lang}`, data);
    return true;
  } catch (error) {
    console.error(
      `Erro ao carregar as traduções para o idioma ${lang}:`,
      error
    );
    return false;
  }
}

// Função para aplicar as traduções
async function applyTranslations(lang) {
  if (!translations[lang]) {
    const loaded = await loadTranslations(lang);
    if (!loaded) {
      console.error(`Falha ao aplicar traduções para o idioma: ${lang}`);
      return;
    }
  }

  // Atualizar o conteúdo do intro-pre
  const introPre = document.getElementById('intro-pre');
  //console.log(introPre.innerHTML);  Verifica o conteúdo antes e depois da tradução
  if (introPre) {
    introPre.innerHTML = translations[lang].introText || '';
  }

  // Atualizar todos os elementos com data-translate
  document.querySelectorAll('[data-translate]').forEach((element) => {
    const key = element.getAttribute('data-translate');
    if (key && translations[lang][key]) {
      console.log(
        `Traduzindo elemento: ${key} para ${translations[lang][key]}`
      );
      element.textContent = translations[lang][key];
    } else {
      console.warn(`Chave de tradução não encontrada: ${key}`);
    }
  });
}

// Função para atualizar o texto da página
async function updatePageLanguage(lang) {
  console.log(`Atualizando idioma para: ${lang}`);
  await applyTranslations(lang);
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
      } else {
        link.classList.remove('active');
      }
    });

  // Carrega as traduções iniciais
  await applyTranslations(savedLanguage);

  // Adiciona os event listeners para os botões de idioma
  document
    .querySelectorAll('.navbar-nav .nav-link[data-lang]')
    .forEach((link) => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const lang = e.target.getAttribute('data-lang');
        if (lang) {
          localStorage.setItem('language', lang);

          // Atualiza o destaque do idioma ativo
          document
            .querySelectorAll('.navbar-nav .nav-link[data-lang]')
            .forEach((l) => {
              l.classList.toggle(
                'active',
                l.getAttribute('data-lang') === lang
              );
            });

          // Atualiza o idioma da página
          await updatePageLanguage(lang);
        }
      });
    });
}

// Inicia o sistema de idiomas quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeLanguage);
