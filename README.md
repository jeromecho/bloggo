# bloggo
MERN Blog Application with a RESTful API. Test Driven Development

Thoroughly tested using Supertest package and MongoDB-Memory-Server

User-tested on Pixel XL, Ipad Pro 2021, and MBP 2021 (mobile, tablet, PC)

Please see *Production* branch if you want to read code without the comments I wrote for my learning. 

Server deployed in an AWS EC2 Instance. Frontends deployed on Github Pages.

## Dev Log

* EDIT - 2022/12/19 - patches released. Bloggo is ready for deployment. *
* EDIT - 2023/01/06 - deployed

## Live

Server: http://ec2-3-82-200-100.compute-1.amazonaws.com:5500/

Users Page: https://jeromecho.github.io/bloggo-users/

Admin Page: https://jeromecho.github.io/bloggo-admin/

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
* AWS (EC2 Instance)

## Images 

<img width="300" alt="image" src="https://user-images.githubusercontent.com/71617542/189499298-d2849a02-c4a0-43e1-848d-29f3ccaa821a.png"><img width="300" alt="image" src="https://user-images.githubusercontent.com/71617542/189499358-b8bcaa58-8188-41dd-83ef-f4e2df552d71.png"><img width="300" alt="image" src="https://user-images.githubusercontent.com/71617542/189499417-ce73e2d7-b133-47df-a06f-7f4718624c5f.png"><img width="300" alt="image" src="https://user-images.githubusercontent.com/71617542/189499454-0cd36ae5-8797-4ef1-8f98-1a5386318f45.png"><img width="300" alt="image" src="https://user-images.githubusercontent.com/71617542/189499461-0ea8d2ce-cd38-4685-8e99-9087ae211efa.png"><img width="300" alt="image" src="https://user-images.githubusercontent.com/71617542/189499471-19f78928-7012-4dd9-89f0-5267908dc82a.png"><img width="300" alt="image" src="https://user-images.githubusercontent.com/71617542/189499478-cc2dffc9-ed35-4e4a-b605-a795e13d123a.png">

## Technical Challenges 

* Many users with the same username. Surprisingly, this was a hard problem, due to there being 
a multitude of constraints I had to consider. First, I had to ensure I was only sending one 
HTTP response, which meant I could have only one place in my code calling "done". Second, 
bcrypt.compare() was asynchronous but not promise-based. I solved this problem by 
promisfying my bcrypt calls, then indirectly changing boolean values on local variables 
to determine whether or not a user was found or not
 
* Tradeoff for CSS verbosity in exchange for more maintainable code. I had to make the decision to use various css selectors and classes and many lines of CSS to have code that was easy to maintain and very readable, at the cost of writing more lines of cost. Considering the distinct styling of many of the pages. I believe this tradeoff was worth it and will prove its worth if I choose to extend this project in the future. 

* Securing routes - it was a NIGHTMARE trying to secure routes initially. Context did not have persistence for ensuring a user was authenticated. I tried to load data from localStorage then update the local state of a higher order component to conditionally render components, but this didn't work and I would simply get redirected or 
get the component shown in any case - authenticated or not. Finally, I discovered 
the magical lines of code: 

```
        if (isAuthenticated !== null) { 
            setIsOkayToRedirect(true);
        }
        if (localStorage.isAuthenticated) {
            setIsAuthenticated(!!localStorage.getItem('isAuthenticated'));
        } else {
            setIsAuthenticated(false);
        }
```

Here's the catch. By causing useEffect to asynchronously update GLOBAL state via context, I was able to cause not just my HOC to re-render, but my app as a *whole*. It seems this was the missing piece, because finally, logged in users continued to access protected routes while unauthenticated users did not. This makes sense though - App.tsx is where all my routes are defined, so I guess a re-render of App is necessary in order to once again iterate through every Route in Route and run my HOC again, this time with 'isAuthenticated' equal to a true or false value, rather than null. 

* Safely unescaping rich text editor content - In order to preserve 
formatting of text typed into the rich text editor, I used innerHTML. This 
came with some security concerns, thus, I escaped the data I stored in the 
database, then unescaped using a custom helper and a XSS sanitizer - DOMPurify
