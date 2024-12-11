import editPath from "../icons/edit.png";
import binPath from "../icons/bin.png";
import detailsPath from "../icons/info.png";
import { Project } from "./projects";
import { Task } from "./tasks";

class DOM {
  showDialog(modal) {
    modal.showModal();
  }

  closeDialog(modal) {
    modal.close();
  }

  appendProject(name) {
    const sidebar = document.querySelector(".sidebar");
    const parentDiv = document.createElement("div");
    parentDiv.style.display = "flex";
    parentDiv.style.justifyContent = "space-between";

    const r = document.querySelector(".inner-tasks-container");

    const remove = document.createElement("img");
    remove.classList.add("delete-project");
    remove.src = binPath;
    remove.style.display = "none";

    const childDiv = document.createElement("div");
    childDiv.classList.add("project-icons");

    parentDiv.classList.add("project");
    const p = document.createElement("p");

    parentDiv.appendChild(p);
    p.textContent = name;
    childDiv.appendChild(remove);
    parentDiv.appendChild(childDiv);

    sidebar.append(parentDiv);

    parentDiv.addEventListener("click", () => {
      this.removeChilds(r);
    });

    parentDiv.addEventListener("mouseover", () => {
      remove.style.display = "block";
    });

    parentDiv.addEventListener("mouseout", () => {
      remove.style.display = "none";
    });

    remove.addEventListener("click", () => {
      localStorage.removeItem(parentDiv.textContent);
      this.deleteNode(remove.parentNode);
    });
  }

