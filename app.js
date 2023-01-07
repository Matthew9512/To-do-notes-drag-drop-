'use strict';

const sectionsContainer = document.querySelector('.sections__container');
const sectionDragArea = document.querySelectorAll('.section__drag-area');

const stateObject = {
  location: [],
  value: [],
  noteId: [],
};

//
const currentItemData = (e) => {
  const click = e.target;
  if (!click.classList.contains('section__btn')) return;
  else {
    const input = click.closest('.section').querySelector('.section__input');
    stateObject.value = input.value;
    stateObject.location = click.closest('.section');

    addTask();

    input.value = '';
  }
};

//
const addTask = () => {
  const click = stateObject.location.querySelector('.section__drag-area');
  console.log(click);
  // id of the task
  let id = new Date().getTime().toString();
  let parentID = stateObject.location.id;

  stateObject.noteId = id;

  const newItem = `
    <div draggable="true" class="section__drag-item" data-id="${id}">
      <p class="section__new-task">${stateObject.value}</p>
      <i class="delete fa-solid fa-xmark"></i>
    </div>`;
  click.insertAdjacentHTML('afterbegin', newItem);

  const dragItems = document.querySelectorAll('.section__drag-item');
  const btnsDelete = document.querySelectorAll('.delete');

  btnsDelete.forEach((btn) => {
    btn.addEventListener('click', deleteItem);
  });

  updateLS(parentID);
  drag(dragItems);
};

// ===
// drag and drop items
const drag = (dragItems) => {
  dragItems.forEach((item) => {
    item.addEventListener('dragstart', () => {
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });
  });
};

// delete item
const deleteItem = (e) => {
  const parent = e.target.closest('.section__drag-area');
  const target = parent.querySelector('.section__drag-item');
  parent.removeChild(target);
  removeLS(target);
};

// place of drag items to be moved
sectionDragArea.forEach((area) => {
  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    area.appendChild(dragging);
  });
});

// === localStorage
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

// remove item from localStorage
const removeLS = (target) => {
  const lsArr = getLS();
  const lsItems = lsArr.filter((item) => item.id !== target.dataset.id);
  localStorage.setItem('notes', JSON.stringify(lsItems));
};

// === domcontentloaded function
const loadDisplay = () => {
  const lsArr = getLS();
  console.log(lsArr);
  if (!lsArr.length) return;
  console.log(`you have some notes in your notes folder`);

  // for (let ls in lsArr) {
  //   const m = document.querySelector(`#${lsArr[ls].location}`);
  //   console.log(m);
  //   m.innerHTML = `<div draggable="true" class="section__drag-item" data-id="${lsArr.at(ls).id}">
  //   <p class="section__new-task">${lsArr.at(ls).value}</p>
  //   <i class="delete fa-solid fa-xmark"></i>
  // </div>`;
  // }

  // const parent = lsArr.at(1).location;
  // console.log(parent);
  // const y = document.querySelector(`#${parent}`);
  // console.log(y);
  // const qw = y.querySelector('.section__drag-area');
  // qw.innerHTML = `
  // <div draggable="true" class="section__drag-item" data-id="${lsArr.at(0).id}">
  //   <p class="section__new-task">${lsArr.at(0).value}</p>
  //   <i class="delete fa-solid fa-xmark"></i>
  // </div>`;
};

//addEventListeners
sectionsContainer.addEventListener('click', currentItemData);
document.addEventListener('DOMContentLoaded', loadDisplay);
