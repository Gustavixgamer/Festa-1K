const { neon } = require('@neondatabase/serverless');

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED
  );
}

async function getSql() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error('Banco de dados não configurado (variável DATABASE_URL ausente).');
  }
  const sql = neon(connectionString);

  // Cria a tabela automaticamente na primeira vez que alguém acessa —
  // ninguém precisa rodar SQL manualmente.
  await sql`
    CREATE TABLE IF NOT EXISTS inscricoes (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      instagram TEXT,
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  return sql;
}

module.exports = async (req, res) => {
  let sql;
  try {
    sql = await getSql();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Banco de dados indisponível. Verifique se a integração Neon foi criada no Vercel.'
    });
    return;
  }

  try {
    if (req.method === 'GET') {
      const linhas = await sql`SELECT COUNT(*)::int AS count FROM inscricoes`;
      res.status(200).json({ count: linhas[0].count });
      return;
    }

    if (req.method === 'POST') {
      const corpo = req.body || {};
      const nome = corpo.nome ? String(corpo.nome).trim() : '';
      const whatsapp = corpo.whatsapp ? String(corpo.whatsapp).trim() : '';
      const instagram = corpo.instagram ? String(corpo.instagram).trim() : null;

      if (!nome || !whatsapp) {
        res.status(400).json({ error: 'Nome e WhatsApp são obrigatórios.' });
        return;
      }

      await sql`
        INSERT INTO inscricoes (nome, whatsapp, instagram)
        VALUES (${nome}, ${whatsapp}, ${instagram})
      `;

      const linhas = await sql`SELECT COUNT(*)::int AS count FROM inscricoes`;
      res.status(200).json({ success: true, count: linhas[0].count });
      return;
    }

    res.status(405).json({ error: 'Método não permitido.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao falar com o banco de dados. Tente novamente.' });
  }
};
