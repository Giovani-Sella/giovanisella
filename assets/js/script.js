// EmailOctopus — preencha após criar a conta
const EO_API_KEY = 'SUA_API_KEY_AQUI';
const EO_LIST_ID = 'SEU_LIST_ID_AQUI';

/* ── Newsletter ───────────────────────────────────────────── */
const form = document.querySelector('.newsletter__form');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const input = form.querySelector('.newsletter__input');
    const btn   = form.querySelector('.newsletter__btn');
    const msg   = form.closest('.newsletter__inner').querySelector('.newsletter__msg');
    const email = input.value.trim();

    if (!email) return;

    btn.disabled = true;
    btn.textContent = 'Enviando…';
    msg.textContent = '';
    msg.className = 'newsletter__msg';

    try {
      const res = await fetch(
        `https://emailoctopus.com/api/1.6/lists/${EO_LIST_ID}/contacts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: EO_API_KEY,
            email_address: email,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        msg.textContent = 'Inscrito! Você receberá meus próximos textos.';
        msg.classList.add('newsletter__msg--ok');
        input.value = '';
      } else {
        const codigo = data?.error?.code;
        if (codigo === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
          msg.textContent = 'Este e-mail já está inscrito.';
          msg.classList.add('newsletter__msg--ok');
        } else {
          throw new Error(data?.error?.message || 'Erro desconhecido');
        }
      }
    } catch (err) {
      msg.textContent = 'Erro ao inscrever. Tente novamente.';
      msg.classList.add('newsletter__msg--err');
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Inscrever';
    }
  });
}
