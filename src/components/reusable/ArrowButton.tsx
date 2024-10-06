type Props = {
  direction: "left" | "right";
  handleClick: () => void; // More specific typing for handleClick
  disabled: boolean;
};

export const ArrowButton = ({ disabled, handleClick, direction }: Props) => {
  const iconDirection =
    direction === "left" ? "fa-chevron-left" : "fa-chevron-right";

  return (
    <div
      onClick={!disabled ? handleClick : undefined} // Prevent click if disabled
      className={`px-2 py-1 border rounded 
            ${
              disabled
                ? "bg-gray-200"
                : "border-gray-300 hover:bg-gray-200 cursor-pointer"
            }
          `}
    >
      <i className={`fa-solid ${iconDirection}`}></i>
    </div>
  );
};
