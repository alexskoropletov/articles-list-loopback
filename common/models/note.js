'use strict';
const Joi = require('joi');
const Schema = require('../joischema');

module.exports = function (Note) {
    var schema = Schema(Note);

    Note.beforeRemote('upsertWithWhere', function(context, user, next) {

        context.args.data.tags = typeof context.args.data.tags == 'undefined' ? [] : context.args.data.tags.split(",");

        var result = Joi.validate(context.args.data, schema, {abortEarly: false});
        if (result.error === null) {
            next();
        } else {
            context.res.send(result.error.details);
        }
    });
};
