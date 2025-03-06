import { SlashCommandBuilder } from "discord.js";
import { db } from "../../db/connection";
import { technicianRange, technician } from "../../db/schema";
import { eq } from "drizzle-orm";

export const listRangesCommand = {
  data: new SlashCommandBuilder().setName("listar-ranges").setDescription("Lista os ranges de responsabilidade"),
  async execute(interaction: any) {
    const user = interaction.user;

    const ranges = await db.select().from(technicianRange).leftJoin(technician, eq(technicianRange.technicianId, technician.id)).where(eq(technician.discordUserId, user.id));

    if (ranges.length === 0) {
      await interaction.reply({
        content: "❌ Nenhum range encontrado para você.",
        ephemeral: true,
      });
      return;
    }

    const rangeList = ranges.map((range) => `- ${range.technician_range.startRange} a ${range.technician_range.endRange}`).join("\n");

    await interaction.reply({
      content: `📋 Seus ranges de responsabilidade:\n${rangeList}`,
      ephemeral: true,
    });
  },
};
