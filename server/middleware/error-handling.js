

function errorHandling (err, req, res, next) {
    console.error(err);
    res.status(500).send('Internal Server Error');
}
function notFound (req, res, next) {
    res.status(404).send('Not Found');
}

module.exports = { notFound, errorHandling }; 
