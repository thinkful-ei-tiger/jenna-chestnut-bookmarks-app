// this is our object holder for our store

const store = {
  bookmarks: [
    {
      id: 'x56w',
      title: 'Salem\'s Portfolio',
      rating: 5,
      url: 'https://www.instagram.com/sweetsaybae/?hl=en',
      desc: 'A truly wonderful work of art, this site is a compilation of some of Salem Chestnut\'s greatest moments - from catching his own tail to mastering a game of basketball. Woof!',
      expanded: false
    },
    {
      id: '6ffw',
      title: 'Jennabot',
      rating: 4,
      url: 'http://www.jennabot.com',
      desc: 'dolorum tempore deserunt',
      expanded: false
    }
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