import * as React from "react";
import { FC } from "react";
import Image from "next/image";
import { getContracts } from "./config/contracts.config";
import Script from "next/script";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
} from "@tanstack/table-core";

import { flexRender, useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import qseal from "@/public/qseal.png";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { abi as auditTrailAbi } from "../contracts/AuditTrail.sol/AuditTrail.json";
import { getContract } from "viem";

import { Input } from "@/components/ui/input";

import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { ForceClient } from "./ForceClient";
import { decrypt, encrypt } from "@/lib/backend-utils";

export const CenterAlignedHeader: FC<{ header: string }> = ({ header }) => (
  <div className="capitalize text-center">{header}</div>
);

export type AuditLog = {
  userNameEncrypted: string;
  userNameDecrypted: string;
  documentHash: string;
  customer: string;
  timeStamp: number;
  sigType: number;
};

const sigTypeMap: { [index: number]: string } = {
  0: "Seal",
  1: "QSeal",
  2: "QES",
  3: "AES",
  4: "SES",
};

export const AuditLogs = () => {
  // arb sepolia
  const chainId = 421614;

  const [encryptedName, setEncryptedName] = React.useState<string>("");

  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);
  const [decryptedUsernames, setDecryptedUsernames] = React.useState<string[]>(
    []
  );
  const [auditorKey, setAuditorKey] = React.useState<string>("");

  const client = createPublicClient({
    chain: arbitrumSepolia,
    transport: http("https://sepolia-rollup.arbitrum.io/rpc"),
  });

  React.useEffect(() => {
    const fetchAuditLogs = async () => {
      if (!client) return;
      // if logs is not empty then return
      if (auditLogs.length) return;
      const auditTrailAddress = getContracts(chainId)
        .auditTrail as `0x${string}`;

      const auditTrail = getContract({
        address: auditTrailAddress,
        abi: auditTrailAbi,
        client: client,
      });

      const logs = (await auditTrail.read.getAuditLogs()) as any;
      // create list of decrypted usernames
      const decryptedNames = await Promise.all(
        logs.map(async (log: AuditLog, index: number) => {
          const decryptedName = await decrypt(log.userNameEncrypted, index);
          return decryptedName;
        })
      );

      // add the decrypted usernames to the logs
      setAuditLogs(
        logs.map((log: AuditLog, index: number) => {
          return {
            ...log,
            userNameDecrypted: decryptedNames[index],
          };
        }) as AuditLog[]
      );
    };
    fetchAuditLogs();
  }, [auditLogs.length, client]);

  const auditTrailAddress = getContracts(chainId).auditTrail as `0x${string}`;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "userNameEncrypted",
      header: () => {
        return <CenterAlignedHeader header="Username Encrypted" />;
      },
      cell: ({ row }: any) => {
        console.log("username", row.original?.userNameEncrypted?.toString());
        return (
          <div className="text-center">
            {row.original?.userNameEncrypted?.toString()}
          </div>
        );
      },
    },
    {
      accessorKey: "userNameDecrypted",
      header: () => {
        return <CenterAlignedHeader header="Username Decrypted" />;
      },
      cell: ({ row }: any) => {
        return (
          <div className="text-center">
            {row.original?.userNameDecrypted?.toString()}
          </div>
        );
      },
    },
    {
      accessorKey: "documentHash",
      header: () => {
        return <CenterAlignedHeader header="Document Hash" />;
      },
      cell: ({ row }: any) => (
        <div className="text-center">
          {row.original?.documentHash?.toString()}
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: () => {
        return <CenterAlignedHeader header="customer" />;
      },
      cell: ({ row }: any) => (
        <div className={"flex justify-center items-center space-x-2"}>
          <div className="text-center">Glaux Group Demo</div>
        </div>
      ),
    },
    {
      accessorKey: "timestamp",
      header: () => {
        return <CenterAlignedHeader header="timestamp" />;
      },
      cell: ({ row }: any) => {
        return (
          <div className="text-center">
            {new Date(
              parseInt(row.original?.timeStamp?.toString()) * 1000
            ).toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "sigType",
      header: () => {
        return <CenterAlignedHeader header="Signature Type" />;
      },
      cell: ({ row }: any) => (
        <div className={"flex justify-center items-center space-x-2"}>
          <div className="text-center">{sigTypeMap[row.original?.sigType]}</div>
          <Image src={qseal} className={"w-5 bg-transparent"} alt={""} />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: (auditLogs as AuditLog[]) || [],
    //@ts-ignore
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    table.getColumn("userNameDecrypted")?.toggleVisibility();
  }, [table]);

  return (
    <>
      <div className={"text-3xl m-4 text-center"}>All Log Records</div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter usernames..."
          value={
            (table
              .getColumn("userNameDecrypted")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            console.log("event", event.target.value);
            table
              .getColumn("userNameDecrypted")
              ?.setFilterValue(event.target.value);
          }}
          className="max-w-sm m-2 ml-6"
        />
        <Input
          // label="Email"
          placeholder="Auditor password key..."
          value={auditorKey}
          onChange={(event) => {
            console.log("event", event.target.value);
            setAuditorKey(event.target.value);
          }}
          className="max-w-sm m-2 ml-6"
          title="Auditor view key"
        />
      </div>
      <div className="rounded-md border-2 border-gray-700 m-6">
        <ForceClient>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="px-2 w-1/6 [&:has([role=checkbox])]:pl-3"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getFilteredRowModel().rows?.length ? (
                table.getFilteredRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-gray-700 border-y-2 hover:bg-gray-500 transition-colors duration-400 ease-in-out"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-2 w-1/6 [&:has([role=checkbox])]:pl-3"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ForceClient>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};
