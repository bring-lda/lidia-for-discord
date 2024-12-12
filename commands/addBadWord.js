const fs = require('fs');
const path = require('path');
const Logger = require('../utils/logger'); // Importando o Logger

// Caminho para o arquivo badWords.json
const badWordsFilePath = path.join(__dirname, '../config', 'badWords.json');

module.exports = {
  name: 'addbadword',
  description: 'Adiciona uma palavra à lista de palavras proibidas.',
  async execute(message, args) {
    // Verifica se o usuário tem permissão para gerenciar mensagens
    if (!message.member.permissions.has('MODERATOR_ROLE_ID')) {
      Logger.warn('Tentativa de adicionar palavra sem permissão', { user: message.author.tag });
      return message.reply('Você não tem permissão para adicionar palavras à lista de proibidas.');
    }

    // Verifica se o argumento foi fornecido
    if (!args.length) {
      Logger.warn('Tentativa de adicionar palavra sem argumento', { user: message.author.tag });
      return message.reply('Você precisa fornecer uma palavra para adicionar.');
    }

    const newWord = args[0].toLowerCase();  // A palavra é convertida para minúscula

    try {
      // Carregar as palavras proibidas do arquivo
      const badWords = JSON.parse(fs.readFileSync(badWordsFilePath, 'utf8'));

      // Verificar se a palavra já está na lista
      if (badWords.includes(newWord)) {
        Logger.info('Palavra já existente', { word: newWord, user: message.author.tag });
        return message.reply(`A palavra "${newWord}" já está na lista de palavras proibidas.`);
      }

      // Adicionar a nova palavra na lista
      badWords.push(newWord);

      // Salvar novamente no arquivo
      fs.writeFileSync(badWordsFilePath, JSON.stringify(badWords, null, 2));

      Logger.info('Palavra adicionada com sucesso', { word: newWord, user: message.author.tag });
      message.reply(`A palavra "${newWord}" foi adicionada com sucesso.`);
    } catch (error) {
      Logger.error('Erro ao adicionar palavra', { error: error.message, user: message.author.tag });
      message.reply('Houve um erro ao tentar adicionar a palavra.');
    }
  },
};
