const Logger = require('../utils/logger'); // Supondo que o logger esteja no diretório acima

module.exports = {
    name: 'ban',
    description: 'Bane um membro do servidor.',
    async execute(message, args) {
        // Verificar permissão do usuário
        if (!message.member.permissions.has('MODERATOR_ROLE_ID')) {
            Logger.warn('Tentativa de banimento sem permissão', { user: message.author.tag });
            return message.reply('Você não tem permissão para banir membros.');
        }

        // Verificar se o usuário foi mencionado
        const member = message.mentions.members.first();
        if (!member) {
            Logger.warn('Tentativa de banimento sem menção de membro', { user: message.author.tag });
            return message.reply('Por favor, mencione um usuário para banir.');
        }

        try {
            // Tentar banir o membro
            await member.ban();
            Logger.info('Usuário banido com sucesso', { bannedUser: member.user.tag, by: message.author.tag });
            message.reply(`${member.user.tag} foi banido com sucesso.`);
        } catch (error) {
            Logger.error('Erro ao banir usuário', { error: error.message, user: message.author.tag, target: member.user.tag });
            message.reply('Não consegui banir o usuário. Verifique se ele tem cargos superiores.');
        }
    },
};
