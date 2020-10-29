import $ from 'jquery';
import 'normalize.css';
import './style.css';
import api from './scripts/api'
import render from './scripts/render';
import store from './scripts/store';

// mainly imports

// main function renders the page based on the initial state of the app/api
//fetch from api, plug api details into store, use store to render?
// call all listening functions

let test = {
    url: 'https://www.youtube.com/',
    title: 'YoutubeRRY',
    desc: 'Lorem ipsom dollar mudbugs',
    rating: 5
}

const main = () => {
    // api.addBookmark(test);

    api.getBookmarks()
    .then(respJson => {
        console.log(respJson);
        respJson.forEach(item => {
            store.addToStore(item);
        });
        console.log(store.store);
    })
    .then(() => render.render());

    render.bindEventListeners();
}

$(main)