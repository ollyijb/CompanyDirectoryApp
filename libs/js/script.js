// Handlebars compiler
let renderResults = Handlebars.compile($('#card-template').html());

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
                employees.push(formattedEmployee);
            }
            $('#employeeList').html(renderResults({ employees: employees }));
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