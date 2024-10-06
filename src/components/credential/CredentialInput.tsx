import { UseFormRegister } from "react-hook-form";

type CredentialInputProps = {
  defaultValue: string | number | undefined;
  register: UseFormRegister<any>;
  title: string;
  name: string;
  id: string;
};

export default function CredentialInput({
  defaultValue,
  register,
  title,
  name,
  id,
}: CredentialInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <input
        defaultValue={defaultValue}
        type="text"
        id={id}
        {...register(name, {
          required: "Ce champ est requis",
        })}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
}
