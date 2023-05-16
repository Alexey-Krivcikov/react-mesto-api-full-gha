import React from "react";
import { Link } from "react-router-dom";

function Register({
  email,
  password,
  handleEmailChange,
  handlePasswordChange,
  handleSubmitRegister,
}) {
  return (
    <div className="login">
      <h2 className="login__header">Регистрация</h2>
      <form onSubmit={handleSubmitRegister} className="login-form" name="login">
        <input
          onChange={handleEmailChange}
          className="login-form__input"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          required
        ></input>
        <input
          onChange={handlePasswordChange}
          className="login-form__input"
          type="password"
          name="password"
          placeholder="Пароль"
          minLength="6"
          value={password}
          required
        ></input>
        <button className="login-form__submit-btn" type="submit">
          Зарегистрироваться
        </button>
      </form>
      <Link to="/sign-in" className="login__sing-in">
        Уже зарегистрированы? Войти
      </Link>
    </div>
  );
}

export default Register;
