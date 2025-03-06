import { EmbedBuilder } from "discord.js";

export function createDowntimeEmbed(branch: any, ipType: string) {
  return new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("🚨 Filial Offline")
    .addFields({ name: "Filial", value: branch.name, inline: true }, { name: "IP Afetado", value: ipType === "switch" ? branch.switchIp : branch.ataIp, inline: true }, { name: "Operadora", value: branch.operator, inline: true })
    .setTimestamp();
}

export function createRecoveryEmbed(branch: any, downtime: any) {
  const duration = Math.floor((downtime.end_time - downtime.start_time) / 1000);
  return new EmbedBuilder()
    .setColor("#00FF00")
    .setTitle("✅ Conexão Restaurada")
    .addFields({ name: "Filial", value: branch.name }, { name: "Tempo Offline", value: `${duration} segundos` })
    .setTimestamp();
}
