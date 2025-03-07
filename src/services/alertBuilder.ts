import { EmbedBuilder } from "discord.js";
import { IBranch } from "../interfaces/Branch";
import { IManager } from "../interfaces/Manager";
import { IDowntime } from "../interfaces/Downtime";

export function createProblemType(ipType: string): string {
  return ipType === "switch" ? "SWITCH e ATA" : "ATA";
}

export function buildSimpleAlertEmbed(branch: IBranch, problemType: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("🚨 Filial Offline")
    .setDescription(`A filial **${branch.name}** (Número: **${branch.branchNumber}**) está offline.`)
    .addFields({ name: "Problema", value: problemType, inline: true }, { name: "Operadora", value: branch.operator, inline: true })
    .setFooter({ text: "Verifique a situação o quanto antes." })
    .setTimestamp();
}

export function buildDetailedAlertEmbed(branch: IBranch, problemType: string, managerData?: IManager): EmbedBuilder {
  return new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("🚨 Ação Necessária - Filial Offline")
    .addFields(
      { name: "Filial", value: branch.name, inline: true },
      { name: "Número", value: String(branch.branchNumber), inline: true },
      { name: "Problema", value: problemType, inline: true },
      { name: "Operadora", value: branch.operator, inline: true },
      { name: "Gerente", value: managerData ? `${managerData.name} (${managerData.phone})` : "Não informado", inline: true },
      {
        name: "Instruções",
        value: "1. Verifique se a energia está ok com a filial.\n2. Envie uma foto do rack de rede para a operadora.\n3. Atualize o status para a equipe.",
      }
    )
    .setFooter({ text: "Agradecemos sua atenção!" })
    .setTimestamp();
}

export function buildSimpleRecoveryEmbed(branch: IBranch, downtimeRecord: IDowntime, durationSeconds: number): EmbedBuilder {
  return new EmbedBuilder()
    .setColor("#00FF00")
    .setTitle("✅ Filial Online")
    .addFields({ name: "Filial", value: branch.name, inline: true }, { name: "Número", value: String(branch.branchNumber), inline: true }, { name: "Tempo Offline", value: `${durationSeconds} segundos`, inline: true })
    .setTimestamp();
}

export function buildDetailedRecoveryEmbed(branch: IBranch, downtimeRecord: IDowntime, durationSeconds: number, managerData?: IManager): EmbedBuilder {
  return new EmbedBuilder()
    .setColor("#00FF00")
    .setTitle("✅ Problema Resolvido - Filial Online")
    .addFields(
      { name: "Filial", value: branch.name, inline: true },
      { name: "Número", value: String(branch.branchNumber), inline: true },
      { name: "Tempo Offline", value: `${durationSeconds} segundos`, inline: true },
      { name: "Gerente", value: managerData ? `${managerData.name} (${managerData.phone})` : "Não informado", inline: true }
    )
    .setFooter({ text: "Agradecemos sua colaboração!" })
    .setTimestamp();
}
