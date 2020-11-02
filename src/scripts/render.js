import $ from 'jquery';
import api from './api';
import store from './store';

// grab start returns the homepage based on the contents of our store(based on the contents of our API)
const grabList = () => {
    return `<div class="error">${grabError()}</div>
        <button id="newView">NEW </button>
        <select id="ratingFilter" name="ratingFilter">
            <option value="">FILTER</option>
            <option value="1">${grabDots(1)} +</option>
            <option value="2">${grabDots(2)} +</option>
            <option value="3">${grabDots(3)} +</option>
            <option value="4">${grabDots(4)} +</option>    
            <option value="5">${grabDots(5)}</option>
        </select>
    <ul class="list">${grabListItems()}</ul>`
}

// grabs our list items
const grabListItems = () => {
    let listItems = "";

    let list = store.store.bookmarks.filter(item => item.rating >= store.store.filter)

    list.forEach(item => {
        item.expanded ?
            //extended view with description and URL button as well as a delete button
            listItems += `<li class="group listItem zoom" data-id="${item.id}">
        <button id="minimize"><img src="https://gdurl.com/u7-0" alt="minimize button"></button><br>
        <center>
        <h2 class="title">${item.title}</h2>
        <hr>
        <a href="${item.url}" target="_blank">VISIT SITE</a>
        <span class="dots">${grabDots(item.rating)}</span>
        <p>${item.desc}</p>
        <button id="deleteBookmark">DELETE</button>
        <button id="editBookmark">EDIT</button>
        </center>
        </li>`
            :
            //otherwise, list normally
            listItems += `<li><button class="group mini listItem" data-id="${item.id}"><span class="item">${item.title}</span><span class="item dots">${grabDots(item.rating)}</span></button></li>`
    })
    return listItems;
}

// grabAdd to return the layout of our "add bookmark" page (can we use this layout for an "edit bookmark" page?)
const grabAddOrEdit = () => {
    let editing = store.store.editing;
    let item = store.findById(store.store.toEdit);

    return `<div class="error">${grabError()}</div>
    <div class="addOrEdit center">
    <form id="newBookmarkForm">
    <fieldset>
    <legend><h2>${!editing ? 'ADD BOOKMARK' : 'EDIT BOOKMARK'}</h2></legend>
    <hr>
        <label for="url">
        URL:
        </label>
        <input type="text" id="url" name="url" 
        ${!editing ? `value="https://">`
            : `value="${item.url}">`}

        <br>
        <label for="title">
        TITLE:
        </label>
        <input type="text" id="title" name="title" 
        ${!editing ? `placeholder="Your Website Title"`
            : `value="${item.title}"`}>
        </input>

        <div class="rating"><span>RATING: </span>
        ${grabRatingButtons()}
        </div>

        <label for="bookmarkDescription">
        DESCRIPTION: (OPTIONAL)
        </label>
        <textarea name="desc" id="bookmarkDescription" rows="10"
        ${!editing ? `placeholder="Add a description for your bookmark here!"><`
            : `>${item.desc}<`}/textarea>

        <input type="submit" value="SUBMIT"><button id="cancel">CANCEL</button>
    </fieldset>
    </form>
    </div>`
}


//grabError to return an error bubble if something goes wrong when adding/deleting
const grabError = () => {
    return `<div class="error">${store.store.error === null ? ""
        : `<div class="errorGroup"><h3 class="item">${store.store.error}</h3><button id="clearError" class="item">&#10007</button></div>`}</div>`
}

// --- helper functions ----

// getting an item's id
const getItemId = (item) => {
    return $(item)
        .closest('.listItem')
        .data('id')
}

// adjust to expand/minimize
const changeView = (id) => {
    let bookmark = store.findById(id);
    bookmark.expanded = !bookmark.expanded;
    render();
}

// to make our form much easier to submit by turning it into an object upon submission!
const serializeJson = (form) => {
    const formData = new FormData(form);
    const ob = {};
    formData.forEach((val, name) => ob[name] = val);
    return ob;
}

const grabRatingButtons = () => {
    let item = store.findById(store.store.toEdit);
    let buttons = ``;
    for (let i = 1; i <= 5; i++) {
        if (item !== undefined && parseInt(item.rating) === i) {
            buttons += `<input type="radio" name="rating" value="${i}" id="${i}" checked>
            <label for="${i}">${i}</label>`
        } else {
            buttons += `<input type="radio" name="rating" value="${i}" id="${i}">
            <label for="${i}">${i}</label>`
        }
    }
    return buttons;
}

