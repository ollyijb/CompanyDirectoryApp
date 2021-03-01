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
        id: object.id,
        fullName: nameFormatter(object),
        firstName: object.firstName,
        lastName: object.lastName,
        departmentId: object.departmentID,
        department: object.department,
        locationId: object.locationID,
        location: object.location,
        email: object.email,
        imageURL: countryImageFinder(object),
        countryImage: `${object.location} image`,
        locationObj: {
            id: object.locationID,
            location: object.location
        },
        departmentObj: {
            id: object.departmentID,
            department: object.department
        }
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
    //emptyArray(results);
    $.ajax({
        url: "libs/php/getAll.php",
        type: "POST",
        datatype: "JSON",
        success: function (result) {
            let employeeList = result.data;
            //console.log(result);
            let employees = [];
            for (i = 0; i < employeeList.length; i++) {
                let formattedEmployee = employeesFormatter(employeeList[i]);
                //formattedEmployee.id = i;
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
    //$('#deletesButton').click(function () {
    //console.log('I exist');
    //});

});

/************* JQuery helper Functions ***************/
const modalGenerator = (object) => {
    $('#employeeId').attr('value', object.id);
    $('#fullName').attr('value', object.fullName);
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
    let employee = idFinder(results, id);
    modalGenerator(employee);
});

$('#team').on('click', '#editButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let employee = idFinder(results, id);
    /* let locations = Array.from(new Set(results.map(s => s.locationObj.location))).sort().map(location => {
         return {
             location: location,
             id: results.find(s => s.locationObj.location === location).locationObj.id
         };
     });*/
    //let departments = uniqueDepartmentPairs(results);
    //optionAdderWithID($('.locationSelect'), departments, 'department');
    modalGenerator(employee);
    formEditor();

});

const uniqueLocationPairs = (array) => {
    let results = Array.from(new Set(array.map(s => s.locationObj.location))).sort().map(location => {
        return {
            location: location,
            id: array.find(s => s.locationObj.location === location).locationObj.id
        };
    });
    return results;
}

const uniqueDepartmentPairs = (array) => {
    let results = Array.from(new Set(array.map(s => s.departmentObj.department))).sort().map(department => {
        return {
            department: department,
            id: array.find(s => s.departmentObj.department === department).departmentObj.id
        };
    });
    return results;
}

$('#deleteOfficeButton').click(function () {
    //getAll();
    //console.log(results);
    let locations = uniqueItemFinder(results, "location");
    //let locations = results.map(item => item.location).filter((value, index, self) => self.indexOf(value) === index).sort();
    //console.log(locations);
    let select = $('#branches');
    optionAdder(select, locations);
    let departments = uniqueItemFinder(results, 'department');
    //let departments = results.map(item => item.department).filter((value, index, self) => self.indexOf(value) === index).sort();
    let select2 = $('#departments');
    optionAdder(select2, departments);
    let people = uniqueItemFinder(results, 'fullName');
    //let people = results.map(item => item.fullName).filter((value, index, self) => self.indexOf(value) === index).sort();
    let select3 = $('#employeeSelect');
    optionAdder(select3, people);
    $('#deleteOfficeModal').modal();
});

const optionAdderWithID = (select, array, param) => {
    array.forEach(function (item) {
        let option = document.createElement('option');
        option.innerHTML = item[param];
        option.value = item.id;
        select.append(option);
    });
}

const optionAdder = (select, array) => {
    array.forEach(function (item) {
        let option = document.createElement('option');
        option.innerHTML = item;
        option.value = item;
        select.append(option);
    });
}

const uniqueItemFinder = (array, property) => {
    let sortedArray = array.map(item => item[property]).filter((value, index, self) => self.indexOf(value) === index).sort();
    return sortedArray;
}

const emptyArray = (array) => {
    array.length = 0;
}

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

const idFinder = (array, id) => {
    let found = array.filter(obj => {
        return obj.id === id;

    });
    //console.log(found);
    return found[0];
}

/*$('#saveEdits').click(function () {
    console.log($('#formTest'));
    $.ajax({
        type: 'POST',
        url: "libs/php/test.php",
        data: $('#formTest').serialize(),
        success: function (res) {
            console.log(res);
            alert('sent');
            $('.modal').modal('hide');
        },
        error: function (err) {
            alert(err);
        }
    });

});*/