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
  let parentID = stateObject.location.dataset.location;

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

// template to retrive item from localStorage
const template = (item) => {
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
    const lsItems = template(item);
    nextProjectsSection.innerHTML += lsItems;
  });

  const lsLearnSection = lsArr.filter((item) => item.location === 'learn');
  lsLearnSection.forEach((item) => {
    const lsItems = template(item);
    learnProjectsSection.innerHTML += lsItems;
  });

  const lsCompletedSection = lsArr.filter((item) => item.location === 'completed');
  lsCompletedSection.forEach((item) => {
    const lsItems = template(item);
    completedProjectsSection.innerHTML += lsItems;
  });

  const dragItems = document.querySelectorAll('.section__drag-item');

  // delete btns
  const btnsDelete = document.querySelectorAll('.delete');
  btnsDelete.forEach((btn) => {
    btn.addEventListener('click', deleteItem);
  });

  drag(dragItems);
  // retrive only unique items
  // const lsNext = lsArr.reduce((acc, value) => {
  //   if (!acc.includes(value.location)) {
  //     acc.push(value.location);
  //   }
  //   return acc;
  // }, []);
};

//addEventListeners
sectionsContainer.addEventListener('click', currentItemData);
document.addEventListener('DOMContentLoaded', loadDisplay);
