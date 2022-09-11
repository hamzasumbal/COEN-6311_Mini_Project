const loginState = new Login();

const Header = document.querySelector('.header');
const LoginSelector = document.querySelector('.login-employee-selector');
const LoginContainer = document.querySelector('.login-container');
const MainContainer = document.querySelector('.main-container');
const LoginButton = document.querySelector('.login-button');


LoginSelector.innerHTML = Employees_Data.map((item)=>{
    return `<option value="${item.id}">${item.name} (${item.id})</option>`
}) 

LoginButton.addEventListener('click',()=>{
    loginState.isLoggedIn = true;
    
    const employeeSelected = Employees_Data.filter((item)=> item.id === Number(LoginSelector.value))[0];

    if(employeeSelected.position === 'General Manager'){
        loginState.loggedInUser = new GeneralManager({...employeeSelected})
    }
    else if(employeeSelected.position === 'Manager'){
        loginState.loggedInUser = new Manager({...employeeSelected})
    }
    else if(employeeSelected.position === 'Worker'){
        loginState.loggedInUser = new Worker({...employeeSelected})
    }
    LoginContainer.style.display = "none";
    MainContainer.removeAttribute('hidden');
    document.querySelector('.header-employee-name').innerHTML = `${employeeSelected.name} (${employeeSelected.id})`
    
})


document.querySelector('.hello').addEventListener('click',()=>{
    console.log(loginState.isLoggedIn)
})

const newEmployee = new Worker('name', 123, 'A', 'worker');


/* console.log(loginState); */