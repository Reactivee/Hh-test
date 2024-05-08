import React from "react";
import BankCardForm from "./BankCardForm";

function Container() {
  return (
    <div className="container">
      <div className="card-form">
        <div className="card-form__inner">
          <h2>Пополнить банковской картой</h2>
          <BankCardForm />
        </div>
      </div>
    </div>
  );
}

export default Container;
