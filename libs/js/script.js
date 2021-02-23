// Handlebars compiler
let renderResults = Handlebars.compile($('#card-template').html());

// Storing the results of getting All from the database
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
        firstName: object.firstName,
        lastName: object.lastName,
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
// Also sets the id to the index number of the results array of JSON employees
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

/************* JQuery helper Functions ***************/
const modalGenerator = (object) => {
    $('#fullName').attr('value', object.name);
    $('#firstName').attr('value', object.firstName);
    $('#lastName').attr('value', object.lastName);
    $('#contactEmail').attr('value', object.email);
    $('#contactDepartment').attr('value', object.department);
    $('#contactLocation').attr('value', object.location);
    $('#contactDisplayModal').modal();
}

const formEditor = () => {
    $('#editModalForm').prop('disabled', false);
    $('#editModalForm :input').addClass('form-control').removeClass('form-control-plaintext');
    $('#saveEdits').prop('disabled', false);
}

const formDisabler = () => {
    $('#editModalForm').prop('disabled', true);
    $('#editModalForm :input').addClass('form-control-plaintext').removeClass('form-control');
    $('#saveEdits').prop('disabled', true);
}

/******************** JQuery Events **********************/
$('#team').on('click', '#viewButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let employee = results[id];
    modalGenerator(employee);
});

$('#team').on('click', '#editButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let employee = results[id];
    modalGenerator(employee);
    formEditor();

});

$('#deleteOfficeButton').click(function () {
    let locations = results.map(item => item.location).filter((value, index, self) => self.indexOf(value) === index).sort();
    console.log(locations);
    let select = $('#branches');
    locations.forEach(function (item) {
        let option = document.createElement('option');
        option.innerHTML = item;
        option.value = item;
        select.append(option);
    });
    let departments = results.map(item => item.department).filter((value, index, self) => self.indexOf(value) === index).sort();
    let select2 = $('#departments');
    departments.forEach(function (item) {
        let option = document.createElement('option');
        option.innerHTML = item;
        option.value = item;
        select2.append(option);
    });
    let people = results.map(item => item.name).filter((value, index, self) => self.indexOf(value) === index).sort();
    let select3 = $('#employeeSelect');
    people.forEach(function (item) {
        let option = document.createElement('option');
        option.innerHTML = item;
        option.value = item;
        select3.append(option);
    });
    $('#deleteOfficeModal').modal();
});

$('#branch').click(function () {
    $('#branches').prop('disabled', false);
    $('#branches').focus();
    $('#branches').addClass('focusedInput');
    $('#departments').prop('disabled', true);
    $('#departments').removeClass('focusedInput').prop('selectedIndex', 0);;
    $('#employeeSelect').prop('disabled', true);
    $('#employeeSelect').removeClass('focusedInput').prop('selectedIndex', 0);
    $('#submitDelete').prop('disabled', true);
});

$('#department').click(function () {
    $('#departments').prop('disabled', false);
    $('#departments').focus();
    $('#departments').addClass('focusedInput');
    $('#branches').prop('disabled', true);
    $('#branches').removeClass('focusedInput').prop('selectedIndex', 0);;
    $('#employeeSelect').prop('disabled', true);
    $('#employeeSelect').removeClass('focusedInput').prop('selectedIndex', 0);
    $('#submitDelete').prop('disabled', true);
});

$('#person').click(function () {
    $('#employeeSelect').prop('disabled', false);
    $('#employeeSelect').focus();
    $('#employeeSelect').addClass('focusedInput');
    $('#branches').prop('disabled', true);
    $('#branches').removeClass('focusedInput').prop('selectedIndex', 0);
    $('#departments').prop('disabled', true);
    $('#departments').removeClass('focusedInput').prop('selectedIndex', 0);
    $('#submitDelete').prop('disabled', true);
});

$('#deleteOfficeModalForm select').on('change', function () {
    if ($('#deleteOfficeModalForm select.focusedInput').val() !== 'Choose...') {
        $('#submitDelete').prop('disabled', false);
    } else {
        $('#submitDelete').prop('disabled', true);
    }
});

$('#editButtonModal').click(function () {
    formEditor();
});

$('.modal').on('hide.bs.modal', function () {
    formDisabler();
    $('.modal-body').scrollTop(0);
    deleteFormResetter();
});

const deleteFormResetter = () => {
    $('#deleteOfficeModalForm :input[type=radio]').prop('checked', false);
    $('#deleteOfficeModalForm .focusedInput').prop('disabled', true);
    $('#deleteOfficeModalForm .focusedInput').prop('selectedIndex', 0);
}