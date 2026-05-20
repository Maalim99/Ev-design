import {
  AvatarFallback,
  AvatarImage,
  Avatar as DefaultAvatar
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { User } from "lucide-react";
import { ComponentProps } from "react";

const avatarVariants = cva("block rounded-full overflow-hidden", {
  variants: {
    size: {
      sm: "size-7",
      md: "size-8",
      lg: "size-9",
      xl: "size-10"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

const iconSizeMap = {
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24
};

type AvatarVariantProps = VariantProps<typeof avatarVariants>;
export type Size = AvatarVariantProps["size"];

type Props = {
  isOnline?: boolean;
  onClick?: () => void;
} & AvatarVariantProps &
  Pick<ComponentProps<typeof AvatarImage>, "alt" | "src">;

export default function Avatar({ size, isOnline, src, alt, onClick }: Props) {
  return (
    <div className="relative inline-block size-fit">
      <DefaultAvatar className={cn(avatarVariants({ size }))} onClick={onClick}>
        <AvatarImage
          className="aspect-square size-full object-cover"
          src={src}
          alt={alt}
        />
        <AvatarFallback className="flex items-center justify-center bg-[#F9FAFB]">
          <User
            className="text-[#92A5BA]"
            size={iconSizeMap[size || "md"]}
          />
        </AvatarFallback>
      </DefaultAvatar>

      {isOnline && (
        <span
          className={cn(
            "inline-block bg-green-400 rounded-full",
            "absolute bottom-0 right-0",
            "border border-white",
            size === "sm" || size === "md" ? "size-2" : "size-3"
          )}
          data-testid="presence-indicator"
        />
      )}
    </div>
  );
}

// size
// 28 x 28
// 32 x 32
// 36 x 36
// 40 x 40
