import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { registerTechnicianCommand } from "./bot/commands/registerTechnician";
import { addRangeCommand } from "./bot/commands/addRange";
import { listRangesCommand } from "./bot/commands/listRanges";
import { MonitorService } from "./services/monitor";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
});

const commands = [registerTechnicianCommand.data, addRangeCommand.data, listRangesCommand.data];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log("🔧 Registrando comandos...");
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!), { body: commands });
    console.log("✅ Comandos registrados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao registrar comandos:", error);
  }
})();

const monitor = new MonitorService();

client.on("ready", () => {
  console.log(`✅ Bot conectado como ${client.user?.tag}`);
  monitor.start();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "registrar-tecnico") {
    await registerTechnicianCommand.execute(interaction);
  } else if (commandName === "adicionar-range") {
    await addRangeCommand.execute(interaction);
  } else if (commandName === "listar-ranges") {
    await listRangesCommand.execute(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
export { client };
