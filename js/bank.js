"use strict";

const welcomeLabel = document.querySelector(".welcome-label");
const bankApp = document.querySelector(".app");
const todayDate = document.querySelector(".date");

const movementContainer = document.querySelector(".movements");

const balanceValue = document.querySelector(".balance__value");
const summaryIn = document.querySelector(".summary__value--in");
const summaryOut = document.querySelector(".summary__value--out");
const summaryInterest = document.querySelector(".summary__value--interest");

const savedUserData = JSON.parse(localStorage.getItem("userDetails"));

// Set welome with name and set opacity of the container to 1
if (window.location.href.includes("bank.html")) {
  welcomeLabel.innerHTML = `Welcome ${savedUserData.firstName}`;
  bankApp.style.opacity = 1;
}
// set the date
const getDate = function () {
  const date = new Date();
  const day = `${new Date().getDay()}`.padStart(2, "0");
  const month = `${new Date().getMonth() + 1}`.padStart(2, "0");
  const year = new Date().getFullYear();
  const today = `${day}/${month}/${year}`;

  todayDate.textContent = today;
};
getDate();

const getData = async function () {
  const response = await fetch("data.json");
  const data = await response.json();

  const accData = data[0];
  return accData;
};

// display movements
const displayMovements = async function () {
  const user = await getData();

  //set initial movement array to nothing
  movementContainer.innerHTML = " ";

  // add mov together
  const totalMovements = user.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);

  // display in the dom
  balanceValue.textContent = `${totalMovements.toFixed(2)} €`;

  // get movement dates
  const movDates = user.movementsDates.map(
    (date) => new Date(date).toISOString().split("T")[0]
  );

  user.movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const movDate = movDates[i];

    const movhtml = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
           <div class="movements__date">${movDate}</div>
           <div class="movements__value">${mov}</div>
        </div>
 `;
    movementContainer.insertAdjacentHTML("afterbegin", movhtml);
  });
};
//   .catch((error) => {
//   console.error("Error fetching data:", error);
// });

displayMovements();

// display summary
const displaySummary = async function () {
  const user = await getData();
  const deposits = user.movements.filter((mov) => mov > 0);

  const withdrawals = user.movements.filter((mov) => mov < 0);

  // add deposits
  const depositSum = deposits.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  summaryIn.textContent = `${depositSum} €`;

  // add withdrawals
  const withdrawalSum = withdrawals.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  summaryOut.textContent = `${Math.abs(withdrawalSum)} €`;

  // calculate interest
  const interest = user.interestRate;
  summaryInterest.textContent = `${(depositSum * interest) / 100} €`;
};
displaySummary();
