<script lang="ts">
  import Day from '$lib/home/Day.svelte'
  import { getUserContext, setUserContext } from '../../context.js'

  let user = getUserContext(),
    { data } = $props(),
    { shifts } = data

  user.shifts = shifts
  setUserContext(user)

  // Credit to Jon Musselwhite for this range function: https://stackoverflow.com/questions/58213585/svelte-3-how-to-loop-each-block-x-amount-of-times.
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
    weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

  const firstCalendarDate =
      firstWeekdayThisMonth > 0
        ? 1 - firstWeekdayThisMonth + daysLastMonth
        : 1 - firstWeekdayThisMonth,
    daysBefore =
      firstCalendarDate === 1 ? 0 : daysLastMonth + 1 - firstCalendarDate,
    daysAfter = 35 - daysBefore - daysThisMonth

  const messages = {
      morning: ['Good morning', 'Rise and shine', 'Eat the frog'],
      afternoon: ['Good afternoon', 'Keep working', 'Eat well'],
      evening: [
        'Good evening',
        'Sit back and unwind',
        'The morning starts tonight',
      ],
      night: ['Rest and recharge', 'Sleep is your superpower', 'Good night'],
    },
    randomIndex = Math.floor(Math.random() * 2 + 1),
    hour = today.getHours(),
    greeting =
      messages[
        hour >= 5 && hour < 12
          ? 'morning'
          : hour >= 12 && hour < 16
            ? 'afternoon'
            : hour >= 16 && hour < 21
              ? 'evening'
              : 'night'
      ][randomIndex]
</script>

<div class="options">
  <div>
    <h2>{greeting}, {user.name}</h2>
    {months[month]}
    {today.getDate()}, {year}
  </div>
</div>
<div class="calendar">
  {#each range(1, daysBefore) as i}
    <!-- TOOO: Fix. Shouldn't have to subtract 1. -->
    <Day _classes={['grayed']} day={firstCalendarDate + i - 1} />
    <!-- <Date classes={['grayed']} date={firstCalendarDate + i} /> -->
    <!-- <div class="grayed">{firstCalendarDate + i}</div> -->
  {/each}
  {#each range(1, daysThisMonth) as i}
    <Day _classes={[i === today.getDate() ? 'today' : '']} day={i} />
    <!-- <div class={i === today.getDate() ? 'today' : ''}>{i}</div> -->
  {/each}
  {#each range(1, daysAfter) as i}
    <Day _classes={['grayed']} day={i} />
    <!-- <div class="grayed">{i}</div> -->
  {/each}
</div>

<style>
  .options,
  .calendar {
    width: 100%;
  }

  .options {
    /* Maybe we don't need that big of an options page, since most of the editing is done on the calendar itself. */
    /* height: 100px; */
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

  @media only screen and (max-width: 810px) {
    .options {
      /* height: 80px; */
    }
  }
  @media (prefers-color-scheme: light) {
    .options,
    .calendar {
      color: white;
    }
  }
</style>
