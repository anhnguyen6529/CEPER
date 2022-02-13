import AdapterMoment from '@mui/lab/AdapterMoment';

export default function CustomAdapterMoment(options) {
    const adapter = new AdapterMoment(options);

  const constructDayObject = (day) => ({ charAt: () => day });

  return {
    ...adapter,

    getWeekdays() {
      const customWeekdays = adapter.getWeekdays();
      return customWeekdays.map((day) => constructDayObject(day));
    }
  };
}
