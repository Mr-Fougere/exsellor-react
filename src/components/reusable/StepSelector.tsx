import { useEffect, useState } from "react";
import {
  CreditNoteStep,
  DeliveryStep,
  DocumentType,
  DraftStep,
  InvoiceStep,
  OrderStep,
} from "../../interfaces/enum";
import { DocumentSteps } from "../../interfaces/sellsy.interface";
import { useTranslation } from "react-i18next";

type StepSelectorProps = {
  documentType: DocumentType;
};

export default function StepSelector({ documentType }: StepSelectorProps) {
  const { t } = useTranslation('', { keyPrefix: 'enum.steps' });
  const [availableSteps, setAvailableSteps] = useState<DocumentSteps>();

  useEffect(() => {
    let steps = null;
    switch (documentType) {
      case DocumentType.Invoice:
        steps = InvoiceStep;
        break;
      case DocumentType.CreditNote:
        steps = CreditNoteStep;
        break;
      case DocumentType.Delivery:
        steps = DeliveryStep;
        break;
      case DocumentType.Order:
        steps = OrderStep;
        break;
      default:
        steps = DraftStep;
        break;
    }
    setAvailableSteps(Object.values(steps));
  }, [documentType]);

  return (
    <div className="flex flex-row items-center justify-center mt-2 px-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-2 flex-1">
        {availableSteps?.map((step) => (
          <button
            type="button"
            key={step}
            onClick={() => console.log(step)}
            className={`rounded p-2 hover:bg-sky-200 border border-gray-300 rounded`}
          >
            <div>{t(step)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
