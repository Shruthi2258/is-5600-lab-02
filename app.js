document.addEventListener('DOMContentLoaded', () => {
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);

    const deleteButton = document.querySelector('#btnDelete');
    const saveButton = document.querySelector('#btnSave');

    generateUserList(userData, stocksData);

    deleteButton.addEventListener('click', (event) => 
        {
            event.preventDefault();
            const userId = document.querySelector('#userID').value;
            const userIndex = userData.findIndex(user => user.id == userId);
            userData.splice(userIndex, 1);
            generateUserList(userData, stocksData);
        });

    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        const id = document.querySelector('#userID').value;
        const userIndex = userData.findIndex(user => user.id == id);

        const newUsers = [
            ...userData.slice(0, userIndex),
            {
                ...userData[userIndex],
                user: {
                    firstname: document.querySelector('#firstname').value,
                    lastname: document.querySelector('#lastname').value,
                    address: document.querySelector('#address').value,
                    city: document.querySelector('#city').value,
                    email: document.querySelector('#email').value,
                },
            },
            ...userData.slice(userIndex + 1)
        ]

        generateUserList(newUsers, stocksData);
    });

    function generateUserList(users, stocks) 
    {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = '';

    users.map(({user, id}) => 
        {
        const listItem = document.createElement('li');
        listItem.innerText = user.lastname + ', ' + user.firstname;
        listItem.setAttribute('id', id);
        userList.appendChild(listItem);
        });

        userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
    }

    function handleUserListClick(event, users, stocks) 
    {

    const userId = event.target.id;

    const user = users.find(user => user.id == userId);

    populateForm(user);

    renderPortfolio(user, stocks);
    }

    function renderPortfolio(user, stocks) 
    { 
        const { portfolio } = user;
        const portfolioDetails = document.querySelector('.portfolio-list');

        portfolioDetails.innerHTML = '';

        portfolio.map(({ symbol, owned }) => 
        {
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
        })


        portfolioDetails.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
            viewStock(event.target.id, stocks);
            }
        });

    }

    function populateForm(data) 
    {
    const { user, id } = data;

    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
    }

    function viewStock(symbol, stocks) 
    {
        const stockArea = document.querySelector('.stock-form');
        if (stockArea) 
        {
            const stock = stocks.find( function (s) { return s.symbol == symbol;});

            document.querySelector('#stockName').textContent = stock.name;
            document.querySelector('#stockSector').textContent = stock.sector;
            document.querySelector('#stockIndustry').textContent = stock.subIndustry;
            document.querySelector('#stockAddress').textContent = stock.address;

            document.querySelector('#logo').src = `logos/${symbol}.svg`;
        } 
    }   
});