// Utilitário para buscar elementos com segurança
function getElement(selector) {
  // Retorna o primeiro elemento que corresponde ao seletor CSS fornecido
  return document.querySelector(selector);
}

// Função para alternar o tema (claro/escuro)
function toggleTheme(isDarkMode) {
  // Adiciona ou remove a classe 'dark-mode' com base no valor de isDarkMode
  document.body.classList.toggle('dark-mode', isDarkMode);
  // Adiciona ou remove a classe 'light-mode' com base no valor de isDarkMode
  document.body.classList.toggle('light-mode', !isDarkMode);
  // Salva o tema atual no localStorage para persistência
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Configurar o tema inicial com base no localStorage
function initializeTheme() {
  // Verifica se o tema salvo no localStorage é 'dark'
  const savedTheme = localStorage.getItem('theme') === 'dark';
  // Aplica o tema salvo
  toggleTheme(savedTheme);
}

// Gerenciar o botão de alternância de tema
function setupThemeToggle() {
  // Obtém o elemento do botão de alternância de tema
  const themeToggle = getElement('#theme-toggle');
  if (!themeToggle) return; // Sai da função se o botão não existir

  // Define o estado inicial do botão com base na classe do body
  themeToggle.checked = document.body.classList.contains('dark-mode');
  // Adiciona um evento para alternar o tema ao mudar o estado do botão
  themeToggle.addEventListener('change', () => {
    toggleTheme(themeToggle.checked);
  });
}

// Atualizar o estado ativo do menu com base na rolagem
function updateActiveMenuItem() {
  // Seleciona todas as seções que possuem um ID
  const sections = document.querySelectorAll('section[id]');
  // Calcula a posição atual de rolagem com um ajuste de 100px
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    // Obtém a posição superior e a altura da seção
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    // Seleciona o link correspondente no menu de navegação
    const link = getElement(`.navbar-nav .nav-link[href="#${sectionId}"]`);

    // Adiciona ou remove a classe 'active' com base na posição de rolagem
    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      link?.classList.add('active');
    } else {
      link?.classList.remove('active');
    }
  });
}

// Configurar o comportamento do menu com base na rolagem
function setupMenuHighlighting() {
  // Adiciona um evento de rolagem com debounce para melhorar o desempenho
  window.addEventListener('scroll', debounce(updateActiveMenuItem, 100));
  // Atualiza o estado ativo do menu ao carregar a página
  updateActiveMenuItem();
}

// Função debounce para limitar a frequência de execução
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    // Cancela o timeout anterior
    clearTimeout(timeout);
    // Define um novo timeout para executar a função após o tempo especificado
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Configurar o botão "voltar ao topo"
function setupScrollToTopButton() {
  // Obtém o botão "voltar ao topo"
  const myButton = getElement('#myBtn');
  if (!myButton) return; // Sai da função se o botão não existir

  let lastScrollPosition = 0;

  // Adiciona um evento de rolagem para exibir ou ocultar o botão
  window.addEventListener('scroll', () => {
    const currentScrollPosition = window.scrollY;
    // Exibe o botão se a rolagem for para cima e estiver além de 20px
    myButton.style.display =
      currentScrollPosition < lastScrollPosition && currentScrollPosition > 20
        ? 'block'
        : 'none';
    lastScrollPosition = currentScrollPosition;
  });

  // Adiciona um evento de clique para rolar suavemente até o topo
  myButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Configurar o texto formatado no <pre>
function setupIntroText() {
  // Obtém o elemento <pre> com o ID 'intro-pre'
  const introPre = getElement('#intro-pre');
  const lang = localStorage.getItem('language') || 'en'; // Define o idioma padrão como 'en'
  if (introPre) {
    const rawContent = translations[lang]?.introText || ''; 
    console.log(
      'Conteúdo carregado para introText:',
      rawContent
    );
    introPre.innerHTML = safeContent;
  }
}

/* Configurar a lógica de idiomas*/
function setupLanguageSwitch() {
  const langLinks = document.querySelectorAll('.lang-switch .nav-link');
  const savedLanguage = localStorage.getItem('language') || 'en';

  console.log(`Idioma salvo no localStorage: ${savedLanguage}`);
  updatePageLanguage(savedLanguage);

  langLinks.forEach((link) => {
    const lang = link.getAttribute('data-lang');
    link.classList.toggle('active', lang === savedLanguage);

    link.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(`Alterando idioma para: ${lang}`);
      localStorage.setItem('language', lang); // Salva o idioma no localStorage
      console.log(
        `Idioma atualizado no localStorage: ${localStorage.getItem('language')}`
      );
      langLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      updatePageLanguage(lang); // Atualiza o idioma
    });
  });
}

