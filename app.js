'use strict';

const sectionsContainer = document.querySelector('.sections__container');
const sectionDragArea = document.querySelectorAll('.section__drag-area');

const stateObject = {
  location: [],
  value: [],
  noteId: [],
};

// click on input to save new item
const currentItemClick = (e) => {
  const click = e.target;
  if (!click.classList.contains('section__btn')) return;
  newItemData(click);
};

// press enter to save new item
const currentItemPress = (e) => {
  const click = e.target;
  if (e.key === 'Enter') newItemData(click);
};

// data of new item => value and location
const newItemData = (click) => {
  const input = click.closest('.section').querySelector('.section__input');

  if (!input.value) return;

  stateObject.value = input.value;
  stateObject.location = click.closest('.section').querySelector('.section__drag-area');

  input.value = '';
  input.blur();

  addTask();
};

// render new task, update ls and activate drag functionality
const addTask = () => {
  // id of the task
  let id = new Date().getTime().toString();
  let parentID = stateObject.location.dataset.id;

  stateObject.noteId = id;

  const newItem = `
    <div draggable="true" class="section__drag-item" data-id="${id}">
      <p class="section__new-task">${stateObject.value}</p>
      <i class="delete fa-solid fa-xmark"></i>
    </div>`;
  stateObject.location.insertAdjacentHTML('afterbegin', newItem);

  const dragItems = document.querySelectorAll('.section__drag-item');
  const btnsDelete = document.querySelectorAll('.delete');

  btnsDelete.forEach((btn) => {
    btn.addEventListener('click', deleteItem);
  });

  updateLS(parentID);
  drag(dragItems);
};

// === DRAG ITEMS === //
// drag and drop items
const drag = (dragItems) => {
  dragItems.forEach((item) => {
    item.addEventListener('dragstart', () => {
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');

      updateLSItemsLocation(item);
    });
  });
};

// place of drag items to be moved
sectionDragArea.forEach((area) => {
  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    area.appendChild(dragging);
  });
});

// delete item
const deleteItem = (e) => {
  const parent = e.target.closest('.section__drag-area');
  const target = e.target.parentElement;
  parent.removeChild(target);
  removeLS(target);
};

// === localStorage === //
// getLocalStorage
const getLS = () => {
  const lsArr = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
  return lsArr;
};

// update localStorage
const updateLS = (parentID) => {
  const lsArr = getLS();

  const lsObject = {
    id: stateObject.noteId,
    value: stateObject.value,
    location: parentID,
  };

  lsArr.push(lsObject);
  localStorage.setItem('notes', JSON.stringify(lsArr));
};

// update localStorage dragged items location
const updateLSItemsLocation = (item) => {
  // ID of parentElements where item was droped
  const parentID = item.parentElement.id;

  const lsArr = getLS();

  // find dragged item in ls
  const find = lsArr.find((value) => value.id === item.dataset.id);

  // override dragged items location
  find.location = parentID;

  localStorage.setItem('notes', JSON.stringify(lsArr));
};

// remove item from localStorage
const removeLS = (target) => {
  const lsArr = getLS();
  const lsItems = lsArr.filter((item) => item.id !== target.dataset.id);
  localStorage.setItem('notes', JSON.stringify(lsItems));
};

// template to retrive item from localStorage
const lsTemplate = (item) => {
  return `
    <div draggable="true" class="section__drag-item" data-id="${item.id}">
    <p class="section__new-task">${item.value}</p>
    <i class="delete fa-solid fa-xmark"></i>`;
};

// === domcontentloaded function
const loadDisplay = () => {
  const nextProjectsSection = document.querySelector('#next');
  const learnProjectsSection = document.querySelector('#learn');
  const completedProjectsSection = document.querySelector('#completed');

  const lsArr = getLS();

  if (!lsArr.length) return;

  const lsNextSection = lsArr.filter((item) => item.location === 'next');
  lsNextSection.forEach((item) => {
    const lsItems = lsTemplate(item);
    nextProjectsSection.innerHTML += lsItems;
  });

  const lsLearnSection = lsArr.filter((item) => item.location === 'learn');
  lsLearnSection.forEach((item) => {
    const lsItems = lsTemplate(item);
    learnProjectsSection.innerHTML += lsItems;
  });

  const lsCompletedSection = lsArr.filter((item) => item.location === 'completed');
  lsCompletedSection.forEach((item) => {
    const lsItems = lsTemplate(item);
    completedProjectsSection.innerHTML += lsItems;
  });

  const dragItems = document.querySelectorAll('.section__drag-item');

  // delete btns
  const btnsDelete = document.querySelectorAll('.delete');
  btnsDelete.forEach((btn) => {
    btn.addEventListener('click', deleteItem);
  });

  drag(dragItems);
};

//addEventListeners
sectionsContainer.addEventListener('click', currentItemClick);
document.addEventListener('DOMContentLoaded', loadDisplay);
document.addEventListener('keyup', currentItemPress);
