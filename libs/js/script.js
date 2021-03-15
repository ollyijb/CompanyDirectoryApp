// Handlebars compiler
let renderResults = Handlebars.compile($('#card-template').html());

// Storing the results of getting All from the database
let results = [];
let locations = [];
let departments = [];

// Formats name given back from database
const nameFormatter = (object) => {
    let nameString = `${object.firstName} ${object.lastName}`;
    return nameString;
}

/***************** AJAX GETS ***********************/
// Gets all employees from database and renders the handlebars template with them
// Also sets the id to the index number of the results array of JSON employees
const getAll = () => {
    $.ajax({
        url: "libs/php/getAll.php",
        type: "POST",
        datatype: "JSON",
        success: function (result) {
            let employeeList = result.data;
            let employees = [];
            for (i = 0; i < employeeList.length; i++) {
                let formattedEmployee = employeesFormatter(employeeList[i]);
                employees.push(formattedEmployee);
            }
            results = employees;
            document.getElementById('employeeList').insertAdjacentHTML('beforeend', (renderResults({ employees: employees })));
            let people = uniqueEmployeePairs(results);
            optionAdderWithID($('.employeesSelect'), people, 'fullName', 'fullName');
        }, error: (err) => {
            console.log(err);
        }
    });
}
const getDepartments = () => {
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "POST",
        datatype: "JSON",
        success: function (result) {
            let departmentInfo = result.data;
            departmentInfo.sort((a, b) => (a.name > b.name) ? 1 : -1);
            optionAdderWithID($('.departmentsSelect'), departmentInfo, 'name', 'name');
            checkboxAdderWithID($('#departmentCheckboxes'), departmentInfo, 'name', 'department');
            departments = departmentInfo;
        },
        error: (err) => {
            console.log(err);
        }
    });
}

const getLocations = () => {
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "POST",
        datatype: "JSON",
        success: function (result) {
            let locationsInfo = result.data;
            locationsInfo.sort((a, b) => (a.name > b.name) ? 1 : -1);
            optionAdderWithID($('.locationsSelect'), locationsInfo, 'name', 'name');
            checkboxAdderWithID($('#locationCheckboxes'), locationsInfo, 'name', 'location');
            locations = locationsInfo;
        },
        error: (err) => {
            console.log(err);
        }
    });
}

const getLocationFromDepartmentID = (departmentID) => {
    $.ajax({
        url: "libs/php/getLocationFromDepartmentID.php",
        type: "POST",
        datatype: "JSON",
        data: {
            id: departmentID
        },
        success: function (result) {
            let locationObj = result.data[0];
            renderInput(locationObj);
            setSelect(locationObj);
        },
        error: (err) => {
            console.log(err)
        }
    })
}
const getAllContainingSearch = (searchTerm) => {
    $.ajax({
        url: "libs/php/getAllFromSearch.php",
        type: "POST",
        datatype: "JSON",
        data: {
            searchTerm: searchTerm
        },
        success: function (result) {
            let employeeList = result.data;
            let employees = [];
            for (i = 0; i < employeeList.length; i++) {
                let formattedEmployee = employeesFormatter(employeeList[i]);
                employees.push(formattedEmployee);
            }
            $('#employeeList').empty();
            results = employees;
            document.getElementById('employeeList').insertAdjacentHTML('beforeend', (renderResults({ employees: employees })));
        },
        error: (err) => {
            console.log(err);
        }
    });
}

/****************** AJAX CREATE ************************/

