const Logger = require('../utils/logger'); // Importando o Logger

module.exports = {
  name: 'tempban',
  description: 'Bane um usuário temporariamente.',
  async execute(message, args) {
    const user = message.mentions.members.first();
    const duration = parseInt(args[1]);

    if (!user || isNaN(duration)) {
      Logger.warn('Tentativa de banir com argumentos inválidos', { user: message.author.tag, args });
      return message.reply("Uso: !tempban @usuário <tempo em minutos>");
    }

    if (!message.member.permissions.has('MODERATOR_ROLE_ID')) {
      Logger.warn('Usuário sem permissão tentou banir', { user: message.author.tag, target: user.user.tag });
      return message.reply('Você não tem permissão para banir membros.');
    }

    try {
      await user.ban({ reason: 'Banimento temporário' });
      message.channel.send(`${user.user.tag} foi banido por ${duration} minutos.`);

      // Loga o banimento com sucesso
      Logger.info('Usuário banido temporariamente', {
        user: message.author.tag,
        target: user.user.tag,
        duration: duration,
      });

      setTimeout(async () => {
        await message.guild.members.unban(user.id);
        message.channel.send(`${user.user.tag} foi desbanido.`);

        // Loga o desbanimento
        Logger.info('Usuário desbanido após banimento temporário', {
          user: message.author.tag,
          target: user.user.tag,
        });
      }, duration * 60000);

    } catch (error) {
      Logger.error('Erro ao tentar banir o usuário', { error: error.message, user: message.author.tag, target: user.user.tag });
      message.reply('Ocorreu um erro ao tentar banir o membro.');
    }
  },
};
