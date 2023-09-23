import React from "react";
import Image from "next/image";
import { useState } from "react";

export default function Characters({ info }) {

    const [showAll, setShowAll] = useState(false);

    return (
        <div className="">
            <div className="flex items-center justify-between lg:gap-3 z-40 px-3">
                <h1 className="font-karla text-[20px] font-bold">Characters</h1>
                {info?.length > 6 && (
                    <div className="cursor-pointer font-karla" onClick={() => setShowAll(!showAll)}>
                        {showAll ? "show less" : "show more"}
                    </div>
                )}
            </div>
            <div className="grid w-full grid-cols-1 gap-[12px] md:gap-4 md:grid-cols-3 md:pt-7 md:pb-5 px-3 md:px-5 pt-4">
                {info.slice(0, showAll ? info.length : 6).map((item, index) => {
                    return <a key={index} className="md:hover:scale-[1.02] snap-start hover:shadow-lg scale-100 transition-transform duration-200 ease-out w-full cursor-default">
                        <div className="text-gray-300 space-x-4 col-span-1 flex w-full h-24 bg-secondary rounded-md">
                            <div className="relative h-full w-16">
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
                                    className="object-cover rounded-l-md"
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
        </div>
    );
}