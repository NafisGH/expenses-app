// const LIMIT_EXPENSE = 10000;
const STATUS_IN_LIMIT = "Все хорошо";
const STATUS_OUT_OF_LIMIT = "Лимит превышен";
const STATUS_OUT_OF_LIMIT_CLASSNAME = "status_red";
const STORAGE_LABLE_LIMIT = "limit";
const STORAGE_LABLE_EXPENSE = "expense";
const currencyRub = "руб.";

const inputNode = document.querySelector(".js-expense-input");
const buttonNode = document.querySelector(".js-button-add-expense");
const historyNode = document.querySelector(".js-history-expenses");
const sumExpenseNode = document.querySelector(".js-sum-expense");

const statusExpenseNode = document.querySelector(".js-status-expense");
const btnResetExpensesNode = document.querySelector(".js-btn-reset-expenses");
// const categorySelect = document.querySelector(".categorySelect");
const btnEditLimit = document.querySelector(".js-btn-edit-limit");
const masageLimit = document.querySelector(".js-masage-limit");

//---------------------------------------------------------------
// Код выпадающего списка категории
const selectSingle = document.querySelector(".__select");
const selectSingle_title = selectSingle.querySelector(".__select__title");
const selectSingle_labels = selectSingle.querySelectorAll(".__select__label");

let selectedCategory; // Переменная для хранения выбранной категории

// Toggle menu Меню переключения
selectSingle_title.addEventListener("click", () => {
  if ("active" === selectSingle.getAttribute("data-state")) {
    selectSingle.setAttribute("data-state", "");
  } else {
    selectSingle.setAttribute("data-state", "active");
  }
});

// Закрыть при нажатии на опцию
for (let i = 0; i < selectSingle_labels.length; i++) {
  selectSingle_labels[i].addEventListener("click", (evt) => {
    // selectSingle_title.textContent = evt.target.textContent;
    selectedCategory = evt.target.textContent; // Записываем выбранную категорию в переменную
    selectSingle_title.textContent = selectedCategory; // Обновляем текст заголовка
    selectSingle.setAttribute("data-state", ""); // Закрываем меню
  });
}
//---------------------------------------------------------------
const limitExpenseNode = document.querySelector(".js-limit-expense"); // limitNode
let limit = parseInt(limitExpenseNode.innerText)

function initLimit() {
  const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LABLE_LIMIT));
  if (!limitFromStorage) {
    return;
  }
  limitExpenseNode.innerText = limitFromStorage;
  return (limit = parseInt(limitExpenseNode.innerText));
}
initLimit();

const expensesFromStorageString = localStorage.getItem(STORAGE_LABLE_EXPENSE);
const expensesFromStorage = JSON.parse(expensesFromStorageString);

let expenses = [];
if (Array.isArray(expensesFromStorage)) {
  expenses = expensesFromStorage
}
render();

// Стартовые значения
initApp(expenses);
function initApp() {
  // limitExpenseNode.innerText = 0;
  sumExpenseNode.innerText = getTotalSum(expenses);
  // statusExpenseNode.innerText = STATUS_IN_LIMIT;
}

// Слушатель по нажатию на Enter
inputNode.addEventListener("keydown", keydownEnterBtnAdd);

// Слушатель на кнопку изменения лимита
btnEditLimit.addEventListener("click", changeLimitHandler);

// Слушатель на Сброс всех данных до начальных значений
btnResetExpensesNode.addEventListener("click", resetAllExpenses);

//Слушатель срабатывает по нажатию на Добавить
buttonNode.addEventListener("click", function () {
  // плучаем значение из поля ввода
  const expense = getExpense();
  // Проверяем, является ли значение пустой строкой или не числом
  // if (isNaN(expense) || expense === "") {
  //   inputNode.classList.add("expense-input-red")
  //   return;
  // }

  // Получаем категорию записываем в переменную и проверяем ее
  const currentCategory = getSelectedCategory();
  console.log('currentCategory', currentCategory)
  // Проверяем, выбрана ли категория


  if ((isNaN(expense) || expense === "") && (isNaN(currentCategory) || !currentCategory)) {
    inputNode.classList.add("expense-input-red")
    selectSingle_title.classList.add("__select__title-red")
    return;
  }

  // Создаем обьект с суммой и категорией
  const newExpense = { amount: expense, category: currentCategory };

  // сохраняем трату в список в массив обьект трату и категорию в список
  saveExpense(newExpense);

  // Подсчитываем сумму
  getTotalSum();

  // Рендер 2-ух ф-ий  renderHistory() renderStatus()
  render();

  // Очищаем поле ввода
  clearInput();
});

// Ф-ия Сброс всех данных до начальных значений
function resetAllExpenses() {
  expenses.length = 0;
  // limitExpenseNode.innerText = 0;
  sumExpenseNode.innerText = `0 `;
  statusExpenseNode.innerText = STATUS_IN_LIMIT;
  statusExpenseNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
  historyNode.innerText = "";
  restCategory();
  masageLimit.classList.remove("masage-limit-active");
  masageLimit.classList.add("masage-limit-hidden");
  inputNode.classList.remove("expense-input-red")
  selectSingle_title.classList.remove("__select__title-red")
}

// Ф-ия Получения категории
function restCategory() {
  selectSingle_title.textContent =
    selectSingle_title.getAttribute("data-default");
}

// Ф-ия изменения лимита
function changeLimitHandler() {
  const newLimit = prompt("Введите лимит");
  const newLimitValue = parseInt(newLimit);

  if (!newLimitValue) {
    return;
  }

  limitExpenseNode.innerText = newLimitValue;
  limit = newLimitValue;

  //
  localStorage.setItem(STORAGE_LABLE_LIMIT, newLimitValue);
}

// Ф-ия Добавление траты по нажатию на Enter
function keydownEnterBtnAdd(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    buttonNode.click();
  }
}

// плучаем значение из поля ввода
function getExpense() {
  const expense = parseInt(inputNode.value);
  return expense;
}

// Ф-ия Получаем категорию
function getSelectedCategory() {
  return selectedCategory;
}

function saveExpensesStorage() {
  const expenseString = JSON.stringify(expenses);
  localStorage.setItem(STORAGE_LABLE_EXPENSE, expenseString);
}

// Ф-ия сохраняем и добавляем в массив обьект трату и категорию в список
function saveExpense(expense) {
  expenses.push(expense);

  saveExpensesStorage();
}

// Ф-ия считает общую сумму
function getTotalSum() {
  let sum = 0;
  expenses.forEach((value) => {
    sum += value.amount;
  });
  return sum;
}

// выводим сумму трат и историю
function renderHistory() {
  let expesesListHTML = "";

  expenses.forEach((value) => {
    expesesListHTML += `<li> ${value.category} - ${value.amount} ${currencyRub}</li>`;
  });
  historyNode.innerHTML = `<ol>${expesesListHTML}</ol>`;
}

// 5. Сравнение с лимитом и вывод статуса
function renderStatus() {
  const total = getTotalSum();
  sumExpenseNode.innerText = total;

  if (total <= limit) {
    statusExpenseNode.innerText = STATUS_IN_LIMIT;
    statusExpenseNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME); // Убираем класс, если он был добавлен ранее
  } else {
    statusExpenseNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
    statusExpenseNode.innerText = `${STATUS_OUT_OF_LIMIT} на ${total - limit} ${currencyRub}`;
    
  }
}

function render() {
  renderHistory();
  renderStatus();
}

function clearInput() {
  inputNode.value = "";
}
