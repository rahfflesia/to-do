class Task {
    constructor(title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    static clearAllTasks(){
        localStorage.clear();
    }

    static getProjectDetails(title, desc, date, prio){
        return [title, desc, date, prio];
    }


}

export {Task};