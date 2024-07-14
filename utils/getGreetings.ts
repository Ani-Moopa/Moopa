export const getGreetings = () => {
  const time = new Date().getHours();
  let greeting = "";

  if (time >= 5 && time < 12) {
    greeting = "Good morning";
  } else if (time >= 12 && time < 18) {
    greeting = "Good afternoon";
  } else if (time >= 18 && time < 22) {
    greeting = "Good evening";
  } else if (time >= 22 || time < 5) {
    greeting = "Good night";
  }

  return greeting;
};
