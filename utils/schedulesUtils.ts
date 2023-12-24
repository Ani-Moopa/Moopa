interface ScheduleItem {
  airingAt: string;
  // Add other properties of ScheduleItem if available
}

interface Schedule {
  [day: string]: ScheduleItem[];
}

interface FormattedSchedule {
  [day: string]: {
    [time: string]: ScheduleItem[];
  };
}

export const transformSchedule = (schedule: Schedule): FormattedSchedule => {
  const formattedSchedule: FormattedSchedule = {};

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

export const sortScheduleByDay = (
  schedule: FormattedSchedule
): FormattedSchedule => {
  const daysOfWeek: string[] = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const currentDay: number = new Date().getDay();

  const orderedDays: string[] = [
    ...daysOfWeek.slice(currentDay),
    ...daysOfWeek.slice(0, currentDay),
  ];

  const sortedSchedule: FormattedSchedule = {};
  orderedDays.forEach((day) => {
    if (schedule[day]) {
      sortedSchedule[day] = schedule[day];
    }
  });

  return sortedSchedule;
};

export const filterScheduleByDay = (
  sortedSchedule: FormattedSchedule,
  filterDay: string
): FormattedSchedule => {
  if (filterDay === "All") return sortedSchedule;

  const filteredSchedule: FormattedSchedule = {};

  for (const day in sortedSchedule) {
    if (day === filterDay) {
      filteredSchedule[day] = sortedSchedule[day];
    }
  }

  return filteredSchedule;
};

export const filterFormattedSchedule = (
  formattedSchedule: FormattedSchedule,
  filterDay: string
): FormattedSchedule => {
  if (filterDay === "All") return formattedSchedule;

  if (formattedSchedule.hasOwnProperty(filterDay)) {
    return {
      [filterDay]: formattedSchedule[filterDay],
    };
  }

  return {};
};
