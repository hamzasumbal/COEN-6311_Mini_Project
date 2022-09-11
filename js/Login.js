class Login {
    constructor(){
        this.isLoggedIn = false;
        this.loggedInUser = {};
    }
    logout(){
        this.isLoggedIn = false;
    }
}