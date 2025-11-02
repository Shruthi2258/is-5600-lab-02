
function populateForm(data) {
   
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
}

/**
 * Renders the stock information for the symbol
 * @param {string} symbol - The stock symbol
 * @param {Array<object>} stocks - The complete list of stock data
 */
function viewStock(symbol, stocks) {
    const stock = stocks.find(function (s) { return s.symbol === symbol; });

    if (stock) {
        document.querySelector('#stockName').textContent = stock.name;
        document.querySelector('#stockSector').textContent = stock.sector;
        document.querySelector('#stockIndustry').textContent = stock.subIndustry;
        document.querySelector('#stockAddress').textContent = stock.address;

        document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
}

/**
 * Renders the portfolio items for the user and registers the view stock click listener
 * @param {object} user - The currently selected user object
 * @param {Array<object>} stocks - The complete list of stock data
 */
function renderPortfolio(user, stocks) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = '';
    portfolio.forEach(({ symbol, owned }) => {
        const symbolEl = document.createElement('p');
        const sharesEl = document.createElement('p');
        const actionEl = document.createElement('button');
        symbolEl.innerText = symbol;
        sharesEl.innerText = owned;
        actionEl.innerText = 'View';
        actionEl.setAttribute('id', symbol);
        portfolioDetails.appendChild(symbolEl);
        portfolioDetails.appendChild(sharesEl);
        portfolioDetails.appendChild(actionEl);
    });
    
    portfolioDetails.onclick = (event) => {
        if (event.target.tagName === 'BUTTON') {
            viewStock(event.target.id, stocks);
        }
    };
}


/**
 * Handles the click event on the user list
 * @param {Event} event - The click event object
 * @param {Array<object>} users - The complete list of user data
 * @param {Array<object>} stocks - The complete list of stock data
 */
function handleUserListClick(event, users, stocks) {
    if (event.target.tagName !== 'LI') return;
    const userId = event.target.id;
    const user = users.find(user => user.id == userId);
    
    if (user) {
        populateForm(user);
        renderPortfolio(user, stocks);
    }
}


/**
 * Loops through the users and renders a ul with li elements for each user
 * @param {Array<object>} users - The complete list of user data
 * @param {Array<object>} stocks - The complete list of stock data
 */
function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = '';
    users.forEach(({ user, id }) => {
        const listItem = document.createElement('li');
        listItem.innerText = user.lastname + ', ' + user.firstname;
        listItem.setAttribute('id', id);
        userList.appendChild(listItem);
    });
    if (!userList.hasClickListener) {
        userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
        userList.hasClickListener = true;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);
    const saveButton = document.querySelector('#save-button');
    const deleteButton = document.querySelector('#delete-button');
    generateUserList(userData, stocksData);
    deleteButton.addEventListener('click', (event) => {
        
        event.preventDefault();

        const userId = document.querySelector('#userID').value;

        if (!userId) return; 

        const userIndex = userData.findIndex(user => user.id == userId);
        
        if (userIndex !== -1) {
            userData.splice(userIndex, 1);
            document.querySelector('.user-form').reset(); 
            document.querySelector('.portfolio-list').innerHTML = ''; 

            generateUserList(userData, stocksData);
        }
    });

    saveButton.addEventListener('click', (event) => {
        
        event.preventDefault();

        
        const id = document.querySelector('#userID').value;

        
        if (!id) return; 

        const userToUpdate = userData.find(user => user.id == id);

        if (userToUpdate) {
            
            userToUpdate.user.firstname = document.querySelector('#firstname').value;
            userToUpdate.user.lastname = document.querySelector('#lastname').value;
            userToUpdate.user.address = document.querySelector('#address').value;
            userToUpdate.user.city = document.querySelector('#city').value;
            userToUpdate.user.email = document.querySelector('#email').value;

            
            generateUserList(userData, stocksData);
            
            populateForm(userToUpdate);
        }
    });
});