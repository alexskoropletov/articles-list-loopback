'use strict';
const Joi = require('joi');

module.exports = function (Model) {
    var schema = {};
    for (var key in Model.definition.properties) {
        schema[key] = Joi;
        if (Model.definition.properties[key].type.name == 'String') {
            schema[key] = schema[key].string();
        } else if (Model.definition.properties[key].type.name == 'Number') {
            schema[key] = schema[key].number().integer();
        } else if (Model.definition.properties[key].type.name == 'Array') {
            schema[key] = schema[key].array();
        } else if (Model.definition.properties[key].type.name == 'Date') {
            schema[key] = schema[key].date();
        }

        if (Model.definition.properties[key].required) {
            schema[key] = schema[key].required();
        }

        if (key == 'email') {
            schema[key] = schema[key].email();
        }
    }

    for (var key in Model.definition.settings.relations) {
        schema[key] = Joi.number().integer();
    }
    return Joi.object().keys(schema);
};
