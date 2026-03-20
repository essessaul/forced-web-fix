import React, { useMemo, useState } from "react";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function normalize(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatKey(date) {
  const d = normalize(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildMonth(year, monthIndex) {
  const first = normalize(new Date(year, monthIndex, 1));
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const jsWeekday = first.getDay();
  const mondayOffset = (jsWeekday + 6) % 7;

  const cells = [];
  for (let i = 0; i < mondayOffset; i += 1) {
    cells.push({ empty: true, key: `empty-start-${monthIndex}-${i}` });
  }

  for (let day = 1; day <= lastDay; day += 1) {
    const date = normalize(new Date(year, monthIndex, day));
    cells.push({
      key: `${year}-${monthIndex}-${day}`,
      date,
      dateKey: formatKey(date),
      day,
      empty: false,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ empty: true, key: `empty-end-${monthIndex}-${cells.length}` });
  }

  return {
    label: first.toLocaleString("en-US", { month: "long", year: "numeric" }).toUpperCase(),
    cells,
  };
}

function nightsBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const diff = Math.round((normalize(endDate) - normalize(startDate)) / 86400000);
  return diff > 0 ? diff : 0;
}

export default function AdvancedDateRangePicker({
  monthsToShow = 2,
  startMonth = new Date(2026, 3, 1),
  blockedDateKeys = [],
  minNights = 1,
  onChange,
}) {
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [previewEnd, setPreviewEnd] = useState(null);

  const blockedSet = useMemo(() => new Set(blockedDateKeys), [blockedDateKeys]);

  const months = useMemo(() => {
    return Array.from({ length: monthsToShow }).map((_, index) => {
      const current = new Date(startMonth.getFullYear(), startMonth.getMonth() + index, 1);
      return buildMonth(current.getFullYear(), current.getMonth());
    });
  }, [monthsToShow, startMonth]);

  function hasBlockedInside(startDate, endDate) {
    const startTs = normalize(startDate).getTime();
    const endTs = normalize(endDate).getTime();
    for (const month of months) {
      for (const cell of month.cells) {
        if (!cell.empty && blockedSet.has(cell.dateKey)) {
          const ts = cell.date.getTime();
          if (ts > startTs && ts < endTs) return true;
        }
      }
    }
    return false;
  }

  function emitChange(startDate, endDate) {
    if (onChange) onChange(startDate, endDate);
  }

  function startNewRange(date) {
    setRangeStart(date);
    setRangeEnd(null);
    setPreviewEnd(null);
    emitChange(date, null);
  }

  function completeRange(date) {
    setRangeEnd(date);
    setPreviewEnd(null);
    emitChange(rangeStart, date);
  }

  function handleDateClick(cell) {
    if (cell.empty) return;
    if (blockedSet.has(cell.dateKey)) return;

    // RANGE MODE: first click = start
    if (!rangeStart) {
      startNewRange(cell.date);
      return;
    }

    // RANGE MODE: after completed range, next click restarts selection
    if (rangeStart && rangeEnd) {
      startNewRange(cell.date);
      return;
    }

    // RANGE MODE: second click = end, and all in-between becomes selected
    if (cell.date.getTime() <= rangeStart.getTime()) {
      startNewRange(cell.date);
      return;
    }

    if (nightsBetween(rangeStart, cell.date) < minNights) return;
    if (hasBlockedInside(rangeStart, cell.date)) return;

    completeRange(cell.date);
  }

  function handleDateHover(cell) {
    if (cell.empty) return;
    if (blockedSet.has(cell.dateKey)) return;
    if (!rangeStart || rangeEnd) return;
    if (cell.date.getTime() <= rangeStart.getTime()) {
      setPreviewEnd(null);
      return;
    }
    if (hasBlockedInside(rangeStart, cell.date)) {
      setPreviewEnd(null);
      return;
    }
    setPreviewEnd(cell.date);
  }

  const activeRangeEnd = rangeEnd || previewEnd;

  function isSelected(date) {
    const ts = date.getTime();
    return (rangeStart && ts === rangeStart.getTime()) || (rangeEnd && ts === rangeEnd.getTime());
  }

  function isInRange(date) {
    if (!rangeStart || !activeRangeEnd) return false;
    const ts = date.getTime();
    return ts >= rangeStart.getTime() && ts <= activeRangeEnd.getTime();
  }

  return (
    <div className="airbnb-calendar-wrap" onMouseLeave={() => !rangeEnd && setPreviewEnd(null)}>
      {months.map((month) => (
        <div key={month.label} className="airbnb-month-card">
          <div className="airbnb-month-label">{month.label}</div>
          <div className="airbnb-weekdays">
            {WEEKDAYS.map((day) => (
              <div key={day} className="airbnb-weekday">{day}</div>
            ))}
          </div>

          <div className="airbnb-month-grid">
            {month.cells.map((cell) => {
              if (cell.empty) return <div key={cell.key} className="airbnb-day-empty" />;

              let className = "airbnb-day";
              if (blockedSet.has(cell.dateKey)) className += " blocked";
              else className += " available";
              if (isInRange(cell.date)) className += " in-range";
              if (isSelected(cell.date)) className += " selected";

              return (
                <button
                  key={cell.key}
                  type="button"
                  className={className}
                  onClick={() => handleDateClick(cell)}
                  onMouseEnter={() => handleDateHover(cell)}
                  disabled={blockedSet.has(cell.dateKey)}
                  aria-label={cell.dateKey}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
