import React from 'react';

const authContext = React.createContext({
    authenticated: false,
    currentUser:null,
    login: () => {}
});

export default authContext;

