/*This config is used for browserstack with multiple browsers*/
var users = {}
users.ROLES = {
    check_admin: {
        username: 'auto.check@gmail.com',
        password: 'check1',
        apiTOKEN: 'testingcheckapionly-forQE'
    },
    normal_user: {
        username: 'auto.normal_user1@gmail.com',
        password: 'normal1',
        apiTOKEN: 'testingnormalapionly-forQE'
    },
    group_admin: {
        username: 'auto.group_admin@gmail.com',
        password: 'group1',
        apiTOKEN: 'testinggrouppionly-forQE'
    },
    signup_user: {
        username: 'auto.signup_user1@gmail.com',
        password: 'signup123',
        apiTOKEN: 'testingsignuparapionly-forQE'
    }
};
module.exports = users;