const addNewLocation = () => {
    $.ajax({
        url: 'libs/php/addNewLocation.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            locationName: $('#locationNewInput').val()
        },
        success: function (result) {
            alert('New Location Added');
            $('#newEntryModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    })
}

const addNewDepartment = () => {
    $.ajax({
        url: 'libs/php/addNewDepartment.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            departmentName: $('#departmentNewInput').val(),
            locationID: $('#newLocationSelect option:selected').val()
        },
        success: function (result) {
            alert(`New Department Added`);
            $('#newEntryModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

const addNewEmployee = () => {
    $.ajax({
        url: 'libs/php/addNewEmployee.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            firstName: $('#newFirstName').val(),
            lastName: $('#newLastName').val(),
            email: $('#newContactEmail').val(),
            departmentID: $('#newContactDepartmentSelect').val(),
            department: $('#newContactDepartmentSelect option:selected').html(),
            location: $('#newContactLocation').val(),
            locationID: $('#newContactLocationID').val()
        },
        success: function (result) {
            alert(`New Employee Added`)
            $('#newEntryModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

/******************** AJAX DELETES ******************/

const deleteDepartment = (id) => {
    $.ajax({
        url: 'libs/php/deleteDepartment.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: id
        },
        success: function (result) {
            if (result.status.code === "200") {
                alert('Department Deleted');
                $('#deleteOfficeModal .btn-danger').click();
            } else {
                alert('Employees still work in this department. Please move them before deleting this department');
                $('#deleteOfficeModal .btn-danger').click();
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

const deleteLocation = (id) => {
    $.ajax({
        url: 'libs/php/deleteLocation.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: id
        },
        success: function (result) {
            if (result.status.code === "200") {
                alert('Location Deleted');
                $('#deleteOfficeModal .btn-danger').click();
            } else {
                alert('This Location still has Departments assigned to it. Please move them before deleting this location');
                $('#deleteOfficeModal .btn-danger').click();
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

const deleteEmployee = (id) => {
    $.ajax({
        url: 'libs/php/deleteEmployee.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: id
        },
        success: function (result) {
            alert('employee deleted');
            $('#contactDisplayModal .btn-danger').click();
            $('#deleteOfficeModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

/***************** AJAX UPDATES ********************************/

const updateLocation = () => {
    $.ajax({
        url: 'libs/php/updateLocation',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: $('#manageLocationSelect option:selected').val(),
            locationName: $('#updateLocationName').val()
        },
        success: function (result) {
            $('#manageModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

const updateDepartment = () => {
    $.ajax({
        url: 'libs/php/updateDepartment',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: $('#manageDepartmentSelect option:selected').val(),
            departmentName: $('#editDepartmentName').val(),
            originalName: $('#manageDepartmentSelect option:selected').html(),
            locationID: $('#changeLocationSelect option:selected').val()
        },
        success: function (result) {
            $('#manageModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

const updateEmployee = () => {
    $.ajax({
        url: 'libs/php/updateEmployee.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: $('#employeeId').val(),
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#contactEmail').val(),
            departmentID: $('#contactDepartmentSelect option:selected').val()
        },
        success: function (result) {
            $('#contactDisplayModal .btn-danger').click();
            $('#manageModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

/***************** FUNCTIONS *******************/
// Adds checkboxes to the DOM with ID values, used in advanced searh Modal
const checkboxAdderWithID = (container, array, param, nameParam) => {
    array.forEach(function (item) {
        let newDiv = $(document.createElement('div')).prop({
            class: "form-check"
        });
        container.append(newDiv);
        newDiv.append(
            $(document.createElement('input')).prop({
                id: nameParam + "ID " + item.id,
                name: nameParam,
                value: item.id,
                type: "checkbox",
                class: "form-check-input generate-check"
            })
        ).append(
            $(document.createElement('label')).prop({
                for: nameParam,
                class: "form-check-label generate-check"
            }).html(item[param])
        )
    })
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

const emptyArray = (array) => {
    array.length = 0;
}

const idFinder = (array, id) => {
    let found = array.filter(obj => {
        return obj.id === id;

    });
    return found[0];
}

const modalGenerator = (object) => {
    $('#employeeId').attr('value', object.id);
    $('#fullName').attr('value', object.fullName);
    $('#firstName').attr('value', object.firstName);
    $('#lastName').attr('value', object.lastName);
    $('#contactEmail').attr('value', object.email);
    document.getElementById("contactDepartmentSelect").value = object.departmentObj.id;
    document.getElementById("contactLocationSelect").value = object.locationObj.id;
    $('#contactDisplayModal').modal();
}

const optionAdder = (select, array) => {
    array.forEach(function (item) {
        let option = document.createElement('option');
        option.innerHTML = item;
        option.value = item;
        select.append(option);
    });
}

const optionAdderWithID = (select, array, param, param2) => {
    array.forEach(function (item) {
        let option = document.createElement('option');
        option.innerHTML = item[param];
        option.value = item.id;
        option.name = item[param2];
        select.append(option);
    });
}

const renderInput = (object) => {
    $('.dependantInput').attr('value', object.location);
    $('.dependantInputHidden').attr('value', object.locationID);
}

const setSelect = (object) => {
    document.getElementById("contactLocationSelect").value = object.locationID;
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

const uniqueEmployeePairs = (array) => {
    let results = Array.from(new Set(array.map(s => s.fullName))).sort().map(fullName => {
        return {
            fullName: fullName,
            id: array.find(s => s.fullName === fullName).id
        };
    });
    return results;
}

const uniqueItemFinder = (array, property) => {
    let sortedArray = array.map(item => item[property]).filter((value, index, self) => self.indexOf(value) === index).sort();
    return sortedArray;
}

const uniqueLocationPairs = (array) => {
    let results = Array.from(new Set(array.map(s => s.locationObj.location))).sort().map(location => {
        return {
            location: location,
            id: array.find(s => s.locationObj.location === location).locationObj.id
        };
    });
    return results;
}

/*************** Document Ready Run  ***********************/
$(document).ready(function () {
    getAll();
    getDepartments();
    getLocations();
});

/************* JQuery helper Functions ***************/
const checkboxFormResetter = () => {
    $('.resetChecks :input[type=radio]').prop('checked', false);
    $('.resetChecks .focusedInput').prop('disabled', true);
    $('.resetChecks .focusedInput').prop('selectedIndex', 0);
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
    modalGenerator(employee);
    formEditor();
});

$('#team').on('click', '#deleteButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let employee = idFinder(results, id);
    //$('#warningFullName').html(employee.fullName);
    //$('#deleteWarning').alert();
});

$('#deleteOfficeButton').click(function () {
    $('#deleteOfficeModal').modal();
});

$('#advancedSearchButton').click(function () {
    $('#advancedSearchModal').modal();
});

$('#manageOfficeButton').click(function () {
    $('#manageModal').modal();
});

$('#addNewButton').click(function () {
    $('#newEntryModal').modal();
});

$('.locationCheck').click(function () {
    $('.locations').prop('disabled', false);
    $('.locations').focus();
    $('.locations').addClass('focusedInput');
    $('.departments').prop('disabled', true);
    $('.departments').removeClass('focusedInput').prop('selectedIndex', 0);;
    $('.employees').prop('disabled', true);
    $('.employees').removeClass('focusedInput').prop('selectedIndex', 0);
    $('.submitButton').prop('disabled', true);
});

$('.departmentCheck').click(function () {
    $('.departments').prop('disabled', false);
    $('.departments').focus();
    $('.departments').addClass('focusedInput');
    $('.locations').prop('disabled', true);
    $('.locations').removeClass('focusedInput').prop('selectedIndex', 0);;
    $('.employees').prop('disabled', true);
    $('.employees').removeClass('focusedInput').prop('selectedIndex', 0);
    $('.submitButton').prop('disabled', true);
});

$('.personCheck').click(function () {
    $('.employees').prop('disabled', false);
    $('.employees').focus();
    $('.employees').addClass('focusedInput');
    $('.locations').prop('disabled', true);
    $('.locations').removeClass('focusedInput').prop('selectedIndex', 0);
    $('.departments').prop('disabled', true);
    $('.departments').removeClass('focusedInput').prop('selectedIndex', 0);
    $('.submitButton').prop('disabled', true);
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
    checkboxFormResetter();
    results.splice(0, results.length);
    departments.splice(0, departments.length);
    locations.splice(0, locations.length);
    $('#newContactLocation').attr('value', '');
    $('select option:not(.first)').remove();
    $('#employeeList').empty();
    $('.generate-check').remove();
    $('#simpleSearch').val(null);
    $('#departmentCheckboxes').empty();
    $(document).scrollTop(0);
    getAll();
    getDepartments();
    getLocations();
});

$('#contactDisplayModal').on('hidden.bs.modal', function () {
    if ($('#manageModal').hasClass('show')) {
        $('#dismissButton').click();
    }
    $('.generate-check').remove();
});

$('#newContactDepartmentSelect').change(function () {
    let id = $('#newContactDepartmentSelect option:selected').val();
    getLocationFromDepartmentID(id);
});

$('#contactDepartmentSelect').change(function () {
    let id = $('#contactDepartmentSelect option:selected').val();
    getLocationFromDepartmentID(id);
});

$('.dependantSelect').change(function () {
    let id = $('.dependantSelect option:selected').val();
    getLocationFromDepartmentID(id);
})

$('#manageEmployeeSelect').change(function () {
    let employeeId = $('#manageEmployeeSelect option:selected').val();
    let employee = idFinder(results, employeeId);
    modalGenerator(employee);
    formEditor();
});

$('#manageLocationSelect').change(function () {
    $('#updateLocationName').prop('disabled', false).focus();
    $('#updateLocationName').keyup(function () {
        $('#manageSubmitButton').prop('disabled', false);
    });
});

$('#manageDepartmentSelect').change(function () {
    $('#editDepartmentName').prop('disabled', false);
    $('#changeLocationSelect').prop('disabled', false).focus();
    $('#changeLocationSelect').change(function () {
        $('#manageSubmitButton').prop('disabled', false);
    });
});

$('#manageModal .form-check-input').click(function () {
    $('#manageSubmitButton').prop('disabled', true);
});

$('#manageModal .form-check-input').click(function () {
    $('#manageSubmitButton').prop('disabled', true);
});

$('#locationNewInput').keyup(function () {
    $('#newSubmitButton').prop('disabled', false);
});

$('#newEntryModal .form-check-input').click(function () {
    $('#newSubmitButton').prop('disabled', true);
    $('#newEntryModal input.inputClear').val(null);
    $('#newEntryModal select.selectBeginning').prop('selectedIndex', 0);
    $('#newEntryModal input.dependantInput').trigger(':reset');
});

$('#departmentNewInput').keyup(function () {
    $('#newLocationSelect').prop('disabled', false);
    $('#newLocationSelect').change(function () {
        $('#newSubmitButton').prop('disabled', false);
    });
});

$('#newFirstName').keyup(function () {
    $('#newLastName').prop('disabled', false);
    $('#newLastName').keyup(function () {
        $('#newContactEmail').prop('disabled', false);
        $('#newContactEmail').keyup(function () {
            $('#newContactDepartmentSelect').prop('disabled', false);
            $('#newContactDepartmentSelect').change(function () {
                $('#newSubmitButton').prop('disabled', false);
            });
        });
    });
});

$('#simpleSearchButton').click(function () {
    let searchTerm = $('#simpleSearch').val();
    getAllContainingSearch(searchTerm);
});

$('#newSubmitButton').click(function () {
    if ($('#personNew').prop("checked")) {
        addNewEmployee();
    } else if ($('#departmentNew').prop("checked")) {
        addNewDepartment();
    } else if ($('#locationNew').prop("checked")) {
        addNewLocation();
    }
});

$('#manageSubmitButton').click(function () {
    if ($('#manageLocation').prop("checked")) {
        updateLocation();
    } else if ($('#manageDepartment').prop("checked")) {
        updateDepartment();
    }
});

$('#saveEdits').click(function () {
    updateEmployee();
});

$('#deleteButtonModal').click(function () {
    deleteEmployee($('#employeeId').val());
});

$('#submitDelete').click(function () {
    if ($('#person').prop("checked")) {
        deleteEmployee($('#employeeSelect option:selected').val());
    } else if ($('#department').prop("checked")) {
        deleteDepartment($('#departments option:selected').val());
    } else if ($('#deleteLocation').prop("checked")) {
        deleteLocation($('#branches option:selected').val());
    }
});
