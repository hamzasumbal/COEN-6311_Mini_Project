class Manager extends Employee {
    constructor(name,id,department,position,notifications ){
        super(name,id,department, position)
        this.notifications = notifications;
    }

        async sendNotification(recieverID, notification){
        console.log('sending notification', notification, recieverID, this)

        const id = new Date().getTime()
        try {
            await firebase.database().ref(`employees/${recieverID}/notifications/${id}`).set({
                message : notification,
                sender : this,
                notificationID : id
            });
            alert(`Notification is sent to ${recieverID}`)
            
          } catch {
            alert("something went wrong. try again");
          }
    }


    async deleteNotification(notificationID){
        console.log(notificationID)
        try {
            await firebase.database().ref(`employees/${this.id}/notifications/${notificationID}`).remove();
          } catch {
            alert("something went wrong. try again");
          }
    }
}