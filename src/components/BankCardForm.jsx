import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import bubble from "../assets/bubble.svg";
import plus from "../assets/plus.svg";
import usd from "../assets/ֆ.svg";
import rubl from "../assets/₽.svg";
import arrow from "../assets/arrow.svg";
import terms from "../assets/terms.svg";

const BankCardForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const rateCurrency = 15;
  const mainRoute = "http://127.0.0.1:8000";
  const [bankCards, setBankCards] = useState([]);
  const [rate, setRate] = useState({ firstRate: "", secondRate: "" });
  const [error, setError] = useState("");
  useEffect(() => {
    fetchBankCards();
  }, []);

  const fetchBankCards = async () => {
    try {
      const response = await axios.get(`${mainRoute}/cards/bank-cards`);
      setBankCards(response.data);
    } catch (error) {
      console.error("Error fetching bank cards:", error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(`${mainRoute}/cards/bank-cards`, data);
      fetchBankCards();
    } catch (error) {
      setError(error.message);
      console.error("Error creating bank card:", error.message);
    }
  };
  const handleRate = (e) => {
    const inputValue = e.target.value;
    // Use regular expression to keep only digits
    const onlyDigits = inputValue.replace(/[^\d]/g, "");
    const result = onlyDigits ? onlyDigits * rateCurrency : "";
    setRate({ firstRate: onlyDigits, secondRate: result });
  };
  return (
    <div className="container">
      <div className="card-form">
        <div className="card-form__inner">
          <h2>Пополнить банковской картой</h2>
          <label htmlFor="currency" className="label_currency">
            Укажите сумму
          </label>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="currency_block">
              <div className="first_currency_wrap">
                <input
                  type="number"
                  className={`${
                    errors.first_currency
                      ? "first_currency error"
                      : "first_currency"
                  }`}
                  {...register("first_currency", {
                    required: true,
                    pattern: /^\d+$/,
                  })}
                  onChange={handleRate}
                  value={rate.firstRate}
                  placeholder="0000.00"
                />

                <img className="usd currency_svg" src={usd} alt="" />
              </div>

              <div className="second_currency_wrap">
                <input
                  type="number"
                  value={rate.secondRate}
                  {...register("second_currency", {
                    pattern: /^\d+$/,
                  })}
                  className="second_currency"
                  placeholder="0000.00"
                />
                <img className="rubl currency_svg" src={rubl} alt="" />
                <img className="arrow currency_svg" src={arrow} alt="" />
              </div>
            </div>

            <div className="card_list_block">
              <ul className="card_lists">
                {bankCards &&
                  bankCards.map((item, index) => {
                    return (
                      <li className="card_list_item">
                        <span>**** {item.number}</span>
                        <span>
                          {item.date} / {item.month}
                        </span>
                      </li>
                    );
                  })}
                <li className="new_card card_list_item">
                  <img src={plus} alt="" />
                  <span>Новая карта</span>
                </li>
              </ul>
            </div>
            <div className="single_card">
              <div className="card-item card_background">
                <div className="card_bubble">
                  <img src={bubble} alt="" />
                </div>
                <div className="card_number_form">
                  <label htmlFor="number">Номер карты </label>
                  <input
                    type="number"
                    id="number"
                    className="number"
                    placeholder="Номер карты"
                    {...register("number", {
                      required: true,
                      minLength: 16,
                      maxLength: 16,
                      pattern: /^\d+$/,
                    })}
                  />
                  {errors.number && (
                    <span style={{ color: "red" }}>
                      Card number must be 16 digits
                    </span>
                  )}
                </div>
                <div className="expiry_form">
                  <div>
                    <label htmlFor="expiry_date">Действует до</label>
                  </div>
                  <div>
                    <input
                      type="number"
                      className="expiry_date"
                      id="expiry_date"
                      placeholder="ММ"
                      {...register("expiry_date", {
                        required: true,
                        minLength: 2,
                        maxLength: 2,
                        pattern: /^\d+$/,
                      })}
                    />
                    <span className="gap">/</span>
                    <input
                      type="number"
                      id="expiry_month"
                      className="expiry_month"
                      placeholder="ГГ"
                      {...register("expiry_month", {
                        required: true,
                        minLength: 2,
                        maxLength: 2,
                        pattern: /^\d+$/,
                      })}
                    />
                  </div>
                  {errors.expiry_date && (
                    <span style={{ color: "red" }}>
                      Expiry date is required
                    </span>
                  )}
                </div>
                <span style={{ color: "red" }}>{error}</span>
              </div>

              <div className="cvv_block card-item">
                <div className="top_line"></div>
                <label className="label_cvv" htmlFor="cvv">
                  CVV/CVC
                </label>
                <input
                  type="number"
                  id="cvv"
                  className="cvv"
                  placeholder="000"
                  {...register("cvv", {
                    required: true,
                    minLength: 3,
                    maxLength: 3,
                    pattern: /^\d+$/,
                  })}
                />
                <span className="info_cvv">
                  три цифры с обратной стороны карты
                </span>
                {errors.cvv && (
                  <span style={{ color: "red" }}>CVV must be 3 digits</span>
                )}
              </div>
            </div>
            <div className="terms_block">
              <div className="terms_check">
                <input
                  {...register("agree", {
                    required: true,
                  })}
                  type="checkbox"
                />

                <div className="terms">
                  <span className="terms_text">
                    Запомнить эту карту. Это безопасно.{" "}
                    <img src={terms} alt="terms" />{" "}
                  </span>
                  <span>
                    <br />
                    <span className="terms_text">
                      Сохраняя карту, вы соглашаетесь с
                      <a href="#"> условиями привязки карты.</a>
                    </span>
                  </span>
                  {errors.agree && (
                    <span style={{ color: "red" }}>Mark please</span>
                  )}
                </div>
              </div>
            </div>

            <button className="submit" type="submit">
              Оплатить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BankCardForm;
