import { useForm } from "react-hook-form";
import CredentialKeeper from "../services/CredentialKeeper";
import {
  CredentialInputs,
  CredentialName,
} from "../interfaces/credential.interface";
import CredentialInput from "./CredentialInput";

type CredentialFormProps = {
  credentialKeeper: CredentialKeeper;
};

export const CredentialForm = ({ credentialKeeper }: CredentialFormProps) => {
  const { register, handleSubmit } = useForm<CredentialInputs>();

  const onSubmit = async (data: CredentialInputs) => {
    console.log(data);

    const pin = await credentialKeeper.secure(data);
    alert(`Votre code PIN est ${pin}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-2/5">
      {Object.keys(CredentialName).map((key) => (
        <CredentialInput
          title={CredentialName[key as keyof typeof CredentialName]}
          name={key}
          id={key}
          register={register}
          defaultValue=""
        />
      ))}
      <button
        type="submit"
        className="w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
      >
        Valider
      </button>
    </form>
  );
};
