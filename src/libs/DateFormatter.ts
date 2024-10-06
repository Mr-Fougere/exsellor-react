export const formatInputDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Ajouter un zéro devant si nécessaire
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ajouter un zéro devant si nécessaire
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const formatDispayedDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Ajouter un zéro devant si nécessaire
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ajouter un zéro devant si nécessaire
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDisplayedTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const remainingSeconds = time % 60;
  return `${minutes} min ${remainingSeconds} s`;
};
