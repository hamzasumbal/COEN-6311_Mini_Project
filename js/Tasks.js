class Task {
    constructor(task,dep, creator){
        this.task = task;
        this.taskId = 123;
        this.creator = creator
        this.assignor = null;
        this.assignee = null;
        this.status = 'unassigned';
        this.department = dep

    }

    createTask(){
        console.log('creating new task', this.task)
    }
    cancelTask(task){
        console.log('delete task', task)
    }
    changeStatus(task){
        console.log('changing status', task)
    }
}