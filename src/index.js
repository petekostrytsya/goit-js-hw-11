import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
}

let page = 1;
let total = 0;

async function getPosts(search) {
    const key = '35672059-da11df4f78d17b3089c7d616f';
    const imageType = 'photo';
    const orientation = 'horizontal';
    const safesearch = true;
    const perPage = 40;
    const URL = `https://pixabay.com/api/?key=${key}
    &q=${search}
    &image_type=${imageType}
    &orientation=${orientation}
    &safesearch=${safesearch}
    &per_page=${perPage}
    &page=${page}`;
}
try {
    const respone = await axios(URL);
    const data = response.data.hits;
    total += response.data.hits.length;
    if (data.length !== 0) {
        showLoadMoreBtn();
    }
    if (response.data.totalHits <= total || response.data.totalHits === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        hidesLoadMoreBtn();
        console.log(response.data.totalHits);
        console.log('the button should be hidden');
    }
    return data;
    console.log(total);
    console.log(response.data.totalHits);
} catch (error) {
    console.log('error');
}

function hidesLoadMoreBtn() {
    refs.loadBtn.classList.add('hide');
    console.log('the button is hidden');
}
hidesLoadMoreBtn();

function showLoadMoreBtn() {
  refs.loadBtn.classList.remove('hide');
  console.log('the button should be hidden');
}




function createMarkup(item) {
  return `<a href="${item.largeImageURL}" class="gallery__item"
        > <div class="card">
        <img src="${item.webformatURL}" alt="${item.tags}" class="gallery__image" loading="lazy" title=""
      />
       <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${item.downloads}
    </p>
  </div>
  </div>
      </a>
   `;
}







refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
    evt.preventDefault();
    page = 1;
    const search = refs.form.elements.searchQuery.value.trim();
    
    if (search) {
        clearMarkup();
        generateMarkup(search);
    }
    if (!search) {
        Notiflix.Notify
            .info('Sorry, there are no images matching your search query. Please try again.');
        return;
    }
    if (evt.type === 'click') {
        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
    }
}

function clearMarkup() {
    refs.gallery.innerHTML = '';
}

// refs.loadBtn.classList.add('hide');

refs.loadBtn.addEventListener('click', onLoadMoreClick);

function onLoadMoreClick() {
    const search = refs.form.elements.searchQuery.value.trim();
    page += 1;
    generateMarkup(search);
    console.log(search);
}

async function generateMarkup(search) {
    const data = await getPosts(search);
    const markup = data.reduce((acc, item) => {
        return acc + createMarkup(item);
    }, '');

    const lightbox = new SimpleLightbox('.gallery a', {});
    refs.gallery.insertAdjacentElement('beforeend', markup);

    lightbox.refresh();
    return data;
}













