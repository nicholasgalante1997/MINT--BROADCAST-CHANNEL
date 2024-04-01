String.prototype.toCapitalCase = function () {
  return this.split(' ')
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
    .join(' ');
};