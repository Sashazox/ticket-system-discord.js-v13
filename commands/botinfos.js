const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Bot commands'),
  async execute(interaction, client) {
    const embed = new client.discord.MessageEmbed()
      .setColor('#7b08df')
      .setAuthor({name: 'Apokolips TM', iconURL: ('https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif')})
      .setDescription('Add a user to a ticket`/add`\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n Remove a user from a ticket `/remove`\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n Apokolips Discord: https://discord.gg/x6TZyyxaTq')
      .setThumbnail('https://cdn.discordapp.com/attachments/1001283718356418660/1019748659274993684/Apokolips_Ticket_Thumbnail.gif')
      .setImage('https://cdn.discordapp.com/attachments/1001283718356418660/1019747136801345636/Apokolips_Ticket_Image.gif')
      .setFooter({text: 'Apokolips TM', iconURL: ('https://cdn.discordapp.com/attachments/1001283718356418660/1019747667301126144/Apokolips_Ticket_Footer.gif')})
      .setTimestamp();
    await interaction.reply({
      embeds: [embed]
    });
  },
};