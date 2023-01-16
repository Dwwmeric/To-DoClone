"use strict";
const itemsContainer = document.querySelectorAll('.itemsContainer');
let actualContainer, actualBtn, actualUl, actualForm, actualInput, actualValidate;
function addContainerListeners(currentContainner) {
    const currentContainnerDeleteBtn = currentContainner.querySelector('.deleteContainerBtn');
    const currentContainnerAddBtn = currentContainner.querySelector('.addItemsBtn');
    const currentContainnerCancelBtn = currentContainner.querySelector('.closeFormBtn');
    const currentForm = currentContainner.querySelector('form');
    deleteBtnListners(currentContainnerDeleteBtn);
    addItemsBtnListeners(currentContainnerAddBtn);
    closeFormBtnListeners(currentContainnerCancelBtn);
    addFormlisteners(currentForm);
    addDDlisteners(currentContainner);
}
itemsContainer.forEach((container) => {
    addContainerListeners(container);
});
function deleteBtnListners(btn) {
    btn.addEventListener('click', handleContainerDeletion);
}
function addItemsBtnListeners(btn) {
    btn.addEventListener('click', handleItemsAdd);
}
function closeFormBtnListeners(btn) {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false));
}
function addFormlisteners(form) {
    form.addEventListener('submit', createNewItems);
}
function addDDlisteners(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragend);
}
function handleContainerDeletion(e) {
    const btn = e.target;
    const btnsArray = [...document.querySelectorAll('.deleteContainerBtn')];
    const containers = [...document.querySelectorAll('.itemsContainer')];
    containers[btnsArray.indexOf(btn)].remove();
}
function handleItemsAdd(e) {
    const btn = e.target;
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
}
function toggleForm(btn, form, show) {
    if (!show) {
        form.style.display = "none";
        btn.style.display = "block";
    }
    else if (show) {
        form.style.display = "block";
        btn.style.display = "none";
    }
}
function setContainerItems(btn) {
    actualBtn = btn;
    actualContainer = btn.parentElement;
    actualUl = actualContainer.querySelector('ul');
    actualForm = actualContainer.querySelector('form');
    actualInput = actualContainer.querySelector('input');
    actualValidate = actualContainer.querySelector('.ValideMsg');
}
function createNewItems(e) {
    e.preventDefault();
    //validation
    if (actualInput.value.length === 0) {
        actualValidate.textContent = "Must be at least 1 character long";
        return;
    }
    else {
        actualValidate.textContent = "";
    }
    // create items
    const itemContent = actualInput.value;
    const il = '<li class="items" draggable="true"> <p> ' + itemContent + ' </p> <button>x</button> </li>';
    actualUl.insertAdjacentHTML('beforeend', il);
    const item = actualUl.lastElementChild;
    const liBtn = item.querySelector('button');
    deleteItemsList(liBtn);
    addDDlisteners(item);
    actualInput.value = "";
}
function deleteItemsList(btn) {
    btn.addEventListener('click', () => {
        const elRemove = btn.parentElement;
        elRemove.remove();
    });
}
//add new contanaire 
const addContainerBtn = document.querySelector('.addContainerBtn');
const addContainerForm = document.querySelector('.addNewContainer form');
const addContainerFormInput = document.querySelector('.addNewContainer input');
const validationContainer = document.querySelector('.addNewContainer .ValideMsg');
const addContainerCloseBtn = document.querySelector('.closeList');
const AddnewContainer = document.querySelector('.addNewContainer');
const containerLists = document.querySelector('.main');
addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true);
});
addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
});
addContainerForm.addEventListener('submit', createNewContainer);
function createNewContainer(e) {
    e.preventDefault();
    //validation
    if (addContainerFormInput.value.length === 0) {
        validationContainer.textContent = "Must be at least 1 character long";
        return;
    }
    else {
        validationContainer.textContent = "";
    }
    // create container
    const itemsContainer = document.querySelector('.itemsContainer');
    const newContainer = itemsContainer.cloneNode();
    const newcCntainerContent = '<div class="topContainer"><h2>' + addContainerFormInput.value + '</h2><button class="deleteContainerBtn">x</button></div><ul></ul><button class="addItemsBtn">Add an item</button><form autocomplete="off"><div class="topFormContainer"><label for="item">Add a new item</label><button type="button" class="closeFormBtn">x</button></div><input type="text" id="item"/><span class="ValideMsg"></span><button type="submit">Submit</button></form>';
    newContainer.innerHTML = newcCntainerContent;
    containerLists.insertBefore(newContainer, AddnewContainer);
    addContainerFormInput.value = "";
    addContainerListeners(newContainer);
}
//DRAG AND DROP 
let dragSrcEl;
function handleDragStart(e) {
    var _a;
    e.stopPropagation();
    if (actualForm)
        toggleForm(actualBtn, actualForm, false);
    dragSrcEl = this;
    (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    e.preventDefault();
}
function handleDrop(e) {
    var _a;
    e.stopPropagation();
    const receptionE1 = this;
    if (dragSrcEl.nodeName === "LI" && receptionE1.classList.contains("itemsContainer")) {
        receptionE1.querySelector('ul').appendChild(dragSrcEl);
        addDDlisteners(dragSrcEl);
        deleteItemsList(dragSrcEl.querySelector("button"));
    }
    if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/html');
        if (this.classList.contains("itemsContainer")) {
            addContainerListeners(this);
            this.querySelectorAll('li').forEach((li) => {
                deleteBtnListners(li.querySelector("button"));
                addDDlisteners(li);
            });
        }
        else {
            addDDlisteners(this);
            deleteBtnListners(this.querySelector("button"));
        }
    }
}
function handleDragend(e) {
    e.stopPropagation();
    if (this.classList.contains("itemsContainer")) {
        addContainerListeners(this);
        if (this.querySelectorAll("li")) {
            this.querySelectorAll('li').forEach((li) => {
                deleteBtnListners(li.querySelector('button'));
                addDDlisteners(li);
            });
        }
        else {
            addDDlisteners(this);
        }
    }
}
