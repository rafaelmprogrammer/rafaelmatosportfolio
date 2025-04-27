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
  if (!introPre) return; // Sai da função se o elemento não existir

  // Define o conteúdo HTML formatado no elemento <pre>
  introPre.innerHTML = `
    <div class="hello-role">
      <span class="hello">HELLO</span>
      <span class="role">I'm a Full Stack Developer</span>
    </div>
    <span class="world">WORLD!</span>
    <span class="tagline">Writing code that creates experiences</span>
  `;
}

// Configurar a lógica de idiomas
function setupLanguageSwitch() {
  // Seleciona todos os links de alternância de idioma
  const langLinks = document.querySelectorAll('.lang-switch .nav-link');
  // Obtém o idioma salvo no localStorage ou define 'en' como padrão
  const savedLanguage = localStorage.getItem('language') || 'en';

  // Aplica a tradução inicial
  applyTranslations(savedLanguage);

  langLinks.forEach((link) => {
    const lang = link.getAttribute('data-lang');
    // Define o link ativo com base no idioma salvo
    link.classList.toggle('active', lang === savedLanguage);

    // Adiciona um evento de clique para alternar o idioma
    link.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('language', lang); // Salva o idioma no localStorage
      langLinks.forEach((l) => l.classList.remove('active')); // Remove a classe 'active' de todos os links
      link.classList.add('active'); // Adiciona a classe 'active' ao link clicado
      applyTranslations(lang); // Aplica a tradução ao clicar
    });
  });
}

// Função para aplicar traduções
function applyTranslations(lang) {
  // Objeto de traduções para diferentes idiomas
  const translations = {
    en: {
      introText:
        "<span class='hello'>[HELLO</span> <span class='role'>I am a Full Stack Developer</span> <span class='world'>WORLD!)</span> <span class='tagline'>Writing code that creates experiences</span>",
    },
    pt: {
      introText:
        "<span class='hello'>[OLÁ</span> <span class='role'>Eu sou um Desenvolvedor Full Stack</span> <span class='world'>MUNDO!)</span> <span class='tagline'>Escrevendo código que cria experiências</span>",
    },
  };

  // Atualiza o conteúdo do elemento <pre> com base no idioma selecionado
  const introPre = document.getElementById('intro-pre');
  if (introPre) {
    introPre.innerHTML = translations[lang]?.introText || '';
  }
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

// Inicializar todas as funcionalidades ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme(); // Configura o tema inicial
  setupThemeToggle(); // Configura o botão de alternância de tema
  setupMenuHighlighting(); // Configura o destaque do menu com base na rolagem
  setupScrollToTopButton(); // Configura o botão "voltar ao topo"
  setupIntroText(); // Configura o texto formatado no <pre>
  setupLanguageSwitch(); // Configura a lógica de alternância de idiomas
  initializeSwiper(); // Inicializa o Swiper
});
