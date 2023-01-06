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

    input.value = '';
  }
};

//
const addTask = () => {
  const click = stateObject.location.querySelector('.section__drag-area');

  const newItem = `
    <div draggable="true" class="drag-item">
      <p class="section__new-task">${stateObject.value}</p>
    </div>`;
  click.insertAdjacentHTML('afterbegin', newItem);
  const dragItems = document.querySelectorAll('.drag-item');

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

// place of drag items to be moved
sectionDragArea.forEach((area) => {
  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    area.appendChild(dragging);
  });
});

//
sectionsContainer.addEventListener('click', currentItemData);
