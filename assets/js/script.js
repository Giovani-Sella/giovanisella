const hero = document.querySelector('section.hero');
if (hero) {
  const path = window.location.pathname;
  const navLinks = [
    { href: '/blog/',        label: 'Blog' },
    { href: '/curriculo/',   label: 'Currículo' },
    { href: '/portfolio/',   label: 'Portfólio' },
    { href: '/sobre.html',   label: 'Sobre' },
  ];
  const nav = navLinks
    .map(({ href, label }) => {
      const ativo = path.startsWith(href) ? ' class="ativo"' : '';
      return `<a href="${href}"${ativo}>${label}</a>`;
    })
    .join('\n          ');
  hero.innerHTML = `
    <div class="hero__inner">
      <div>
        <p class="hero__eyebrow">Site pessoal</p>
        <h1 class="hero__titulo"><a href="/" style="color:inherit;text-decoration:none;">Giovani Sella</a></h1>
        <p class="hero__bio">
          Jornalista em formação pela UFPR, estagiário no Jornal Plural.
          Aqui escrevo de vez em quando sobre o que vejo, produzo e penso. Além disso, fotografo e produzo audiovisual
          pela <a href="https://pererecriativa.com.br" target="_blank" rel="noopener">Pererê Criativa</a>.
        </p>
        <nav class="hero__acoes" aria-label="Navegação rápida">
          ${nav}
        </nav>
      </div>
    </div>
  `;
}

const footer = document.querySelector('footer.footer');
if (footer) {
  footer.innerHTML = `
    <div class="footer__inner">
      <span class="footer__nome">Giovani Sella</span>
      <ul class="footer__links">
        <li><a href="https://www.instagram.com/giovani.sella/" target="_blank" rel="noopener">Instagram</a></li>
        <li><a href="https://wa.me/5543988272639" target="_blank" rel="noopener">WhatsApp</a></li>
        <li><a href="https://www.linkedin.com/in/giovani-pereira-sella-948725197/" target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href="https://github.com/Giovani-Sella" target="_blank" rel="noopener">GitHub</a></li>
        <li><a href="https://substack.com/@giovanisella" target="_blank" rel="noopener">Substack</a></li>
      </ul>
      <p class="footer__copy">© 2026 Giovani Sella · Curitiba, PR</p>
    </div>
  `;
}

function formatarData(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function renderPost(p) {
  return `<a class="post-item" href="${p.url}">
    <time class="post-item__data" datetime="${p.data}">${formatarData(p.data)}</time>
    <div>
      <span class="post-item__cat">${p.categoria}</span>
      <h3 class="post-item__titulo">${p.titulo}</h3>
      <p class="post-item__desc">${p.descricao}</p>
    </div>
  </a>`;
}

const lista = document.querySelector('.posts-lista[data-posts]');
if (lista) {
  const limite = lista.dataset.posts;
  const somenteExclusivo = lista.dataset.exclusivo === 'true';
  fetch('/posts/posts.json')
    .then(r => r.json())
    .then(posts => {
      const filtrados = somenteExclusivo ? posts.filter(p => p.exclusivo) : posts;
      const items = limite === 'all' ? filtrados : filtrados.slice(0, Number(limite));
      lista.innerHTML = items.map(renderPost).join('');
    })
    .catch(() => {
      lista.innerHTML = '<p>Erro ao carregar posts.</p>';
    });
}
