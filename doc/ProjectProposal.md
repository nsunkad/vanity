# Project Proposal

## vanity.

### Project Summary

Vanity is a social media service for people to connect over shared interests in makeup and skincare and discover new products. We primarily target users of beauty products and provide two main features - 

1. A product reviews feature that enables users to look up specific products and read or write reviews by customers who previously purchased the product

2. A social media service that enables users to connect with friends and view each other’s “makeup bags” — in effect to see which specific products their friends purchased.

Currently, there exists no form of online app (besides general purpose apps like Instagram) for the makeup and skincare community to connect. Our web application aims to address this need.   

### Description

This application will be a “makeup bag” in digital form. Users will be able to add products to their personal makeup bag as they purchase products in real life, and they will be able to view their friends' makeup bags to see their favorite products and get recommendations for themselves when they are in the market. In real life, many friends regularly share product recommendations. This is a form of bonding that the makeup and skincare community thrives on. With a minimal, attractive user interface, this app will build the bonds of many makeup and skincare users. By maintaining one's own bag, a user will visually be able to see every product they own. When viewing friends bags, users can explore what is making their friends' skin and makeup so beautiful!

Makeup and skincare users are always in the market for more products, so we will also have a search bar to explore new products and see their reviews. Because of the sheer quantity of brands and products, hearing from actual people is vital. Allowing a user to click on their friend's favorite makeup product and simultaneously view reviews, the user will be more confident about their decision if they want to purchase it, too. This will also increase the reach of brands, because they will have one more platform where users can find them.

As a whole, this application is a digital embodiment of the inclusive, lavish, and friendly beauty community.

### Creative Component

We plan to implement a user authentication feature within our website. Having a sign-in feature allows us to associate a specific “makeup bag” with a user, and also allows that user to see what bags are associated with their friends. This allows for a personalized experience within the app, and provides a jumping off point for future capabilities within the app, like “friending” other users. 

Additionally, our current specifications require users to manually enter in the barcode of the beauty product that they wish to look up and/or add to their bag. If time and bandwidth permit, a potential enhancement to make is implementing a barcode scanner feature to make barcode entry less tedious.

### Usefulness

Our web application is useful for people who wear makeup and who would like to share their favorite products with their friends in a streamlined and social media-like way. At the same time, they are able to search for a friend by username to learn more about their friends’ favorite products, which they can then try for themselves. 

Furthermore, every product on the app will have reviews that have been compiled from online resources. From our personal experiences, it can sometimes be frustrating checking several different websites (amazon, reddit, etc.) just to see a variety of reviews for a product, when deciding whether to purchase it. To our knowledge, there is also no web or mobile app that lets you compile a “makeup bag” of your current products to share with friends. In our app, we are creating this new functionality while also aggregating many reviews in one place for easy access by users.

### Realness

We will be using two main data sources: A barcode-matching database for and a data set containing reviews for multiple makeup products:

1. **Upcdatabase.org**  _This database offers information for over 4.3 million barcode numbers worldwide, with information on 4 attributes: the associated product names, pricing, manufacturer, and quantities. It also provides detailed API documentation to integrate the database with the rest of our application._

2. **Cosmetics and Beauty Products Reviews - Top Brands** _This database is a .csv dataset containing reviews and customer ratings for beauty products. For each of the 7.89 million reviews found in the data set, information is given for up to 18 attributes: product ID, product name, brand name, review id, review title, review text, review author, review date, review rating, whether the reviewer is a buyer, whether the reviewer is a pro user, review label, mrp, price, product rating, product rating count, product tags, and product URL._

Using the UPC database, we will obtain the name of the beauty product from the user-inputted bar code number, and match it to the name of a beauty product in our data set of reviews. The corresponding reviews will be presented to the user, giving the user sufficient information to decide if they would like to add that product to their “Makeup bag”.

### Functionality

The core features of our app work enable users to, in **CRUD** terms:

**READ**
```
View (GET) their “makeup bag”
```

```
Search (GET) for their friends’ “makeup bags” to discover what products their friends are using
```

```
View reviews for a product (GET)
```


**CREATE, UPDATE, DELETE**
```
Add/Remove new products to/from their own makeup bag (POST/PUT)
```

**CREATE**

```
Write reviews for a product (POST)
```

**MVP (Minimum Viable Product)** — Viewing your bag, adding items to your bag, viewing friends’ bags, and seeing product reviews


_Extras if time — Barcode scanning, ordering of products, more advanced
search features_


# A low-fidelity UI mockup

## 1 - Welcome page

![WelcomePageUI](vanity-mockup/1WelcomePage.png)

**Buttons**

```log in``` _leads to screen 2._

```sign up``` _leads to screen 3._


## 2 - Login page

![LoginPageUI](vanity-mockup/2LoginPage.png)

**Text inputs:**

``` username ```

``` password  ```

**Buttons**

``` submit ```

## 3 - Sign up page

![SignUpPageUI](vanity-mockup/3SignUpPage.png)

**Text inputs:**

``` username ```

``` password ```

``` password confirmation ```

**Buttons:**

``` submit ``` _leads to screen 4_

## 4 - Bag page

![BagPageUI](vanity-mockup/4BagPage.png)

_Displays contents of any makeup bag (user’s or friends’)_

**Buttons:**

```+``` _leads to screen 7_

Hamburger menu _leads to screen 5_

## 5 - Hamburger menu

![HamburgerMenuUI](vanity-mockup/5HamburgerMenu.png)

**Buttons:**

```my bag``` _leads to screen 4_

```friends``` _leads to screen 6_

```product reviews``` _leads to screen 7_

## 6 - Friends search page

![FriendsPageUI](vanity-mockup/6FriendsPage.png)

**Text inputs:**

```username``` _(friend’s username)_

**Buttons:**

```search``` _leads to screen 4_

Hamburger menu _leads to screen 5_


## 7 - Products search page

![ProductsSearchPageUI](vanity-mockup/7ProductsSearchPage.png)

**Text inputs:**

```Product barcode```

**Buttons:**

```search``` _leads to screen 8_

Hamburger menu _leads to screen 5_


## 8 - Product reviews page

![ProductReviewsUI](vanity-mockup/8ProductReviews.png)

**Scrollable elements:**

Reviews section

**Buttons:**

Hamburger menu _leads to screen 5_

```add to bag``` _leads to screen 4_


### Project Work Distribution:

The **backend** of our project will be led by Julie and Nitya. In our web application, the backend tasks will be building the Flask API and managing the host infrastructure. Nitya will lead the creation of the endpoints in the API, which will require collaboration with the frontend team to understand what endpoints are necessary for the functions of the app. For example, when displaying the products in the user’s bag, there will need to be an endpoint that grabs the list of products. Julie will lead the SQL queries. She will write the necessary queries that will navigate the backend seamlessly. Additionally, Nitya will manage the host infrastructure such as the API and Database server. Julie will determine the Database Schemas.

The **frontend** of the project will be led by Oju and Ria. In our web app, the frontend will be written using React and CSS. React will control the navigation and the components of the app. For example, one of the essential React components will include the hamburger menu which will allow the user to navigate between their bag, their friends’ bags, and the products search bar. Ria will write most of the CSS files and determine the visual layout, ensuring that the colors and fonts stay consistent throughout the app. Oju will write the React files to ensure that there is smooth navigation and efficient functions that allow the frontend to connect with the backend.

Although we will divide up tasks as stated above, many of these tasks will require collaboration and collaborative decision-making. Our group will maintain good communication to make sure that all of the elements work together.
