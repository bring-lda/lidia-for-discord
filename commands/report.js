const Logger = require('../utils/logger'); // Importando o Logger

module.exports = {
  name: 'report',
  description: 'Permite que membros denunciem comportamentos.',
  async execute(message, args) {
    const reportChannelId = process.env.REPORT_CHANNEL;
    const reportChannel = message.guild.channels.cache.get(reportChannelId);
    const reason = args.join(' ');

    // Verifica se o motivo foi especificado
    if (!reason) {
      Logger.warn('Tentativa de enviar relatório sem motivo', { user: message.author.tag });
      return message.reply("Especifique um motivo para o relatório.");
    }

    try {
      // Envia o relatório para o canal de denúncias
      await reportChannel.send(`🚨 Reporte de ${message.author}:\n${reason}`);
      
      // Responde ao usuário
      message.reply("Seu relatório foi enviado aos moderadores.");
      
      // Loga o envio do relatório com sucesso
      Logger.info('Relatório enviado com sucesso', {
        user: message.author.tag,
        reason: reason,
      });
    } catch (error) {
      Logger.error('Erro ao enviar relatório', { error: error.message, user: message.author.tag });
      message.reply('Houve um erro ao tentar enviar o seu relatório.');
    }
  },
};
