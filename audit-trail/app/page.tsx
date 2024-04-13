"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

import swiss from "@/public/swiss.png";

export default function Home() {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/eigen.jpeg')] bg-no-repeat bg-cover h-screen opacity-10"></div>
        <div className="relative z-10 p-8">
          <div className="w-1/2 mx-auto">
            <div
              className={
                "flex p-2 border-b-2 border-red-500 border-dotted mb-8 items-center text-primary"
              }
            >
              <div className={"flex space-x-2 items-center"}>
                <Image src={swiss} className={"h-10 w-10"} alt={""} />
                <p className={"text-3xl"}>Audit Trail</p>
              </div>
              <p className="ml-auto text-lg">networkName: blabla</p>
            </div>
            <div
              className={
                "w-full h-96 border-2 border-red-500 border-dotted flex items-center"
              }
            >
              <div style={{ width: "50%" }} className={"ml-4"}>
                <blockquote className="mt-6 mb-4  pl-6 italic">
                  For every company that wants to have a immutable permament
                  record of the data.
                </blockquote>
                {
                  <div className={"flex flex-col space-y-2 items-center"}>
                    <Button
                      className={"w-48"}
                      onClick={() => {
                        console.log("Some shadcn button");
                      }}
                    >
                      Some shadcn button
                    </Button>
                  </div>
                }
              </div>
              <div
                className={
                  "flex w-full items-center justify-center align-middle space-x-4"
                }
              >
                <p className="pb-2 text-3xl font-semibold text-primary">
                  Audit Trail
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
