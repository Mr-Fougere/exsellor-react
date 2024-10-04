import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { DocType } from "../interfaces/export.interface";

type RadioGroupWithIconsProps = {
  id: string;
  name: string;
  requiredMessage: string;
  watch: UseFormWatch<any>;
  register: UseFormRegister<any>;
};

const DocTypeRadioGroup = ({
  id,
  name,
  requiredMessage,
  register,
  watch,
}: RadioGroupWithIconsProps) => {
  const getIconClass = (docTypeKey: string) => {
    switch (docTypeKey) {
      case "delivery":
        return "fa-solid fa-truck";
      case "order":
        return "fa-solid fa-box";
      case "creditnote":
        return "fa-solid fa-dollar-sign";
      default:
        return "fa-regular fa-file";
    }
  };

  const selectedValue = watch(name, "invoice");

  return (
    <div className="space-x-2 flex flex-row align-center mt-2 px-2">
      {Object.entries(DocType).map(([key, value]) => (
        <label
          key={key}
          htmlFor={`${id}-${key}`}
          className={`flex items-center flex-col h-32 flex-1 p-2 border border-gray-300 rounded-md cursor-pointer justify-center 
            ${
              selectedValue === key
                ? "bg-cyan-600 text-white"
                : "bg-sky-50 text-gray-700"
            } 
            hover:bg-sky-200 .border-gray-300`}
        >
          <i className={`${getIconClass(key)} text-5xl`}></i>
          <span className="text-center px-2">{value}</span>
          <input
            type="radio"
            id={`${id}-${key}`}
            defaultChecked={DocType.invoice === value}
            value={key}
            {...register(name, { required: requiredMessage })}
            className="hidden"
          />
        </label>
      ))}
    </div>
  );
};

export default DocTypeRadioGroup;
