"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

import swiss from "@/public/swiss.png";
import { AuditLogs } from "@/components/AuditLogs";

export default function Home() {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/eigen.jpeg')] bg-no-repeat bg-cover h-full min-h-screen opacity-15"></div>
        <div className="relative z-10 p-8">
          <div className="w-2/3 mx-auto">
            <div
              className={
                "flex p-2 border-b-2 border-red-500 border-dotted mb-8 items-center text-primary"
              }
            >
              <div className={"flex space-x-2 items-center"}>
                <Image src={swiss} className={"h-10 w-10"} alt={""} />
                <p className={"text-3xl"}>Audit Trail</p>
              </div>
              <p className="ml-auto text-lg">Network: Arbitrum</p>
            </div>
            <div
              className={"w-full h-fit border-2 border-red-500 border-dotted"}
            >
              <div className={"m-8 flex items-center justify-center space-x-4"}>
                <div className={"m-4 w-1/2"}>
                  <blockquote className="mt-6 mb-4  pl-6 italic">
                    For every company that wants to have a immutable permament
                    record of the data.
                  </blockquote>
                </div>
                <div
                  className={
                    "m-4 w-1/2 flex items-center justify-center align-middle space-x-4"
                  }
                >
                  <p className="pb-2 text-3xl font-semibold text-primary">
                    Audit Trail
                  </p>
                </div>
              </div>
              <div className="w-full m-auto">
                <AuditLogs />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
