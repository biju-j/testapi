var envdetails = {}
envdetails.url = {
    alpha: {
        hub: 'https://alpha-hub.dev.blippar.com/',
        bd: 'https://builder-qa.dev.blippar.com/',
        api: 'alpha-api.dev.blippar.com',
        transcoder:'sf-mediacoder.dev.blippar.com'
    },
    dev: {
        hub: 'https://hub.dev.blippar.com/',
        bd: 'https://builder.dev.blippar.com/',
        api:'sf-api.dev.blippar.com',
        transcoder:'sf-mediacoder.dev.blippar.com'
    },
    qa: {
        hub: 'https://hub-qa.dev.blippar.com/',
        bd: 'https://builder-qa.dev.blippar.com/',
        api: 'sf-qa-api.dev.blippar.com',
        transcoder:'sf-mediacoder.dev.blippar.com'
    },
    staging: {
        hub: 'https://hub-staging.blippar.com/',
        cb: 'https://builder-staging.blippar.com/',
        api:'sf-staging-api.dev.blippar.com',
        transcoder:'sf-mediacoder.dev.blippar.com'
    },
    prod: {
        hub: 'https://hub.blippar.com/',
        cb: 'https://builder.blippar.com/',
        api:'api.dev.blippar.com',
        transcoder:'mediacoder.blippar.com'
    }
};

module.exports = envdetails;
