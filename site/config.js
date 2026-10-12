/* Daily Legends: configuração do site.
   Único lugar que você precisa editar. Troque o texto entre aspas pelo seu Client ID do Google
   (termina com .apps.googleusercontent.com). Guia: parte 2. */
window.DL_CONFIG = {
  googleClientId: 'COLE_AQUI_O_CLIENT_ID.apps.googleusercontent.com',

  // nomes da pasta e da planilha que o jogo cria no Drive de cada jogador (o agente procura por este nome)
  nomePasta: 'Daily Legends',
  nomePlanilha: 'Daily Legends - Save',

  // true = ao abrir o app com o login vencido (mais de 1 h), renova sozinho em ~1 s.
  // Se no iPhone isso ficar estranho, troque pra false: aí aparece o botão "Reconectar".
  renovarAoAbrir: true
};
