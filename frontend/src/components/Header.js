import React from "react";
import logo from "../images/logo.svg";
import { Link, Route, Routes } from "react-router-dom";

function Header({ email, signOut }) {
  return (
    <header className="page__header header">
      <img className="logo" src={logo} alt="логотип mesto" />
      <Routes>
        <Route
          path="/sign-up"
          element={
            <Link className="header__link" to="/sign-in">
              Войти
            </Link>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Link className="header__link" to="/sign-up">
              Регистрация
            </Link>
          }
        />
        <Route
          path="/"
          element={
            <div className="header__container">
              <p className="header__email">{email}</p>
              <Link onClick={signOut} className="header__link" to="/sign-in">
                Выход
              </Link>
            </div>
          }
        />
      </Routes>
    </header>
  );
}

export default Header;
