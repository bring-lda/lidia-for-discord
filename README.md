# LidIA - Bot do Discord

LidIA é um bot inteligente para Discord, projetado para gerenciar servidores com facilidade, fornecer automação e melhorar a experiência dos membros. Ele possui uma ampla variedade de comandos úteis para moderação e interação.

---

## **Recursos**
- **Moderação**: Controle de usuários e gerenciamento do servidor.
- **Segurança**: Filtragem de palavras proibidas.
- **Interação**: Comandos para facilitar a comunicação com os membros.
- **Customização**: Fácil de configurar e personalizar para atender às necessidades do servidor.

---

## **Pré-requisitos**
Antes de rodar o bot, você precisa:
1. **Node.js** (recomendado LTS): [Instale aqui](https://nodejs.org/)
2. **Token do bot no Discord**: Crie um bot na [Discord Developer Portal](https://discord.com/developers/applications).

---

## **Configuração**

### **1. Clonar o repositório**
Clone o repositório com o comando:
```bash
git clone https://github.com/bring-lda/lidia-for-discord.git
cd lidia-for-discord
```

---

### **2. Instalar dependências**
Instale as dependências do bot:
```bash
npm install
```

---

### **3. Configurar o arquivo `.env`**
Renomeie o arquivo `.env.example` para `.env` e configure as variáveis:
```env
DISCORD_TOKEN=SEU_TOKEN_AQUI
PREFIX=!
MODERATOR_ROLE_ID=ID_DO_CARGO_DE_MODERADOR
REPORT_CHANNEL=ID_DO_CANAL_DE_RELATORIO
MAX_WARNINGS=3
MUTE_DURATION=20
```

---

### **4. Iniciar o bot**
Inicie o bot com:
```bash
node bot.js
```
O bot estará online e pronto para interagir no seu servidor.

---

## **Estrutura do Projeto**
- `/commands`: Contém os comandos disponíveis para o bot.
- `/utils`: Contém as utilidades do bot.
- `/logs`: Diretório para logs e registros de atividades.
- `bot.js`: Arquivo principal que inicializa o bot.
- `.env`: Armazena variáveis de ambiente, como o token do bot.

---

## **Comandos Disponíveis**
Aqui estão os comandos disponíveis no LidIA:

### **1. Informativos**
- `!help`: Mostra a lista de comandos disponíveis.
- `!about`: Exibe informações sobre o bot.

### **2. Moderação**
- `!kick @usuário`: Expulsa um membro do servidor.
- `!ban @usuário`: Bane um membro do servidor.
- `!mute @usuário`: Silencia um membro do servidor.
- `!unmute @usuário`: Remove o silêncio de um membro.
- `!tempban @usuário [tempo]`: Bane temporariamente um membro.
- `!tempmute @usuário [tempo]`: Silencia temporariamente um membro.
- `!clear [número]`: Limpa um número específico de mensagens no chat.

### **3. Relatórios e Segurança**
- `!report @usuário [motivo]`: Envia um relatório sobre um usuário.
- `!addBadWord [palavra]`: Adiciona uma palavra à lista de proibidas.
- `!removeBadWord [palavra]`: Remove uma palavra da lista de proibidas.

### **4. Teste**
- `!ping`: Responde com "Pong!" para testar se o bot está funcionando.

---

## **Personalização**
### **Adicionando Novos Comandos**
1. Crie um novo arquivo no diretório `/commands`.
2. Siga o formato de qualquer comando existente.

### **Alterando o Prefixo**
Edite a variável `PREFIX` no arquivo `.env` para configurar um novo prefixo.

---

## **Boas Práticas**
- **Mantenha o token seguro**: Nunca compartilhe seu token do bot.
- **Monitore logs**: Use os logs para identificar possíveis erros ou abusos.
- **Atualize sempre**: Mantenha o bot e suas dependências atualizadas.

---

## **Contribuição**
Este projeto é privado. Para contribuir:
1. Crie um branch para sua funcionalidade:
   ```bash
   git checkout -b minha-feature
   ```
2. Envie um Pull Request após concluir as alterações.

---

## **Aviso**
LidIA é de uso exclusivo e não deve ser redistribuído sem autorização.

---

## **Licença**
Projeto privado. Todos os direitos reservados.

Se precisar ajustar ou incluir mais funcionalidades específicas, me avise! 😊
