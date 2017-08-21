'use strict';
const Joi = require('joi');
const Schema = require('../joischema');

module.exports = function (Vertical) {
    var schema = Schema(Vertical);

    Vertical.beforeRemote('upsertWithWhere', function(context, user, next) {
        var result = Joi.validate(context.args.data, schema, {abortEarly: false});
        if (result.error === null) {
            next();
        } else {
            context.res.send(result.error);
        }
    });
};
