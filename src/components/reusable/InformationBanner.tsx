import React from "react";

type InformationBannerProps = {
  backgroundColor: string;
  children: React.ReactNode;
};

export const InformationBanner = ({
  backgroundColor,
  children,
}: InformationBannerProps) => {
  return (
    <div
      className={`flex p-2 items-center rounded text-xs w-full ${getBackgroundColorClass(
        backgroundColor
      )}`}
    >
      <i className="fa-solid fa-circle-info mr-2 text-sm"></i>
      {children}
    </div>
  );
};

const getBackgroundColorClass = (color: string) => {
  const colorMapping: { [key: string]: string } = {
    red: "bg-red-100",
    green: "bg-green-100",
    blue: "bg-cyan-100"
  };

  return colorMapping[color] || "bg-gray-100"; // Default to gray if the color is not found
};
