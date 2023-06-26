# Eshop API Documentation
The Eshop API provides information on every aspect of the Eshop.

## Get a list of all the products
**Request Format:** /products/list

**Request Type:** GET

**Returned Data Format**: json

**Description:** Returns in json format all the products that are avaliable in the Eshop and information on them.

**Example Request:** /products/list

**Example Response:**
```json
{
  "products": [
    {
      "id": 0,
      "name": "Nike Dri-FIT Team (MLB Minnesota Twins)",
      "sub_title": "Men's Long-Sleeve T-Shirt",
      "price": 40,
      "availability": 9,
      "avg_rating": "4.00133333333333",
      "review_count": "15",
      "images": [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/0116e668-a77e-402d-b89f-04647db0f0ad/dri-fit-team-minnesota-twins-mens-long-sleeve-t-shirt-6Wdjql.png"
      ]
    },
    ...
  ]
}
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`


## Get all products matching search term
**Request Format:** /products/list?search=value

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Given a valid product name, returns information on all containing search term.

**Example Request:** /products/list?search=Miami

**Example Response:**
```json
{
  "products": [
    {
      "name": "NFL Miami Dolphins (Mike Gesicki)",
      "price": 130,
      "availability": 20,
      "avg_rating": "0",
      "review_count": "0",
      "images": [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/113bb00a-97ba-4120-b2f8-d2e0ec4db7f8/miami-dolphins-mike-gesicki-mens-game-football-jersey-dspWwb.png"
      ]
    },
    ...
  ]
}
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`

## Get product categories
**Request Format:** /products/categories

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Get all categories of products

**Example Request:** /products/categories

**Example Response:**
```json
{
  "categories": [
    {
      "sub_title": "Men's Long-Sleeve T-Shirt"
    },
    ...
  ]
}
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`


## Lookup details for a product
**Request Format:** /products/details/:name

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets the details of product.

**Example Request:** /products/details/Nike Dri-FIT Team (MLB Minnesota Twins)

**Example Response:**
```json
[
  {
    "id": 0,
    "url": "https://www.nike.com/t/dri-fit-team-minnesota-twins-mens-long-sleeve-t-shirt-6Wdjql",
    "name": "Nike Dri-FIT Team (MLB Minnesota Twins)",
    "sub_title": "Men's Long-Sleeve T-Shirt",
    "brand": "Nike",
    "model": 14226571,
    "color": "Navy",
    "price": 40,
    "currency": "USD",
    "availability": 9,
    "description": "SWEAT-WICKING COMFORT.The Nike Dri-FIT Team (MLB Minnesota Twins) T-Shirt layers you in lightweight fabric with sweat-wicking technology to help keep you cool and dry as you rep your favorite team.BenefitsNike Dri-FIT technology helps you stay dry, comfortable and focused.Jersey fabric has a soft, lightweight feel.Product Details100% polyesterMachine washImportedShown: NavyStyle: NKAY44BMTF-KT6",
    "raw_description": "<div class=\"pi-pdpmainbody\"><p><b class=\"headline-5\">SWEAT-WICKING COMFORT.</b></p><p>The Nike Dri-FIT Team (MLB Minnesota Twins) T-Shirt layers you in lightweight fabric with sweat-wicking technology to help keep you cool and dry as you rep your favorite team.</p><p><b class=\"headline-5\">Benefits</b></p><ul><li>Nike Dri-FIT technology helps you stay dry, comfortable and focused.</li><li>Jersey fabric has a soft, lightweight feel.</li></ul><p><b class=\"headline-5\">Product Details</b></p><ul><li>100% polyester</li><li>Machine wash</li><li>Imported</li><li>Shown: Navy</li><li>Style: NKAY44BMTF-KT6</li></ul></div>",
    "avg_rating": "4.00133333333333",
    "review_count": "15",
    "images": "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/0116e668-a77e-402d-b89f-04647db0f0ad/dri-fit-team-minnesota-twins-mens-long-sleeve-t-shirt-6Wdjql.png",
    "available_sizes": "S | M | L | XL | 2XL",
    "uniq_id": "c3229e54-aa58-5fdd-9f71-fbe66366b2b2",
    "scraped_at": "20/09/2022 23:32:28"
  }
]
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid product name, an error is returned with the message: `Product does not exist.`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`


