# FlavorHub

**FlavorHub** is a recipe-sharing community website where users can create, share, view, and review recipes. Built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Bootstrap, FlavorHub provides a platform for food enthusiasts to explore, contribute, and discuss recipes in an interactive and user-friendly environment.

## Features

- **Create Recipes**: Users can add their recipes by filling out a form with details such as ingredients, steps, and preparation time.
- **Share Recipes**: Once submitted, recipes are shared with the community and visible to other users.
- **View Recipes**: Users can browse through a wide variety of recipes from different categories.
- **Review Recipes**: Users can leave reviews on recipes shared by others to help the community with feedback.
- **Responsive Design**: The site is fully responsive, ensuring a great experience on desktops, tablets, and smartphones.

## Technologies Used

- **Frontend**: React, MUI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: MUI, external CSS

## Installation

### Prerequisites

- Node.js (v14 or later)
- MongoDB (or a MongoDB cloud service like Atlas)

### Steps

1. **Clone the repository**

   git clone https://github.com/CodeBenderX/FlavorHub.git
   cd flavorhub

2. **Install backend dependencies**
  cd server
  yarn install

3. **Install frontend dependencies**
  cd client
  yarn install

4. **Configure environment variables**
  Create a .env file in the backend directory and set the following variables:
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key

5. **Run the application**
  *To start the backend server:*
  cd server
  yarn dev

  *To start the frontend server:*
  cd client
  yarn build (optional but if the yarn dev does not update the interface, try doing this)
  yarn dev

6. **Visit http://localhost:3000 in your browser to see the application in action.**
7. **Deploying**
   *You can choose your third-party deployment site. For this, we used render.*

**Contributing**
We welcome contributions to FlavorHub! If you want to improve the project or fix a bug, feel free to fork the repository, create a branch, and submit a pull request.

**License**
This project is licensed under the MIT License - see the LICENSE file for details.

**Acknowledgements**
MERN Stack for providing a powerful, full-stack JavaScript solution.
MUI is for quick and responsive design components.

**Contact**
If you have any questions or suggestions, please contact us at angelo.tiquio@outlook.com.


This `README.md` provides an overview of the project, the features, technologies used, and installation instructions. You can customize the contact information, repository URL, and other details to suit your project.
