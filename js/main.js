(function () {
  var firebaseConfig = {
    apiKey: keys.apiKey,
    authDomain: keys.authDomain,
    projectId: keys.projectId,
    storageBucket: keys.storageBucket,
    messagingSenderId: keys.messagingSenderId,
    databaseURL: keys.databaseURL,
    appId: keys.appId,
    measurementId: keys.measurementId,
  };
  firebase.initializeApp(firebaseConfig);
})();

const loginState = new Login();

const Header = document.querySelector(".header");
const LoginSelector = document.querySelector(".login-employee-selector");
const LoginContainer = document.querySelector(".login-container");
const MainContainer = document.querySelector(".main-container");
const LoginButton = document.querySelector(".login-button");
const CreateTaskContainer = document.querySelector(".create-task-container");
const CreateTaskButton = document.querySelector(".create-task-button");

LoginSelector.innerHTML = Employees_Data.map((item) => {
  return `<option value="${item.id}">${item.name} (${item.id})</option>`;
});

LoginButton.addEventListener("click", () => {
  loginState.isLoggedIn = true;

  const employeeSelected = Employees_Data.filter(
    (item) => item.id === Number(LoginSelector.value)
  )[0];

  if (employeeSelected.position === "General Manager") {
    loginState.loggedInUser = new GeneralManager(
      employeeSelected.name,
      employeeSelected.id,
      employeeSelected.department,
      employeeSelected.position
    );
    document.querySelector(".create-task-container").removeAttribute("hidden");
  } else if (employeeSelected.position === "Manager") {
    loginState.loggedInUser = new Manager(
      employeeSelected.name,
      employeeSelected.id,
      employeeSelected.department,
      employeeSelected.position
    );
    document.querySelector(".create-task-container").removeAttribute("hidden");
  } else if (employeeSelected.position === "Worker") {
    loginState.loggedInUser = new Worker(
      employeeSelected.name,
      employeeSelected.id,
      employeeSelected.department,
      employeeSelected.position
    );
    document.querySelector(`.tasks-container.assigned`).style.display = "none";
  }

  LoginContainer.style.display = "none";
  MainContainer.removeAttribute("hidden");
  document.querySelector(
    ".header-employee-name"
  ).innerHTML = `${employeeSelected.name} (${employeeSelected.id})`;
  getTasks();
});

document.querySelector(".hello").addEventListener("click", () => {
  console.log(loginState);
});

CreateTaskButton.addEventListener("click", () => {
  const taskInput = document.querySelector(".create-task-input");

  const task = taskInput.value;

  const newTask = new Task(
    task,
    loginState.loggedInUser.department,
    loginState.loggedInUser
  );

  newTask.createTask();

  taskInput.value = null;
  console.log(newTask);
});

const getTasks = async () => {
  const response = await firebase.database().ref("tasks").get();
  const data = response.val();
  const dataArray = Object.values(data);
  console.log(response.val());

  const AssignedTasksArray = dataArray.filter(
    (item) =>
      item.assignee &&
      (item.department === loginState.loggedInUser.department ||
        loginState.loggedInUser.position === "General Manager")
  );
  const UnassignedTasksArray = dataArray.filter(
    (item) =>
      !item.assignee &&
      (item.department === loginState.loggedInUser.department ||
        loginState.loggedInUser.position === "General Manager")
  );
  const YourTasksArray = dataArray.filter(
    (item) =>
      item.assignee?.id === loginState.loggedInUser.id &&
      (item.department === loginState.loggedInUser.department ||
        loginState.loggedInUser.position === "General Manager")
  );

  console.log(AssignedTasksArray, UnassignedTasksArray, YourTasksArray);

  renderTasksList("unassigned", UnassignedTasksArray);
  renderTasksList("assigned", AssignedTasksArray);
  renderTasksList("your", YourTasksArray);
};

const renderTasksList = (type, tasksArray) => {
  if (tasksArray.length > 0) {
    console.log("remderong", type);
    document.querySelector(`.${type}-task-container`).innerHTML = tasksArray
      .map((task) => {
        return `
                <div class ='task-wrapper'>
                <p class = 'title'>
                task: 
                ${task.task}
                </p>
                <p class = 'creator'>
                creator: 
                ${task.creator.name}
                </p>
                <p class = 'department'>
                </p>
                department: 
                ${task.creator.department}
                </div>
                <p>Assign to : </p>
                <select class = '${type}-select-${task.taskId}'>
                ${Employees_Data.map((item) => {
                    return `<option value="${item.id}" ${
                        task.assignee?.id === item.id ? "selected" : null
                      }>${item.name} (${item.id})</option>`;
            
                  
                })}
                </select>
                <button class = '${type}-button-${task.taskId}'>Assign</button>
                <br/>
                <br/>
                `;
      })
      .join("");

    tasksArray.map((task) => {
      document
        .querySelector(`.${type}-button-${task.taskId}`)
        .addEventListener("click", async () => {
          const assigneeEmployeeID = document.querySelector(
            `.${type}-select-${task.taskId}`
          ).value;
          await new Task().assignTask(
            task.taskId,
            Employees_Data.filter(
              (item) => item.id === Number(assigneeEmployeeID)
            )[0]
          );
        });
    });
  }
};

/* console.log(loginState); */
