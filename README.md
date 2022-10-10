# Mini Project COEN-6311
A task assignment system software.
[Live here](https://mini-project.hamzasumbal.com/)


## Company Hierarchy
```
├── General Manager
│  ├── Manager A
│  │   ├── Worker 1A
│  │   ├── Worker 2A
│  │   ├── Worker 3A
│  ├── Manager B
│  │   ├── Worker 1B
│  │   ├── Worker 2B
│  │   ├── Worker 3B
│  │   ├── Worker 4B      
```


## Features

- General Manager and Manager can create Task
- General Manager can assign task to anyone from any department
- Manager can assign task to workers to their department
- A worker can not be assigned more than 3 task at one time
- General Manager can see all the assigned tasks in the company
- Manager can only see the assigned tasks of their department
- Workers can look at the list of unassigned task of their department and assign themselves only
- Only General Manager and Manager can cancel a task
- A Notification is sent to General Manager and Manager when 
    - new task is created
    - task is assigned
    - task is deleted
- Managers and General Manager can send message notification to each other
- The project is horizontally scalable meaning that more Managers and Workers can be added
- Tasks and Employee data is stored in cloud firebase real time database
- There is a hidden reset button in the HTML that resets the database



