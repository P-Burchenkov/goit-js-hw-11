const axios = require('axios').default;

export class SearchImageApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImage() {
    const URL = 'https://pixabay.com/api/';
    const searchParams = new URLSearchParams({
      key: '35630454-6da641b773f4c3909fcec63c4',
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: '5',
      page: `${this.page}`,
    });
    const response = await axios.get(`${URL}?${searchParams}`);
    // console.log(response.data.totalhits);
    return response;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
