import ping from "ping";
import { db } from "../db/connection";
import { branch } from "../db/schema";
import { checkDowntime } from "./alerts";

export class MonitorService {
  private interval!: NodeJS.Timeout;

  constructor(private checkInterval: number = 60000) {} // 1 minuto

  start() {
    this.interval = setInterval(async () => {
      console.log("🔍 Verificando status das filiais...");
      const branches = await db.select().from(branch);

      for (const branch of branches) {
        console.log(`📡 Verificando filial: ${branch.name}`);

        const switchResult = await ping.promise.probe(branch.switchIp);
        console.log(`- IP switch (${branch.switchIp}): ${switchResult.alive ? "Online" : "Offline"}`);

        if (!switchResult.alive) {
          await checkDowntime(branch, "switch", false);
        } else {
          const ataResult = await ping.promise.probe(branch.ataIp);
          console.log(`- IP ata (${branch.ataIp}): ${ataResult.alive ? "Online" : "Offline"}`);

          if (!ataResult.alive) {
            await checkDowntime(branch, "ata", false);
          } else {
            await checkDowntime(branch, "switch", true);
            await checkDowntime(branch, "ata", true);
          }
        }
      }
    }, this.checkInterval);
  }

  stop() {
    clearInterval(this.interval);
  }
}