  removeChilds(parent) {
    if (parent.hasChildNodes()) {
      while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
      }
    }
  }

  enableProject(allProjects, projectTitleGUI) {
    allProjects = document.querySelectorAll(".project");
    for (let i = 0; i < allProjects.length; i++) {
      allProjects[i].addEventListener("click", () => {
        const retrievedProject = JSON.parse(
          localStorage.getItem(allProjects[i].textContent)
        );
        projectTitleGUI = document.querySelector(".title");

        if (retrievedProject === null) {
          projectTitleGUI.textContent = "";
          return;
        }
        projectTitleGUI.textContent = retrievedProject["name"];
      });
    }
  }

  clearInput(input) {
    input.value = "";
  }

  deleteNode(parent) {
    parent.parentNode.remove();
  }

  changeColor(priorityValue, container) {
    if (priorityValue === "Low") {
      container.style.backgroundColor = "lightgreen";
    } else if (priorityValue === "High") {
      container.style.backgroundColor = "palevioletred";
    }
  }

  appendTasksToProject(projectName, containerToAppend) {
    const project = JSON.parse(localStorage.getItem(projectName));

    if (project === null || projectName === null) {
      return;
    }

    const tasks = project["listOfTasks"];

    for (let i = 0; i < tasks.length; i++) {
      const taskDiv = document.createElement("div");
      const input = document.createElement("input");
      input.classList.add("project-name");
      input.type = "checkbox";

      // Párrafos para mostrar la información
      const taskTitle = document.createElement("p");
      taskTitle.textContent = tasks[i].title;

      const priority = document.createElement("p");
      priority.textContent = tasks[i].priority;
      this.changeColor(tasks[i].priority, priority);
      priority.classList.add("priority");

      const date = document.createElement("p");
      date.textContent = tasks[i].dueDate;
      date.classList.add("date");

      const description = document.createElement("p");
      description.textContent = tasks[i].description;
      description.classList.add("description");

      // Contenedor de los íconos de edición y borrado
      const iconsDiv = document.createElement("div");
      iconsDiv.classList.add("icons");

      const editIcon = document.createElement("img");
      editIcon.classList.add("edit");
      editIcon.src = editPath;

      const deleteIcon = document.createElement("img");
      deleteIcon.classList.add("delete");
      deleteIcon.src = binPath;

      const detailsIcon = document.createElement("img");
      detailsIcon.classList.add(".details");
      detailsIcon.src = detailsPath;

      taskDiv.classList.add("task");
      taskDiv.classList.add("shadow");

      taskDiv.appendChild(input);
      taskDiv.appendChild(taskTitle);
      taskDiv.appendChild(priority);
      taskDiv.appendChild(date);
      taskDiv.appendChild(description);

      iconsDiv.appendChild(editIcon);
      iconsDiv.appendChild(deleteIcon);
      iconsDiv.appendChild(detailsIcon);

      taskDiv.appendChild(iconsDiv);

      this.enableDeleteButton(
        deleteIcon,
        taskDiv,
        project,
        tasks,
        taskTitle,
        projectName
      );

      this.enableCheckbox(
        input,
        taskDiv,
        project,
        tasks,
        taskTitle,
        projectName
      );

      containerToAppend.appendChild(taskDiv);

      this.showProjectDetails(
        detailsIcon,
        taskTitle,
        description,
        date,
        priority
      );

      const data = Task.getProjectDetails(
        taskTitle.textContent,
        description.textContent,
        date.textContent,
        priority.textContent
      );
      this.showEditDialog(
        editIcon,
        data,
        taskTitle,
        description,
        date,
        priority
      );
    }
  }

  showProjectDetails(project, taskTitle, desc, date, priority) {
    project.addEventListener("click", () => {
      const detailsDialog = document.querySelector(".task-details");
      this.showDialog(detailsDialog);

      let detailsTitle = document.querySelector(".details-title");
      let detailsDesc = document.querySelector(".details-description");
      let detailsDate = document.querySelector(".details-duedate");
      let detailsPriority = document.querySelector(".details-priority");

      detailsTitle.textContent = "Title: " + taskTitle.textContent;
      detailsDesc.textContent = "Description: " + desc.textContent;
      detailsDate.textContent = "Due date: " + date.textContent;
      detailsPriority.textContent = "Priority: " + priority.textContent;

      const closeButton = document.querySelector(".close-details");
      this.enableCloseButton(closeButton, detailsDialog);
    });
  }

  enableCloseButton(button, dialog) {
    button.addEventListener("click", () => {
      this.closeDialog(dialog);
    });
  }

  enableDeleteButton(
    button,
    parentDiv,
    project,
    tasks,
    taskTitle,
    projectName
  ) {
    button.addEventListener("click", () => {
      project = JSON.parse(localStorage.getItem(projectName));
      tasks = project["listOfTasks"];
      const t = taskTitle.textContent;
      const newTaskList = [...tasks].filter((task) => task.title != t);
      const newProject = new Project(project["name"], newTaskList);
      localStorage.setItem(project["name"], JSON.stringify(newProject));
      this.deleteNode(parentDiv.firstChild);
    });
  }

  enableCheckbox(checkbox, parentDiv, project, tasks, taskTitle, projectName) {
    checkbox.addEventListener("click", () => {
      if (checkbox.checked) {
        project = JSON.parse(localStorage.getItem(projectName));
        tasks = project["listOfTasks"];
        const t = taskTitle.textContent;
        const newTaskList = [...tasks].filter((task) => task.title != t);
        const newProject = new Project(project["name"], newTaskList);
        localStorage.setItem(project["name"], JSON.stringify(newProject));
        this.deleteNode(parentDiv.firstChild);
      }
    });
  }

  showEditDialog(editIcon, data, taskTitle, description, dueDate, priority) {
    editIcon.addEventListener("click", () => {
      const editDialog = document.querySelector(".edit-task");
      this.showDialog(editDialog);

      const close = document.querySelector(".close-edit-task-dialog");
      this.enableCloseButton(close, editDialog);

      const title = document.querySelector(".edit-title");
      title.value = data[0];

      const desc = document.querySelector(".edit-desc");
      desc.value = data[1];

      const date = document.querySelector(".edit-date");
      date.value = data[2];

      const prio = document.querySelector("#edit-priority");
      prio.value = data[3];

      const edit = document.querySelector(".edit-task-button");
      edit.addEventListener("click", () => {
        taskTitle.textContent = title.value;
        description.textContent = desc.value;
        dueDate.textContent = date.value;
        priority.textContent = prio.value;
        this.changeColor(prio.value, priority);

        const t = document.querySelector(".title");

        const allTasks = document.querySelectorAll(".task");
        let taskList = [];

        for (let i = 0; i < allTasks.length; i++) {
          const info = allTasks[i].childNodes;
          const newTask = new Task(
            info[1].textContent,
            info[4].textContent,
            info[3].textContent,
            info[2].textContent
          );
          taskList.push(newTask);
        }

        const project = new Project(t.textContent, taskList);
        localStorage.setItem(t.textContent, JSON.stringify(project));
        this.closeDialog(editDialog);
      });
    });
  }
}
export { DOM };
