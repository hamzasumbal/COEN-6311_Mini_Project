class Task {
    constructor(task,dep, creator){
        this.task = task;
        this.taskId = new Date().getTime();
        this.creator = creator
        this.assignor = null;
        this.assignee = null;
        this.status = 'unassigned';
        this.department = dep

    }

    async createTask(){
        console.log('creating new task', this.task)
        try {
            await firebase.database().ref(`tasks/${this.taskId}`).set(this);
          } catch {
            alert("something went wrong. try again");
          }
    }

    async assignTask(taskID, employee){

        console.log('assigning task');

        try{
            await firebase.database().ref(`tasks/${taskID}/assignee`).set(employee);
            await firebase.database().ref(`tasks/${taskID}/department`).set(employee.department);
        }catch{
            alert("something went wrong. try again");
        }

    }

}