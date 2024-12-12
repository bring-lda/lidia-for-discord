const Logger = require('../utils/logger'); // Supondo que o logger esteja no diretório acima

module.exports = {
  name: 'mute',
  description: 'Mutar um membro no servidor.',
  async execute(message, args) {
    // Verifica permissão do usuário
    if (!message.member.permissions.has('MODERATOR_ROLE_ID')) {
      Logger.warn('Tentativa de mutar sem permissão', { user: message.author.tag });
      return message.reply('Você não tem permissão para mutar membros.');
    }

    // Verifica se o usuário foi mencionado
    const member = message.mentions.members.first();
    if (!member) {
      Logger.warn('Tentativa de mutar sem menção de membro', { user: message.author.tag });
      return message.reply('Por favor, mencione um usuário para mutar.');
    }

    // Define a duração do mute (padrão: 10 minutos)
    const duration = parseInt(args[1]) || 10;
    try {
      // Tenta mutar o membro
      await member.timeout(duration * 60 * 1000, 'Muted pelo comando mute');
      Logger.info('Usuário mutado com sucesso', { mutedUser: member.user.tag, by: message.author.tag, duration: `${duration} minutos` });
      message.reply(`${member.user.tag} foi mutado por ${duration} minutos.`);
    } catch (error) {
      Logger.error('Erro ao mutar usuário', { error: error.message, user: message.author.tag, target: member.user.tag });
      message.reply('Ocorreu um erro ao tentar mutar o membro.');
    }
  },
};
