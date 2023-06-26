/**
 * Script file of index.html.
 *
 * Sort Help:
 * https://www.geeksforgeeks.org/how-to-sort-html-elements-by-data-attribute/
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  const DELAY = 2500;
  const DELAY_SHORT = 1000;
  const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  /**
   * initialization
   */
  function init() {
    baseInit();

    id("sign-in-btn").addEventListener("click", function() {
      let data = new FormData();
      data.append("username", qs("#username").value);
      data.append("password", qs("#password").value);

      login(data);
    });
    id("sign-up-btn").addEventListener("click", function(event) {
      event.preventDefault();
      signup();
    });

    id("search").addEventListener("keypress", function(keyboard) {
      if (keyboard.key === "Enter") {
        back();
        getSearchProducts(id("search").value);
        id("search").value = "";
      }
    });
    id("filter").addEventListener("change", function() {
      filterOptions(this.options[this.selectedIndex].value);
    });

    let buttons = qsa(".number");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        let rating = button.textContent;
        leaveCommentRequest(rating);
      });
    });
  }

  /**
   * initialization helper, helps with the basic initializations
   */
  function baseInit() {
    getCategories();
    back();
    mainView();
    logout();
    id("login-error").classList.add("hidden");
    id("signup-error").classList.add("hidden");

    id("grid").addEventListener("click", gridView);
    id("list").addEventListener("click", listView);
    id("logo").addEventListener("click", mainView);
    qs("#ratings > p").classList.add("hidden");

    id("user").addEventListener("click", loginView);
    id("checkout").addEventListener("click", checkout);
    id("back").addEventListener("click", back);
    id("logout").addEventListener("click", logout);
    id("history").addEventListener("click", historyView);
    id("back-sign").addEventListener("click", loginView);
    id("sign-up").addEventListener("click", signupView);

    getAllProducts();
  }

  /**
   * Switches current view to history
   */
  function historyView() {
    id("main-view").classList.add("hidden");
    id("history-view").classList.remove("hidden");
    id("product-view").classList.add("hidden");
    getHistory();
  }

  /**
   * Logs out user
   */
  function logout() {
    qs("#nav-elements section section").classList.add("hidden");
    id("user").classList.add("active");
    id("user").addEventListener("click", loginView);
    id("nav-user").textContent = "Please Login";

    id("comment").disabled = true;
    id("checkout").disabled = true;
    id("checkout").textContent = "Please Login";

    let buttons = qsa("#leave-review button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }

  /**
   * Switches current view to signup view
   */
  function signupView() {
    id("product-view").classList.add("hidden");
    id("main-view").classList.add("hidden");
    id("checkout-box").classList.add("hidden");
    id("signup-view").classList.remove("hidden");
    id("login-view").classList.add("hidden");
    id("sign-up");
  }

  /**
   * Switches current view to login view
   */
  function loginView() {
    id("signup-view").classList.add("hidden");
    id("login-view").classList.remove("hidden");
    id("product-view").classList.add("hidden");
    id("nav-elements").classList.add("hidden");
    id("main-view").classList.add("hidden");
    id("checkout-box").classList.add("hidden");
    id("filter").classList.add("hidden");
    id("history-view").classList.add("hidden");
  }

  /**
   * Signs a new user up
   */
  function signup() {
    let url = "/users/signup";

    let data = new FormData();
    data.append("username", qs("#new-username").value);
    data.append("email", qs("#new-email").value);
    data.append("password", qs("#new-password").value);

    fetch(url, {method: "POST", body: data})
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(signupComplete)
      .catch(handleSignupError);

    id("signup-view").classList.add("hidden");
  }

  /**
   * Logs in user after they sign up
   * @param {json} responseData - user data of signed up user
   */
  function signupComplete(responseData) {
    let data = new FormData();
    data.append("username", responseData.username);
    data.append("password", responseData.password);

    login(data);
  }

  /**
   * Logs in user
   * @param {form} data - Form data of user to login
   */
  function login(data) {
    let url = "/users/login";

    fetch(url, {method: "POST", body: data})
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(loginComplete)
      .catch(handleLoginError);
  }

  /**
   * Handles login error
   */
  function handleLoginError() {
    qs(".error-msg").classList.remove("hidden");
    qs("#login-view h2").classList.add("error");
  }

  /**
   * Handles signup error
   */
  function handleSignupError() {
    qs("#signup-error").classList.remove("hidden");
    qs("#signup-view h2").classList.add("error");
  }

  /**
   * Logs in user
   * @param {json} responseData - user data of logged in user
   */
  function loginComplete(responseData) {
    id("user").removeEventListener("click", loginView);
    id("user").classList.remove("active");

    id("comment").disabled = false;
    id("comment").placeholder = "Enter a review...";

    id("checkout").disabled = false;
    id("checkout").textContent = "Checkout";

    qs(".error-msg").classList.add("hidden");
    qs("#login-view h2").classList.remove("error");
    qs("#nav-elements section section").classList.remove("hidden");

    id("nav-user").textContent = "Welcome, " + responseData.username;
    id("user").classList.add("login");
    setTimeout(mainView, DELAY_SHORT);

    let buttons = qsa("#leave-review button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
    }
  }

  /**
   * Fills product categories that user can filter
   * @param {json} responseData - product categories
   */
  function fillOptions(responseData) {
    responseData = responseData.categories;
    let options = id("filter");
    for (let i = 0; i < responseData.length; i++) {
      let option = document.createElement("option");
      option.value = responseData[i].sub_title;
      option.textContent = responseData[i].sub_title;
      options.appendChild(option);
    }
  }

  /**
   * Gets product categories
   */
  function getCategories() {
    let url = "/products/categories";
    fetch(url)
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(fillOptions)
      .catch(handleError);
  }

  /**
   * Comparator, compares for ascending price
   * @param {object} firstProduct - first product card
   * @param {object} secondProduct - second product card
   * @returns {number} - -1 if less than, 1 if greater than, 0 if the same
   */
  function ascending(firstProduct, secondProduct) {
    if (
      parseInt(firstProduct.querySelector("span").textContent.substring(1)) <
      parseInt(secondProduct.querySelector("span").textContent.substring(1))
    ) {
      return -1;
    } else if (
      parseInt(firstProduct.querySelector("span").textContent.substring(1)) >
      parseInt(secondProduct.querySelector("span").textContent.substring(1))
    ) {
      return 1;
    }
    return 0;
  }

  /**
   * Comparator, compares for descending price
   * @param {object} firstProduct - first product card
   * @param {object} secondProduct - second product card
   * @returns {number}- -1 if greater than, 1 if less than, 0 if the same
   */
  function descending(firstProduct, secondProduct) {
    if (
      parseInt(firstProduct.querySelector("span").textContent.substring(1)) >
      parseInt(secondProduct.querySelector("span").textContent.substring(1))
    ) {
      return -1;
    } else if (
      parseInt(firstProduct.querySelector("span").textContent.substring(1)) <
      parseInt(secondProduct.querySelector("span").textContent.substring(1))
    ) {
      return 1;
    }
    return 0;
  }

  /**
   * Sorter, sorts for ascending price
   */
  function sortDataAscending() {
    let cards = qsa(".grid-card");
    let cardsArray = Array.from(cards);
    let sorted = cardsArray.sort(ascending);
    sorted.forEach((item) => id("products").appendChild(item));
  }

  /**
   * Sorter, sorts for ascending price
   */
  function sortDataDescending() {
    let cards = qsa(".grid-card");
    let cardsArray = Array.from(cards);
    let sorted = cardsArray.sort(descending);
    sorted.forEach((item) => id("products").appendChild(item));
  }

  /**
   * Makes a request to leave a comment
   * @param {number} rating - rating the user gave
   */
  function leaveCommentRequest(rating) {
    let params = new FormData();
    params.append(
      "username",
      id("nav-user").textContent.substring(9)
    );
    params.append("comment", id("comment").value);
    params.append("rating", rating);
    params.append(
      "product_id",
      qs("#desc ul:last-of-type").lastChild.textContent.substring(12)
    );
    params.append("avg_rating", id("rating").textContent);
    params.append("review_count", id("rating-ct").textContent);

    fetch("/rate", {method: "POST", body: params})
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(leaveComment)
      .catch(handleError);
  }

  /**
   * Leaves comment on web
   * @param {json} responseData - comment data
   */
  function leaveComment(responseData) {
    id("leave-review").classList.add("hidden");
    id("comment").classList.add("hidden");

    qs("#ratings > p").classList.remove("hidden");

    setTimeout(function() {
      updateComments(responseData);
    }, DELAY);
  }

  /**
   * Updates comment display
   * @param {json} responseData - comment data
   */
  function updateComments(responseData) {
    id("comment").value = "";
    id("leave-review").classList.remove("hidden");
    id("comment").classList.remove("hidden");
    qs("#ratings > p").classList.add("hidden");
    id("no-comment").classList.add("hidden");

    createComment(responseData);
  }

  /**
   * Gets comments of product
   * @param {number} productId - product id
   */
  function getComments(productId) {
    let url = "/products/comments/" + productId;

    fetch(url)
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(fillComments)
      .catch(handleError);
  }

  /**
   * Clears comment screne
   */
  function clearCommentScrene() {
    let commentScrene = qs("#comments section");
    commentScrene.innerHTML = "";
  }

  /**
   * Show comments
   * @param {json} responseData - comment information
   */
  function fillComments(responseData) {
    clearCommentScrene();
    if (responseData.length > 0) {
      for (let i = 0; i < responseData.length; i++) {
        createComment(responseData[i]);
      }
      id("no-comment").classList.add("hidden");
    } else {
      id("no-comment").classList.remove("hidden");
    }
  }

  /**
   * Create a comment card
   * @param {json} responseData - comment information
   */
  function createComment(responseData) {
    let article = document.createElement("article");

    let usernameS = document.createElement("span");
    usernameS.textContent = responseData.username;

    let ratingS = document.createElement("span");
    ratingS.textContent = " - " + responseData.rating + " stars";

    let contentP = document.createElement("p");
    contentP.textContent = responseData.comment;

    article.append(usernameS);
    article.append(ratingS);
    article.append(contentP);

    qs("#comments section").prepend(article);
  }

  /**
   * Filters products to only the category selected
   * @param {string} option - product category
   */
  function filterOptions(option) {
    unHideAll();
    if (option === "all") {
      unHideAll();
    } else if (option === "ascending") {
      sortDataAscending();
    } else if (option === "descending") {
      sortDataDescending();
    } else {
      let cards = qsa(".grid-card");
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].querySelector(".subtitle").textContent === option) {
          cards[i].classList.remove("hidden");
        } else {
          cards[i].classList.add("hidden");
        }
      }
    }
  }

  /**
   * Hides purchase box
   */
  function back() {
    id("checkout-box").classList.add("hidden");
    qs("#checkout-box section").classList.remove("hidden");
  }

  /**
   * Makes a purchase
   * @param {json} response - purchase information
   */
  function purchase(response) {
    qs("#checkout-box h2").textContent =
      "You Bought " +
      id("product-name").textContent +
      "! View in your purchases in your purchase history.";
    qs("#checkout-box section").classList.add("hidden");
    reduceAvailabilityReq(response);
    let code = createCode();
    saveToHistoryReq(response, code);
    setTimeout(back, DELAY);
  }

  /**
   * Creates a new code
   * @returns {string} - new code
   */
  function createCode() {
    let code = "";

    for (let i = 0; i < 6; i++) {
      code += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    }
    return code;
  }

  /**
   * Reduces product availability
   * @param {json} response - availability of product
   */
  function reduceAvailabilityReq(response) {
    let params = new FormData();
    params.append("availability", response[0].availability);
    params.append("name", response[0].name);

    fetch("/availability", {method: "POST", body: params})
      .then(statusCheck)
      .then((resp) => resp.text())
      .catch(handleError);
  }

  /**
   * Saves purchase to history
   * @param {json} response - product information
   * @param {json} code - purchase code
   */
  function saveToHistoryReq(response, code) {
    let params = new FormData();
    params.append("confirmation_code", code);
    params.append("product_name", response[0].name);
    params.append("price", response[0].price);
    params.append("user", id("nav-user").textContent.split(", ")[1]);

    fetch("/history", {method: "POST", body: params})
      .then(statusCheck)
      .then((resp) => resp.json())
      .catch(handleError);
  }

  /**
   * Gets purchase history of user
   */
  function getHistory() {
    fetch(`/history/user/${id("nav-user").textContent.split(", ")[1]}`)
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(populateHistory)
      .catch(handleError);
  }

  /**
   * Populates user purchase history
   * @param {json} responseData - purchase history information
   */
  function populateHistory(responseData) {
    let history = id("history-view");
    if (responseData) {
      for (let i = 0; i < responseData.length; i++) {
        let productCard = createHistoryCard(responseData[i]);
        history.appendChild(productCard);
        id("history-view").appendChild(gen("hr"));
      }
    } else {
      let noHistory = gen("p");
      noHistory.textContent = "No purchases have been made...";
      id("history-view").appendChild(noHistory);
    }
  }

  /**
   * Creates history element
   * @param {json} responseData - purchase history information
   * @returns {object} - created card object
   */
  function createHistoryCard(responseData) {
    let card = gen("article");
    card.id = responseData.product_name;
    card.addEventListener("click", function() {
      getProductDetails(responseData.product_name);
    });

    let cardContent = gen("div");
    cardContent.classList.add("history-card");

    let productDetails = gen("section");
    productDetails.classList.add("product-details");

    let title = gen("a");
    title.id = responseData.id;
    title.classList.add("title");
    title.textContent = responseData.product_name;
    productDetails.appendChild(title);

    let code = gen("p");
    code.classList.add("subtitle");
    code.textContent = "Confimation Code: " + responseData.confirmation_code;
    productDetails.appendChild(code);

    let price = gen("span");
    price.textContent = "$" + responseData.price.toFixed(2);
    productDetails.appendChild(price);

    cardContent.appendChild(productDetails);
    card.appendChild(cardContent);

    return card;
  }

  /**
   * Fills product cards with product information
   * @param {json} responseData - all product information
   */
  function fillProductCards(responseData) {
    let productSection = id("products");
    for (let i = 0; i < responseData.products.length; i++) {
      let productCard = createProductCard(responseData.products[i]);
      productSection.appendChild(productCard);
    }
  }

  /**
   * Create product cards and return them
   * @param {json} responseData - single product information
   * @returns {object} - card created
   */
  function createProductCard(responseData) {
    let card = gen("article");
    card.classList.add("grid-card");
    card.id = responseData.name;
    card.addEventListener("click", function() {
      getProductDetails(responseData.name);
    });

    let cardContent = gen("div");
    cardContent.classList.add("card-content");
    let productImage = gen("img");
    productImage.src = responseData.images[0];
    productImage.alt = "Image of " + responseData.name;
    productImage.classList.add("product-image");
    cardContent.appendChild(productImage);

    let productDetails = createProductDetails(responseData);
    displayAvailability(responseData, productDetails);

    cardContent.appendChild(productDetails);
    card.appendChild(cardContent);
    return card;
  }

  /**
   * Create product details cards and return them
   * @param {json} responseData - single product information
   * @returns {object} - card created
   */
  function createProductDetails(responseData) {
    let productDetails = gen("section");
    productDetails.classList.add("product-details");

    let subtitle = gen("p");
    subtitle.classList.add("subtitle");
    subtitle.textContent = responseData.sub_title;
    productDetails.appendChild(subtitle);

    let title = gen("a");
    title.id = responseData.id;
    title.classList.add("title");
    title.textContent = responseData.name;
    productDetails.appendChild(title);

    let price = gen("span");
    price.textContent = "$" + responseData.price.toFixed(2);
    productDetails.appendChild(price);

    return (productDetails);
  }

  /**
   * Displays product availability
   * @param {json} responseData - product avaliability
   * @param {json} productDetails - product details
   */
  function displayAvailability(responseData, productDetails) {
    let availability = gen("span");
    availability.classList.add("availability");
    availability.textContent = "Availability: " + responseData.availability;
    productDetails.appendChild(availability);
  }

  /**
   * Unhides all posts
   */
  function unHideAll() {
    let cards = qsa(".grid-card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove("hidden");
    }
  }

  /**
   * Gets product details
   * @param {string} name - name of product getting
   */
  function getProductDetails(name) {
    let url = `/products/details/${name}`;

    fetch(url)
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(showProductDetails)
      .catch(handleError);
  }

  /**
   * Displays product details
   * @param {json} responseData - product details
   */
  function showProductDetails(responseData) {
    window.scrollTo(0, 0);
    productView();
    if (id("nav-user").textContent !== "Please Login") {
      id("checkout").disabled = false;
    }

    let firstImage = responseData[0].images.split(" | ")[0];

    if (firstImage && firstImage.endsWith(".png")) {
      id("product-img").src = firstImage;
      id("product-img").alt = "Image of" + responseData[0].name;
    }

    let description = responseData[0].raw_description;

    id("product-name").textContent = responseData[0].name;
    id("subtitle").textContent = responseData[0].sub_title;
    id("desc").innerHTML = description;

    let idDesc = gen("li");
    idDesc.textContent = "Product ID: " + responseData[0].id;

    qs("#desc ul:last-of-type").appendChild(idDesc);
    id("price").textContent = "$" + responseData[0].price.toFixed(2);
    id("rating-ct").textContent = responseData[0].review_count;

    let averageRating = responseData[0].avg_rating;

    id("rating").textContent = parseFloat(averageRating).toFixed(2);
    colorStars(averageRating);
    id("purchase").addEventListener("click", function makePurchase() {
      purchase(responseData);
      this.removeEventListener("click", makePurchase);
      id("checkout").disabled = true;
    });

    getComments(responseData[0].id);
  }

  /**
   * Colors stars according to rating
   * @param {json} rating - average rating of product
   * @returns {object} stars - html object containing stars
   */
  function colorStars(rating) {
    let stars = qs(".stars");
    stars.textContent = "";

    for (let i = 0; i < 5; i++) {
      let star = gen("span");
      star.classList.add("filled");
      if (i >= rating) {
        star.classList.remove("filled");
      }
      star.textContent = "★";
      stars.appendChild(star);
    }
    return stars;
  }

  /**
   * Switches current view to product view
   */
  function productView() {
    id("main-view").classList.add("hidden");
    id("product-view").classList.remove("hidden");
    id("filter").classList.add("hidden");
  }

  /**
   * Gets product data matching a given search term
   * @param {string} search - search term
   */
  function getSearchProducts(search) {
    unHideAll();

    let url = "/products/list?search=" + search;
    fetch(url)
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(hideProducts)
      .catch(handleError);
  }

  /**
   * Checks out user purchase
   */
  function checkout() {
    id("checkout").disabled = true;
    id("checkout-box").classList.remove("hidden");
    qs("#checkout-box h2").textContent =
      "Buy " + id("product-name").textContent + "?";
  }

  /**
   * Hides products not matching the search term.
   * @param {json} responseData - products with IDs of products that match search term
   */
  function hideProducts(responseData) {
    id("product-view").classList.add("hidden");
    id("main-view").classList.remove("hidden");

    responseData = responseData.products;
    let cards = qsa(".grid-card");
    let array = parseArray(responseData, "name");
    if (array.length === 0) {
      id("no-products").classList.remove("hidden");
    } else {
      id("no-products").classList.add("hidden");
    }
    for (let i = 0; i < cards.length; i++) {
      if (!array.includes(cards[i].id)) {
        cards[i].classList.add("hidden");
      } else {
        cards[i].classList.remove("hidden");
      }
    }
  }

  /**
   * Turns ID json into array.
   * @param {json} responseData - ID json
   * @param {string} key - ID json
   * @returns {array} - array with ID information
   */
  function parseArray(responseData, key) {
    let array = [];

    for (let i = 0; i < responseData.length; i++) {
      array.push(responseData[i][key]);
    }
    return array;
  }

  /**
   * Gets all product data
   */
  function getAllProducts() {
    let url = "/products/list";
    fetch(url)
      .then(statusCheck)
      .then((resp) => resp.json())
      .then(fillProductCards)
      .catch(handleError);
  }

  /**
   * Switches current view to list view
   */
  function listView() {
    id("list").classList.add("view-selected");
    id("grid").classList.remove("view-selected");
    let cards = qsa(".grid-card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove("grid-card");
      cards[i].classList.add("list-card");
    }

    id("products").classList.add("list-view");
    id("products").classList.remove("grid-view");
  }

  /**
   * Switches current view to grid view
   */
  function gridView() {
    id("grid").classList.add("view-selected");
    id("list").classList.remove("view-selected");
    let cards = qsa(".card-content");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove("list-card");
      cards[i].classList.add("grid-card");
    }

    id("products").classList.remove("list-view");
    id("products").classList.add("grid-view");
  }

  /**
   * Switches current view to main view
   */
  function mainView() {
    id("login-view").classList.add("hidden");
    id("nav").classList.remove("hidden");
    id("product-view").classList.add("hidden");
    id("main-view").classList.remove("hidden");
    id("checkout-box").classList.add("hidden");
    id("filter").classList.remove("hidden");
    id("grid").classList.add("view-selected");
    id("nav-elements").classList.remove("hidden");
    id("history-view").classList.add("hidden");
  }

  /**
   * Create element with tag
   * @param {string} tagName - tag name of element
   * @returns {object} - element created
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Returns element of specified ID
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Handles Error if something goes wrong.
   */
  function handleError() {
    let pTag = document.createElement("p");
    pTag.textContent = "Error";
  }

  /**
   * select a single element
   * @param {string} selector - string selector
   * @returns {object} - the first element selected by the selector
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * select all elements
   * @param {string} selector - string selector
   * @returns {object} - the all elements selected by the selector
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns the retrieved text of the response. Otherwise returns the rejected promise result
   * and error code.
   * @param {object} res - response to check if response was successful
   * @return {object} - valid response if successful, rejected if error
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }
})();
