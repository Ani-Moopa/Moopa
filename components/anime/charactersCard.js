import React from "react";
import Image from "next/image";
import { useState } from "react";

export default function Characters({ info }) {

    const [showAll, setShowAll] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between lg:gap-3 px-5 z-40 ">
                <h1 className="font-karla text-[20px] font-bold">Characters</h1>
                {info?.length > 6 && (
                    <div className="cursor-pointer font-karla" onClick={() => setShowAll(!showAll)}>
                        {showAll ? "show less" : "show more"}
                    </div>
                )}
            </div>
            {/* for bigger device */}
            <div className="hidden md:grid w-full grid-cols-1 gap-[10px] md:gap-4 md:grid-cols-3 md:pt-7 md:pb-5 px-3 md:px-5 pt-4">
                {info.slice(0, showAll ? info.length : 6).map((item, index) => {
                    return <a key={index} className="md:hover:scale-[1.02] snap-start hover:shadow-lg scale-100 transition-transform duration-200 ease-out w-full cursor-default">
                        <div className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-secondary rounded-md overflow-hidden">
                            <div className="relative h-full w-20">
                                <Image
                                    draggable={false}
                                    src={
                                        item.node.image.large ||
                                        item.node.image.medium
                                    }
                                    width={500}
                                    height={300}
                                    alt={
                                        item.node.name.userPreferred ||
                                        item.node.name.full ||
                                        "Character Image"
                                    }
                                    className="rounded-l-md"
                                />
                            </div>
                            <div className="py-2 flex flex-col justify-between">
                                <p className="font-semibold">{item.node.name.full || item.node.name.userPreferred}</p>
                                <p>{item.role}</p>
                            </div>
                        </div>
                    </a>
                })}
            </div>
            {/* for smaller devices */}
            <div className="flex md:hidden h-full w-full select-none overflow-x-scroll overflow-y-hidden scrollbar-hide gap-4 pt-8 pb-4 px-5 z-30">
                {info.slice(0, showAll ? info.length : 6).map((item, index) => {
                    return <div key={index} className="flex flex-col gap-3 shrink-0 cursor-pointer">
                        <a className="hover:scale-105 hover:shadow-lg duration-300 ease-out group relative">
                            <div className="h-[190px] w-[135px] rounded-md z-30">
                                <Image
                                    draggable={false}
                                    src={
                                        item.node.image.large ||
                                        item.node.image.medium
                                    }
                                    alt={
                                        item.node.name.userPreferred ||
                                        item.node.name.full ||
                                        "Character Image"
                                    }
                                    width={500}
                                    height={300}
                                    className="z-20 h-[190px] w-[135px] object-cover rounded-md brightness-90"
                                />
                            </div>
                        </a>
                        <a className="w-[135px] lg:w-[185px] line-clamp-2">
                            <h1 className="font-karla font-semibold text-[15px]">{item.node.name.full || item.node.name.userPreferred}</h1>
                            <h1 className="font-karla float-right italic text-[12px]">~{item.role}</h1>
                        </a>
                    </div>
                })}
            </div>
        </div>
    );
}