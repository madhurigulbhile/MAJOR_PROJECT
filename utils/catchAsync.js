// Wrap async route handlers to automatically pass errors to next()
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
};
