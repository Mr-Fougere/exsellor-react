type Props = {
  pin: string[];
  length: number;
};

export default function PinDisplay({ pin, length }: Props) {
  return (
    <div className="flex flex-row space-x-2">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className={`w-20 h-40 border ${
            pin[index] ? "border-black" : ""
          } bg-gray-100 rounded flex items-center justify-center text-4xl`}
        >
          {pin[index]}
        </div>
      ))}
    </div>
  );
}
