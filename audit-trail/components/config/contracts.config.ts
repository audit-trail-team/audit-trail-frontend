export type Contracts = { [key in ContractNames]: string };
type ContractNames = "auditTrail";

const contracts = {
  // arbitrum one.
  42161: {
    auditTrail: "",
  },
  // aribitrum sepolia.
  421614: {
    auditTrail: "0x1ab6D7eB4DBb0509e90cd83A24F467594cD30562",
  },
};

export const getContracts = (chainId: number): Contracts => {
  return contracts[chainId as keyof typeof contracts];
};
