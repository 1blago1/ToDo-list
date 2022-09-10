//найти элементы
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

//функции
function addTask(event) {
  //отмена отправки формы
  event.preventDefault();

  //достать текст из инпута
  const taskText = taskInput.value;

  //описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //добавляем задачу в массив объектов
  tasks.push(newTask);

  saveToLocalStorage();

  renderTask(newTask);

  //очищаем поле ввода и возвр в него фокус
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  //проверка что клик был по не по кнопке" удалить задачу"
  if (event.target.dataset.action !== "delete") return;

  //проверка что клик был по кнопке удалить
  const parentNode = event.target.closest(".list-group-item");
  parentNode.remove();

  //определяем IDзадачи
  const id = Number(parentNode.id);

  //удаляем задачу через фильтер массива
  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();

  checkEmptyList();
}

function doneTask(event) {
  //проверка что клик был не  по кнопке "выполнено"
  if (event.target.dataset.action !== "done") return;

  //проверка что клик был по кнопке "выполнено"
  const parentNode = event.target.closest(".list-group-item");
  //опр айди задачи
  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  //форрмируем css класс
  const cssClass = task.done ? "task-title task-title--done" : " task-title";

  //добавление задачи
  const taskHTML = `
 <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
     <span class="${cssClass}">${task.text}</span>
     <div class="task-item__buttons">
         <button type="button" data-action="done" class="btn-action">
         <img src="./img/tick.svg" alt="Done" width="18" height="18" />
         </button>
         <button type="button" data-action="delete" class="btn-action">
         <img src="./img/cross.svg" alt="Done" width="18" height="18" />
         </button>
     </div>
 </li>
`;

  //добавить задачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
