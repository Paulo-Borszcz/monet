export type OperatorType = "ALT" | "ACT";

export interface IBranch {
  id: number;
  name: string;
  branchNumber: number;
  switchIp: string;
  ataIp: string;
  operator: OperatorType;
  managerId: number | null;
  technicianId: number | null;
}
