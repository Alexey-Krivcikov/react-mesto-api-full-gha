import React from "react";

function Login({
  handleSubmitLogin,
  handleEmailChange,
  handlePasswordChange,
  email,
  password,
}) {
  return (
    <div className="login">
      <h2 className="login__header">Вход</h2>
      <form onSubmit={handleSubmitLogin} className="login-form" name="login">
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
          value={password}
          minLength="6"
          required
        ></input>
        <button className="login-form__submit-btn" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
