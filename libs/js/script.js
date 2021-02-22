// Handlebars compiler
let renderResults = Handlebars.compile($('#card-template').html());


let results = [];

// Formats name given back from database
const nameFormatter = (object) => {
    let nameString = `${object.firstName} ${object.lastName}`;
    return nameString;
}

// Formats employees returned from database
const employeesFormatter = (object) => {
    let employee = {
        name: nameFormatter(object),
        department: object.department,
        location: object.location,
        email: object.email,
        imageURL: countryImageFinder(object),
        countryImage: `${object.location} image`
    };
    return employee;
}

// Gets the relevant URL for countries flag based on location returned from database
const countryImageFinder = (object) => {
    let location = object.location;
    let locationCode;
    let imageURL;
    switch (location) {
        case "London":
            locationCode = "GB";
            imageURL = `https://www.countryflags.io/${locationCode}/flat/32.png`;
            break;
        case "New York":
            locationCode = "US";
            imageURL = `https://www.countryflags.io/${locationCode}/flat/32.png`;
            break;
        case "Paris":
            locationCode = "FR";
            imageURL = `https://www.countryflags.io/${locationCode}/flat/32.png`;
            break;
        case "Munich":
            locationCode = "DE";
            imageURL = `https://www.countryflags.io/${locationCode}/flat/32.png`;
            break;
        case "Rome":
            locationCode = "IT";
            imageURL = `https://www.countryflags.io/${locationCode}/flat/32.png`;
            break;
        default:
            imageURL = "libs/images/image-not-found.png";
    }
    return imageURL;
}

const employeeCard = (object) => {

}

// Gets all employees from database and renders the handlebars template with them
const getAll = () => {
    $.ajax({
        url: "libs/php/getAll.php",
        type: "POST",
        datatype: "JSON",
        success: function (result) {
            let employeeList = result.data;
            console.log(result);
            let employees = [];
            for (i = 0; i < employeeList.length; i++) {
                let formattedEmployee = employeesFormatter(employeeList[i]);
                formattedEmployee.id = i;
                employees.push(formattedEmployee);
                console.log(formattedEmployee);
            }
            results = employees;
            //$('#employeeList').html(renderResults({ employees: employees }));
            //$('#employeeList').insertAdjacentHTML('beforeend', (renderResults({ employees: employees })));
            document.getElementById('employeeList').insertAdjacentHTML('beforeend', (renderResults({ employees: employees })));
        }, error: (err) => {
            console.log(err);
        }
    });
}

$(document).ready(function () {
    /*$.ajax({
        url: "libs/php/getAll.php",
        type: "POST",
        datatype: "JSON",
        success: function (result) {
            let employeeList = result.data;
            console.log(result);
            let employees = [];
            for (i = 0; i < employeeList.length; i++) {
                let formattedEmployee = employeesFormatter(employeeList[i]);
                employees.push(formattedEmployee);
            }
            $('#employeeList').html(renderResults({ employees: employees }));
        }, error: (err) => {
            console.log(err);
        }
    });*/
    getAll();
});

$('#team').on('click', '#viewButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let employee = results[id];
    $('#contactName').html(employee.name);
    $('#contactEmail').html(employee.email);
    $('#contactLocation').html(employee.location);
    $('#contactDepartment').html(employee.department);
    $('#contactCountryImage').attr('src', employee.imageURL);
    $('#contactCountryImage').attr('alt', employee.countryImage);
    $('#contactDisplayModal').modal();
});