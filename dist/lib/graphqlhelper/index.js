'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapClass2Resolvers = exports.isSubscription = exports.isQuery = exports.isMutation = undefined;

var _resolvers = require('./resolvers.loader');

exports.isMutation = _resolvers.isMutation;
exports.isQuery = _resolvers.isQuery;
exports.isSubscription = _resolvers.isSubscription;
exports.mapClass2Resolvers = _resolvers.mapClass2Resolvers;