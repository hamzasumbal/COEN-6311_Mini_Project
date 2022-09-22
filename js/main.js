// main.js is only helping with DOM Manipulations

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

let Employees_Data = [];

(async () => {
  const snapshot = await firebase.database().ref().child(`employees`).get();
  if (snapshot.exists()) {
    let data = await snapshot.val();
    Employees_Data = Object.values(data);
    console.log(Employees_Data);
  }

  const getEmployeeNameByID = (id)=>{
    return Employees_Data.filter((item)=>item.id === Number(id))[0].name
 }

  const notificationReceiverList = Employees_Data.filter((e)=> e.position === 'Manager' || e.position === 'General Manager')

  const Header = document.querySelector(".header");
  const LoginSelector = document.querySelector(".login-employee-selector");
  const LoginContainer = document.querySelector(".login-container");
  const MainContainer = document.querySelector(".main-container");
  const LoginButton = document.querySelector(".login-button");
  const CreateTaskContainer = document.querySelector(".create-task-container");
  const CreateTaskButton = document.querySelector(".create-task-button");
  const SendNotification = document.querySelector(
    ".send-notification-container"
  );
  const ShowNotification = document.querySelector(
    ".show-notification-container"
  );
  const SendNotificationButton = document.querySelector(
    ".send-notification-button"
  );
  const NotificationReceiverSelector = document.querySelector(
    ".notification-receiver-select"
  );
  const NotificationContainer = document.querySelector(".notifications-list");

  const LogoutButton = document.querySelector('.logout-button')


  LoginSelector.innerHTML = Employees_Data.map((item) => {
    return `<option value="${item.id}">${item.name} (${item.id})</option>`;
  });

  LoginButton.addEventListener("click", async () => {
    loginState.isLoggedIn = true;

    const employeeSelected = Employees_Data.filter(
      (item) => item.id === Number(LoginSelector.value)
    )[0];

    if (employeeSelected.position === "General Manager") {
      loginState.loggedInUser = new GeneralManager(
        employeeSelected.name,
        employeeSelected.id,
        employeeSelected.department,
        employeeSelected.position,
        employeeSelected.notifications ? employeeSelected.notifications : []
      );
      CreateTaskContainer.removeAttribute("hidden");
      SendNotification.removeAttribute("hidden");
      ShowNotification.removeAttribute("hidden");
      LogoutButton.removeAttribute("hidden");
    } else if (employeeSelected.position === "Manager") {
      loginState.loggedInUser = new Manager(
        employeeSelected.name,
        employeeSelected.id,
        employeeSelected.department,
        employeeSelected.position,
        employeeSelected.notifications ? employeeSelected.notifications : []
      );
      CreateTaskContainer.removeAttribute("hidden");
      SendNotification.removeAttribute("hidden");
      ShowNotification.removeAttribute("hidden");
      LogoutButton.removeAttribute("hidden");
    } else if (employeeSelected.position === "Worker") {
      loginState.loggedInUser = new Worker(
        employeeSelected.name,
        employeeSelected.id,
        employeeSelected.department,
        employeeSelected.position
      );
      document.querySelector(`.tasks-container.assigned`).style.display = "none";
        LogoutButton.removeAttribute("hidden");
    }

    NotificationReceiverSelector.innerHTML = Employees_Data.map((item) => {
      if (item.position === "Manager" || item.position === "General Manager") {
        return `<option value="${item.id}">${item.name} (${item.id})</option>`;
      } else {
        return null;
      }
    });

    LoginContainer.style.display = "none";
    MainContainer.removeAttribute("hidden");
    document.querySelector(
      ".header-employee-name"
    ).innerHTML = `${employeeSelected.name} (${employeeSelected.id})`;
    showTasks();
    showNotification();
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

    notificationReceiverList.map(async (item)=>{
        await loginState.loggedInUser.sendNotification(item.id, `new task created by ${loginState.loggedInUser.name}`)
    })

    taskInput.value = null;
  });

  SendNotificationButton.addEventListener("click", async () => {
    const notification = document.querySelector(".create-notification-input");

    if (notification !== "") {
      await loginState.loggedInUser.sendNotification(
        NotificationReceiverSelector.value,
        notification.value
      );
      alert('notification sent!')
    } else {
      alert("no message");
    }

    notification.value = null;
  });


  LogoutButton.addEventListener('click',async ()=>{
    if(loginState.isLoggedIn){

        loginState.logout();
    }
  })

  const showNotification = async () => {
    firebase
      .database()
      .ref(`employees/${loginState.loggedInUser.id}/notifications`)
      .on("value", (snapshot) => {
        const data = snapshot.val();
        const notificationsArray = data === null ? [] : Object.values(data);

        NotificationContainer.innerHTML = notificationsArray
          .map((item) => {
            return `
        <ol>
        <li>${item.message}. (Notification from ${item.sender.name})<button class = 'notification-delete-button-${item.notificationID}'>Delete</button></li>
        </ol>
        `;
          })
          .join("");

        notificationsArray.map((item) => {
          document
            .querySelector(`.notification-delete-button-${item.notificationID}`)
            .addEventListener("click", async () => {
              await loginState.loggedInUser.deleteNotification(
                item.notificationID
              );
            });
        });
      });
  };

  const showTasks = async () => {
    firebase
      .database()
      .ref("tasks")
      .on("value", (snapshot) => {
        const data = snapshot.val();
        const dataArray = data === null ? [] : Object.values(data);

        const AssignedTasksArray = dataArray.filter(
          (item) =>
            item.assignee &&
            (item.department === loginState.loggedInUser.department ||
              loginState.loggedInUser.position === "General Manager" ||
              item.department === "*")
        );
        const UnassignedTasksArray = dataArray.filter(
          (item) =>
            !item.assignee &&
            (item.department === loginState.loggedInUser.department ||
              loginState.loggedInUser.position === "General Manager" ||
              item.department === "*")
        );
        const YourTasksArray = dataArray.filter(
          (item) =>
            item.assignee?.id === loginState.loggedInUser.id &&
            (item.department === loginState.loggedInUser.department ||
              loginState.loggedInUser.position === "General Manager" ||
              item.department === "*")
        );

        console.log(AssignedTasksArray, UnassignedTasksArray, YourTasksArray);

        renderTasksList("unassigned", UnassignedTasksArray);
        renderTasksList("assigned", AssignedTasksArray);
        renderTasksList("your", YourTasksArray);
      });
  };

  const renderTasksList = (type, tasksArray) => {
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
                ${task.department}
                
                <p>Assign to : ${task.assignee?.name}</p>
                <p>Assignor: ${task.assignor?.name}</p>
                <select class = '${type}-select-${task.taskId}' ${
          type === "your" && loginState.loggedInUser.position === "Worker"
            ? "hidden"
            : ""
        }>
                ${
                  type === "unassigned"
                    ? `<option value="">select</option>`
                    : null
                }
                ${Employees_Data.map((item) => {
                  if (
                    loginState.loggedInUser.id === item.id &&
                    loginState.loggedInUser.position === "Worker"
                  ) {
                    return `<option value="${item.id}" ${
                      task.assignee?.id === item.id ? "selected" : null
                    }>${item.name} (${item.id})</option>`;
                  }

                  if (
                    (loginState.loggedInUser.department === item.department &&
                      loginState.loggedInUser.position === "Manager") ||
                    loginState.loggedInUser.position === "General Manager"
                  ) {
                    return `<option value="${item.id}" ${
                      task.assignee?.id === item.id ? "selected" : null
                    }>${item.name} (${item.id})</option>`;
                  } else {
                    return null;
                  }
                })}
                </select>
                <button class = '${type}-button-${task.taskId}' ${
          type === "your" && loginState.loggedInUser.position === "Worker"
            ? "hidden"
            : ""
        }>Assign</button>
                <br/>
                <label>Status</label>
                <select class = '${type}-status-select-${task.taskId}'>
                ${Task_Status.map((item) => {
                  return `<option value="${item}" ${
                    task.status === item ? "selected" : null
                  }>${item}</option>`;
                })}.join("")
                </select>
                <br/>
                <button class = '${type}-delete-button-${task.taskId}' ${
          type === "your" && loginState.loggedInUser.position === "Worker"
            ? "hidden"
            : ""
        }>Delete</button>
                <br/>
                <br/>
                <br/>
                </div>
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
            )[0],
            loginState.loggedInUser
          );
          notificationReceiverList.map(async (item)=>{
            await loginState.loggedInUser.sendNotification(item.id, `task "${task.task}" assigned to ${getEmployeeNameByID(assigneeEmployeeID)}`)
        })
        });
    });

    tasksArray.map((task) => {
      document
        .querySelector(`.${type}-delete-button-${task.taskId}`)
        .addEventListener("click", async () => {
          await new Task().deleteTask(task.taskId);
          notificationReceiverList.map(async (item)=>{
            await loginState.loggedInUser.sendNotification(item.id, `task "${task.task}" deleted`)
        })
        });


    });

    tasksArray.map((task) => {
      document
        .querySelector(`.${type}-status-select-${task.taskId}`)
        .addEventListener("change", async (event) => {
          await new Task().changeStatus(task.taskId, event.target.value);
        });
    });
  };
})();


