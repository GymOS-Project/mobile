import React from "react";
import * as Icons from "lucide-react-native";

type IconName = keyof typeof Icons;

interface RenderIconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const Icon = ({
  name,
  size = 20,
  color = "#000",
  strokeWidth = 2,
}: RenderIconProps) => {
  const Icon = Icons[name] || Icons.CircleAlert;
  //@ts-ignore
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
};

export default Icon;
