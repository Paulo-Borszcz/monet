import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db/connection";
import { technicianRange } from "../../db/schema";

export const addRangeCommand = {
  data: new SlashCommandBuilder()
    .setName("adicionar-range")
    .setDescription("Adiciona um range de responsabilidade para um técnico")
    .addIntegerOption((option) => option.setName("inicio").setDescription("Início do range (ex: 1)").setRequired(true))
    .addIntegerOption((option) => option.setName("fim").setDescription("Fim do range (ex: 50)").setRequired(true)),
  async execute(interaction: any) {
    const user = interaction.user;
    const startRange = interaction.options.getInteger("inicio");
    const endRange = interaction.options.getInteger("fim");

    const tech = await db.query.technician.findFirst({
      where: (technician, { eq }) => eq(technician.discordUserId, user.id),
    });

    if (!tech) {
      await interaction.reply({
        content: "❌ Você precisa se registrar como técnico primeiro!",
        ephemeral: true,
      });
      return;
    }

    await db.insert(technicianRange).values({
      technicianId: tech.id,
      startRange: startRange,
      endRange: endRange,
    });

    await interaction.reply({
      content: `✅ Range ${startRange}-${endRange} adicionado com sucesso!`,
      ephemeral: true,
    });
  },
};
