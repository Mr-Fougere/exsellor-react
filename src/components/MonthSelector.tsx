import { useEffect, useState } from "react";

type MonthSelectorProps = {
  setDates: Function;
  selectedDates?: {
    start: Date;
    end: Date;
  };
};

const MonthSelector = ({ setDates, selectedDates }: MonthSelectorProps) => {
  const [months, setMonths] = useState<{ [key: number]: string }>({});

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const getFirstAndLastDays = (month: number) => {
    const firstDay = new Date(currentYear as number, month, 1);
    const lastDay = new Date(
      currentYear as number,
      month + (month == currentMonth ? 0 : 1),
      month == currentMonth ? today.getDay() - 1 : 0
    );
    return { start: firstDay, end: lastDay };
  };

  const isSelected = (month: number) => {
    if (!selectedDates) return false;

    const { start, end } = getFirstAndLastDays(month);

    const areStartTimesEqual =
      selectedDates.start.getDay() === start.getDay() &&
      selectedDates.start.getMonth() === start.getMonth();

    const areEndTimesEqual =
      selectedDates.end.getDay() === end.getDay() &&
      selectedDates.end.getMonth() === end.getMonth();

    return areStartTimesEqual && areEndTimesEqual;
  };

  useEffect(() => {
    const availableMonths: Record<string, string> = {};
    for (let i = 0; i < currentMonth + 1; i++) {
      availableMonths[i] = monthNames[i];
    }
    setMonths(availableMonths);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 px-2">
      {Object.entries(months).map(([monthIndex, monthName]) => (
        <button
          type="button"
          key={monthIndex}
          onClick={() => setDates(getFirstAndLastDays(Number(monthIndex)))}
          className={`rounded px-4 py-2 hover:bg-sky-200 border border-gray-300 rounded ${
            isSelected(Number(monthIndex))
              ? "bg-cyan-600 text-white"
              : "bg-sky-50 text-black"
          }`}
        >
          {monthName} {currentYear}
        </button>
      ))}
    </div>
  );
};

export default MonthSelector;
