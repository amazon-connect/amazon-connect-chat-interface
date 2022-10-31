// Set time zone to UTC for jest config
// https://stackoverflow.com/questions/56261381/how-do-i-set-a-timezone-in-my-jest-config
module.exports = async () => {
  process.env.TZ = 'UTC';
};