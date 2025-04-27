"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const modalSignIn = document.querySelector(".modal__sign-in");
const modalLogIn = document.querySelector(".modal__log-in");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const hamburgerOpen = document.querySelector(".hamburger[open]");
const hamburgers = document.querySelectorAll(".hamburger");
const navContent = document.querySelector(".nav__content");
const section1 = document.querySelector("#section--1");
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");
const navLink = document.querySelectorAll(".nav__link");
const heroContainer = document.querySelector(".hero__container");
const allSections = document.querySelectorAll(".section");
const imgTargets = document.querySelectorAll("img[data-src]");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

const errorMessages = document.querySelectorAll(".error-message");
const btnsForm = document.querySelectorAll(".btn--form");
const btnSignIn = document.querySelector("#btn--sign-in");
const btnLogIn = document.querySelector("#btn--log-in");

// open and close hamburger
const openMobile = function (e) {
  nav.classList.toggle("nav__content--active");
};

hamburgers.forEach((ham) => ham.addEventListener("click", openMobile));

// close hamburger when a link is clicked
navLink.forEach((link) =>
  link.addEventListener("click", function () {
    nav.classList.remove("nav__content--active");
  })
);

// open modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

// close modal
const closeModal = function (e) {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// modal btns
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
if (btnCloseModal) {
  btnCloseModal.addEventListener("click", closeModal);
}

// when the overlay is clicked, close modal
// overlay.addEventListener("click", closeModal);
overlay.addEventListener("click", function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");

  if (!modalLogIn.classList.contains("hidden"))
    modalLogIn.classList.add("hidden");
});

// Add keyboard functions
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// hero btn scrolling
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: "smooth" });
});

// nav buttons
navLinks.addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const nav = link.closest(".nav");
    const siblings = nav.querySelectorAll(".nav__link");
    const logo = nav.querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// Sticky navigation
const headerHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  //   console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const heroObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeight}px`,
});

heroObserver.observe(heroContainer);

// Tabbed components

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach((t) => t.classList.remove("operations__content--active"));

  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Reveal sections
const revealSection = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// lazy loading images
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

// slider
const slider = function () {
  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // initialize everything
  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();

// save to user details local storage
const saveDetails = function () {
  const userDetails = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  // store to local storage
  localStorage.setItem("userDetails", JSON.stringify(userDetails));
};

// get details
const getDetails = function () {
  const savedUserData = JSON.parse(localStorage.getItem("userDetails"));
};

// signin
const validation = function (e) {
  e.preventDefault();

  let isValid = true;

  const fields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "user-email",
    "user-password",
  ];

  fields.forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    if (!input) return;

    const formBox = input.closest(".form--box");
    const errorMsg = formBox.querySelector(".error-message");

    // Reset error visibility, border, and outline
    errorMsg.classList.add("hidden");
    input.style.border = "1px solid #ddd";
    input.style.outline = "1px solid #ddd";

    const value = input.value.trim();

    // Sign Up Form Validation
    if (!modalSignIn.classList.contains("hidden")) {
      if ((fieldId === "firstName" || fieldId === "lastName") && value === "") {
        errorMsg.textContent = "This field is required";
        errorMsg.classList.remove("hidden");
        input.style.border = "1px solid rgb(204, 90, 90)";
        input.style.outline = "1px solid rgb(210, 70, 90)";
        isValid = false;
      }

      if (fieldId === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          errorMsg.textContent = "Enter a valid email address";
          errorMsg.classList.remove("hidden");
          input.style.border = "1px solid rgb(204, 90, 90)";
          input.style.outline = "1px solid rgb(210, 70, 90)";
          isValid = false;
        }
      }

      if (fieldId === "password" && value.length < 6) {
        errorMsg.textContent = "Password must be at least 6 characters";
        errorMsg.classList.remove("hidden");
        input.style.border = "1px solid rgb(204, 90, 90)";
        input.style.outline = "1px solid rgb(210, 70, 90)";
        isValid = false;
      }
    }

    // If signup is valid, save to local storage
    if (!modalSignIn.classList.contains("hidden") && isValid) {
      // store to local storage
      saveDetails();
      // after sign up, hide modal and show login
      modalSignIn.classList.add("hidden");
      modalLogIn.classList.remove("hidden");
    }
  });

  // Login Form Validation
  if (!modalLogIn.classList.contains("hidden")) {
    const enteredemail = document.getElementById("user-email").value.trim();
    const enteredPassword = document
      .getElementById("user-password")
      .value.trim();

    // Retrieve data
    const savedUserData = JSON.parse(localStorage.getItem("userDetails"));

    const newPara = document.createElement("p");
    newPara.classList.add("error-message");

    // Check for invalid email format
    if (!enteredemail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newPara.textContent = "Enter a valid email";
      modalLogIn.appendChild(newPara);
      newPara.classList.remove("hidden");
      newPara.style.textAlign = "center";
      isValid = false; // Mark the form as invalid
    }

    // If saved user data exists, check the credentials
    if (savedUserData) {
      if (
        enteredemail === savedUserData.email &&
        enteredPassword === savedUserData.password
      ) {
        // redirect to bank.html after successful login
        window.location.href = "bank.html";
      } else {
        newPara.textContent = "Invalid email or password";
        modalLogIn.appendChild(newPara); // Append the error message to modal
        newPara.classList.remove("hidden");
        newPara.style.textAlign = "center";
        isValid = false; // Mark the form as invalid
      }
    } else {
      newPara.textContent = "No user found. Please sign up first";
      modalLogIn.appendChild(newPara); // Append the error message to modal
      newPara.classList.remove("hidden");
      newPara.style.textAlign = "center";
      isValid = false; // Mark the form as invalid
    }
  }

  // If sign-up and valid, show login
  if (!modalSignIn.classList.contains("hidden") && isValid) {
    modalSignIn.classList.add("hidden");
    modalLogIn.classList.remove("hidden");
  }

  // If login and valid, submit or close
  if (!modalLogIn.classList.contains("hidden") && isValid) {
    btnLogIn.addEventListener("click", function (e) {
      e.preventDefault();
      if (validation()) {
        // Redirect to bank.html after successful login
        window.location.href = "bank.html";
      }
    });

    closeModal();
  }

  if (!modalLogIn.classList.contains("hidden"))
    overlay.classList.remove("hidden");
};

btnsForm.forEach((btn) => btn.addEventListener("click", validation));
