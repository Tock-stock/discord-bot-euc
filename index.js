require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', () => {
  console.log(`Eingeloggt als ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    const { commandName } = interaction;

    if (commandName === 'abmeldung') {
      const modal = new ModalBuilder()
        .setCustomId('abmeldung_modal')
        .setTitle('Abmeldung');


        const startNameInput = new TextInputBuilder()
        .setCustomId('abmeldung_Name_date')
        .setLabel('Name/Ig')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Name');

      const startDateInput = new TextInputBuilder()
        .setCustomId('abmeldung_start_date')
        .setLabel('Datum von wann')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('TT.MM.JJJJ');

      const endDateInput = new TextInputBuilder()
        .setCustomId('abmeldung_end_date')
        .setLabel('Datum bis wann')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('TT.MM.JJJJ');

      const reasonInput = new TextInputBuilder()
        .setCustomId('abmeldung_reason')
        .setLabel('Grund')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Gib hier den Grund ein');

      const firstActionRow = new ActionRowBuilder().addComponents(startDateInput);
      const secondActionRow = new ActionRowBuilder().addComponents(endDateInput);
      const thirdActionRow = new ActionRowBuilder().addComponents(reasonInput);
      const fourtree = new ActionRowBuilder().addComponents(startNameInput);

      modal.addComponents(fourtree, firstActionRow, secondActionRow, thirdActionRow);

      await interaction.showModal(modal);
    }
  } else if (interaction.type === InteractionType.ModalSubmit) {
    if (interaction.customId === 'abmeldung_modal') {
      const startDate = interaction.fields.getTextInputValue('abmeldung_start_date');
      const endDate = interaction.fields.getTextInputValue('abmeldung_end_date');
      const reason = interaction.fields.getTextInputValue('abmeldung_reason');
      const four = interaction.fields.getTextInputValue('abmeldung_Name_date');

      await interaction.reply({
        content: `Deine Abmeldung wurde erfolgreich eingetragen:\nName: ${four}\nVon: ${startDate}\nBis: ${endDate}\nGrund: ${reason}`,
        ephemeral: true,
      });

      const channel = client.channels.cache.get(interaction.channelId);
      if (channel) {
        const sentMessage = await channel.send({
            content: `Ig: ${four}\nWan: ${startDate}\nBis: ${endDate}\nGrund: ${reason}`,
        });
  
        await sentMessage.react('✅'); 
        await sentMessage.react('❌'); 

    }
    }
  }
});

client.login(process.env.TOKEN);

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Starte das Registrieren der Slash-Befehle.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [
        {
          name: 'abmeldung',
          description: 'Reiche eine Abmeldung ein.',
        },
      ],
    });

    console.log('Slash-Befehl erfolgreich registriert.');
  } catch (error) {
    console.error('Fehler beim Registrieren des Slash-Befehls:', error);
  }
})();
