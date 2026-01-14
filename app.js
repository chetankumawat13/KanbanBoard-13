let taskData = {}
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
let dragElement = null;

const columns = [todo, progress, done];


const inner = document.querySelector('.inner');
const overlay = document.querySelector('.overlay');
let w = 0;
let rotation = 0;


let file = null;
let image = null;

let interval = setInterval(() => {
    if (w < 90) { 
        w += 1; 
        inner.style.width = w + '%';
    } else {
        clearInterval(interval); 
    }
}, 40); 

setTimeout(() => {
    inner.style.transition = 'width 0.5s ease-in-out';
    inner.style.width = '100%';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}, 4000);

/* ------------------ UTIL FUNCTIONS ------------------ */

function attachDrag(task) {
    task.addEventListener("drag", () => {
        dragElement = task;
    });
}

function attachDelete(task) {
    const deleteBtn = task.querySelector("button");
    deleteBtn.addEventListener("click", () => {
        task.remove();
        updateTasksAndCount();
    });
}

function updateTasksAndCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector(".heading .right");

        taskData[col.id] = Array.from(tasks).map(t => ({
            title: t.querySelector("h2").textContent,
            description: t.querySelector("p").textContent
        }));

        count.textContent = tasks.length;
    });

    localStorage.setItem("tasks", JSON.stringify(taskData));
}

/* ------------------ LOAD FROM LOCALSTORAGE ------------------ */

if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data) {
        const column = document.querySelector(`#${col}`);

        data[col].forEach(task => {
            const div = document.createElement("div");
            div.classList.add("task");
            div.setAttribute("draggable", "true");
            div.innerHTML = `
                <h2>${task.title}</h2>
                <p>${task.description}</p>
                <button>Delete</button>
            `;

            column.appendChild(div);
            attachDrag(div);
            attachDelete(div);
        });
    }

    updateTasksAndCount();
}

/* ------------------ DRAG & DROP ------------------ */

function addDragEventsOnColumn(column) {
    column.addEventListener("dragenter", e => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", e => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", e => e.preventDefault());

    column.addEventListener("drop", e => {
        e.preventDefault();
        column.appendChild(dragElement);
        column.classList.remove("hover-over");
        updateTasksAndCount();
    });
}

columns.forEach(addDragEventsOnColumn);

/* ------------------ MODAL ------------------ */

const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

/* ------------------ ADD TASK ------------------ */

addTaskButton.addEventListener("click", () => {
    const title = document.querySelector("#task-title-input").value;
    const description = document.querySelector("#task-dec-input").value;

    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button>Delete</button>
    `;

    todo.appendChild(div);
    attachDrag(div);
    attachDelete(div);

    updateTasksAndCount();
    modal.classList.remove("active");

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-dec-input").value = "";
});



