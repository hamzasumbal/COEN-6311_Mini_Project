class GeneralManager extends Employee {
    constructor(name,id,department,position ){
        super(name,id,department, position)
        this.notifications = [];
    }
}