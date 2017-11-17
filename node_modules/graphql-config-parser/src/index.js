"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const valid_url_1 = require("valid-url");
const fs_1 = require("fs");
const path_1 = require("path");
const graphql_1 = require("graphql/graphql");
const introspectionQuery_1 = require("graphql/utilities/introspectionQuery");
const fetch = require("node-fetch");
function parse(path = process.cwd()) {
    try {
        const packageJson = require(`${path}/package.json`);
        if (packageJson.hasOwnProperty('graphql')) {
            return parseConfigJson(packageJson.graphql);
        }
    }
    catch (ex) {
    }
    try {
        const graphqlrc = JSON.parse(fs_1.readFileSync(`${path}/.graphqlrc`, 'utf-8'));
        return parseConfigJson(graphqlrc);
    }
    catch (ex) {
    }
    if (process.env.hasOwnProperty('GRAPHQL_ENDPOINT')) {
        const endpoint = process.env.GRAPHQL_ENDPOINT;
        if (!valid_url_1.isWebUri(endpoint)) {
            throw new Error(`No valid GraphQL endpoint: ${endpoint}`);
        }
        return {
            url: endpoint,
            type: 'request',
        };
    }
    throw new Error('Couldn\'t find a GraphQL config. Please refer to https://github.com/graphcool/graphql-config');
}
exports.parse = parse;
function resolveSchema(config) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (config.type) {
            case 'file':
                const schema = require(path_1.resolve(config.file));
                console.log(`Loaded GraphQL schema from ${config.file}`);
                return Promise.resolve(schema);
            case 'request':
                const configRequest = config;
                return fetch(configRequest.url, {
                    method: 'POST',
                    body: JSON.stringify({
                        query: introspectionQuery_1.introspectionQuery,
                    }),
                    headers: Object.assign({
                        'Content-Type': 'application/json',
                    }, configRequest.headers || {}),
                })
                    .then((res) => {
                    if (res.ok) {
                        return res.json()
                            .then((schema) => {
                            console.log(`Loaded GraphQL schema from ${configRequest.url}`);
                            return schema;
                        });
                    }
                    else {
                        return res.text()
                            .then((text) => {
                            throw new Error(`${res.statusText}: ${text}`);
                        });
                    }
                });
            case 'graphql-js':
                const schemaSource = require(path_1.resolve(config.file));
                console.log(`Loaded GraphQL schema from ${config.file}`);
                return graphql_1.graphql(schemaSource.default || schemaSource, introspectionQuery_1.introspectionQuery);
            default: throw new Error(`Invalid config: ${JSON.stringify(config)}`);
        }
    });
}
exports.resolveSchema = resolveSchema;
function parseConfigJson(json) {
    if (json.file) {
        return {
            file: json.file,
            type: 'file',
        };
    }
    if (json.request) {
        return Object.assign({
            type: 'request',
        }, json.request);
    }
    if (json['graphql-js']) {
        return {
            type: 'graphql-js',
            file: json['graphql-js'],
        };
    }
    throw new Error(`Invalid configuration file: ${JSON.stringify(json)}`);
}
exports.parseConfigJson = parseConfigJson;
