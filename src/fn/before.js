export default (before, next) => function (...args) {
  if (before.apply(this, args)) {
    next.apply(this, args);
  }
};
