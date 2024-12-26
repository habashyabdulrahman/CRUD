let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');

let mood = 'create';
let tmp;

// get total
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#007213FF';
    } else {
        total.innerHTML = '';
        total.style.background = '#7901b0';
    }
}

// create product
let dataProduct;

if (localStorage.product != null) {
    dataProduct = JSON.parse(localStorage.product);
} else {
    dataProduct = [];
}

submit.onclick = function () {
    let newProduct = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase()
    }

    if (title.value != ''
        && price.value != ''
        && category.value != ''
        && newProduct.count < 151) {
        if (mood == 'create') {
            dataProduct.push(newProduct);
        } else {
            newProduct.count = dataProduct[tmp].count; // Keep the original count
            dataProduct[tmp] = newProduct;
            mood = 'create';
            count.style.display = 'block';
            submit.innerHTML = 'Create';
        }
        clearData();
    }

    // save local storage
    localStorage.setItem('product', JSON.stringify(dataProduct));

    showData();
}

// clear inputs
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

// read
function showData() {
    getTotal();
    let table = '';
    let totalCount = 0;
    for (let i = 0; i < dataProduct.length; i++) {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataProduct[i].title}</td>
            <td>${dataProduct[i].price}</td>
            <td>${dataProduct[i].taxes}</td>
            <td>${dataProduct[i].ads}</td>
            <td>${dataProduct[i].discount}</td>
            <td>${dataProduct[i].total}</td>
            <td>${dataProduct[i].count}</td>
            <td>${dataProduct[i].category}</td>
            <td><button onclick="updateData(${i})" id="update">Update</button></td>
            <td><button onclick="confirmDelete(${i})" id="delete">Delete</button></td>
        </tr>
        `;
        totalCount += parseInt(dataProduct[i].count);
    }
    document.getElementById('tbody').innerHTML = table;

    let btnDelete = document.getElementById('deleteAll');
    if (dataProduct.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteAll()">Delete All (${totalCount})</button>`;
    } else {
        btnDelete.innerHTML = '';
    }
}
showData();

// delete
function deleteAll() {
    dataProduct = [];
    localStorage.product = JSON.stringify(dataProduct);
    showData();
}

// delete some or all
function confirmDelete(i) {
    let modal = document.getElementById("deleteModal");
    let span = document.getElementsByClassName("close")[0];
    let deleteOneBtn = document.getElementById("deleteOne");
    let deleteAllBtn = document.getElementById("deleteItemAll");

    console.log(modal, span, deleteOneBtn, deleteAllBtn);

    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    deleteOneBtn.onclick = function () {
        dataProduct[i].count--;
        if (dataProduct[i].count === 0) {
            dataProduct.splice(i, 1);
        }
        localStorage.product = JSON.stringify(dataProduct);
        showData();
        modal.style.display = "none";
    }

    deleteAllBtn.onclick = function () {
        if (dataProduct[i].count > 1) {
            dataProduct.splice(i, 1);
        }
        localStorage.product = JSON.stringify(dataProduct);
        showData();
        modal.style.display = "none";
    }
}

// update
function updateData(i) {
    title.value = dataProduct[i].title;
    price.value = dataProduct[i].price;
    taxes.value = dataProduct[i].taxes;
    ads.value = dataProduct[i].ads;
    discount.value = dataProduct[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataProduct[i].category;
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;
    scroll({
        top: 0,
        behavior: 'smooth'
    });
}

// search
let searchMood = 'title';

function getSearchMood(id) {

    let search = document.getElementById('search');
    if (id == 'searchTitle') {
        searchMood = 'title';
    } else {
        searchMood = 'category';
    }
    search.focus();
    search.placeholder = `Search by ${searchMood}`;
    search.value = '';
    showData(); 
}

function searchData(value) {
    let table = '';
    let searchResults = [];
    for (let i = 0; i < dataProduct.length; i++) {
        if (searchMood == 'title') {
            if (dataProduct[i].title.toLowerCase().includes(value.toLowerCase())) {
                searchResults.push(i);
                table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataProduct[i].title}</td>
            <td>${dataProduct[i].price}</td>
            <td>${dataProduct[i].taxes}</td>
            <td>${dataProduct[i].ads}</td>
            <td>${dataProduct[i].discount}</td>
            <td>${dataProduct[i].total}</td>
            <td>${dataProduct[i].count}</td>
            <td>${dataProduct[i].category}</td>
            <td><button onclick="updateData(${i})" id="update">Update</button></td>
            <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
        </tr>
        `;
            }
        } else {
            if (dataProduct[i].category.toLowerCase().includes(value.toLowerCase())) {
                searchResults.push(i);
                table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataProduct[i].title}</td>
            <td>${dataProduct[i].price}</td>
            <td>${dataProduct[i].taxes}</td>
            <td>${dataProduct[i].ads}</td>
            <td>${dataProduct[i].discount}</td>
            <td>${dataProduct[i].total}</td>
            <td>${dataProduct[i].count}</td>
            <td>${dataProduct[i].category}</td>
            <td><button onclick="updateData(${i})" id="update">Update</button></td>
            <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
        </tr>
        `;
            }
        }
    }

    document.getElementById('tbody').innerHTML = table;

    let btnDelete = document.getElementById('deleteAll');
    if (searchResults.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteSearchedData(${JSON.stringify(searchResults)})">Delete All (${searchResults.length})</button>`;
    } else {
        btnDelete.innerHTML = '';
    }
}

function deleteSearchedData(searchResults) {
    for (let i = searchResults.length - 1; i >= 0; i--) {
        dataProduct.splice(searchResults[i], 1);
    }
    localStorage.product = JSON.stringify(dataProduct);
    showData();
}

// clean data