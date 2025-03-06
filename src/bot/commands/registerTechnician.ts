import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db/connection";
import { technician } from "../../db/schema";

export const registerTechnicianCommand = {
  data: new SlashCommandBuilder()
    .setName("registrar-tecnico")
    .setDescription("Registra um técnico responsável")
    .addStringOption((option) => option.setName("nome").setDescription("Nome do técnico").setRequired(true)),
  async execute(interaction: any) {
    const user = interaction.user;
    const displayName = interaction.options.getString("nome");

    await db.insert(technician).values({
      discordUserId: user.id,
      displayName: displayName,
    });

    await interaction.reply({
      content: `✅ Técnico ${displayName} registrado com sucesso!`,
      ephemeral: true,
    });
  },
};
