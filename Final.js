const clock = document.querySelector('h1');
const $loginInput = document.querySelector('#loginInput');
const $loginForm = document.querySelector('#loginForm');
const $todoForm = document.querySelector('#todoForm');
const $greeting = document.querySelector('#greeting');
const $todoInput = document.querySelector('#todoInput');
const $todoList = document.querySelector('#todoList');

function getClock () {
    const today = new Date();
    const todayHours = String(today.getHours()).padStart(2,'0');
    const todayMinutes = String(today.getMinutes()).padStart(2,'0');
    const todaySeconds = String(today.getSeconds()).padStart(2,'0');
    clock.innerText = `${todayHours}:${todayMinutes}:${todaySeconds}`;
}

getClock();
setInterval(getClock, 1000);

const USERNAME_KEY = 'username';
const HIDDEN = 'hidden';

function onLoginSubmit (event) {
    event.preventDefault();
    $loginForm.classList.add(HIDDEN);
    const userName = $loginInput.value;
    localStorage.setItem(USERNAME_KEY, userName);
    paintGreetings(userName);
}  

function paintGreetings (userName) { 
    const todayHours = new Date().getHours(); 
    if (todayHours >= 6 && todayHours < 12) {
        $greeting.innerText = `Good morning, ${userName[0].toUpperCase()+userName.slice(1)}`;
    } else if (todayHours >= 12 && todayHours < 18) {
        $greeting.innerText = `Good afternoon, ${userName[0].toUpperCase()+userName.slice(1)}`;
    } else if (todayHours >= 18 && todayHours < 23) {
        $greeting.innerText = `Good evening, ${userName[0].toUpperCase()+userName.slice(1)}`;
    } else {
        $greeting.innerText = `Hello, ${userName[0].toUpperCase()+userName.slice(1)}`;
    }
    $greeting.classList.remove(HIDDEN);
    $todoForm.classList.remove(HIDDEN);
    $loginForm.classList.add(HIDDEN);
}

$loginForm.addEventListener('submit', onLoginSubmit);

const userName = localStorage.getItem(USERNAME_KEY);

if (userName === null) {
    $loginForm.classList.remove(HIDDEN);
    $loginForm.addEventListener('submit', onLoginSubmit);
} else {
    paintGreetings(userName);
}

const images = ['000.png', '001.jpg', '002.jpg'];
const chosenImage = images[Math.floor(Math.random() * images.length)];
document.body.style.backgroundImage = `url('./${chosenImage}')`;


const API_KEY = "f608625d899ba43e3a0e62f593d84c21";

function onGeoOk(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then((data)=>{
            const weather = document.querySelector("#weather span:first-child")
            const city = document.querySelector("#weather span:last-child")
            city.innerText = data.name;
            weather.innerText = `${data.weather[0].main}/${data.main.temp}`;
        }
        );
}

function onGeoError(){
    alert("Can't find you.");
}
navigator.geolocation.getCurrentPosition(onGeoOk,onGeoError);

const TODOS_KEY = "todos"
let todos = [];

function todoSave() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function todoDelete(event) {
    const li = event.target.parentElement;
    li.remove();
    todos = todos.filter((todo) => todo.id !== parseInt(li.id));
    todoSave();
}

function todoPaint(newTodo) {
    const li = document.createElement("li");
    li.id = newTodo.id;
    const span = document.createElement("span");
    span.innerText = newTodo.text;
    const button = document.createElement("button");
    button.innerText = "";
    button.style.background = 'none';
    button.style.border = '2px solid white';
    button.style.width = '30px';
    button.style.height = '30px';
    button.style.margin = '0 50px 0 0';
    button.addEventListener("click",todoDelete);
    li.appendChild(button);
    li.appendChild(span);
    $todoList.appendChild(li);
    li.style.color = 'white';
    li.style.listStyle = 'none';
    li.style.fontSize = '35px';
    li.style.textAlign = 'left';
}

function todoSubmit(event) {
    event.preventDefault();
    const newTodo = $todoInput.value;
    $todoInput.value = '';
    const newTodoObj = {
        text: newTodo,
        id: Date.now(),
    }
    todos.push(newTodoObj);
    todoPaint(newTodoObj);
    todoSave();
}

$todoForm.addEventListener('submit', todoSubmit);

const savedTodos = localStorage.getItem(TODOS_KEY);

if(savedTodos !== null){
    const parsedTodos = JSON.parse(savedTodos);
    todos = parsedTodos;
    parsedTodos.forEach(todoPaint);     
}