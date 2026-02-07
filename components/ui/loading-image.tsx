"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingImageProps extends ImageProps {
    containerClassName?: string;
}

export function LoadingImage({
    alt,
    src,
    className,
    containerClassName,
    ...props
}: LoadingImageProps) {
    const [isLoading, setLoading] = useState(true);

    return (
        <div
            className={cn(
                "relative overflow-hidden bg-zinc-800/50",
                containerClassName
            )}
        >
            <Image
                alt={alt}
                src={src}
                className={cn(
                    "duration-700 ease-in-out",
                    isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
                    className
                )}
                onLoad={() => setLoading(false)}
                {...props}
            />
        </div>
    );
}
