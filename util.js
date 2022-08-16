const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const scheduleTasks = (cb, times = 2, ms = 1000) => {
  for (let x = 1; x <= times; x++) {
    delay(x * ms).then(cb);
  }
};
