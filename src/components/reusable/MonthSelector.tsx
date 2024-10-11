import { useEffect, useState } from "react";
import { Month } from "../../interfaces/enum";
import { ArrowButton } from "./ArrowButton";
import { PeriodDates } from "../../interfaces/sellsy.interface";
import { useTranslation } from "react-i18next";

type MonthSelectorProps = {
  documentTypePeriodDates: PeriodDates;
  setDates: Function;
  selectedDates?: {
    start: Date;
    end: Date;
  };
};

const MonthSelector = ({
  setDates,
  selectedDates,
  documentTypePeriodDates,
}: MonthSelectorProps) => {
  const { t } = useTranslation('', { keyPrefix: 'enum.month' });

  const [months, setMonths] = useState<{ [key: number]: string }>({});
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const getFirstAndLastDays = (month: number) => {
    const firstDay = new Date(selectedYear, month, 1);
    const lastDay = new Date(
      selectedYear,
      month +
        (month === documentTypePeriodDates.start.getMonth() &&
        selectedYear === documentTypePeriodDates.start.getFullYear()
          ? 0
          : 1),
      month === documentTypePeriodDates.start.getMonth() &&
      selectedYear === documentTypePeriodDates.start.getFullYear()
        ? documentTypePeriodDates.start.getDate()
        : 0
    );
    return { start: firstDay, end: lastDay };
  };

  const isSelected = (month: number) => {
    if (!selectedDates) return false;

    const { start, end } = getFirstAndLastDays(month);

    const areStartTimesEqual =
      selectedDates.start.getDate() === start.getDate() &&
      selectedDates.start.getMonth() === start.getMonth() &&
      selectedDates.start.getFullYear() === selectedYear;

    const areEndTimesEqual =
      selectedDates.end.getDate() === end.getDate() &&
      selectedDates.end.getMonth() === end.getMonth() &&
      selectedDates.end.getFullYear() === selectedYear;

    return areStartTimesEqual && areEndTimesEqual;
  };

  const handlePrevYear = () => {
    if (selectedYear > documentTypePeriodDates?.end?.getFullYear()) {
      setSelectedYear(selectedYear - 1);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < documentTypePeriodDates.start.getFullYear()) {
      setSelectedYear(selectedYear + 1);
    }
  };

  const nextYearDisabled =
    selectedYear === documentTypePeriodDates.start.getFullYear();
  const previousYearDisabled =
    selectedYear === documentTypePeriodDates.end.getFullYear();

  useEffect(() => {
    const availableMonths: Record<string, string> = {};
    for (
      let i = 0;
      i <
      (selectedYear === documentTypePeriodDates.start.getFullYear()
        ? documentTypePeriodDates.start.getMonth() + 1
        : 12);
      i++
    ) {
      availableMonths[i] = Object.values(Month)[i];
    }
    setMonths(availableMonths);
  }, [selectedYear]);

  useEffect(() => {
    setSelectedYear(documentTypePeriodDates.start.getFullYear());
  }, [documentTypePeriodDates]);

  return (
    <div className="flex flex-row items-center justify-center mt-2 px-2">
      <ArrowButton
        direction="left"
        handleClick={handlePrevYear}
        disabled={previousYearDisabled}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-2 flex-1">
        {Object.entries(months).map(([monthIndex, monthName]) => (
          <button
            type="button"
            key={monthIndex}
            onClick={() => setDates(getFirstAndLastDays(Number(monthIndex)))}
            className={`rounded p-2 hover:bg-sky-200 border border-gray-300 rounded
            ${
              documentTypePeriodDates.end.getMonth() > Number(monthIndex) &&
              documentTypePeriodDates.end.getFullYear() === selectedYear
                ? "bg-gray-200 text-white pointer-events-none"
                : isSelected(Number(monthIndex))
                ? "bg-cyan-600 text-white"
                : "bg-sky-50 text-black"
            } 
            `}
          >
            <div>{t(monthName)}</div>
            <div>{selectedYear}</div>
          </button>
        ))}
      </div>

      <ArrowButton
        direction="right"
        handleClick={handleNextYear}
        disabled={nextYearDisabled}
      />
    </div>
  );
};

export default MonthSelector;
