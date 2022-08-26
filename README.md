# bloggo
MERN Blog Application with a RESTful API. Test Driven Development

Thoroughly tested using Supertest package and MongoDB-Memory-Server
User-tested on Pixel XL, Ipad Pro 2021, and MBP 2021 (mobile, tablet, PC)
Please see *Production* branch for the final and polished version of project

## Features

 * Handcrafted CMS for managing blog posts
 * Separate frontends for admin and users, with rich text editor for creating blog posts
 * Mobile-first design with responsive layout.
 * Light and dark modes using React context 
## Tech 

* MongoDB/Mongoose 
* Express 
* React.js 
* Node.js 
* JavaScript
* TypeScript
* Passport, JSON Web Tokens, and Bcrypt for authentication and encryption
* Supertest and MongoDB-Memory-Server for integration testing

## Technical Challenges 
 
* Security: Initially, I tried to store my JWT in localStorage since 
I had planned to have my frontend and backend served on different 
origins. However, localStorage is quite vulnerable to JS attacks, so I
opted in for storing my JWT on an HTTPOnly Cookie. This required 
my application to be on the same origin, which turned this problem 
into a Dev Ops problem. I fixed the problem by setting up AWS so that 
both my frontends and backend were served on the same origin. 
* Tradeoff for CSS verbosity in exchange for more maintainable code. I had to make the decision to use various css selectors and classes and many lines of CSS to have code that was easy to maintain and very readable, at the cost of writing more lines of cost. Considering the distinct styling of many of the pages. I believe this tradeoff was worth it and will prove its worth if I choose to extend this project in the future. 

## Learnings 

## Creator's Comment
