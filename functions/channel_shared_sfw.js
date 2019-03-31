module.exports.run = async (client, message, con) => {
  // let blacklisted = false;

  // no pic fallback
  let pic = 'https://cdn.discordapp.com/embed/avatars/0.png';
  if (message.author.avatarURL) pic = message.author.avatarURL;

  con.query('SELECT * FROM shared_channels', async (err, rows) => {
    rows.forEach((ID) => {
      const vorenetwork_channel = client.channels.find(channel => channel.id === ID.channelID);
      if (vorenetwork_channel.id !== message.channel.id) {
        con.query(`SELECT * FROM shared_channels WHERE channelID = '${message.channel.id}'`, async (err, rows) => {
          vorenetwork_channel.fetchWebhooks()
            .then((webhook) => {
              const hook = webhook.find(hook => hook.name === rows[0].webhookName);
              hook.send(message.content, {
                username: `${message.author.username} [${message.channel.guild.name}]`,
                avatarURL: pic,
              })
                .catch((error) => {
                  console.log(error);
                  message.channel.send('Something went wrong sending the message to one of the other servers. Please report this to the Team.');
                  return;
                });
            });
        });
      }
    });
  });

  // TODO: need redo with db
  // Object.entries(blacklist).forEach(([key, value]) => {
  //   if (message.author.id === value) {
  //     content = '\nSorry, because of your recent behavior you are not allowed to use the vore-network anymore!';
  //     blacklisted = true;
  //   }
  // });
};

module.exports.help = {
  name: 'channel_shared_sfw',
};
