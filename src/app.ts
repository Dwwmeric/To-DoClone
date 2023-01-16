const itemsContainer = document.querySelectorAll('.itemsContainer') as NodeListOf<HTMLDivElement>

let actualContainer: HTMLDivElement,
    actualBtn: HTMLButtonElement,
    actualUl: HTMLUListElement,
    actualForm: HTMLFormElement,
    actualInput: HTMLInputElement,
    actualValidate: HTMLSpanElement;


function addContainerListeners(currentContainner: HTMLDivElement) {
    const currentContainnerDeleteBtn = currentContainner.querySelector('.deleteContainerBtn') as HTMLButtonElement;
    const currentContainnerAddBtn = currentContainner.querySelector('.addItemsBtn') as HTMLButtonElement;
    const currentContainnerCancelBtn = currentContainner.querySelector('.closeFormBtn') as HTMLButtonElement;
    const currentForm = currentContainner.querySelector('form') as HTMLFormElement;

    deleteBtnListners(currentContainnerDeleteBtn)
    addItemsBtnListeners(currentContainnerAddBtn)
    closeFormBtnListeners(currentContainnerCancelBtn)
    addFormlisteners(currentForm)
    addDDlisteners(currentContainner)
}



itemsContainer.forEach((container: HTMLDivElement) => {
    addContainerListeners(container)
})

function deleteBtnListners(btn: HTMLButtonElement) {
    btn.addEventListener('click', handleContainerDeletion)
}

function addItemsBtnListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', handleItemsAdd)
}

function closeFormBtnListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false))
}

function addFormlisteners(form: HTMLFormElement) {
    form.addEventListener('submit', createNewItems)
}
function addDDlisteners(element: HTMLElement) {
    element.addEventListener('dragstart', handleDragStart)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)
    element.addEventListener('dragend', handleDragend)
}



function handleContainerDeletion(e: MouseEvent) {
    const btn = e.target as HTMLButtonElement;
    const btnsArray = [...document.querySelectorAll('.deleteContainerBtn')] as HTMLButtonElement[];
    const containers = [...document.querySelectorAll('.itemsContainer')] as HTMLDivElement[];
    containers[btnsArray.indexOf(btn)].remove();
}

function handleItemsAdd(e: Event) {
    const btn = e.target as HTMLButtonElement;
    if (actualContainer) toggleForm(actualBtn, actualForm, false);
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
}

function toggleForm(btn: HTMLButtonElement, form: HTMLFormElement, show: boolean) {
    if (!show) {
        form.style.display = "none";
        btn.style.display = "block";
    } else if (show) {
        form.style.display = "block";
        btn.style.display = "none";
    }
}

function setContainerItems(btn: HTMLButtonElement) {
    actualBtn = btn;
    actualContainer = btn.parentElement as HTMLDivElement;
    actualUl = actualContainer.querySelector('ul') as HTMLUListElement;
    actualForm = actualContainer.querySelector('form') as HTMLFormElement;
    actualInput = actualContainer.querySelector('input') as HTMLInputElement;
    actualValidate = actualContainer.querySelector('.ValideMsg') as HTMLSpanElement;
}

function createNewItems(e: Event) {
    e.preventDefault();
    //validation
    if (actualInput.value.length === 0) {
        actualValidate.textContent = "Must be at least 1 character long";
        return;
    } else {
        actualValidate.textContent = "";
    }

    // create items
    const itemContent = actualInput.value;
    const il = '<li class="items" draggable="true"> <p> ' + itemContent + ' </p> <button>x</button> </li>';
    actualUl.insertAdjacentHTML('beforeend', il);

    const item = actualUl.lastElementChild as HTMLLIElement;
    const liBtn = item.querySelector('button') as HTMLButtonElement;
    deleteItemsList(liBtn);
    addDDlisteners(item);
    actualInput.value = "";
}

function deleteItemsList(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => {
        const elRemove = btn.parentElement as HTMLLIElement;
        elRemove.remove()
    })
}

//add new contanaire 

const addContainerBtn = document.querySelector('.addContainerBtn') as HTMLButtonElement;
const addContainerForm = document.querySelector('.addNewContainer form') as HTMLFormElement;
const addContainerFormInput = document.querySelector('.addNewContainer input') as HTMLInputElement;
const validationContainer = document.querySelector('.addNewContainer .ValideMsg') as HTMLSpanElement;
const addContainerCloseBtn = document.querySelector('.closeList') as HTMLButtonElement;
const AddnewContainer = document.querySelector('.addNewContainer') as HTMLDivElement;
const containerLists = document.querySelector('.main') as HTMLDivElement;


addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true);
})

addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
})

addContainerForm.addEventListener('submit', createNewContainer);

function createNewContainer(e: Event) {
    e.preventDefault();
    //validation
    if (addContainerFormInput.value.length === 0) {
        validationContainer.textContent = "Must be at least 1 character long";
        return;
    } else {
        validationContainer.textContent = "";
    }

    // create container
    const itemsContainer = document.querySelector('.itemsContainer') as HTMLDivElement;
    const newContainer = itemsContainer.cloneNode() as HTMLDivElement;
    const newcCntainerContent = '<div class="topContainer"><h2>' + addContainerFormInput.value + '</h2><button class="deleteContainerBtn">x</button></div><ul></ul><button class="addItemsBtn">Add an item</button><form autocomplete="off"><div class="topFormContainer"><label for="item">Add a new item</label><button type="button" class="closeFormBtn">x</button></div><input type="text" id="item"/><span class="ValideMsg"></span><button type="submit">Submit</button></form>';

    newContainer.innerHTML = newcCntainerContent;
    containerLists.insertBefore(newContainer, AddnewContainer);
    addContainerFormInput.value = "";
    addContainerListeners(newContainer);

}

//DRAG AND DROP 
let dragSrcEl: HTMLElement;

function handleDragStart(this: HTMLElement, e: DragEvent) {
    e.stopPropagation();

    if (actualForm) toggleForm(actualBtn, actualForm, false);
    dragSrcEl = this;
    e.dataTransfer?.setData('text/html', this.innerHTML);
}

function handleDragOver(e: DragEvent) {
    e.preventDefault()
}

function handleDrop(this: HTMLElement, e: DragEvent) {
    e.stopPropagation();

    const receptionE1 = this;

    if (dragSrcEl.nodeName === "LI" && receptionE1.classList.contains("itemsContainer")) {
        (receptionE1.querySelector('ul') as HTMLUListElement).appendChild(dragSrcEl);
        addDDlisteners(dragSrcEl);
        deleteItemsList(dragSrcEl.querySelector("button") as HTMLButtonElement);
    }

    if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer?.getData('text/html') as string;

        if (this.classList.contains("itemsContainer")) {
            addContainerListeners(this as HTMLDivElement)
            this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
                deleteBtnListners(li.querySelector("button") as HTMLButtonElement)
                addDDlisteners(li);
            })
        } else {
            addDDlisteners(this);
            deleteBtnListners(this.querySelector("button") as HTMLButtonElement)
        }
    }
}

function handleDragend(this: HTMLElement, e: DragEvent) {
    e.stopPropagation();
    if (this.classList.contains("itemsContainer")) {
        addContainerListeners(this as HTMLDivElement)
        if (this.querySelectorAll("li")) {
            this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
                deleteBtnListners(li.querySelector('button') as HTMLButtonElement)
                addDDlisteners(li);
            })
        } else {
            addDDlisteners(this);
        }

    }

}
