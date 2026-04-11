import type { FC } from "react";

interface OroLogoProps {
  size?: number;
  className?: string;
}

export const OroLogo: FC<OroLogoProps> = ({ size = 40, className }) => {
  return (
    <img
      src="/logo.png"
      alt="Oro Logo"
      width={size}
      height={size}
      className={className}
      style={{ 
        display: "block", 
        objectFit: "contain",
        mixBlendMode: "multiply"
      }}
    />
  );
};
