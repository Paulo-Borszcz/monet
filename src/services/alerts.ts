import { db } from "../db/connection";
import { downtime, ipType, branch, manager } from "../db/schema";
import { EmbedBuilder, TextBasedChannel, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { eq, and } from "drizzle-orm";
import { client } from "../index";

export async function checkDowntime(branchData: any, ipTypeValue: string, isAlive: boolean) {
  const ipTypeEnum = ipTypeValue as (typeof ipType.enumValues)[number];

  const openDowntime = await db.query.downtime.findFirst({
    where: and(eq(downtime.branchId, branchData.id), eq(downtime.ipType, ipTypeEnum), eq(downtime.status, "open")),
  });

  if (!isAlive) {
    if (!openDowntime) {
      await db.insert(downtime).values({
        branchId: branchData.id,
        ipType: ipTypeEnum,
        status: "open",
      });

      await sendAlert(branchData, ipTypeEnum);
    }
  } else {
    if (openDowntime) {
      await db.update(downtime).set({ status: "closed", endTime: new Date() }).where(eq(downtime.id, openDowntime.id));

      await sendRecoveryAlert(branchData, openDowntime);
    }
  }
}

export async function sendAlert(branchData: any, ipType: string) {
  const managerData = await db.query.manager.findFirst({
    where: (manager, { eq }) => eq(manager.id, branchData.managerId),
  });

  // Determina o tipo de problema (SWITCH, ATA ou ambos)
  let problemType = ipType === "switch" ? "SWITCH" : "ATA";
  if (ipType === "switch") {
    problemType = "SWITCH e ATA";
  }

  const simpleEmbed = new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("🚨 Filial Offline")
    .setDescription(`A filial **${branchData.name}** (Número: **${branchData.branchNumber}**) está offline.`)
    .addFields({ name: "Problema", value: problemType, inline: true }, { name: "Operadora", value: branchData.operator, inline: true })
    .setFooter({ text: "Verifique a situação o quanto antes." })
    .setTimestamp();

  const detailedEmbed = new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("🚨 Ação Necessária - Filial Offline")
    .addFields(
      { name: "Filial", value: branchData.name, inline: true },
      { name: "Número", value: String(branchData.branchNumber), inline: true },
      { name: "Problema", value: problemType, inline: true },
      { name: "Operadora", value: branchData.operator, inline: true },
      { name: "Gerente", value: managerData ? `${managerData.name} (${managerData.phone})` : "Não informado", inline: true },
      { name: "Instruções", value: "1. Verifique se a energia está ok com a filial.\n2. Envie uma foto do rack de rede para a operadora.\n3. Atualize o status para a equipe." }
    )
    .setFooter({ text: "Agradecemos sua atenção!" })
    .setTimestamp();

  let whatsappLink: string | null = null;
  if (managerData?.phone) {
    const phoneNumber = managerData.phone.replace(/\D/g, "");
    let message = "";
    if (ipType === "ata") {
      message = encodeURIComponent(`Olá, ${managerData.name}! O ATA da filial ${branchData.name} (Número: ${branchData.branchNumber}) está offline. Por gentileza, pdoeria reconectar o cabo de rede, por favor? Obrigado! 😊`);
    } else {
      message = encodeURIComponent(`Olá, ${managerData.name}! A filial ${branchData.name} (Número: ${branchData.branchNumber}) está offline. Por gentileza, poderia verificar a energia e enviar uma foto do rack? Obrigado! 😊`);
    }
    whatsappLink = `https://web.whatsapp.com/send/?phone=${phoneNumber}&text=${message}`;
    if (whatsappLink.length > 512) {
      console.error("❌ O URL do WhatsApp excede o limite de 512 caracteres.");
      whatsappLink = null;
    }
  }

  const row = whatsappLink ? new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setLabel("Chamar Gerente no WhatsApp").setStyle(ButtonStyle.Link).setURL(whatsappLink)) : null;

  const channel = client.channels.cache.get(process.env.ALERT_CHANNEL_ID!);
  if (channel && channel.isTextBased() && "send" in channel) {
    await (channel as TextChannel).send({
      embeds: [simpleEmbed],
      components: row ? [row] : [],
    });
  }

  const technician = await db.query.technician.findFirst({
    where: (technician, { eq }) => eq(technician.id, branchData.technicianId),
  });

  if (technician) {
    const user = await client.users.fetch(technician.discordUserId);
    await user.send({
      embeds: [detailedEmbed],
      components: row ? [row] : [],
    });
  }
}

export async function sendRecoveryAlert(branchData: any, downtime: any) {
  const managerData = await db.query.manager.findFirst({
    where: (manager, { eq }) => eq(manager.id, branchData.managerId),
  });

  const duration = Math.floor((new Date().getTime() - downtime.startTime.getTime()) / 1000);

  const simpleEmbed = new EmbedBuilder()
    .setColor("#00FF00")
    .setTitle("✅ Filial Online")
    .addFields({ name: "Filial", value: branchData.name, inline: true }, { name: "Número", value: String(branchData.branchNumber), inline: true }, { name: "Tempo Offline", value: `${duration} segundos`, inline: true })
    .setTimestamp();

  const detailedEmbed = new EmbedBuilder()
    .setColor("#00FF00")
    .setTitle("✅ Problema Resolvido - Filial Online")
    .addFields(
      { name: "Filial", value: branchData.name, inline: true },
      { name: "Número", value: String(branchData.branchNumber), inline: true },
      { name: "Tempo Offline", value: `${duration} segundos`, inline: true },
      { name: "Gerente", value: managerData ? `${managerData.name} (${managerData.phone})` : "Não informado", inline: true }
    )
    .setFooter({ text: "Agradecemos sua colaboração!" })
    .setTimestamp();

  const channel = client.channels.cache.get(process.env.ALERT_CHANNEL_ID!);
  if (channel && channel.isTextBased() && "send" in channel) {
    await (channel as TextChannel).send({
      embeds: [simpleEmbed],
    });
  }

  const technician = await db.query.technician.findFirst({
    where: (technician, { eq }) => eq(technician.id, branchData.technicianId),
  });

  if (technician) {
    const user = await client.users.fetch(technician.discordUserId);
    await user.send({
      embeds: [detailedEmbed],
    });
  }
}
