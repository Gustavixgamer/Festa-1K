(function () {
  const cfg = window.CONFIG || {};

  // ---------- Preenche textos a partir do config.js ----------
  function preencher(id, valor) {
    const el = document.getElementById(id);
    if (el && valor) el.textContent = valor;
  }

  preencher('nome-conta', cfg.nomeConta);
  preencher('rodape-nome', cfg.nomeConta);
  preencher('mensagem-festa', cfg.mensagem);
  preencher('convite-data', cfg.dataTexto);
  preencher('convite-horario', cfg.horarioTexto);
  preencher('convite-local', cfg.local);

  const linkInsta = document.getElementById('rodape-insta');
  if (linkInsta && cfg.instagram) {
    const usuario = cfg.instagram.replace('@', '').trim();
    linkInsta.href = 'https://instagram.com/' + usuario;
    linkInsta.textContent = 'Seguir @' + usuario;
  }

  const linkMapa = document.getElementById('convite-mapa');
  if (linkMapa && cfg.linkMapa) {
    linkMapa.href = cfg.linkMapa;
    linkMapa.style.display = 'block';
  }

  // ---------- Animação do número principal (1.000) ----------
  const numeroEl = document.getElementById('numero-milestone');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function formatarNumero(n) {
    return n.toLocaleString('pt-BR');
  }

  if (numeroEl) {
    const alvo = parseInt(numeroEl.dataset.target || '1000', 10);
    if (prefersReducedMotion) {
      numeroEl.textContent = formatarNumero(alvo);
    } else {
      const duracao = 1400;
      const inicio = performance.now();
      (function passo(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const suavizado = 1 - Math.pow(1 - progresso, 3);
        numeroEl.textContent = formatarNumero(Math.round(alvo * suavizado));
        if (progresso < 1) requestAnimationFrame(passo);
      })(inicio);
    }
  }

  // ---------- Contador de confirmados (vem do banco de dados) ----------
  const contadorEl = document.getElementById('contador-texto');

  function textoContador(n) {
    if (n === 0) return 'Seja a primeira pessoa a confirmar presença! 🙌';
    if (n === 1) return '1 pessoa já confirmou presença 🎉';
    return formatarNumero(n) + ' pessoas já confirmaram presença 🎉';
  }

  async function carregarContador() {
    if (!contadorEl) return;
    try {
      const resp = await fetch('/api/rsvp');
      const dados = await resp.json();
      contadorEl.textContent = textoContador(dados.count || 0);
    } catch (err) {
      contadorEl.textContent = '';
    }
  }
  carregarContador();

  // ---------- Envio do formulário ----------
  const form = document.getElementById('form-rsvp');
  const statusEl = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', async function (evento) {
      evento.preventDefault();

      const dados = {
        nome: form.nome.value.trim(),
        whatsapp: form.whatsapp.value.trim(),
        instagram: form.instagram.value.trim()
      };

      if (!dados.nome || !dados.whatsapp) {
        statusEl.dataset.tipo = 'erro';
        statusEl.textContent = 'Preencha nome e WhatsApp para confirmar.';
        return;
      }

      const botao = form.querySelector('button[type="submit"]');
      botao.disabled = true;
      statusEl.dataset.tipo = '';
      statusEl.textContent = 'Enviando…';

      try {
        const resp = await fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });

        if (!resp.ok) {
          const erro = await resp.json().catch(function () { return {}; });
          throw new Error(erro.error || 'Falha ao confirmar.');
        }

        const resultado = await resp.json();

        form.hidden = true;
        statusEl.dataset.tipo = 'sucesso';
        statusEl.textContent = 'Presença confirmada! Nos vemos na festa 🎉';

        if (contadorEl && typeof resultado.count === 'number') {
          contadorEl.textContent = textoContador(resultado.count);
        }
      } catch (err) {
        statusEl.dataset.tipo = 'erro';
        statusEl.textContent = 'Não conseguimos confirmar agora. Tente novamente em instantes.';
        botao.disabled = false;
      }
    });
  }
})();
