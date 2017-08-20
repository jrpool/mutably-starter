# Mutably Starter

Web application creating, retrieving, updating, and deleting records in a database through its API.

## Project Members

[Danielle Gellis](https://github.com/danisyellis)

[Jonathan Pool](https://github.com/jrpool)

## Discussion

### General

This application demonstrates the use of the fundamental web languages, HTML, CSS, and JavaScript, and the JQuery, Materialize, and EJS libraries to create an application that runs inside a web browser and interacts with a database through its API.

The demonstration takes the form of an interface that manages the user’s interactions with a database of books.

The application fulfills the requirements of the “CRUD Mutably” module (Module 383) in Phase 3 of the [Learners Guild][lg] curriculum.

Users of this application can perceive that it illustrates some web application development techniques but does not pretend to provide a realistically rich interface for interaction with a database of books. Real book catalogues assign values to many more properties of their records than this application does. The Mutably books database is, likewise, intended as a simplified model, and this application manipulates all of the properties that the API allows.

### Implementation notes

The project members have developed 2 versions of this application, exhibiting partially distinct interface-design strategies. Each version contains work by both members. Members Gellis and Pool are the main contributors to version 2 and version 1, respectively. The project members welcome comments on the interface strategies embodied in these versions.

## Installation and Configuration

### User mode

To use either version of the application, you do not need to install anything. Just visit either of these addresses with a web browser:

- Version 1: `https://mighty-beach-12535.herokuapp.com/1`

- Version 2: `https://mighty-beach-12535.herokuapp.com/2`

### Developer Mode

To examine and further develop this application, follow the instructions below.

0. These instructions presuppose that (1) [npm][npm] is installed.

1. Your copy of this project will be located in its own directory, inside some other directory that you may choose or create. For example, to create that parent directory inside your own home directory’s `Documents` subdirectory and call it `projects`, you can execute:

    `mkdir ~/Documents/projects`

Make that parent directory your working directory, by executing, for example:

    `cd ~/Documents/projects`

2. Clone this project’s repository into it, thereby creating the project directory, named `mutably-starter`, by executing:

    `git clone https://github.com/jrpool/mutably-starter.git mutably-starter`

2. Make the project directory your working directory by executing:

    `cd mutably-starter`

3. Install required dependencies (you can see them listed in `package.json`) by executing:

    `npm i`

4. To start version 1 of the application, execute `npm localstart1`. To start version 2, execute `npm run localstart2`.

To access the application while it is running, use a web browser to request this URL:

`http://localhost:3000/`

## Usage

The intent is that the interfaces are self-explanatory. The project members will appreciate reports of any aspects that are not easily understandable. In using this application, you can make changes to the Mutably books database. Conversely, other users can, by doing the same, change and delete any content that you insert into the database.

You can see that each book has 2 properties that you cannot manipulate: an identifier and a version. The Mutably API assigns identifiers to new books automatically. It also assigns 0 as the value of the version property of every book. If you amend a book record, the API does not increment the version.

[lg]: https://www.learnersguild.org
