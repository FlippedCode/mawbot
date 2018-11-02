const Discord = module.require('discord.js');

const client = new Discord.Client();

module.exports.run = async (client, message, args, con, config) => {
  // message.channel.send('Pong...').then((msg) => {
  //   msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping[0])}ms`);
  // });
  message.channel.send('Pong...').then((msg) => {
    msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(msg.client.ping)}ms`);
    return;
  });
};

module.exports.help = {
  name: 'ping',
};
