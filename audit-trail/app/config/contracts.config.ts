export type Contracts = { [key in ContractNames]: string };
type ContractNames = "auditTrail";

const contracts = {
  // arbitrum one.
  42161: {
    auditTrail: "",
  },
  // aribitrum sepolia.
  421614: {
    auditTrail: "0x36e6909E146E3c15d19c0A9A6fa6dDe649A96662",
  },
};

export const getContracts = (chainId: number): Contracts => {
  return contracts[chainId as keyof typeof contracts];
};
