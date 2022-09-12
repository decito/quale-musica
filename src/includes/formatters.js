const formatTime = (time) => {
  if (!time) {
    return "00:00";
  }

  const minutes = Math.floor(time / 60) || 0;
  const seconds = Math.round(time - minutes * 60 || 0);

  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const limitVolume = (value) => {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
};

const limitText = (value) => {
  if (!value.length) {
    return;
  }

  if (value.length > 18) {
    return `${value.substring(0, 18)}...`;
  }

  return value;
};

export { formatTime, limitVolume, limitText };