/* Função para aplicar traduções*/
async function applyTranslations(lang) {
  console.log(`Aplicando traduções para o idioma: ${lang}`);

  // Verifica se as traduções foram carregadas
  if (!translations[lang]) {
    console.warn(
      `Traduções para o idioma ${lang} não foram carregadas. Tentando carregar...`
    );
    const loaded = await loadTranslations(lang); // Tenta carregar as traduções
    if (!loaded) {
      console.error(`Falha ao carregar as traduções para o idioma: ${lang}`);
      return;
    }
  }

  // Atualiza o conteúdo do elemento <pre> com base no idioma selecionado
const introPre = document.getElementById('intro-pre');
if (introPre) {
  const safeIntro = DOMPurify.sanitize(translations[lang]?.introText || '');
  introPre.innerHTML = safeIntro;
}

// Atualiza todos os elementos com data-translate
document.querySelectorAll('[data-translate]').forEach((element) => {
  const key = element.getAttribute('data-translate');
  if (key && translations[lang][key]) {
    const safeTranslation = DOMPurify.sanitize(translations[lang][key]);
    element.innerHTML = safeTranslation;
    console.log(`Traduzindo elemento: ${key} para ${translations[lang][key]}`);
  } else {
    console.warn(`Chave de tradução não encontrada: ${key}`);
  }
});
}

// Inicializar o Swiper
function initializeSwiper() {
  // Verifica se o elemento Swiper existe antes de inicializar
  const swiperElement = getElement('.mySwiper');
  if (!swiperElement) return;

  // Configura o Swiper com as opções fornecidas
  new Swiper('.mySwiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    initialSlide: 1,
    coverflowEffect: {
      rotate: 30,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}

// Seleciona todas as "bolas" e as seções
const navDots = document.querySelectorAll('.nav-dot');
const sections = document.querySelectorAll('section');

// Adiciona evento de clique para rolar até a seção correspondente
navDots.forEach((dot) => {
  dot.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = dot.getAttribute('data-section');
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });

      // Atualiza manualmente a classe 'active' após o clique
      navDots.forEach((d) => d.classList.remove('active'));
      dot.classList.add('active');
    }
  });
});

// Atualiza a bola ativa com base na seção visível
window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollPosition = window.scrollY + window.innerHeight / 2; // Ajuste para considerar o centro da tela

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute('id');
    }
  });

  navDots.forEach((dot) => {
    dot.classList.remove('active');
    if (dot.getAttribute('data-section') === currentSection) {
      dot.classList.add('active');
    }
  });
});

// Função para carregar o header e footer dinamicamente
async function loadHeaderAndFooter() {
  try {
    const [headerRes, footerRes] = await Promise.all([
      fetch('./components/header.html'),
      fetch('./components/footer.html'),
    ]);

    const headerHtml = await headerRes.text();
    const footerHtml = await footerRes.text();

    // 🧼 Sanitiza antes de injetar
    const sanitizedHeader = DOMPurify.sanitize(headerHtml);
    const sanitizedFooter = DOMPurify.sanitize(footerHtml);

    document.getElementById('header').innerHTML = sanitizedHeader;
    document.getElementById('footer').innerHTML = sanitizedFooter;

    var animation = bodymovin.loadAnimation({
      container: document.getElementById('logo-animado'),
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'data.json',
    });

    setupLanguageSwitch();
  } catch (error) {
    console.error('Erro ao carregar o header ou footer:', error);
  }
}

// Inicializar todas as funcionalidades ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  loadHeaderAndFooter(); // Carrega o header e footer dinamicamente
  initializeTheme(); // Configura o tema inicial
  setupThemeToggle(); // Configura o botão de alternância de tema
  setupMenuHighlighting(); // Configura o destaque do menu com base na rolagem
  setupScrollToTopButton(); // Configura o botão "voltar ao topo"
  initializeSwiper(); // Inicializa o Swiper
});
