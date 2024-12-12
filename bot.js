require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const wordFilter = require('./utils/wordFilter');
const logger = require('./utils/logger'); // Importando o logger

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

client.commands = new Collection();
const prefix = process.env.PREFIX || '!';

// Carregar comandos da pasta "commands"
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
        logger.info(`Comando carregado: ${command.name}`, { file });
    } catch (error) {
        logger.error(`Erro ao carregar comando do arquivo ${file}`, error);
    }
}

client.once('ready', () => {
    logger.info(`Bot iniciado com sucesso`, {
        username: client.user.tag,
        guilds: client.guilds.cache.size,
        commandsLoaded: client.commands.size
    });
});

client.on('messageCreate', async (message) => {
    // Log da mensagem recebida
    logger.info('Nova mensagem recebida', {
        content: message.content,
        author: message.author.tag,
        channel: message.channel.name,
        guild: message.guild?.name
    });

    // Chama o filtro de palavras ofensivas
    try {
        await wordFilter(message);
    } catch (error) {
        logger.error('Erro no filtro de palavras', error);
    }

    // Ignorar mensagens de bot
    if (message.author.bot) {
        logger.debug('Mensagem ignorada: autor é um bot');
        return;
    }

    // Verificar prefixo
    if (!message.content.startsWith(prefix)) {
        logger.debug(`Mensagem sem prefixo correto: ${prefix}`, {
            content: message.content,
            author: message.author.tag
        });
        return;
    }

    logger.info('Prefixo encontrado, processando comando...', {
        content: message.content
    });

    // Processar argumentos e comando
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    logger.info('Comando detectado', {
        command: commandName,
        args: args,
        author: message.author.tag
    });

    // Verificar se o comando existe
    if (!client.commands.has(commandName)) {
        logger.warn('Comando não encontrado', {
            command: commandName,
            author: message.author.tag
        });
        return;
    }

    const command = client.commands.get(commandName);

    // Executar o comando e tratar erros
    try {
        await command.execute(message, args);
        logger.info(`Comando '${commandName}' executado com sucesso`, {
            author: message.author.tag,
            args: args
        });
    } catch (error) {
        logger.error(`Erro ao executar comando '${commandName}'`, error);
        try {
            await message.reply('Houve um erro ao tentar executar esse comando.');
        } catch (replyError) {
            logger.error('Erro ao enviar mensagem de erro ao usuário', replyError);
        }
    }
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
    logger.error('Erro não tratado (UnhandledRejection)', error);
});

// Login do bot
client.login(process.env.DISCORD_TOKEN)
    .then(() => logger.info('Bot logado com sucesso'))
    .catch(error => logger.error('Erro ao fazer login do bot', error));