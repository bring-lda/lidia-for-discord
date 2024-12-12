const Logger = require('../utils/logger'); // Importando o Logger

module.exports = {
  name: 'unmute',
  description: 'Desmutar um membro no servidor.',
  async execute(message, args) {
    if (!message.member.permissions.has('MODERATOR_ROLE_ID')) {
      Logger.warn('Usuário sem permissão tentou desmutar', { user: message.author.tag });
      return message.reply('Você não tem permissão para desmutar membros.');
    }

    const member = message.mentions.members.first();
    if (!member) {
      Logger.warn('Comando unmute sem usuário mencionado', { user: message.author.tag });
      return message.reply('Por favor, mencione um usuário para desmutar.');
    }

    try {
      await member.timeout(null);
      message.reply(`${member.user.tag} foi desmutado com sucesso.`);

      // Loga o desmutar com sucesso
      Logger.info('Usuário desmutado com sucesso', {
        user: message.author.tag,
        target: member.user.tag,
      });
    } catch (error) {
      Logger.error('Erro ao tentar desmutar o usuário', { error: error.message, user: message.author.tag, target: member.user.tag });
      message.reply('Ocorreu um erro ao tentar desmutar o membro.');
    }
  },
};
