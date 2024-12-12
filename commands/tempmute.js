const Logger = require('../utils/logger'); // Importando o Logger

module.exports = {
  name: 'tempmute',
  description: 'Muta um usuário temporariamente.',
  async execute(message, args) {
    const user = message.mentions.members.first();
    const duration = parseInt(args[1]);

    if (!user || isNaN(duration)) {
      Logger.warn('Tentativa de mutar com argumentos inválidos', { user: message.author.tag, args });
      return message.reply("Uso: !tempmute @usuário <tempo em minutos>");
    }

    if (!message.member.permissions.has('MODERATOR_ROLE_ID')) {
      Logger.warn('Usuário sem permissão tentou mutar', { user: message.author.tag, target: user.user.tag });
      return message.reply('Você não tem permissão para mutar membros.');
    }

    try {
      await user.timeout(duration * 60000);
      message.channel.send(`${user.user.tag} foi mutado por ${duration} minutos.`);

      // Loga o mutar com sucesso
      Logger.info('Usuário mutado temporariamente', {
        user: message.author.tag,
        target: user.user.tag,
        duration: duration,
      });

      setTimeout(async () => {
        await user.timeout(null);
        message.channel.send(`${user.user.tag} foi desmutado.`);

        // Loga o desmutar
        Logger.info('Usuário desmutado após mutação temporária', {
          user: message.author.tag,
          target: user.user.tag,
        });
      }, duration * 60000);

    } catch (error) {
      Logger.error('Erro ao tentar mutar o usuário', { error: error.message, user: message.author.tag, target: user.user.tag });
      message.reply('Ocorreu um erro ao tentar mutar o membro.');
    }
  },
};
