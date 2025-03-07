import { EmbedBuilder, TextChannel } from "discord.js";
import { client } from "../index";

export async function sendEmbedToChannel(embed: EmbedBuilder, components: any[] = []): Promise<void> {
  const channelId = process.env.ALERT_CHANNEL_ID;

  if (!channelId) {
    console.error("ALERT_CHANNEL_ID não encontrado no .env");
    return;
  }

  try {
    const channel = await client.channels.fetch(channelId);

    if (channel && channel instanceof TextChannel) {
      await channel.send({ embeds: [embed], components });
    } else {
      console.error("Canal não encontrado ou não é um canal de texto");
    }
  } catch (error) {
    console.error("Erro ao enviar embed para o canal:", error);
  }
}

export async function sendEmbedToUser(userId: string, embed: EmbedBuilder, components: any[] = []): Promise<void> {
  try {
    const user = await client.users.fetch(userId);

    if (user) {
      await user.send({ embeds: [embed], components });
    }
  } catch (error) {
    console.error("Erro ao enviar embed para o usuário:", error);
  }
}