// to set up our rating dots 
const grabDots = (num) => {
    let number = parseInt(num);
    let dots = ``;
    switch (number) {
        case 1:
            dots = `&#9673&#9678&#9678&#9678&#9678`;
            break;
        case 2:
            dots = `&#9673&#9673&#9678&#9678&#9678`;
            break;
        case 3:
            dots = `&#9673&#9673&#9673&#9678&#9678`;
            break;
        case 4:
            dots = `&#9673&#9673&#9673&#9673&#9678`;
            break;
        case 5:
            dots = `&#9673&#9673&#9673&#9673&#9673`;
            break;
        default:
            dots = `&#9678&#9678&#9678&#9678&#9678`;
    }
    return dots;
}

// --- render function lays out everything based on the state of the store ---
const render = () => {
    if (store.store.error !== null) {
    $('.error').html(grabError())
    } else {
    !store.store.adding && !store.store.editing ?
        $('main').html(grabList())
        :
        $('main').html(grabAddOrEdit())
    }
}

// --- listener functions ---

// listen for a click on the "NEW" button
const handleNewView = () => {
    $('main').on('click', '#newView', event => {
        store.store.adding = true;
        render();
    })
}

const handleBookmarkSubmit = () => {
    $('main').on('submit', '#newBookmarkForm', event => {
        event.preventDefault();
        let bookmark = serializeJson(event.target);
        let id = store.store.toEdit;

        store.store.adding ? // if adding
            api.addBookmark(bookmark)
                .then((resp) => store.addToStore(resp))
                .then(() => store.store.adding = false)
                .then(() => render())
                .catch(error => {
                    store.store.error = error.message;
                    render();
                })
            : // if editing
            api.editBookmark(bookmark, id)
                .then(() => store.editBookmark(id, bookmark))
                .then(() => {
                    store.store.editing = false;
                    store.store.toEdit = "";
                })
                .then(() => render())
                .catch(error => {
                    store.store.error = error.message;
                    render();
                })
    })
}

// listen for cancel button:
const handleCancel = () => {
    $('main').on('click', '#cancel', event => {
        store.store.adding = false;
        store.store.editing = false;
        store.store.toEdit = "";
        render();
    })
}

// listen for clear error button
const handleClearError = () => {
    $('main').on('click', '#clearError', event => {
        store.store.error = null;
        render();
    })
}

// listen for a selection of filtering by star
const handleFilter = () => {
    $('main').on('click', '#ratingFilter', event => {
        let picked = $('#ratingFilter').val();
        if (picked !== "") {
            store.store.filter = picked;
            render();
        }
    })
}

// listen for a click on an item to be expanded
const handleExpand = () => {
    $('main').on('click', '.mini', event => {
        let id = getItemId(event.currentTarget);
        changeView(id);
    })
}

// listen for minimize
const handleMinimize = () => {
    $('main').on('click', '#minimize', event => {
        let id = getItemId(event.currentTarget);
        changeView(id);
    })
}

// listen for a click on a delete button for item
const handleDeleteClick = () => {
    $('main').on('click', '#deleteBookmark', event => {
        if (confirm("Are you sure you want to delete? This action cannot be undone!")) {
            let id = getItemId(event.currentTarget);
            api.deleteBookmark(id)
                .then(() => store.removeItem(id))
                .then(() => render())
                .catch(error => {
                    store.store.error = error.message;
                    render();
                })
        } else {
            render();
        }
    })
}

// possibly listen for an edit button - but that's an optional feature lol
const handleEditClick = () => {
    $('main').on('click', '#editBookmark', event => {
        let id = getItemId(event.currentTarget);
        store.store.editing = true;
        store.store.toEdit = id;
        render();
    })
}

// --- put all our event listeners in one lil function
const bindEventListeners = () => {
    handleNewView();
    handleBookmarkSubmit();
    handleCancel();
    handleClearError();
    handleFilter();
    handleExpand();
    handleMinimize();
    handleDeleteClick();
    handleEditClick();
}


export default {
    render,
    bindEventListeners
}