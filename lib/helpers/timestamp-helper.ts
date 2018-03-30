export namespace Timestamp {
  export function ToMinutesAndSeconds(duration: number): string {
    let text = '';
    if (duration < 0) {
      text += '-';
      duration *= -1;
    }

    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor(duration / 1000) - 60 * minutes;

    return (
      text +
      minutes +
      ':' +
      ('00' + seconds).substring(seconds.toString().length)
    );
  }

  export function ToSeconds(duration: number): string {
    const deciseconds = Math.floor((duration % 1000) / 100);
    const seconds = Math.floor(duration / 1000);

    if (deciseconds > 0) {
      return `${seconds}.${deciseconds}s`;
    }

    return `${seconds}s`;
  }

  export function ToDayAndMonth(timestamp: number): string {
    const date = new Date(timestamp);
    const months = [
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
      'Dec'
    ];

    return date.getUTCDate() + ' ' + months[date.getUTCMonth()];
  }

  export function ToDateTimeString(timestamp: number): string {
    const timezoneOffsetInMilliseconds =
      new Date().getTimezoneOffset() * 60 * 1000;
    const dateString = new Date(
      timestamp - timezoneOffsetInMilliseconds
    ).toUTCString();

    const words = dateString.split(' ');
    words[0] = words[0].slice(0, -1); // Remove comma after day
    words.pop(); // Remove timezone
    words.splice(3, 1); // Remove year
    words[words.length - 1] = words[words.length - 1].slice(0, -3); // Remove seconds

    return words.join(' ');
  }

  export function ToTime(timestamp: number): string {
    const dateString = ToDateTimeString(timestamp);
    const words = dateString.split(' ');

    return words[words.length - 1];
  }

  export function ToHoursOrMinutes(duration: number): string {
    const hours = Math.floor(duration / 3600000);

    if (hours > 0) {
      return hours + ' hour' + (hours > 1 ? 's' : '');
    }

    const minutes = Math.floor(duration / 60000) - 60 * hours;

    return minutes + ' minute' + (minutes > 1 ? 's' : '');
  }
}