## Get comments of a product
**Request Format:** /products/comments/:id

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets all comments of a product.

**Example Request:** /products/comments/0

**Example Response:**
```json
[
  {
    "id": 8,
    "username": "iloveclothes",
    "comment": "Good shirt",
    "rating": 5,
    "product_id": 0
  },
  ...
]
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`


## Get current codes
**Request Format:** /history/code

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets all current transaction codes in use.

**Example Request:** /history/code

**Example Response:**
```json
[
  {
    "confirmation_code": "DAV0Z7"
  },
  ...
]
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`


## Get user history
**Request Format:** /history/user/:user

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets user history from username.

**Example Request:** /history/user/username

**Example Response:**
```json
[
  {
    "id": 0,
    "user": "username",
    "price": 40,
    "product_id": 0,
    "product_name": "Nike Dri-FIT Team (MLB Minnesota Twins)",
    "size": "L",
    "confirmation_code": "BNCI8A"
  },
  ...
]
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`


## Rate a Product

**Request Format:** /rate endpoint with POST parameters of `username`, `comment`, `rating`, `product_id`, `avg_rating`, and `review_count`

**Request Type**: POST

**Returned Data Format**: json

**Description:** Given a valid `username`, `comment`, `rating`, `product_id`, `avg_rating`, and `review_count`, will add the rating to the product page and return the information of the added comment.

**Example Request:** /rate with POST parameters of `username=iloveclothes`, `comment=good shirt`, `rating=5`, `product_id=0`, `avg_rating=5`, and `review_count=3`

**Example Response:**
```json
[
  {
    "id": "4",
    "username": "iloveclothes",
    "comment": "good shirt",
    "rating": "5",
    "product_id": "0"
  }
]
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid product-name, an error is returned with the message: `Product doesn't exist.`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`


## Create User
**Request Format:** /signup endpoint with POST parameters of `username`, `email`, and `password`

**Request Type**: POST

**Returned Data Format**: json

**Description:** Given a valid `username`, `email`, and `password`, will create new user and returns json file of new user. Does not check if email is legit. May have same email for multiple accounts.

**Example Request:** /signup with POST parameters of `username=username`, `email=username@gmail.com`, and `password=password`

**Example Response:**
```json
{
  "user-name": "username",
  "email": "username@gmail.com",
  "password": "password"
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in a username that already exists, an error is returned with the message: `User already exists.`
  - If missing a field, an error is returned with the message: `Missing one or more of the required params.`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`


## Create User
**Request Format:** /availability endpoint with POST parameters of `availability` and `name`

**Request Type**: POST

**Returned Data Format**: text

**Description:** Given a valid `availability` and `name`, will update avaliability of product decreasing by one.

**Example Request:** /availability with POST parameters of `availability=1` and `name=Nike Dri-FIT Team (MLB Minnesota Twins)`

**Example Response:**
```
0
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`


## Login User
**Request Format:** /users/login endpoint with POST parameters of `username` and `password`

**Request Type**: POST

**Returned Data Format**: json

**Description:** Given a valid `username` and `password`, will login user if the fields match

**Example Request:** /users/login with POST parameters of `username=username` and `password=password`

**Example Response:**
```json
{
  "username": "username"
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If missing a field, an error is returned with the message: `Missing one or more of the required params.`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`


## Add purchase to history
**Request Format:** /history endpoint with POST parameters of `confirmation_code`, `product_name`, `price`, and `user`

**Request Type**: POST

**Returned Data Format**: text

**Description:** Given a valid `confirmation_code`, `product_name`, `price`, and `user`, will add purchase to user's history.

**Example Request:** /history with POST parameters of `confirmation_code=DAV0Z7`, `product_name=Nike Sportswear Swoosh`, `price=140`, and `user=username`

**Example Response:**
```
Success
```

**Error Handling:**
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`