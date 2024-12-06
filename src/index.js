import "./styles.css";
import { DOM } from "./scripts/DOM";
import { Project } from "./scripts/projects";
import { Task } from "./scripts/tasks";

const addProject = document.querySelector('.add-project');
// En realidad este modal es del proyecto, pero me confundí
const taskDialog = document.querySelector('.project-add');
const closeDialogButton = document.querySelector('.close');
const addTaskButton = document.querySelector('.addTask');
const projectTitle = document.querySelector('.project-title');
const projects = [];

const tasksContainer = document.querySelector('.inner-tasks-container');

let allProjects;
let projectTitleGUI;

const dom = new DOM();

const clickToAddTaskButton = document.querySelector('.click-to-add');
const addTaskModal = document.querySelector('.task-add');
const cancelTaskButtonInner = document.querySelector('.cancel-task-button');
const addTaskButtonInner = document.querySelector('.add-task-button');

// Default project
//const proj = new Project(defaultName, []);
//projects.push(proj);
//dom.appendProject(defaultName);
//localStorage.setItem("Default", JSON.stringify(proj));

// Método para cargar y habilitar los proyectos guardados en memoria
Project.loadProjects();

addProject.addEventListener('click', () => {
    dom.showDialog(taskDialog);
});

closeDialogButton.addEventListener('click', () => {
    dom.closeDialog(taskDialog);
});

addTaskButton.addEventListener('click', () => {
    const title = projectTitle.value;
    const project = new Project(title, []);
    projects.push(project);
    dom.appendProject(title);
    dom.closeDialog(taskDialog);
    project.appendProject(project);
    dom.clearInput(projectTitle);
    dom.enableProject(allProjects, projectTitleGUI);
});

const taskTitle = document.querySelector('.task-title');
const taskDescription = document.querySelector('.description');
const taskDueDate = document.querySelector('.date');
const taskPriority = document.querySelector('#priority')

clickToAddTaskButton.addEventListener('click', () => {
    dom.showDialog(addTaskModal);
    dom.clearInput(taskTitle);
    dom.clearInput(taskDescription);
    dom.clearInput(taskDueDate);
});

cancelTaskButtonInner.addEventListener('click', () => {
    dom.closeDialog(addTaskModal);
});

addTaskButtonInner.addEventListener('click', () => {
    const task = new Task(taskTitle.value, taskDescription.value, taskDueDate.value, taskPriority.value);
    projectTitleGUI = document.querySelector('.title');
    const currentProject = JSON.parse(localStorage.getItem(projectTitleGUI.textContent));

    if(currentProject === null){
        return;
    }

    currentProject["listOfTasks"].push(task);
    localStorage.setItem(projectTitleGUI.textContent, JSON.stringify(currentProject));

    const everyProject = document.querySelectorAll('.project');

    for(let i = 0; i < everyProject.length; i++){
        everyProject[i].addEventListener('click', () => {
            dom.removeChilds(tasksContainer);
            dom.appendTasksToProject(projectTitleGUI.textContent, tasksContainer);
        });
    }

    dom.closeDialog(addTaskModal);
    dom.removeChilds(tasksContainer);
    dom.appendTasksToProject(projectTitleGUI.textContent, tasksContainer);
});