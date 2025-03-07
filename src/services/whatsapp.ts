import { IManager } from "../interfaces/Manager";
import { IBranch } from "../interfaces/Branch";

export function createWhatsAppLink(managerData: IManager, branch: IBranch, ipType: string): string | null {
  if (!managerData.phone) return null;

  const phoneNumber = managerData.phone.replace(/\D/g, "");
  let message: string;

  if (ipType === "ata") {
    message = encodeURIComponent(`Olá, ${managerData.name}! O ATA da filial ${branch.name} (Número: FL ${branch.branchNumber}) está offline. Por gentileza, poderia reconectar o cabo de rede, por favor? Obrigado! 😊`);
  } else {
    message = encodeURIComponent(`Olá, ${managerData.name}! A filial ${branch.name} (Número: FL ${branch.branchNumber}) está offline. Por gentileza, poderia verificar a energia e enviar uma foto do rack? Obrigado! 😊`);
  }

  const url = `https://web.whatsapp.com/send/?phone=${phoneNumber}&text=${message}`;
  if (url.length > 512) {
    console.error("❌ O URL do WhatsApp excede o limite de 512 caracteres.");
    return null;
  }
  return url;
}
