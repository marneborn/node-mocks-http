'use strict';

/**
 * Test: test-mockRequest
 *
 *   Test cases for the <mockRequest> module.
 */

var httpMocks = require('../lib/http-mock');

exports['params - Simple verification'] = function(test) {
    var request = httpMocks.createRequest();
    request._setParameter('id', 42);
    test.equal(42, request.params.id);
    test.done();
};

exports['params - Unset value'] = function(test) {
    var request = httpMocks.createRequest();
    test.equal(undefined, request.params.id);
    test.done();
};


exports['method - Default value'] = function(test) {
    var request = httpMocks.createRequest();
    test.equal('GET', request.method);
    test.done();
};

exports['method - Setting a POST'] = function(test) {
    var request = httpMocks.createRequest();
    request._setMethod('POST');
    test.equal('POST', request.method);
    test.done();
};

exports['url - Default value'] = function(test) {
    var request = httpMocks.createRequest();
    test.equal('', request.url);
    test.done();
};

exports['url - Setting a POST'] = function(test) {
    var request = httpMocks.createRequest();
    var expected = 'http://localhost:5732/blah';
    request._setURL(expected);
    test.equal(expected, request.url);
    test.done();
};

exports['originalUrl - Default value'] = function(test) {
    var request = httpMocks.createRequest();
    test.equal(request.url, request.originalUrl);
    test.done();
};

exports['originalUrl - Default value (with url option set)'] = function(test) {
    var expected = 'http://localhost:5732/blah';
    var request = httpMocks.createRequest({ url: expected });
    test.equal(request.url, request.originalUrl);
    test.done();
};

exports['originalUrl - Default value (with url and originalUrl options set)'] = function(test) {
    var url = 'http://localhost:5732/blah';
    var originalUrl = 'http://original/blah';
    var request = httpMocks.createRequest({ url: url, originalUrl: originalUrl });
    test.equal(url, request.url);
    test.equal(originalUrl, request.originalUrl);
    test.done();
};

exports['originalUrl - Setting using ._setOriginalUrl()'] = function(test) {
    var request = httpMocks.createRequest();
    var expected = 'http://localhost:5732/blah';
    request._setOriginalUrl(expected);
    test.equal(expected, request.originalUrl);
    test.done();
};

exports['get/header - Setting a header using options'] = function(test) {
    var name = 'accept';
    var value = 'text/plain';
    var options = { headers: {} };
    options.headers[name] = value;
    var request = httpMocks.createRequest(options);
    test.equal(request.get(name), value);
    test.done();
};

exports['get/header - Setting a header using ._setHeadersVariable()'] = function(test) {
    var request = httpMocks.createRequest();
    var name = 'accept';
    var value = 'text/plain';
    request._setHeadersVariable(name, value);
    test.equal(request.get(name), value);
    test.equal(request.header(name), value);
    test.done();
};

exports['get/header - Setting header "referer" edge-case'] = function(test) {
    var request = httpMocks.createRequest();
    var name = 'referer';
    var value = 'http://localhost:5732/blah';
    request._setHeadersVariable(name, value);
    test.equal(request.get('referer'), value);
    test.equal(request.get('referrer'), value);
    test.equal(request.header('referer'), value);
    test.equal(request.header('referrer'), value);
    test.done();
};

exports['get/header - Setting header "referrer" edge-case'] = function(test) {
    var request = httpMocks.createRequest();
    var name = 'referrer';
    var value = 'http://localhost:5732/blah';
    request._setHeadersVariable(name, value);
    test.equal(request.get('referer'), value);
    test.equal(request.get('referrer'), value);
    test.equal(request.header('referer'), value);
    test.equal(request.header('referrer'), value);
    test.done();
};

exports['addBody - Simple verification'] = function(test) {
    var request = httpMocks.createRequest();

    var username = 'bob';
    request._addBody('user', username);
    test.equal(username, request.body.user);
    test.done();
};

exports['setBody - Simple verification'] = function(test) {
    var request = httpMocks.createRequest();

    var username = 'bob';
    request._setBody({
        'user': username
    });
    test.equal(username, request.body.user);
    test.done();
};

exports['body - Unset value'] = function(test) {
    var request = httpMocks.createRequest();
    test.equal(undefined, request.body.user);
    test.done();
};


exports['Object creation - All values set'] = function(test) {

    var methodValue = 'PUT';
    var idValue = 34;
    var urlValue = 'http://localhost:6522/blingbling';
    var usernameValue = 'mittens';

    var request = httpMocks.createRequest({
        method: methodValue,
        url: urlValue,
        params: {
            id: idValue,
            sort: 'asc'
        },
        body: {
            username: usernameValue,
            email: 'bob@dog.com'
        }
    });

    test.equal(methodValue, request.method);
    test.equal(urlValue, request.url);
    test.equal(urlValue, request.originalUrl);
    test.equal(idValue, request.params.id);
    test.equal(usernameValue, request.body.username);
    test.done();
};

exports['.param - returns value from params if exists'] = function(test) {
    var request = httpMocks.createRequest();
    request._setParameter('paramitem', 'abc');

    test.equal(request.param('paramitem'), 'abc');
    test.done();
};

exports['.param - returns value in body if exists'] = function(test) {
    var request = httpMocks.createRequest();
    request._addBody('bodyitem', 'abc');

    test.equal(request.param('bodyitem'), 'abc');
    test.done();
};

exports['.param - returns value in querystring if exists'] = function(test) {
    var request = httpMocks.createRequest({
        query: {
            'queryitem': 'abc'
        }
    });

    test.equal(request.param('queryitem'), 'abc');
    test.done();
};


exports['.param - returns value in correct order (params)'] = function(test) {
    var request = httpMocks.createRequest({
        query: {
            'thing': '3'
        }
    });

    request._setParameter('thing', '1');
    request._addBody('thing', '2');

    test.equal(request.param('thing'), '1');
    test.done();
};

exports['.param - returns value in correct order (body)'] = function(test) {
    var request = httpMocks.createRequest({
        query: {
            'thing': '2'
        }
    });

    request._addBody('thing', '1');

    test.equal(request.param('thing'), '1');
    test.done();
};

exports['.param - returns value in correct order (query)'] = function(test) {
    var request = httpMocks.createRequest({
        query: {
            'thing': '1'
        }
    });

    test.equal(request.param('thing'), '1');

    test.done();
};

exports['query object is parsed from url query string'] = function(test) {
    var request = httpMocks.createRequest({
        url: 'http://www.whatever.com?a=1&b=2&c=3'
    });

    test.equal(request.query.a, '1');
    test.equal(request.query.b, '2');
    test.equal(request.query.c, '3');

    test.done();
};

exports['query object is parsed from supplied options if provided'] = function(test) {
    var request = httpMocks.createRequest({
        url: 'http://www.whatever.com?a=1&b=2&c=3',
        query: {
            'a': '7',
            'b': '8',
            'c': '9'
        }
    });

    test.equal(request.query.a, '7');
    test.equal(request.query.b, '8');
    test.equal(request.query.c, '9');

    test.done();
};

exports['path(pathname) has to be parsed from url'] = function(test) {
    var request = httpMocks.createRequest({
        url: 'http://www.whatever.com/iamthepath?a=1&b=2&c=3'
    });

    test.equal(request.path, '/iamthepath');

    test.done();
};
