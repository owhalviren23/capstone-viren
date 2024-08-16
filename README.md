# Tailor data

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- PostgreSQL
- Node.js

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/neelvaidya133/Capstone
   cd capstone
   ```
2.  Setup Backend
    Install PostgreSQL from [here](https://www.postgresql.org/download/).
    Create a new database named capstone:
    ```sql
    CREATE DATABASE capstone;
    ```
    Create roles:
    ```sql
    CREATE ROLE company;
    CREATE ROLE anonymous;
    ```
    Restore the database using pgAdmin:

  Open pgAdmin.
  Right-click on the capstone database and select Restore.
  Choose the tailordataback file located in the database folder.
  Click Restore


  Update the .env file with your PostgreSQL configuration.

Install the backend dependencies:

```bash
npm install
```
Move to the server directory and start the server:

```bash
cd server
node index.js
```
3.  Setup Frontend
    Go back to the root directory of the repository:

  ```bash
cd ..
```
Install the frontend dependencies:

```bash
npm install
```
Start the frontend server:

```bash
npm start
```
## Running the Application

1.Ensure PostgreSQL is running on your machine.

2.Start the backend server as mentioned above.

3.Start the frontend server as mentioned above.

