const coursesData = [
    {
      courseId: 1,
      title: "JavaScript for Beginners",
      creator: "Programming with Mosh",
      completedVideos: [
        {
          id: 1,
          title: "Introduction to JavaScript",
          url: "https://www.youtube.com/embed/W6NZfCO5SIk",
          summary:
            "This video provides a comprehensive introduction to JavaScript, one of the most widely used programming languages for web development. You'll learn about JavaScript’s role in web development, syntax, and how to set up your first script. The video also covers data types, variables, and basic operations, setting a strong foundation for beginners.",
        },
        {
          id: 2,
          title: "JavaScript Variables",
          url: "https://www.youtube.com/embed/sjyJBL5fkp8",
          summary:
            "In this lesson, you'll dive deep into JavaScript variables. Learn about `var`, `let`, and `const`, and understand their scope, differences, and best practices. This video also explains hoisting and how variables are stored in memory, helping you write more efficient and error-free code.",
        },
        {
          id: 3,
          title: "JavaScript Functions",
          url: "https://www.youtube.com/embed/8dWL3wF_OMw",
          summary:
            "Functions are the building blocks of any JavaScript program. This video teaches you how to declare and invoke functions, work with parameters and return values, and understand function expressions. You'll also explore arrow functions and their advantages in modern JavaScript.",
        },
        {
          id: 4,
          title: "JavaScript Arrays",
          url: "https://www.youtube.com/embed/tVCYa_bnITg",
          summary:
            "Arrays allow you to store multiple values in a single variable. This video explains array creation, manipulation, and common methods like `push()`, `pop()`, `map()`, and `filter()`. You'll also learn about multidimensional arrays and how to efficiently iterate through them using loops.",
        },
        {
          id: 5,
          title: "JavaScript Objects",
          url: "https://www.youtube.com/embed/Bv_5Zv5c-Ts",
          summary:
            "Objects are a fundamental part of JavaScript. This tutorial introduces object literals, key-value pairs, and how to manipulate objects. Learn about nested objects, object destructuring, and methods like `Object.keys()`, `Object.values()`, and `Object.entries()`.",
        },
      ],
      remainingVideos: [
        {
          id: 6,
          title: "ES6 Features",
          url: "https://www.youtube.com/embed/Wn_Kb3MR_cU",
          summary:
            "ECMAScript 6 (ES6) introduced several powerful features in JavaScript. This video covers template literals, spread/rest operators, destructuring, classes, and modules. By mastering ES6, you'll write cleaner and more efficient code.",
        },
        {
          id: 7,
          title: "JavaScript Promises",
          url: "https://www.youtube.com/embed/DHvZLI7Db8E",
          summary:
            "Promises help you handle asynchronous operations in JavaScript. This video explains how promises work, the differences between `resolve` and `reject`, and how to use `.then()` and `.catch()` for better async control.",
        },
        {
          id: 8,
          title: "Async Await in JavaScript",
          url: "https://www.youtube.com/embed/V_Kr9OSfDeU",
          summary:
            "Async/Await makes working with asynchronous JavaScript easier. Learn how to write cleaner asynchronous code by replacing `.then()` chains with a more readable `async` and `await` syntax.",
        },
        {
          id: 9,
          title: "JavaScript Event Loop",
          url: "https://www.youtube.com/embed/8aGhZQkoFbQ",
          summary:
            "The event loop is crucial to JavaScript’s non-blocking nature. This video explains how JavaScript handles tasks asynchronously using the call stack, microtasks, and the message queue.",
        },
        {
          id: 10,
          title: "JavaScript DOM Manipulation",
          url: "https://www.youtube.com/embed/wiozYyXQEVk",
          summary:
            "The Document Object Model (DOM) lets you interact with web pages dynamically. This video teaches you how to select, modify, and create elements in the DOM using JavaScript methods like `getElementById()`, `querySelector()`, and event listeners.",
        },
      ],
    },
    {
      courseId: 2,
      title: "React JS Mastery",
      creator: "Academind",
      completedVideos: [
        {
          id: 1,
          title: "Introduction to React",
          url: "https://www.youtube.com/embed/bMknfKXIFA8",
          summary:
            "This video introduces React, a popular JavaScript library for building user interfaces. Learn about components, JSX syntax, and why React is used in modern web development.",
        },
      ],
      remainingVideos: [
        {
          id: 2,
          title: "React Hooks Explained",
          url: "https://www.youtube.com/embed/KKeqMmc0BZk",
          summary:
            "React Hooks allow functional components to manage state and side effects. This video covers `useState`, `useEffect`, and custom hooks to make your React applications more efficient.",
        },
        {
          id: 3,
          title: "React State Management",
          url: "https://www.youtube.com/embed/X6TLFZUC9gI",
          summary:
            "State management is crucial in React applications. This video compares different approaches, including React Context API, Redux, and Zustand, and helps you choose the best one for your needs.",
        },
      ],
    },
    {
      courseId: 3,
      title: "Node.js & Express Crash Course",
      creator: "Traversy Media",
      completedVideos: [
        {
          id: 1,
          title: "Introduction to Node.js",
          url: "https://www.youtube.com/embed/fBNz5xF-Kx4",
          summary:
            "Node.js allows you to run JavaScript on the server. This video covers the basics of Node.js, including its architecture, event-driven nature, and use cases.",
        },
      ],
      remainingVideos: [
        {
          id: 2,
          title: "Building REST APIs with Express",
          url: "https://www.youtube.com/embed/pKd0Rpw7O48",
          summary:
            "Express.js simplifies backend development in Node.js. Learn how to create RESTful APIs, handle routes, and manage middleware to build scalable applications.",
        },
        {
          id: 3,
          title: "Connecting MongoDB with Node.js",
          url: "https://www.youtube.com/embed/7CqJlxBYj-M",
          summary:
            "Databases are essential for dynamic applications. This tutorial covers how to connect MongoDB with Node.js using Mongoose, perform CRUD operations, and structure your database models.",
        },
      ],
    },
  ];
  
  export default coursesData;
  