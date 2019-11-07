const myLibrary = [];
const bookTableBody = document.querySelector('#book-table tbody');
const newBookButton = document.getElementById('new-book');
const newBookModal = document.getElementById('new-book-modal');
const modalCloseButton = document.querySelector('.modal-close');
const cancelButton = document.querySelector('.button.cancel');
const modalBackground = document.querySelector('.modal-background');
const addBookButton = document.getElementById('add-book');

document.addEventListener('click', function(event) {
	// console.log(event);
	if (event.target === newBookButton) {
		newBookModal.classList.add('is-active');
	}
	if (event.target === modalCloseButton ||
					event.target === modalBackground ||
					event.target === cancelButton ||
					event.target === addBookButton) {
		newBookModal.classList.remove('is-active');
	}
	if (event.target === addBookButton) {
		console.log('Add book to library button was clicked');
		const newBookTitle = document.getElementById('title').value;
		const newBookAuthor = document.getElementById('author').value;
		const newBookPages = document.getElementById('pages').value;
		const newBookRead = document.getElementById('read').value;
		const newBook = new Book(newBookTitle, newBookAuthor, newBookPages, newBookRead);
		console.log(newBook);
		addBookToLibrary(newBook);
	}
	if (event.target.parentElement.classList.contains('book-read')) {
		const bookIndexToChange = event.target.closest('tr').getAttribute('data-book-index');
		if (event.target.innerText === 'not read yet') {
			event.target.classList.add('is-success');
			myLibrary[bookIndexToChange].changeReadStatus('read');
		} else {
			event.target.classList.remove('is-success');
			myLibrary[bookIndexToChange].changeReadStatus('not read yet');
		}
		event.target.innerText = myLibrary[bookIndexToChange].read;
	}
	if (event.target.classList.contains('delete')) {
		const bookIndexToDelete = event.target.closest('tr').getAttribute('data-book-index');
		removeBookFromLibrary(bookIndexToDelete);
	}
});

document.addEventListener('keydown', function(event) {
	if (newBookModal.classList.contains('is-active') && event.code === 'Escape') {
    newBookModal.classList.remove('is-active');
  }
});

function Book(title, author, pages, read) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

Book.prototype.makeTableCell = function(prop) {
	const tableCell = document.createElement('td');
	tableCell.classList.add(`book-${prop}`);
	if (prop === 'read') {
		const readButton = document.createElement('a');
		readButton.classList.add('button', 'is-small');
		if (this[prop] === 'read') {
			readButton.classList.add('is-success');
		} else {
			readButton.classList.remove('is-success');
		}

		readButton.innerText = this[prop];
		tableCell.appendChild(readButton);
	} else {
		tableCell.innerText = this[prop];
	}
	return tableCell;
}

Book.prototype.makeTableRow = function(arr) {
	let tableRow = document.createElement('tr');

	// Create td for each of arr's elements
	for (let prop of arr) {
		let tableCell = this.makeTableCell(prop);
		tableRow.appendChild(tableCell);
	}

	// Create delete button
	let tableCell = document.createElement('td');
	let deleteLink = document.createElement('a');
	deleteLink.classList.add('delete');
	tableCell.appendChild(deleteLink);
	tableRow.appendChild(tableCell);

	return tableRow;
}

Book.prototype.changeReadStatus = function(newStatus) {
	this.read = newStatus;
}

function addBookToLibrary(book) {
	myLibrary.push(book);
	render(myLibrary);
}

function removeBookFromLibrary(bookIndex) {
	myLibrary.splice(bookIndex, 1);
	render(myLibrary);
}

function render(library) {
	// Clear old table rows before re-rendering library
	while(bookTableBody.firstChild) {
		bookTableBody.removeChild(bookTableBody.firstChild);
	}
	let count = 0;
	for (let book of library) {
		tableRow = book.makeTableRow(['title', 'author', 'pages', 'read']);
		tableRow.setAttribute('data-book-index', count);
		bookTableBody.appendChild(tableRow);
		count++;
	}

}

// Sample books to populate the start page
const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, 'read');
const eloquentJS = new Book('Eloquent JavaScript, Third Edition', 'Marijn Haverbeke', 450, 'not read yet');

addBookToLibrary(theHobbit);
addBookToLibrary(eloquentJS);

render(myLibrary);
