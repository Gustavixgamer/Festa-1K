const { neon } = require('@neondatabase/serverless');

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED
  );
}

function paraCsv(valor) {
  const texto = valor === null || valor === undefined ? '' : String(valor);
  return '"' + texto.replace(/"/g, '""') + '"';
}

module.exports = async (req, res) => {
  const chaveEsperada = process.env.ADMIN_KEY;
  const chaveRecebida = req.query ? req.query.key : undefined;

  if (!chaveEsperada) {
    res.status(500).send('Defina a variável ADMIN_KEY nas configurações do projeto no Vercel para poder exportar a lista.');
    return;
  }

  if (chaveRecebida !== chaveEsperada) {
    res.status(401).send('Não autorizado.');
    return;
  }

  const connectionString = getConnectionString();
  if (!connectionString) {
    res.status(500).send('Banco de dados não configurado.');
    return;
  }

  try {
    const sql = neon(connectionString);
    const linhas = await sql`
      SELECT nome, whatsapp, instagram, criado_em
      FROM inscricoes
      ORDER BY criado_em ASC
    `;

    let csv = 'Nome,WhatsApp,Instagram,Confirmado em\n';
    for (const linha of linhas) {
      csv += [
        paraCsv(linha.nome),
        paraCsv(linha.whatsapp),
        paraCsv(linha.instagram),
        paraCsv(linha.criado_em)
      ].join(',') + '\n';
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="inscricoes-geracao-eucaristia.csv"');
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao gerar o arquivo.');
  }
};
