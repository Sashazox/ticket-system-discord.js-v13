const chalk = require('chalk');

module.exports = {
  name: 'ready',
  execute(client) {
    console.log(chalk.green('[Sashazox]') + chalk.cyan('discord.gg/apokolips'))
    console.log(chalk.red('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'))
    console.log(chalk.green('Name: ') + chalk.cyan('Apokolips TM'))
    console.log(chalk.green('Bot Status: ') + chalk.cyan('Initialized'))
    console.log(chalk.red('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'))
    const oniChan = client.channels.cache.get(client.config.ticketChannel)

    function sendTicketMSG() {
      const embed = new client.discord.MessageEmbed()
        .setColor('#7b08df')
        .setAuthor({name: 'Apokolips TM', iconURL: ('https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif')})
        .setDescription('Click the button below to open a ticket')
        .setThumbnail('https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif')
        .setImage('https://cdn.discordapp.com/attachments/1001283718356418660/1019747136801345636/Apokolips_Ticket_Image.gif')
        .setFooter({text:`Apokolips TM`, iconURL: ('https://cdn.discordapp.com/attachments/1001283718356418660/1019747667301126144/Apokolips_Ticket_Footer.gif')})
      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('open-ticket')
          .setLabel('open a ticket')
          .setEmoji('✉️')
          .setStyle('SUCCESS'),
        );

      oniChan.send({
        embeds: [embed],
        components: [row]
      })
    }

    oniChan.bulkDelete(100).then(() => {
      sendTicketMSG()
      console.log(chalk.green('[Apokolips TM]') + chalk.cyan(' Ticket Panel sent...'))
    })
  },
};