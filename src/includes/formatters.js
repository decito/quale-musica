const formatTime = (time) => {
  if (!time) {
    return "00:00";
  }

  const minutes = Math.floor(time / 60) || 0;
  const seconds = Math.round(time - minutes * 60 || 0);

  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const limitValue = (value) => {
  if (value < 0 || value > 1) {
    return;
  }

  return value;
};

export { formatTime, limitValue };
