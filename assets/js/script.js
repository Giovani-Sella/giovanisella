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

const lb = document.createElement('div');
lb.className = 'lightbox';
lb.innerHTML = `
  <button class="lightbox__fechar" aria-label="Fechar">&times;</button>
  <button class="lightbox__nav lightbox__nav--prev" aria-label="Imagem anterior">&#8249;</button>
  <img class="lightbox__img" src="" alt="">
  <button class="lightbox__nav lightbox__nav--next" aria-label="Próxima imagem">&#8250;</button>
`;
document.body.appendChild(lb);

let lbImagens = [], lbIndex = 0;

function lbAtualizar() {
  lb.querySelector('.lightbox__img').src = lbImagens[lbIndex].src;
  lb.querySelector('.lightbox__img').alt = lbImagens[lbIndex].alt || '';
  lb.querySelector('.lightbox__nav--prev').style.visibility = lbIndex > 0 ? '' : 'hidden';
  lb.querySelector('.lightbox__nav--next').style.visibility = lbIndex < lbImagens.length - 1 ? '' : 'hidden';
}

lb.addEventListener('click', e => {
  if (e.target === lb) { lb.classList.remove('ativo'); document.body.style.overflow = ''; }
});
lb.querySelector('.lightbox__fechar').addEventListener('click', () => {
  lb.classList.remove('ativo'); document.body.style.overflow = '';
});
lb.querySelector('.lightbox__nav--prev').addEventListener('click', () => {
  if (lbIndex > 0) { lbIndex--; lbAtualizar(); }
});
lb.querySelector('.lightbox__nav--next').addEventListener('click', () => {
  if (lbIndex < lbImagens.length - 1) { lbIndex++; lbAtualizar(); }
});
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('ativo')) return;
  if (e.key === 'Escape') { lb.classList.remove('ativo'); document.body.style.overflow = ''; }
  if (e.key === 'ArrowLeft' && lbIndex > 0) { lbIndex--; lbAtualizar(); }
  if (e.key === 'ArrowRight' && lbIndex < lbImagens.length - 1) { lbIndex++; lbAtualizar(); }
});

document.querySelectorAll('.galeria[data-imagens]').forEach(galeria => {
  let imagens;
  try { imagens = JSON.parse(galeria.dataset.imagens); } catch { return; }
  if (!Array.isArray(imagens) || imagens.length === 0) return;
  const slice = imagens.slice(0, 10);

  galeria.innerHTML = `
    <figure class="galeria__principal">
      <img class="galeria__principal-img" src="${slice[0].src}" alt="${slice[0].alt || ''}" loading="lazy">
      <figcaption class="galeria__legenda">${slice[0].legenda || ''}</figcaption>
    </figure>
    ${slice.length > 1 ? `<div class="galeria__miniaturas">
      ${slice.map((img, i) => `
        <figure class="galeria__thumb${i === 0 ? ' galeria__thumb--ativo' : ''}" data-index="${i}">
          <img src="${img.src}" alt="${img.alt || ''}" loading="lazy">
        </figure>
      `).join('')}
    </div>` : ''}
  `;

  let atual = 0;

  function atualizar(i) {
    atual = i % slice.length;
    const img = galeria.querySelector('.galeria__principal-img');
    const leg = galeria.querySelector('.galeria__legenda');
    img.src = slice[atual].src;
    img.alt = slice[atual].alt || '';
    leg.textContent = slice[atual].legenda || '';
    galeria.querySelectorAll('.galeria__thumb').forEach((t, j) => {
      t.classList.toggle('galeria__thumb--ativo', j === atual);
    });
  }

  // let timer = slice.length > 1 ? setInterval(() => atualizar(atual + 1), 2000) : null;

  galeria.querySelectorAll('.galeria__thumb').forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      // clearInterval(timer);
      atualizar(i);
      // timer = setInterval(() => atualizar(atual + 1), 2000);
    });
  });

  const principalImg = galeria.querySelector('.galeria__principal-img');
  principalImg.style.cursor = 'pointer';
  principalImg.addEventListener('click', () => {
    lbImagens = slice; lbIndex = atual; lbAtualizar();
    lb.classList.add('ativo'); document.body.style.overflow = 'hidden';
  });
});

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
