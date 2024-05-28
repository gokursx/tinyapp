# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Work flow
- User registers on the portal with user name and password
- Users can login in using the registered credentials (user Name and password) and submit
- The main page localhost/8080/urls consists Tinyapp logo, My URLs, Create New URL buttons at the top navigation bar with Login and Register buttons on the right.
- Below navigation bar shows the urls that logged in user has added with short URL, Long URL coloumns. Each rows of URL consists of Edit and Delete button to update urls and delete it.
- Create New URL functionality redirects to http://localhost:8080/urls/new page with a text field "Enter a URL" and text box for entering it and submit button. After submission long URL is converted into short URL and displays both. There is also an option to edit the long URL on the page.
- After new URL is created, main page lists all the urls for the particular user and shows upon logging in each instance.

## Functionality
- After registration the page checks the credentials upon logging in. If user name matches password, user logs in otherwise shows "password is wrong" for incorrect password (login page) or "Username already exists" (Register page).

## Final Product
!["Screenshot of URLs page"](https://github.com/lighthouse-labs/tinyapp/blob/master/docs/urls-page.png)
!["Screenshot of register page"](https://github.com/lighthouse-labs/tinyapp/blob/master/docs/register-page.png)