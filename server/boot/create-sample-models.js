module.exports = function(app) {
    var Vertical = app.models.Vertical;
    Vertical.create([{
        name: 'Company'
    }, {
        name: 'Clients'
    }, {
        name: 'Stuff'
    }]);
};