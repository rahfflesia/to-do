import { DOM } from "./DOM";

class Project {
    constructor(name, listOfTasks){
        this.name = name;
        this.listOfTasks = listOfTasks;
    }

    addTask(taskObject){
        this.listOfTasks.push(taskObject);
    }

    appendProject(projectObject){
        localStorage.setItem(this.name, JSON.stringify(projectObject));
    }

    static loadProjects(){
        let arr = Object.entries(localStorage);
        const dom = new DOM();

        for(let i = 0; i < arr.length; i++){
            dom.appendProject(arr[i][0]);
        }

        let allProjs = document.querySelectorAll('.project');
        let container = document.querySelector('.inner-tasks-container');
        let title = document.querySelector('.title');

        dom.enableProject(allProjs, title);

        for(let i = 0; i < allProjs.length; i++){
            allProjs[i].addEventListener('click', () => {
                dom.removeChilds(container);
                dom.appendTasksToProject(allProjs[i].textContent, container);
            });
        }
    }
}

export {Project};