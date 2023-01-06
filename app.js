'use strict';

const sectionsContainer = document.querySelector('.sections__container');
const sectionDragArea = document.querySelectorAll('.section__drag-area');

const stateObject = {
  location: [],
  value: [],
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
    updateLS();

    input.value = '';
  }
};

//
const addTask = () => {
  const click = stateObject.location.querySelector('.section__drag-area');

  const newItem = `
    <div draggable="true" class="section__drag-item">
      <p class="section__new-task">${stateObject.value}</p>
      <i class="delete fa-solid fa-xmark"></i>
    </div>`;
  click.insertAdjacentHTML('afterbegin', newItem);
  const dragItems = document.querySelectorAll('.section__drag-item');
  const btnsDelete = document.querySelectorAll('.delete');

  btnsDelete.forEach((btn) => {
    btn.addEventListener('click', deleteItem);
  });

  drag(dragItems);
};

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
};

// place of drag items to be moved
sectionDragArea.forEach((area) => {
  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    area.appendChild(dragging);
  });
});

// localStorage
// getLocalStorage
const getLS = () => {
  const lsArr = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
  return lsArr;
};

// update localStorage
const updateLS = () => {
  const lsArr = getLS();
  lsArr.push(stateObject.value);
  localStorage.setItem('notes', JSON.stringify(lsArr));
};

//
sectionsContainer.addEventListener('click', currentItemData);
