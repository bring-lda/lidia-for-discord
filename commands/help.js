module.exports = {
    name: 'help',
    description: 'Exibe uma lista de comandos disponíveis.',
    async execute(message, args) {
      const commands = message.client.commands.map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');
      message.channel.send(`**Aqui estão os comandos disponíveis**:\n\n${commands}`);
    },
  };
  