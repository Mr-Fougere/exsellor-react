import { useForm } from "react-hook-form";
import CredentialKeeper from "../../services/CredentialKeeper";
import { useState } from "react";
import { CredentialInputs, CredentialName } from "../../interfaces/credential.interface";
import PinDisplay from "../reusable/PinDisplay";
import { InformationBanner } from "../reusable/InformationBanner";
import CredentialInput from "./CredentialInput";


type CredentialFormProps = {
  credentialKeeper: CredentialKeeper;
};

export const CredentialForm = ({ credentialKeeper }: CredentialFormProps) => {
  const { register, handleSubmit } = useForm<CredentialInputs>();
  const [pin, setPin] = useState<string[]>([]);

  const onSubmit = async (data: CredentialInputs) => {
    const pin = await credentialKeeper.secure(data);
    setPin(pin);
  };

  const confirmMemorizedPin = () => {
    credentialKeeper.confirmMemorizedPin();
  };

  return (
    <div className="flex justify-center items-center p-4" >
      {pin.length > 0 ? (
        <div className="flex flex-col justify-center items-center space-y-2">
          <h2 className="text-2xl font-bold">Votre code PIN</h2>
          <PinDisplay pin={pin} length={pin.length} />
          <InformationBanner backgroundColor="red">
            <p className="text-gray-500">
              Conservez-le précieusement, il vous sera demandé pour accéder à
              vos informations
            </p>
          </InformationBanner>
          <button
            className="w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
            onClick={confirmMemorizedPin}
          >
            Valider
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-2/5">
          {Object.values(CredentialName).map((value) => (
            <CredentialInput
              title={value}
              name={value}
              id={value}
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
      )}
    </div>
  );
};
