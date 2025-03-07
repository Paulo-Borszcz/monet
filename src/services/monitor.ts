import ping from "ping";
import { db } from "../db/connection";
import { branch } from "../db/schema";
import { checkDowntime } from "./alerts";

export class MonitorService {
  private interval!: NodeJS.Timeout;

  constructor(private checkInterval: number = 60000) {} // 1 minuto

  start() {
    this.interval = setInterval(this.monitorBranches.bind(this), this.checkInterval);
  }

  stop() {
    clearInterval(this.interval);
  }

  private async monitorBranches() {
    console.log("🔍 Verificando status das filiais...");
    const branches = await db.select().from(branch);

    for (const branch of branches) {
      await this.checkBranchStatus(branch);
    }
  }

  private async checkBranchStatus(branch: any) {
    console.log(`📡 Verificando filial: ${branch.name}`);

    const switchResult = await this.checkComponentStatus(branch.switchIp, "switch");
    const ataResult = switchResult.alive ? await this.checkComponentStatus(branch.ataIp, "ata") : { alive: false };

    if (!switchResult.alive) {
      await checkDowntime(branch, "switch", false);
    } else if (!ataResult.alive) {
      await checkDowntime(branch, "ata", false);
    } else {
      await this.updateComponentsStatus(branch);
    }
  }

  private async checkComponentStatus(ip: string, componentName: string) {
    const result = await ping.promise.probe(ip);
    console.log(`- IP ${componentName} (${ip}): ${result.alive ? "Online" : "Offline"}`);
    return result;
  }

  private async updateComponentsStatus(branch: any) {
    await checkDowntime(branch, "switch", true);
    await checkDowntime(branch, "ata", true);
  }
}
