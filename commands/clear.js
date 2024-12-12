const Logger = require('../utils/logger'); // Supondo que o logger esteja no diretório acima

module.exports = {
  name: 'clear',
  description: 'Limpa uma quantidade específica de mensagens.',
  async execute(message, args) {
    // Verifica se o usuário tem permissão de administrador
    if (!message.member.permissions.has('MODERATOR_ROLE_ID')) {
      Logger.warn('Tentativa de limpar mensagens sem permissão de administrador', { user: message.author.tag });
      return message.reply('Você não tem permissão para limpar mensagens.');
    }

    const amount = parseInt(args[0]);

    // Verifica se o número é válido
    if (isNaN(amount) || amount < 1 || amount > 100) {
      Logger.warn('Tentativa de limpar com número inválido', { user: message.author.tag, amount: args[0] });
      return message.reply("Especifique um número entre 1 e 100.");
    }

    try {
      // Pega mensagens, incluindo uma extra para contar a mensagem do comando
      let messages = await message.channel.messages.fetch({ limit: amount + 1 });
      messages = messages.filter(msg => msg.deletable); // Filtra mensagens deletáveis

      // Apaga as mensagens
      await message.channel.bulkDelete(messages, true);
      const deletedMessagesCount = messages.size - 1; // Ajusta a contagem

      // Log de sucesso na exclusão
      Logger.info('Mensagens limpas com sucesso', {
        user: message.author.tag,
        amountRequested: amount,
        amountDeleted: deletedMessagesCount
      });

      // Envia confirmação e exclui após 5 segundos
      const confirmationMessage = await message.channel.send(`Limpou ${deletedMessagesCount} mensagens.`);
      setTimeout(() => {
        confirmationMessage.delete();
      }, 5000);
    } catch (error) {
      Logger.error('Erro ao limpar mensagens', { error: error.message, user: message.author.tag });
      message.reply('Houve um erro ao tentar limpar as mensagens.');
    }
  },
};
