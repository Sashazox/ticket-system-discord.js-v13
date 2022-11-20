const { getPasteUrl, PrivateBinClient } = require('@agc93/privatebin');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {
      if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
        return interaction.reply({
          content: 'You already have a ticket',
          ephemeral: true
        });
      };

      interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        parent: client.config.parentOpened,
        topic: interaction.user.id,
        permissionOverwrites: [{
            id: interaction.user.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: client.config.roleSupport,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
        type: "GUILD_TEXT",
      }).then(async c => {
        interaction.reply({
          content: `Ticket created <#${c.id}>`,
          ephemeral: true
        });

        const embed = new client.discord.MessageEmbed()
          .setColor('#7b08df')
          .setAuthor({name: `${interaction.user.username}'s Ticket`, iconURL: 'https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif'})
          .setDescription('Why are you opening this ticket?\nYou have 1 minute to choose your reason')
          .setThumbnail('https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif')
          .setImage('https://cdn.discordapp.com/attachments/1001283718356418660/1019747136801345636/Apokolips_Ticket_Image.gif')
          .setFooter({text: `Apokolips TM`, iconURL: ('https://cdn.discordapp.com/attachments/1001283718356418660/1019747667301126144/Apokolips_Ticket_Footer.gif')})
          .setTimestamp();

        const row = new client.discord.MessageActionRow()
          .addComponents(
            new client.discord.MessageSelectMenu()
            .setCustomId('category')
            .setPlaceholder('Apokolips™️ Select Menu')
            .addOptions([{
                label: client.config.Category1,
                value: client.config.Category1,
                description: 'Description 1',
              },
              {
                label: client.config.Category2,
                value: client.config.Category2,
                description: 'Description 2',
              },
              {
                label: client.config.Category3,
                value: client.config.Category3,
                description: 'Description 3',
              },
              {
                label: client.config.Category4,
                value: client.config.Category4,
                description: 'Description 4',
              },
            ]),
          );

        msg = await c.send({
          content: `<@!${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({
          componentType: 'SELECT_MENU',
          time: 60000 //60 seconds
        });

        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            if (msg.deletable) {
              msg.delete().then(async () => {
                const embed = new client.discord.MessageEmbed()
                  .setColor('6d6ee8')
                  .setAuthor({name: 'Ticket', iconURL: interaction.user.displayAvatarURL()})
                  .setDescription(`<@!${interaction.user.id}> created a ticket with the Reason \`${i.values[0]}\``)
                  .setThumbnail('https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif')
                  .setImage('https://cdn.discordapp.com/attachments/1001283718356418660/1019747136801345636/Apokolips_Ticket_Image.gif')
                  .setFooter({text: `Apokolips TM`, iconURL: ('https://cdn.discordapp.com/attachments/1001283718356418660/1019747667301126144/Apokolips_Ticket_Footer.gif')})
                  .setTimestamp();

                const row = new client.discord.MessageActionRow()
                  .addComponents(
                    new client.discord.MessageButton()
                    .setCustomId('close-ticket')
                    .setLabel('Close')
                    .setEmoji('✖')
                    .setStyle('DANGER'),
                  );

                const opened = await c.send({
                  content: `<@&${client.config.roleSupport}>`,
                  embeds: [embed],
                  components: [row]
                });

                opened.pin().then(() => {
                  opened.channel.bulkDelete(1);
                });
              });
            };
          };
        });

        collector.on('end', collected => {
          if (collected.size < 1) {
            c.send(`> **No reason selected**`).then(() => {
              setTimeout(() => {
                if (c.deletable) {
                  c.delete();
                };
              }, 5000);
            });
          };
        });
      });
    };

    if (interaction.customId == "close-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('confirm-close')
          .setLabel('Close')
          .setStyle('DANGER'),
          new client.discord.MessageButton()
          .setCustomId('no')
          .setLabel('Cancel')
          .setStyle('SECONDARY'),
        );

      const verif = await interaction.reply({
        content: '> **Are you sure you want to close this ticket?**',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 10000
      });

      collector.on('collect', i => {
        if (i.customId == 'confirm-close') {
          interaction.editReply({
            content: `> **Ticket closed by <@!${interaction.user.id}>**`,
            components: []
          });

          chan.edit({
              name: `closed-${chan.name}`,
              permissionOverwrites: [
                {
                  id: client.users.cache.get(chan.topic),
                  deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: client.config.roleSupport,
                  allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: interaction.guild.roles.everyone,
                  deny: ['VIEW_CHANNEL'],
                },
              ],
            })
            .then(async () => {
              const embed = new client.discord.MessageEmbed()
                .setColor('#7b08df')
                .setAuthor({name: 'Ticket', iconURL: 'https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif'})
                .setDescription('```Apokolips TM```')
                .setThumbnail('https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif')
                .setImage('https://cdn.discordapp.com/attachments/1001283718356418660/1019747136801345636/Apokolips_Ticket_Image.gif')
                .setFooter({text: `Apokolips TM`, iconURL: ('https://cdn.discordapp.com/attachments/1001283718356418660/1019747667301126144/Apokolips_Ticket_Footer.gif')})
                .setTimestamp();

              const row = new client.discord.MessageActionRow()
                .addComponents(
                  new client.discord.MessageButton()
                  .setCustomId('delete-ticket')
                  .setLabel('Delete')
                  .setEmoji('🗑️')
                  .setStyle('DANGER'),
                );

              chan.send({
                embeds: [embed],
                components: [row]
              });
            });

          collector.stop();
        };
        if (i.customId == 'no') {
          interaction.editReply({
            content: '> **Canceled**',
            components: []
          });
          collector.stop();
        };
      });

      collector.on('end', (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: '> **Canceled**',
            components: []
          });
        };
      });
    };

    if (interaction.customId == "delete-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      interaction.reply({
        content: '> **Transcription...**'
      });

      chan.messages.fetch().then(async (messages) => {
        let a = messages.filter(m => m.author.bot !== true).map(m =>
          `${new Date(m.createdTimestamp).toLocaleString('en-EN')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
        ).reverse().join('\n');
        if (a.length < 1) a = "Nothing"
        var paste = new PrivateBinClient("https://privatebin.net/");
        var result = await paste.uploadContent(a, {uploadFormat: 'markdown'})
            const embed = new client.discord.MessageEmbed()
              .setColor('#ff0000')
              .setAuthor({name: 'Ticket Log', iconURL: 'https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif'})
              .setDescription(`Channel ID \`${chan.id}\`\nTicket created by <@!${chan.topic}>\nTicket closed by <@!${interaction.user.id}>\n\nلاگ: [**Transcript**](${getPasteUrl(result)})`)
              .setColor('#ff0000')
              .setThumbnail('https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif')
              .setFooter({text: "This log will be deleted after 24 hours", iconURL: ('https://cdn.discordapp.com/attachments/1001283718356418660/1019747667301126144/Apokolips_Ticket_Footer.gif')})
              .setTimestamp();

            const embed2 = new client.discord.MessageEmbed()
              .setColor('#ff0000')
              .setAuthor({name: 'Ticket Log', iconURL: 'https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif'})
              .setDescription(`Channel ID \`${chan.id}\`: [**Transcript**](${getPasteUrl(result)})`)
              .setColor('#ff0000')
              .setThumbnail('https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif')
              .setFooter({text: "This log will be deleted after 24 hours", iconURL: ('https://cdn.discordapp.com/attachments/1001283718356418660/1019747667301126144/Apokolips_Ticket_Footer.gif')})
              .setTimestamp();

            client.channels.cache.get(client.config.logsTicket).send({
              embeds: [embed]
            }).catch(() => console.log("> **Log Error: Channel Not Found**"));
            chan.send('> **Deleting the channel...**');

            setTimeout(() => {
              chan.delete();
            }, 5000);
          });
    };
  },
};
