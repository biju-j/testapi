var envdetails = {}
envdetails.url = {

    dev: {
        mill: 'https://mill-dev.check.com/',
        bd: 'https://builder.dev.com/',
        api:'dev-api.com'
    },
    qa: {
        mill: 'https://mill-qa.com/',
        bd: 'https://mill-builder-qa.com/',
        api: 'mill-api-qa.com'
    },
    staging: {
        hub: 'https://mill-staging.com/',
        cb: 'https://mill-builder-staging..com/',
        api:'mill-staging-api.dev.com'
    }
};

module.exports = envdetails;
