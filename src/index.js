import { SearchImageApi } from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
console.log(SimpleLightbox);

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
      console.log(totalQuantity);
      console.log(res);
      if (imagesArray.length === 0) {
        Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`Hooray! We found ${totalQuantity} images.`);
      activeLoadmore();
      searchImageApi.incrementPage();
      imagesArray.map(makeMarkup);
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
      imagesArray.map(makeMarkup);
    })
    .catch(err => console.log(err));
}

function makeMarkup(response) {
  const card = `<a href="${response.largeImageURL}" class="photo-card">
  <img src="${response.webformatURL}" alt="${response.tags}" class="gallery-image" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${response.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${response.views}</b> 
    </p>
    <p class="info-item">
      <b>Comments: ${response.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${response.downloads}</b>
    </p>
  </div>
</a>`;
  refs.gallery.insertAdjacentHTML('beforeend', card);
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

  const modal = new SimpleLightbox(`.gallery a`, {
    captionsData: 'alt',
    captionDelay: 250,
    scrollZoom: false,
  });
  modal.refresh();
}
