import { db } from "../db/connection";
import { downtime, ipType } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { client } from "../index";
import { IBranch } from "../interfaces/Branch";
import { IManager } from "../interfaces/Manager";
import { IDowntime } from "../interfaces/Downtime";
import { ITechnician } from "../interfaces/Technician";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { createProblemType, buildSimpleAlertEmbed, buildDetailedAlertEmbed, buildSimpleRecoveryEmbed, buildDetailedRecoveryEmbed } from "./alertBuilder";
import { createWhatsAppLink } from "./whatsapp";
import { sendEmbedToChannel, sendEmbedToUser } from "./sendMessage";

export async function checkDowntime(branch: IBranch, ipTypeValue: string, isAlive: boolean): Promise<void> {
  const ipTypeEnum = ipTypeValue as (typeof ipType.enumValues)[number];

  const openDowntime = await db.query.downtime.findFirst({
    where: and(eq(downtime.branchId, branch.id), eq(downtime.ipType, ipTypeEnum), eq(downtime.status, "open")),
  });

  if (!isAlive && !openDowntime) {
    await db.insert(downtime).values({
      branchId: branch.id,
      ipType: ipTypeEnum,
      status: "open",
    });
    await sendAlert(branch, ipTypeEnum);
    return;
  }

  if (isAlive && openDowntime) {
    await db.update(downtime).set({ status: "closed", endTime: new Date() }).where(eq(downtime.id, openDowntime.id));

    await sendRecoveryAlert(branch, openDowntime);
  }
}

export async function sendAlert(branch: IBranch, ipType: string): Promise<void> {
  const managerData: IManager | null = await getManagerData(branch);
  const problemType = createProblemType(ipType);
  const simpleEmbed = buildSimpleAlertEmbed(branch, problemType);
  const detailedEmbed = buildDetailedAlertEmbed(branch, problemType, managerData ?? undefined);

  const components: any[] = managerData ? await getWhatsAppLinkComponents(managerData, branch, ipType) : [];

  await sendEmbedToChannel(simpleEmbed, components);

  if (branch.technicianId !== null) {
    const technician = await getTechnician(branch.technicianId);
    if (technician) {
      await sendEmbedToUser(technician.discordUserId, detailedEmbed, components);
    }
  }
}

export async function sendRecoveryAlert(branch: IBranch, downtimeRecord: IDowntime): Promise<void> {
  const managerData: IManager | null = await getManagerData(branch);
  if (!downtimeRecord.startTime) {
    console.error("downtimeRecord.startTime é nulo.");
    return;
  }

  const durationSeconds = Math.floor((Date.now() - new Date(downtimeRecord.startTime).getTime()) / 1000);
  const simpleEmbed = buildSimpleRecoveryEmbed(branch, downtimeRecord, durationSeconds);
  const detailedEmbed = buildDetailedRecoveryEmbed(branch, downtimeRecord, durationSeconds, managerData ?? undefined);

  await sendEmbedToChannel(simpleEmbed);

  if (branch.technicianId !== null) {
    const technician = await getTechnician(branch.technicianId);
    if (technician) {
      await sendEmbedToUser(technician.discordUserId, detailedEmbed);
    }
  }
}

async function getManagerData(branch: IBranch): Promise<IManager | null> {
  if (branch.managerId !== null) {
    return (
      (await db.query.manager.findFirst({
        where: (manager, { eq }) => eq(manager.id, branch.managerId as number),
      })) ?? null
    );
  }
  return null;
}

async function getTechnician(technicianId: number): Promise<ITechnician | null> {
  return (
    (await db.query.technician.findFirst({
      where: (technician, { eq }) => eq(technician.id, technicianId),
    })) ?? null
  );
}

async function getWhatsAppLinkComponents(managerData: IManager, branch: IBranch, ipType: string): Promise<any[]> {
  const whatsappLink = createWhatsAppLink(managerData, branch, ipType);
  if (whatsappLink) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setLabel("Chamar Gerente no WhatsApp").setStyle(ButtonStyle.Link).setURL(whatsappLink));
    return [row];
  }
  return [];
}
