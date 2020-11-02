// this is our object holder for our store

const store = {
  bookmarks: [
  ],
  adding: false,
  error: null,
  filter: 0,
  editing: false,
  toEdit: ""
};

const findById = (id) => {
  return store.bookmarks.find(item => item.id === id);
}

const addToStore = (item) => {
  item.expanded = false;
  store.bookmarks.push(item);
}

const editBookmark = (id, newDetails) => {
  let item = store.bookmarks.find(el => el.id === id);
  const changedItem = Object.assign(item, newDetails);
  return changedItem;
}

const removeItem = (id) => {
  store.bookmarks = store.bookmarks.filter(item => item.id !== id);
}

export default {
  store,
  addToStore,
  editBookmark,
  removeItem,
  findById
}