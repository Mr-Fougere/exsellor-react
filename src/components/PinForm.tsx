import { useEffect, useState } from "react";
import CredentialKeeper from "../services/CredentialKeeper";

type PinFormProps = {
  credentialKeeper: CredentialKeeper;
  length?: number;
};

export const PinForm = ({ credentialKeeper, length = 4 }: PinFormProps) => {
  const [pin, setPin] = useState<string[]>([]);
  const [remainingPinTest, setRemainingPinTest] = useState<number>(credentialKeeper.remainingPinTest);

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key >= "0" && e.key <= "9") {
      if (pin.length < length) {
        setPin((prev) => [...prev, e.key]);
      }
    } else if (e.key === "Backspace") {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleValidLengthPin = async () => {
    if (pin.length === length) {
      await credentialKeeper.testPin(pin.join("")).then((result) => {
        if (result) {
          console.log("Pin correct");
        } else {
          setRemainingPinTest(credentialKeeper.remainingPinTest);
        }
      });
    }
  };

  useEffect(() => {
    handleValidLengthPin();
  }, [pin]);

  const handleResetCreds = async () => {
    await credentialKeeper.reset();
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-2">
        <input maxLength={length} type="number" className="hidden" />
        {Array.from({ length }).map((_, index) => (
          <div
            key={index}
            className="w-20 h-40 border border-black bg-gray-100 rounded flex items-center justify-center"
          >
            {pin[index]} {/* Affiche le chiffre correspondant */}
          </div>
        ))}
      </div>
      <div>
        Tentatives restantes avant reset: {remainingPinTest}
      </div>
      <div>
        <button onClick={handleResetCreds}> Reset creds </button>
      </div>
    </div>
  );
};
