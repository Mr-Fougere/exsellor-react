type RecapInformationProps = {
  title: string;
  value: any;
};

export const RecapInformation = ({ title, value }: RecapInformationProps) => {
  return (
    <div className="flex justify-between bg-gray-100 p-2 rounded w-full">
      {title}
      <span className="ml-1 font-bold">{value.toString()}</span>
    </div>
  );
};
