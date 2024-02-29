export const timeSince = (date: string) => {
  if (!date || date === '') return 'Unknown';

  const seconds = Math.abs(
    Math.floor(new Date().getTime() - new Date(date).getTime()) / 1000
  );

  let interval = seconds / 31536000;

  if (interval > 1) {
    return (
      Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '')
    );
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return (
      Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '')
    );
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return (
      Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '')
    );
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return (
      Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '')
    );
  }
  interval = seconds / 60;
  if (interval > 1) {
    return (
      Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '')
    );
  }
  return Math.floor(seconds) + ' second' + (Math.floor(seconds) > 1 ? 's' : '');
};
