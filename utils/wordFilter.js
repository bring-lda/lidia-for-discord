const fs = require('fs');
const path = require('path');
const Logger = require('./logger');

// Caminho para os arquivos
const badWordsFilePath = path.join(__dirname, '../config', 'badWords.json');
const warningsFilePath = path.join(__dirname, '../config', 'warnings.json');

// Configurações do .env
const MODERATOR_ROLE_ID = process.env.MODERATOR_ROLE_ID;
const MAX_WARNINGS = parseInt(process.env.MAX_WARNINGS) || 3; // Valor padrão 3 se não definido
const MUTE_DURATION = parseInt(process.env.MUTE_DURATION) || 120; // Valor padrão 120 minutos (2 horas) se não definido

// Validação das variáveis de ambiente
function validateEnvVariables() {
    const requiredVars = {
        'MODERATOR_ROLE_ID': MODERATOR_ROLE_ID,
        'MAX_WARNINGS': process.env.MAX_WARNINGS,
        'MUTE_DURATION': process.env.MUTE_DURATION
    };

    const missingVars = [];
    for (const [name, value] of Object.entries(requiredVars)) {
        if (!value) {
            missingVars.push(name);
        }
    }

    if (missingVars.length > 0) {
        Logger.error(`Variáveis de ambiente ausentes: ${missingVars.join(', ')}`);
    }
}

// Função para carregar as palavras proibidas
function loadBadWords() {
    try {
        const data = fs.readFileSync(badWordsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        Logger.error('Erro ao carregar palavras proibidas', error);
        return [];
    }
}

// Função para inicializar o arquivo de avisos se não existir
function initWarningsFile() {
    if (!fs.existsSync(warningsFilePath)) {
        fs.writeFileSync(warningsFilePath, JSON.stringify({}, null, 2));
    }
}

// Função para carregar os avisos
function loadWarnings() {
    try {
        initWarningsFile(); // Garante que o arquivo existe
        const data = fs.readFileSync(warningsFilePath, 'utf8');
        return data ? JSON.parse(data) : {};
    } catch (error) {
        Logger.error('Erro ao carregar avisos', error);
        return {};
    }
}

// Função para salvar os avisos
function saveWarnings(warnings) {
    try {
        fs.writeFileSync(warningsFilePath, JSON.stringify(warnings, null, 2));
    } catch (error) {
        Logger.error('Erro ao salvar avisos', error);
    }
}

// Função para adicionar aviso
function addWarning(userId) {
    const warnings = loadWarnings();
    if (!warnings[userId]) {
        warnings[userId] = {
            count: 0,
            lastWarning: null
        };
    }
    
    warnings[userId].count++;
    warnings[userId].lastWarning = Date.now();
    saveWarnings(warnings);
    
    return warnings[userId];
}

// Função para limpar avisos de um usuário
function clearWarnings(userId) {
    const warnings = loadWarnings();
    if (warnings[userId]) {
        delete warnings[userId];
        saveWarnings(warnings);
    }
}

// Função para verificar permissões do bot
function checkBotPermissions(guild) {
    const botMember = guild.members.cache.get(guild.client.user.id);
    return botMember.permissions.has('ModerateMembers');
}

// Função para mutar usuário usando timeout
async function muteUser(member) {
    try {
        // Verifica se o bot tem as permissões necessárias
        if (!checkBotPermissions(member.guild)) {
            Logger.error('Bot não tem permissões para mutar membros');
            return false;
        }

        // Verifica se o membro pode ser mutado
        if (!member.moderatable) {
            Logger.error(`Não é possível mutar o membro ${member.user.tag}`);
            return false;
        }

        // Muta o usuário
        await member.timeout(MUTE_DURATION * 60 * 1000, 'Múltiplas infrações de linguagem imprópria');
        
        // Limpa os avisos do usuário após o mute
        clearWarnings(member.id);
        
        return true;
    } catch (error) {
        Logger.error('Erro ao mutar usuário', error);
        return false;
    }
}

module.exports = async (message) => {
    // Valida as variáveis de ambiente na primeira execução
    validateEnvVariables();
    
    // Ignorar mensagens de bots e comandos
    if (message.author.bot || message.content.startsWith('!')) return;
    
    // Recarrega a lista de palavras proibidas a cada verificação
    const currentBadWords = loadBadWords();
    const foundWord = currentBadWords.find((word) =>
        message.content.toLowerCase().includes(word.toLowerCase())
    );
    
    if (foundWord) {
        try {
            // Apaga a mensagem
            await message.delete();
            
            // Adiciona um aviso
            const userWarnings = addWarning(message.author.id);
            
            let warningMessage = `<@${message.author.id}>, linguagem imprópria detectada. `;
            warningMessage += `Aviso ${userWarnings.count}/${MAX_WARNINGS}. `;
            
            // Se atingiu o limite de avisos
            if (userWarnings.count >= MAX_WARNINGS) {
                const member = message.guild.members.cache.get(message.author.id);
                const mutedSuccessfully = await muteUser(member);
                
                if (mutedSuccessfully) {
                    warningMessage += `Você foi mutado por ${MUTE_DURATION} minutos devido a múltiplas infrações.`;
                } else {
                    warningMessage += `Tentativa de mute falhou. Por favor, um moderador precisa verificar as permissões do bot.`;
                }
            }
            
            // Notifica moderadores
            warningMessage += ` <@&${MODERATOR_ROLE_ID}>`;
            
            await message.channel.send(warningMessage);
            
            // Loga a detecção
            Logger.info('Linguagem imprópria', {
                user: message.author.tag,
                word: foundWord,
                channel: message.channel.name,
                warningCount: userWarnings.count,
                wasMuted: userWarnings.count >= MAX_WARNINGS
            });
            
        } catch (error) {
            Logger.error('Erro ao processar mensagem ofensiva', error);
        }
    }
};