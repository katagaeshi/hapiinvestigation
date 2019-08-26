'use strict';

const Hapi = require('@hapi/hapi');

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    const options = {
        ops: {
            interval: 1000
        },
        reporters: {
            consoleReporter: [
                {
                    module: '@hapi/good-squeeze',
                    name: 'Squeeze',
                    args: [{ log: '*', response: '*' }]
                },
                {
                    module: '@hapi/good-console'
                },
                'stdout'
            ]
        }
    };

    await server.register({
        plugin: require('@hapi/good'),
        options,
    });

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {
            request.log();
            return h.response('Hello World!');
        }
    });

    await server.start();
    server.log('Server running on %s', server.info.uri);
};

init();