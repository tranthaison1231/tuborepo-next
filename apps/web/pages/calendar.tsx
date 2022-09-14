import { Calendar, MonthCalendar } from "calendar";
import { format } from "date-fns";

export default function Web() {
  return (
    <div className="h-screen w-screen grid place-content-center bg-gray-200">
      <Calendar className="bg-white rounded-xl p-4 space-y-8">
        <Calendar.Header className="flex items-center">
          <Calendar.Title className="px-3 text-lg font-semibold" />

          <div className="flex ml-auto gap-3 items-center px-2">
            <Calendar.Button action="previous month" className="p-1 text-lg">
              {"<"}
            </Calendar.Button>
            <Calendar.Button action="next month" className="p-1 text-lg">
              {">"}
            </Calendar.Button>
          </div>
        </Calendar.Header>

        <MonthCalendar>
          <MonthCalendar.ColumnHeader />

          <MonthCalendar.GridCell>
            {(date) => <button className="p-3">{format(date, "dd")}</button>}
          </MonthCalendar.GridCell>
        </MonthCalendar>
      </Calendar>
    </div>
  );
}
