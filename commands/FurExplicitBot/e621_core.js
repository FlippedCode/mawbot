const rp = require('request-promise');

function Timeout(msg, userID, messageOwner, config) {
  messageOwner.set(msg.id, userID);
  setTimeout(() => {
    messageOwner.delete(msg.id);
    msg.clearReactions();
  }, config.reactionsTimeout);
}

function tagsReplace(tags, search, replace) {
  return tags.replace(new RegExp(search, 'g'), replace);
}

module.exports.run = async (client, message, args, config, functions, RichEmbed, messageOwner) => {
  message.react(client.guilds.get(config.emojiServer).emojis.get(config.loadingEmoji)).then((reaction_loading) => {
    let [limit] = args;
    let tags = args.join(' ');
    tags = tagsReplace(tags, ', ', ' ');
    if (isNaN(limit) || limit === 0) limit = 1;
    else tags = tags.slice(limit.length + 1);

    let uri = 'https://e621.net/post/index.json';
    if (message.channel.nsfw === false) uri = 'https://e926.net/post/index.json';
    if (limit > 10) {
      message.reply('you can only requwest a maximum of 10 images at the twime.');
      reaction_loading.remove(client.user);
      return;
    }
    if (limit > 3) {
      let embed = new RichEmbed().setDescription('you requwested over 3 images and this might take somwe time. Pleawse don\'t rush me. >.<');
      message.channel.send({ embed })
        .then(msg => msg.delete(10000));
    }
    let request = {
      method: 'POST',
      uri,
      body: {
        limit: '300',
        tags,
      },
      headers: { 'User-Agent': 'DiscordBot - FurExplicitBot' },
      json: true,
    };
    rp(request)
      .then((json) => {
        if (json.length === 0) return message.channel.send('Sowwy, I found no pictures with your tags. uwu');
        for (let i = 0; i < limit; i++) {
          const randomChoice = Math.floor(Math.random() * json.length);
          let typePic = 'Preview';
          let picURL = json[randomChoice].sample_url;
          let arrow = '🔽';
          const extantion = json[randomChoice].file_ext;
          if (extantion === 'gif' || extantion === 'webm' || extantion === 'swf') {
            typePic = 'Full Picture';
            picURL = json[randomChoice].file_url;
            if (extantion === 'webm' || extantion === 'swf') arrow = json[randomChoice].file_url;
          }
          let embed = new RichEmbed()
            .setAuthor(`Main Artist: ${json[randomChoice].artist[0]}`)
            .setColor(config.color_e621)
            .setTitle('E621 Link')
            .setURL(`https://e621.net/post/show/${json[randomChoice].id}`)
            .addField(typePic, arrow)
            .setImage(picURL)
            .setFooter('e621.net', config.logo_e621)
            .setTimestamp();
          message.channel.send({ embed })
            .then((msg) => {
              msg.react('↔')
                .then(() => msg.react('❌'));
              Timeout(msg, message.author.id, messageOwner, config);
            });
        }
      })
      .then(() => {
        reaction_loading.remove(client.user);
      });
  })
    .catch((err) => {
      message.channel.send('Sowwy, but it seems like something went wrong... Pleawse report this to my creator. uwu')
        .then(() => message.react('❌'));
      console.error(err);
    });
};

module.exports.help = {
  name: 'e6',
};
