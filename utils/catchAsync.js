// Simply catch async errors
// --- catching  errorrs in asynch function----
// --- in order to get rid of try catch ---
// The function should not be called right away
// create tour should be a function not a result of calling function
// the function should sit inside and wait until express calls it
// express will call it as soon as the route hits the route
// sol : return an anynomous function not call a function
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
    // fn(req, res, next).catch(err => next(err))
  };
};
