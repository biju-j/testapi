/*This config is used for browserstack with multiple browsers*/
var users = {}
users.ROLES = {
    blippar_admin: {
        username: 'auto.blippar@gmail.com',
        password: 'blippar1',
        apiTOKEN: 'testingblipparapionly-forQE'
    },
    blippar_user: {
        username: 'auto.blippar+blippar_user1@gmail.com',
        password: 'blippar1',
        apiTOKEN: 'testingblipparapionly-forQE'
    },
    group_admin: {
        username: 'auto.blippar+group_admin@gmail.com',
        password: 'blippar1',
        apiTOKEN: 'testingblipparapionly-forQE'
    },
    signup_user: {
        username: 'auto.blippar+signup_user1@gmail.com',
        password: 'blippar123',
        apiTOKEN: 'testingblipparapionly-forQE'
    }
};
module.exports = users;
