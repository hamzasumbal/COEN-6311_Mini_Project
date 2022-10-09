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

    async assignTask(taskID, assignee, assignor){

        console.log('assigning task');

        if(assignee.position === "Worker"){
            if(!await this.canAssign(assignee.id)){
                
                return alert(`3 task already assigned to ${assignee.name} (${assignee.id})`)
            }
        }

        try{
            await firebase.database().ref(`tasks/${taskID}/assignee`).set(assignee);
            await firebase.database().ref(`tasks/${taskID}/department`).set(assignee.department);
            await firebase.database().ref(`tasks/${taskID}/assignor`).set(assignor);
            await firebase.database().ref(`tasks/${taskID}/status`).set('assigned');
        }catch{
            alert("something went wrong. try again");
        }

    }


    async deleteTask(taskID){
        console.log('deleting task');

        try{
            await firebase.database().ref(`tasks/${taskID}`).remove();
        }catch{
            alert("something went wrong. try again");
        }

    }

    async changeStatus(taskID, status){
        console.log('changing status')
        try{
            await firebase.database().ref(`tasks/${taskID}/status`).set(status);
        }catch{
            alert("something went wrong. try again");
        }

    }



    async canAssign(workerId){

    const snapshot =  await firebase.database().ref().child(`tasks`).get()
      if (snapshot.exists()) {
        let data = await snapshot.val();
        const tasks = Object.values(data);
        return tasks.filter((task)=> task.assignee?.id === workerId).length < 3? true : false;
      };

    }

   

}