const Logger = require('../utils/logger'); // Supondo que o logger esteja no diretório acima

module.exports = {
    name: 'about',
    description: 'Exibe informações sobre o bot.',
    async execute(message, args) {
        // Log de execução do comando
        Logger.info('Comando executado', { command: 'about', user: message.author.tag });

        // Mensagem de apresentação do bot
        const aboutMessage = `
**LidIA - Assistente de Moderação da Bring**

_LidIA_ é um bot desenvolvido pela Bring para oferecer suporte e segurança à comunidade. Com funcionalidades de monitoramento e automação, _LidIA_ ajuda a manter um ambiente organizado e acolhedor, facilitando a comunicação entre os membros.

Para mais informações sobre _LidIA_ ou suporte técnico, entre em contato com a equipe **Bring**.
        `;

        // Envia a mensagem no canal
        message.channel.send(aboutMessage);
    },
};
