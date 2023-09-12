// Function to transform the schedule data into the desired format
export const transformSchedule = (schedule) => {
  const formattedSchedule = {};

  for (const day of Object.keys(schedule)) {
    formattedSchedule[day] = {};

    for (const scheduleItem of schedule[day]) {
      const time = scheduleItem.airingAt;

      if (!formattedSchedule[day][time]) {
        formattedSchedule[day][time] = [];
      }

      formattedSchedule[day][time].push(scheduleItem);
    }
  }

  return formattedSchedule;
};

export const sortScheduleByDay = (schedule) => {
  const daysOfWeek = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  // Get the current day of the week (0 = Sunday, 1 = Monday, ...)
  const currentDay = new Date().getDay();

  // Reorder days of the week to start with today
  const orderedDays = [
    ...daysOfWeek.slice(currentDay),
    ...daysOfWeek.slice(0, currentDay),
  ];

  // Create a new object with sorted days
  const sortedSchedule = {};
  orderedDays.forEach((day) => {
    if (schedule[day]) {
      sortedSchedule[day] = schedule[day];
    }
  });

  return sortedSchedule;
};

export const filterScheduleByDay = (sortedSchedule, filterDay) => {
  if (filterDay === "All") return sortedSchedule;
  // Create a new object to store the filtered schedules
  const filteredSchedule = {};

  // Iterate through the keys (days) in sortedSchedule
  for (const day in sortedSchedule) {
    // Check if the current day matches the filterDay
    if (day === filterDay) {
      // If it matches, add the schedules for that day to the filteredSchedule object
      filteredSchedule[day] = sortedSchedule[day];
    }
  }

  // Return the filtered schedule
  return filteredSchedule;
};

export const filterFormattedSchedule = (formattedSchedule, filterDay) => {
  if (filterDay === "All") return formattedSchedule;

  // Check if the selected day exists in the formattedSchedule
  if (formattedSchedule.hasOwnProperty(filterDay)) {
    return {
      [filterDay]: formattedSchedule[filterDay],
    };
  }

  // If the selected day does not exist, return an empty object
  return {};
};
