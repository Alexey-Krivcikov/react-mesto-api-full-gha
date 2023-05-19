class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
    this._credentials = options.credentials;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _request(endpoint, options) {
    return fetch(`${this._baseUrl}${endpoint}`, options).then(this._checkResponse);
  }

  getUserInfo() {
    return this._request("/users/me", {
      credentials: this._credentials,
      headers: this._headers,
    });
  }

  getInitialCards() {
    return this._request("/cards", {
      credentials: this._credentials,
      headers: this._headers,
    });
  }

  setUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      credentials: this._credentials,
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }

  addNewCard({ name, link}) {
    return this._request("/cards", {
      method: "POST",
      credentials: this._credentials,
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: "DELETE",
      credentials: this._credentials,
      headers: this._headers,
    });
  }

  setAvatar({ avatar }) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      credentials: this._credentials,
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar,
      }),
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return this._request(`/cards/${cardId}/likes`, {
      method: `${isLiked ? "PUT" : "DELETE"}`,
      credentials: this._credentials,
      headers: this._headers,
    });
  }
// 
  addLike(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      headers: this._headers,
      method: "PUT",
      credentials: 'include',
    });
  }
// 
  deleteLike(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      headers: this._headers,
      method: "DELETE",
      credentials: 'include',
    });
  }
}

const api = new Api({
  // baseUrl: "https://mesto.nomoreparties.co/v1/cohort-59",
  baseUrl: "http://localhost:3000",
  headers: {
    // authorization: "13de05b0-eaab-40cb-aa9f-faea16b25706",
    "Content-Type": "application/json",
  },
  credentials: 'include',
});

export default api;
