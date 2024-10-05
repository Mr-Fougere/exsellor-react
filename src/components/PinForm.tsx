import { useEffect, useState, useRef } from "react";
import CredentialKeeper from "../services/CredentialKeeper";
import PinDisplay from "./PinDisplay";

type PinFormProps = {
  credentialKeeper: CredentialKeeper;
  length?: number;
};

export const PinForm = ({ credentialKeeper, length = 4 }: PinFormProps) => {
  const [remainingPinTest, setRemainingPinTest] = useState<number>(
    credentialKeeper.remainingPinTest
  );
  const pinRef = useRef<string[]>([]);
  const [pinDisplay, setPinDisplay] = useState<string[]>([]);

  const handleKeyUp = (e: KeyboardEvent) => {
    if (pinRef.current.length < length && e.key >= "0" && e.key <= "9") {
      pinRef.current = [...pinRef.current, e.key];
      setPinDisplay([...pinRef.current]);
    } else if (e.key === "Backspace" && pinRef.current.length > 0) {
      pinRef.current = pinRef.current.slice(0, -1);
      setPinDisplay([...pinRef.current]);
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleValidLengthPin = async () => {
    if (pinRef.current.length === length) {
      await credentialKeeper.testPin(pinRef.current.join("")).then((result) => {
        if (result) {
          console.log("Pin correct");
        } else {
          setRemainingPinTest(credentialKeeper.remainingPinTest);
        }
        pinRef.current = [];
        setPinDisplay([]);
      });
    }
  };

  useEffect(() => {
    handleValidLengthPin();
  }, [pinDisplay]);

  const handleResetCreds = async () => {
    await credentialKeeper.reset();
  };

  return (
    <div className="flex flex-col">
      <input maxLength={length} type="number" className="hidden" />
      <PinDisplay pin={pinDisplay} length={length}></PinDisplay>
      <div>Tentatives restantes avant reset: {remainingPinTest}</div>
      <div>
        <button onClick={handleResetCreds}>
          {" "}
          Réinitialiser mes identifiants{" "}
        </button>
      </div>
    </div>
  );
};
