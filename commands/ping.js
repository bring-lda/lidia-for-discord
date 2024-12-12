module.exports = {
  name: 'ping',
  description: 'Pinga o bot para verificar se ele está online!',
  async execute(message, args) {
    const sent = await message.channel.send('Pong!');  // Envia a mensagem inicial

    const latency = sent.createdTimestamp - message.createdTimestamp;  // Latência entre o envio da mensagem e a resposta
    const apiLatency = Math.round(message.client.ws.ping);  // Latência da API do Discord

    // Edita a mensagem de resposta para incluir latência de rede e latência da API
    sent.edit(`**Pong! 🏓\nLatência**: ${latency}ms\n**Latência da API**: ${apiLatency}ms`);
  },
};
