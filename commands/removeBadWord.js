const fs = require('fs');
const path = './config/badWords.json';
const Logger = require('../utils/logger'); // Importando o Logger

module.exports = {
    name: 'removebadword',
    description: 'Remove uma palavra da lista de palavras ofensivas.',
    async execute(message, args) {
        // Verifica se o usuário tem permissão de administrador
        if (!message.member.permissions.has('MODERATOR_ROLE_ID')) {
            Logger.warn('Tentativa de remover palavra sem permissão de administrador', { user: message.author.tag });
            return message.reply('Você não tem permissão para remover palavras da lista.');
        }

        try {
            // Verificar se foi fornecido um argumento
            if (!args.length) {
                Logger.warn('Comando removebadword sem argumento', { user: message.author.tag });
                await message.channel.send('Por favor, forneça uma palavra para remover.');
                return;
            }

            const wordToRemove = args[0].toLowerCase();

            // Carregar o arquivo de palavras ruins
            let badWords;
            try {
                const data = fs.readFileSync(path, 'utf8');
                badWords = JSON.parse(data);
            } catch (err) {
                Logger.error('Erro ao ler o arquivo de palavras ruins', { error: err.message, user: message.author.tag });
                await message.channel.send('Houve um erro ao acessar as palavras ruins.');
                return;
            }

            // Verificar se a palavra está na lista
            if (!badWords.includes(wordToRemove)) {
                Logger.info('Palavra não encontrada para remoção', { word: wordToRemove, user: message.author.tag });
                await message.channel.send(`A palavra "${wordToRemove}" não foi encontrada na lista de palavras ruins.`);
                return;
            }

            // Remover a palavra da lista
            badWords = badWords.filter(word => word !== wordToRemove);

            // Salvar a lista atualizada no arquivo
            try {
                fs.writeFileSync(path, JSON.stringify(badWords, null, 2));
                Logger.info('Palavra removida com sucesso', { word: wordToRemove, user: message.author.tag });
                await message.channel.send(`A palavra "${wordToRemove}" foi removida com sucesso.`);
            } catch (err) {
                Logger.error('Erro ao escrever no arquivo de palavras ruins', { error: err.message, user: message.author.tag });
                await message.channel.send('Houve um erro ao tentar remover a palavra.');
            }
        } catch (error) {
            Logger.error('Erro no comando removebadword', { error: error.message, user: message.author.tag });
            await message.channel.send('Ocorreu um erro ao executar o comando.');
        }
    },
};
