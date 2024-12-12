const Logger = require('../utils/logger'); // Supondo que o logger esteja no diretório acima

module.exports = {
  name: 'kick',
  description: 'Expulsar um membro do servidor.',
  async execute(message, args) {
    // Verifica permissão do usuário
    if (!message.member.permissions.has('MODERATOR_ROLE_ID')) {
      Logger.warn('Tentativa de expulsão sem permissão', { user: message.author.tag });
      return message.reply('Você não tem permissão para expulsar membros.');
    }

    // Verifica se o usuário foi mencionado
    const member = message.mentions.members.first();
    if (!member) {
      Logger.warn('Tentativa de expulsão sem menção de membro', { user: message.author.tag });
      return message.reply('Por favor, mencione um usuário para expulsar.');
    }

    // Verifica se o membro é expulsável
    if (!member.kickable) {
      Logger.warn('Tentativa de expulsão falhou - cargo superior', { user: message.author.tag, target: member.user.tag });
      return message.reply('Não consegui expulsar o membro. Ele pode ter um cargo superior ao meu.');
    }

    try {
      // Tenta expulsar o membro
      await member.kick();
      Logger.info('Usuário expulso com sucesso', { kickedUser: member.user.tag, by: message.author.tag });
      message.reply(`${member.user.tag} foi expulso com sucesso.`);
    } catch (error) {
      Logger.error('Erro ao expulsar usuário', { error: error.message, user: message.author.tag, target: member.user.tag });
      message.reply('Ocorreu um erro ao tentar expulsar o membro.');
    }
  },
};
