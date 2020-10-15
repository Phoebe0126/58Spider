module.exports = app => {
    app.route('/')
    .get(function(req,res,next){
        res.sendFile('index.html');
    });
}