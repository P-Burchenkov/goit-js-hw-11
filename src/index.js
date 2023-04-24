import { SearchImageApi } from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('input'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const searchImageApi = new SearchImageApi();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', onImgClick);

function onSearch(evt) {
  evt.preventDefault();

  searchImageApi.query = evt.currentTarget.elements.searchQuery.value.trim();
  searchImageApi.resetPage();
  clearMarkup();
  inacniveLoadmore();

  searchImageApi
    .getImage()
    .then(res => {
      const imagesArray = res.data.hits;
      const totalQuantity = res.data.totalHits;

      if (imagesArray.length === 0) {
        Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`Hooray! We found ${totalQuantity} images.`);
      activeLoadmore();
      searchImageApi.incrementPage();
      makeMarkup(imagesArray);
    })
    .catch(err => console.log(err));
}

function onLoadMore() {
  searchImageApi
    .getImage()
    .then(res => {
      const totalQuantity = res.data.totalHits;
      console.log(totalQuantity);
      console.log(res);
      const imagesArray = res.data.hits;
      searchImageApi.incrementPage();
      if (imagesArray.length === 0) {
        Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        inacniveLoadmore();
      }
      makeMarkup(imagesArray);
    })
    .catch(err => console.log(err));
}

function makeMarkup(response) {
  const markup = response
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" class="gallery-image" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b> 
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
   </div>
  </div>`
      }
    )
    .join();
  console.log(markup);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

function activeLoadmore() {
  refs.loadMoreBtn.disabled = false;
}

function inacniveLoadmore() {
  refs.loadMoreBtn.disabled = true;
}

//------------

function onImgClick(event) {
  if (event.target.className !== 'gallery__image') {
    return;
  }
  event.preventDefault();

  let modal = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    scrollZoom: false,
  });
  modal.refresh();
}
