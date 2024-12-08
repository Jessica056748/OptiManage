<script lang="ts">
  // Credit to Jon Musselwhite: https://stackoverflow.com/questions/58213585/svelte-3-how-to-loop-each-block-x-amount-of-times.
  function* range(start: number, end: number): Generator<number> {
    for (let i = start; i <= end; i++) yield i
  }

  function daysInMonth(month: number, year: number): number {
    // 0 is Jan for months, and the last day of the previous month for date (1 is the first of this month).
    return new Date(year, month + 1, 0).getDate()
  }

  const today = new Date(),
    year = today.getFullYear(),
    month = today.getMonth()

  const firstWeekdayThisMonth = new Date(year, month, 1).getDay(),
    daysThisMonth = daysInMonth(month, year),
    daysLastMonth = daysInMonth(month - 1, year),
    weekdays = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'],
    months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

  const firstCalendarDate =
      firstWeekdayThisMonth > 0
        ? 1 - firstWeekdayThisMonth + daysLastMonth
        : 1 - firstWeekdayThisMonth,
    daysBefore =
      firstCalendarDate === 1 ? 0 : daysLastMonth + 1 - firstCalendarDate,
    daysAfter = 35 - daysBefore - daysThisMonth
</script>

<div class="options">OPTIONS</div>
<div class="calendar">
  <!-- 0 <= count <= 5 -->
  {#each range(1, daysBefore) as i}
    <!-- {#each range(firstCalendarDate, daysLastMonth) as i} -->
    <div class="grayed">{firstCalendarDate + i}</div>
  {/each}

  <!-- Count will always be daysThisMonth. -->
  {#each range(1, daysThisMonth) as i}
    <div class={i === today.getDate() ? 'today' : ''}>{i}</div>
  {/each}
  {#each range(1, daysAfter) as i}
    <div class="grayed">{i}</div>
  {/each}
</div>

<style>
  .options,
  .calendar {
    width: 100%;
  }

  .options {
    height: 100px;
    border-bottom: 2px solid white;
  }
  .calendar {
    flex-grow: 1;
    display: grid;
    display: grid;
    grid: repeat(5, 1fr) / repeat(7, 1fr);
    overflow-y: scroll;
  }

  .calendar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .calendar::-webkit-scrollbar-track {
    width: 3px;
    background: #f0f0f0;
  }

  .calendar::-webkit-scrollbar-thumb {
    background: #888;
  }

  .calendar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .calendar > * {
    padding: 3px;
    border: 0 solid white;
    border-width: 0 1px 1px;
    aspect-ratio: 1 / 1;
  }
  .today {
    font-weight: bold;
    color: hsl(237, 100%, 70%);
    border-color: hsl(237, 100%, 70%);
    background-color: hsla(0, 0%, 0%, 0.2);
  }
  .grayed {
    color: hsl(0, 0%, 70%);
    background-color: hsla(0, 0%, 0%, 0.3);
  }

  @media (prefers-color-scheme: light) {
    .options,
    .calendar {
      color: white;
    }
  }
</style>
