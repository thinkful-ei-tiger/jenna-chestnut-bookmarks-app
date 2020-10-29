import store from './store';

// this page handles our API stuff

const baseUrl = "https://thinkful-list-api.herokuapp.com/jenna-chestnut/bookmarks"

//starter function that only catches and handles our errors on the edit/add page
const apiFetch = (...args) => {
    let error;
    return fetch(...args)
    .then(res => {
        if(!res.ok) {
            error = {code: res.statusText}
        }
        if(!res.headers.get('content-type').includes('json')) {
            error.message = res.statusText;
            store.error = error.message;
            return Promise.reject(error);
        }
    return res.json();
    })
    .then(data => {
        if (error) {
            error.message = data.message;
            store.error = error.message;
            return Promise.reject(error);
        }
    return data;
    })
}

// get - to read our store
const getBookmarks = () => {
    return apiFetch(baseUrl);
}

// post to add an item to our store
const addBookmark = (details) => {
    let newItem = JSON.stringify(details);

    return apiFetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: newItem
    })
}

// path to edit an item in our store
const editBookmark = (details, id) => {
    let newItem = JSON.stringify(details);

    return apiFetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: newItem
    })
}

// delete to remove a bookmark from store&api
const deleteBookmark = (id) => {
    return apiFetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
    })
}

export default {
    getBookmarks,
    addBookmark,
    editBookmark,
    deleteBookmark
}