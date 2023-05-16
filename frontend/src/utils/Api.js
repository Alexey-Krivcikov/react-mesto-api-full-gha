class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._checkResponse);
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  setUserInfo(userData) {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({
        name: userData.name,
        about: userData.about,
      }),
    });
  }

  addNewCard(cardData) {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: "POST",
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      }),
    });
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      headers: this._headers,
      method: "DELETE",
    });
  }

  setAvatar(data) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
  }

  addLike(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      headers: this._headers,
      method: "PUT",
    });
  }

  deleteLike(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      headers: this._headers,
      method: "DELETE",
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      headers: this._headers,
      method: isLiked ? "PUT" : "DELETE",
    });
  }
}

const api = new Api({
  // baseUrl: "https://mesto.nomoreparties.co/v1/cohort-59",
  baseUrl: "https://api.mesto.front.end.nomoredomains.monster",
  headers: {
    // authorization: "13de05b0-eaab-40cb-aa9f-faea16b25706",
    "Content-Type": "application/json",
  },
});

export default api;
