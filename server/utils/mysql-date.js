const toMysqlDatetime = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

const nowIST = () => {
  const now = new Date();
  const expires = new Date(now.getTime() + 5 * 60 * 1000); // +5 min
  return expires.toISOString().slice(0, 19).replace("T", " ");
}

export { toMysqlDatetime, nowIST }
