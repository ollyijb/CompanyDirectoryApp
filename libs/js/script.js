// Handlebars compilers
const renderEmployees = Handlebars.compile($('#employees-template').html());
const renderLocations = Handlebars.compile($('#locations-template').html());
const renderDepartments = Handlebars.compile($('#departments-template').html());

// Storing the results of getting All from the database
let results = [];
let locations = [];
let departments = [];

/******************************** AJAX GETS **********************************************/

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
            $('#handlebars').html(renderEmployees({ employees: employees }));
            //let people = uniqueEmployeePairs(results);
            //optionAdderWithID($('.employeesSelect'), people, 'fullName', 'fullName');
        }, error: (err) => {
            console.log(err);
        }
    });
}

// Gets all Departments & Fills documents Select Department boxes and adds checkboxes
const getDepartments = () => {
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "POST",
        datatype: "JSON",
        success: function (result) {
            let departmentInfo = result.data;
            departmentInfo.sort((a, b) => (a.name > b.name) ? 1 : -1);
            optionAdderWithID($('.departmentsSelect'), departmentInfo, 'name', 'name');
            departments = departmentInfo;
        },
        error: (err) => {
            console.log(err);
        }
    });
}

// Gets all Locations & Fills documents Select Location boxes and adds checkboxes
const getLocations = () => {
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "POST",
        datatype: "JSON",
        success: function (result) {
            let locationsInfo = result.data;
            locationsInfo.sort((a, b) => (a.name > b.name) ? 1 : -1);
            optionAdderWithID($('.locationsSelect'), locationsInfo, 'name', 'name');
            locations = locationsInfo;
        },
        error: (err) => {
            console.log(err);
        }
    });
}

// Gets the location from department ID & Sets relevant select options and inputs to it
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

// Hits the database from simple search box and renders results
const getAllContainingSearch = (searchTerm) => {
    $.ajax({
        url: "libs/php/getAllFromSearch.php",
        type: "POST",
        datatype: "JSON",
        data: {
            searchTerm: searchTerm
        },
        success: function (result) {
            console.log(result);
            if (result.data.length < 1) {
                $('#noResults').modal();
            }
            let employeeList = result.data;
            let employees = [];
            for (i = 0; i < employeeList.length; i++) {
                let formattedEmployee = employeesFormatter(employeeList[i]);
                employees.push(formattedEmployee);
            }
            results = employees;
            // Compiling results using handlebars
            $('#handlebars').html(renderEmployees({ employees: employees }));
        },
        error: (err) => {
            console.log(err);
        }
    });
}

/****************** AJAX CREATE ************************/

// Adds new Location to Database & Closes New Entry Modal
const addNewLocation = () => {
    let newItem = $('#locationNewInput').val();
    $.ajax({
        url: 'libs/php/addNewLocation.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            locationName: $('#locationNewInput').val()
        },
        success: function (result) {
            $('#successText').html(result.data);
            $('#successModal').modal();
            $('#newEntryModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    })
}

// Adds new Department to Database & Closes New Entry Modal
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
            $('#successText').html(result.data);
            $('#successModal').modal();
            $('#newEntryModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

// Adds new Employee to Database & Closes New Entry Modal
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
            $('#successText').html(result.data);
            $('#successModal').modal();
            $('#newEntryModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

/******************** AJAX DELETES ******************/
// Checks to see if there are any Dependants to protect Data from being deleted
const checkDepartmentDependants = (id) => {
    $.ajax({
        url: 'libs/php/checkDepartmentDependants.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: id
        },
        success: function (result) {
            if (result.status.code === "409") {
                $('#dependantsReason').html(`Can't delete as you have the following employees working there`);
                $('#noDelete').click();
                result.data.forEach(function (item) {
                    let name = item.firstName + " " + item.lastName;
                    $('#dependantsList').append('<li>' + name + '</li>');
                });
                $('#dependantsModal').modal();
                $('#deleteOfficeModal .btn-danger').click();
            } else {
                $('#deleteItemID').val(result.id);
                $('#deleteTrigger').val(`department`);
                $('#deleteItem').html(result.data);
                $('#deleteWarning').modal();
            }

        },
        error: (err) => {
            console.log(err);
        }
    });
}
// Deletes Department from an ID 
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
                $('#successText').html(`${result.data} deleted`);
                $('#noDelete').click();
                $('#successModal').modal();
                $('#deleteOfficeModal .btn-danger').click();
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

// Deletes Location from an ID if no dependants, alerts user if there are
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
                $('#successText').html(`${result.data} deleted`);
                $('#noDelete').click();
                $('#successModal').modal();
                $('#deleteOfficeModal .btn-danger').click();
            }
        },
        error: (err) => {
            console.log(err);
        }
    });
}

// Checks to see if there are any Dependants to protect Data from being deleted
const checkLocationDependants = (id) => {
    $.ajax({
        url: 'libs/php/checkLocationDependants.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: id
        },
        success: function (result) {
            if (result.status.code === "409") {
                $('#dependantsReason').html(`Can't delete as you have the following departments based there`);
                $('#noDelete').click();
                result.data.forEach(function (item) {

                    $('#dependantsList').append('<li>' + item.name + '</li>');
                });
                $('#dependantsModal').modal();
                $('#deleteOfficeModal .btn-danger').click();
            } else {
                $('#deleteItemID').val(result.id);
                $('#deleteTrigger').val(`location`);
                $('#deleteItem').html(result.data);
                $('#deleteWarning').modal();
            }

        },
        error: (err) => {
            console.log(err);
        }
    });
}

// Deletes Employee from Database
const deleteEmployee = (id) => {
    $.ajax({
        url: 'libs/php/deleteEmployee.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: id
        },
        success: function (result) {
            $('#successText').html(`${result.data.firstName} ${result.data.lastName} deleted`);
            $('#noDelete').click();
            $('#closeContactDelete').click();
            $('#successModal').modal();
            $('#contactDisplayModal .btn-danger closer').click();
            $('#deleteOfficeModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

/***************** AJAX UPDATES ********************************/

// Updates Location and closes Manage Modal
const updateLocation = () => {
    $.ajax({
        url: 'libs/php/updateLocation',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: $('#updateLocationID').val(),
            locationName: $('#updateLocationName').val()
        },
        success: function (result) {
            $('#successText').html(result.data);
            $('#successModal').modal();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

// Updates Department and closes Manage Modal
const updateDepartment = () => {
    $.ajax({
        url: 'libs/php/updateDepartment',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: $('#departmentID').val(),
            departmentName: $('#editDepartmentName').val(),
            locationID: $('#changeLocationSelect option:selected').val()
        },
        success: function (result) {
            $('#successText').html(result.data);
            $('#successModal').modal();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

// Updates Employee and closes Manage Modal
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
            $('#successText').html(result.data);
            $('#successModal').modal();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

/***************** FUNCTIONS *******************/

// Gets the relevant URL for countries flag based on location returned from database
const countryImageFinder = (object) => {
    let location = object;
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

const departmentsFormatter = (object) => {
    let department = {
        id: object.id,
        name: object.name,
        location: object.locationObj.name,
        locationID: object.locationID,
        imageURL: countryImageFinder(object.locationObj.name),
        countryImage: `${object.location} image`,
    };
    return department;
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
        imageURL: countryImageFinder(object.location),
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

// Helper function to clear arrays
const emptyArray = (array) => {
    array.length = 0;
}

// Finds an object in an array via id property
const idFinder = (array, id) => {
    let found = array.filter(obj => {
        return obj.id === id;

    });
    return found[0];
}

const locationsFormatter = (object) => {
    let location = {
        id: object.id,
        name: object.name,
        imageURL: countryImageFinder(object.name)
    }
    return location;
}

// Renders and opens the contact Display Modal
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

// Formats name given back from database
const nameFormatter = (object) => {
    let nameString = `${object.firstName} ${object.lastName}`;
    return nameString;
}

// Fills a Select from an array
const optionAdder = (select, array) => {
    array.forEach(function (item) {
        let option = document.createElement('option');
        option.innerHTML = item;
        option.value = item;
        select.append(option);
    });
}

// Fills a Select from an aray with the option value being an id, sets name and display too
const optionAdderWithID = (select, array, param, param2) => {
    array.forEach(function (item) {
        let option = document.createElement('option');
        option.innerHTML = item[param];
        option.value = item.id;
        option.name = item[param2];
        select.append(option);
    });
}

// Used to Fill locations from departments with classes .dependantInput, .dependantInputHidden
const renderInput = (object) => {
    $('.dependantInput').attr('value', object.location);
    $('.dependantInputHidden').attr('value', object.locationID);
}

// Sets which option a Select is showing
const setSelect = (object) => {
    document.getElementById("contactLocationSelect").value = object.locationID;
}

// Finds all the unique departments in an array
const uniqueDepartmentPairs = (array) => {
    let results = Array.from(new Set(array.map(s => s.departmentObj.department))).sort().map(department => {
        return {
            department: department,
            id: array.find(s => s.departmentObj.department === department).departmentObj.id
        };
    });
    return results;
}

// Finds all unique employees and matches their name with their id
const uniqueEmployeePairs = (array) => {
    let results = Array.from(new Set(array.map(s => s.fullName))).sort().map(fullName => {
        return {
            fullName: fullName,
            id: array.find(s => s.fullName === fullName).id
        };
    });
    return results;
}

// Sorts an array via property
const uniqueItemFinder = (array, property) => {
    let sortedArray = array.map(item => item[property]).filter((value, index, self) => self.indexOf(value) === index).sort();
    return sortedArray;
}

// Finds all the unique locations in an array
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
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    // scroll body to 0px on click
    $('#back-to-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 400);
        return false;
    });
    getAll();
    getDepartments();
    getLocations();
});

/************* JQuery helper Functions ***************/

// Allows the user to edit inputs
const formEditor = () => {
    $('#editModalForm').prop('disabled', false);
    $('#editModalForm :input').addClass('form-control').removeClass('form-control-plaintext');
    $('#saveEdits').prop('disabled', false);
}

// Denies the user ability to edit inputs
const formDisabler = () => {
    $('#editModalForm').prop('disabled', true);
    $('#editModalForm :input').addClass('form-control-plaintext').removeClass('form-control');
    $('#saveEdits').prop('disabled', true);
}

/******************** JQuery Events **********************/

/////////// Adding Buttons To The DOM & Firing Events /////////////////
// Adding View button from template to the DOM
$('#team').on('click', '#viewButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let employee = idFinder(results, id);
    modalGenerator(employee);
});

// Adding edit Location Button to the DOM
$('#team').on('click', '#editLocationButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let location = idFinder(locations, id);
    $('#updateLocationName').prop("placeholder", location.name);
    $('#updateLocationID').val(location.id);
    $('#manageLocationModal').modal();
});

// Adding edit Location Button to the DOM for small screen sizes
$('#team').on('click', '#editLocationButtonMobile', function () {
    let parents = $(this).parents();
    let parent = parents[1];
    let target = parent.children[0].id;
    let id = target.substring(1);
    let location = idFinder(locations, id);
    $('#updateLocationName').prop("placeholder", location.name);
    $('#updateLocationID').val(location.id);
    $('#manageLocationModal').modal();
});

// Adding delete location Button to the DOM for small screen sizes
$('#team').on('click', '#deleteLocationButtonMobile', function () {
    let parents = $(this).parents();
    let parent = parents[1];
    let target = parent.children[0].id;
    let id = target.substring(1);
    let location = idFinder(locations, id);
    checkLocationDependants(location.id);
});

// Adding delete location Button to the DOM
$('#team').on('click', '#deleteLocationButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let location = idFinder(locations, id);
    checkLocationDependants(location.id);
});

// Adding edit Department Button to the DOM
$('#team').on('click', '#editDepartmentButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let department = idFinder(departments, id);
    $('#editDepartmentName').val(department.name);
    $('#departmentID').val(department.id);
    document.getElementById('changeLocationSelect').value = department.locationID;
    $('#manageDepartmentModal').modal();
});

// Adding edit Department Button to the DOM for small screen sizes
$('#team').on('click', '#editDepartmentButtonMobile', function () {
    let parents = $(this).parents();
    let parent = parents[1];
    let target = parent.children[0].id;
    let id = target.substring(1);
    let department = idFinder(departments, id);
    $('#editDepartmentName').val(department.name);
    $('#departmentID').val(department.id);
    document.getElementById('changeLocationSelect').value = department.locationID;
    $('#manageDepartmentModal').modal();
});

// Adding Delete Department Button to the DOM 
$('#team').on('click', '#deleteDepartmentButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let department = idFinder(departments, id);
    checkDepartmentDependants(department.id);
});

// Adding Delete Department Button to the DOM for small screen sizes
$('#team').on('click', '#deleteDepartmentButtonMobile', function () {
    let parents = $(this).parents();
    let parent = parents[1];
    let target = parent.children[0].id;
    let id = target.substring(1);
    let department = idFinder(departments, id);
    checkDepartmentDependants(department.id);
});

// Adding View button from template to the DOM for Mobile Cards
$('#team').on('click', '#viewButtonMobile', function () {
    let siblings = $(this).siblings();
    let siblingID = siblings[0].id;
    let id = siblingID.substring(1);
    let employee = idFinder(results, id);
    modalGenerator(employee);
});

// Adding edit button from template to the DOM
$('#team').on('click', '#editButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let employee = idFinder(results, id);
    modalGenerator(employee);
    formEditor();
});

// Adding delete button from template to the DOM
$('#team').on('click', '#deleteButton', function () {
    let parents = $(this).parents();
    let topLevel = parents[5];
    let id = topLevel.id;
    let employee = idFinder(results, id);
    $('#deleteContactItem').html(employee.fullName);
    $('#deleteContactId').val(employee.id);
    $('#contactDeleteWarning').modal();
});

// Unlocks the form so it can be edited by the user
$('#editButtonModal').click(function () {
    formEditor();
});

/****************** Nav Buttons *************************/
// Renders the locations handlebars template
$('#locationButton').click(function () {
    formattedLocations = [];
    locations.forEach(function (item) {
        formattedLocations.push(locationsFormatter(item));
    });
    locations = formattedLocations;
    $('#handlebars').html(renderLocations({ locations: locations }));
    $('#title').html('LOCATIONS');
});

// Renders Department Handlebars template
$('#departmentButton').click(function () {
    let formattedDepartments = [];
    departments.forEach(function (item) {
        let locateObj = idFinder(locations, item.locationID);
        item.locationObj = {
            id: locateObj.id,
            name: locateObj.name
        };
        formattedDepartments.push(departmentsFormatter(item))
    });
    departments = formattedDepartments;
    $('#handlebars').html(renderDepartments({ departments: departments }));
    $('#title').html('DEPARTMENTS');
});

// Renders the Employee Handlebars template
$('#employeeButton').click(function () {
    let searchTerm = "";
    $('#simpleSearch').val(null);
    //$('#handlebars').html(renderEmployees({ employees: employees }));
    $('#title').html('TEAM');
    getAll();
});

// Opens New Modal when add new button is clicked
$('#addNewButton').click(function () {
    if ($('#title').html() === 'TEAM') {
        $('#newEmployeeModal').modal();
    } else if ($('#title').html() === 'LOCATIONS') {
        $('#newLocationModal').modal();
    } else if ($('#title').html() === 'DEPARTMENTS') {
        $('#newDepartmentModal').modal();
    }
});

//////////////////////////////////// Delete Modals ////////////////////////////////////
// Deletes either department or location depending on deleteTrigger value from delete Modal
$('#fireDelete').click(function () {
    if ($('#deleteTrigger').val() === 'location') {
        deleteLocation($('#deleteItemID').val());
    } else if ($('#deleteTrigger').val() === 'department') {
        deleteDepartment($('#deleteItemID').val());
    }
});

// Deletes the employee
$('#fireContactDelete').click(function () {
    deleteEmployee($('#deleteContactId').val());
});

// Brings up delete warning modal from delete Modal button
$('#deleteButtonModal').click(function () {
    $('#deleteContactItem').html($('#fullName').val());
    $('#deleteContactId').val($('#employeeId').val());
    $('#contactDeleteWarning').modal();
});

// If user says don't delete on warning screen it closes
$('#noDelete').click(function () {
    $('#deleteWarning').modal('hide');
});

//////////////////////// Update Modals //////////////////////////////////////

// Unblocks Department edit Form
$('#editDepartmentNameButton').click(function () {
    $('#editDepartmentName').prop('disabled', false);
    $('#changeLocationSelect').prop('disabled', false);
    $('#updateDepartmentSubmitButton').prop('disabled', false);
});

// Updates the database with user changes to employee
$('#saveEdits').click(function () {
    updateEmployee();
});

// On keyup allows the submission button
$('#updateLocationName').keyup(function () {
    $('#updateLocationSubmitButton').prop('disabled', false);
});

// Updates the Location
$('#updateLocationSubmitButton').click(function () {
    updateLocation();
    $('#updateLocationClose').click();
});

// Updates the Department
$('#updateDepartmentSubmitButton').click(function () {
    updateDepartment();
    $('#updateDepartmentClose').click();
});

///////// New Item Modal //////////////

// Handles how user can enter New Location Form
$('#locationNewInput').keyup(function () {
    $('#newLocationSubmitButton').prop('disabled', false);
});

// Handles how user can enter New Department Form
$('#departmentNewInput').keyup(function () {
    $('#newLocationSelect').prop('disabled', false);
    $('#newLocationSelect').change(function () {
        $('#newDepartmentSubmitButton').prop('disabled', false);
    });
});

// Handles how user can enter New Employee Form
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

// when department selected gets the location 
$('#newContactDepartmentSelect').change(function () {
    let id = $('#newContactDepartmentSelect option:selected').val();
    getLocationFromDepartmentID(id);
});

// when department selected gets the location 
$('#contactDepartmentSelect').change(function () {
    let id = $('#contactDepartmentSelect option:selected').val();
    getLocationFromDepartmentID(id);
});

// Adds new Employee
$('#newSubmitButton').click(function () {
    addNewEmployee();
    $('#closeNewEmployee').click();
});

// Adds new Department
$('#newDepartmentSubmitButton').click(function () {
    addNewDepartment();
    $('#closeNewDepartment').click();
});

// Adds new Location
$('#newLocationSubmitButton').click(function () {
    addNewLocation();
    $('#closeNewLocation').click();
});

/////////////////////// Simple Search ////////////////////////////////////////////////
// Fires get all containg value in search box on click
$('#simpleSearchButton').click(function () {
    let searchTerm = $('#simpleSearch').val();
    getAllContainingSearch(searchTerm);
});

// Fires get all containg value in search box on enter key
$('#simpleSearch').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        $('#simpleSearchButton').click();
    }
});

/////////////////////// Events accross multiple Modals ///////////////////////////////

// Used to render a location once a department is selected
$('.dependantSelect').change(function () {
    let id = $('.dependantSelect option:selected').val();
    getLocationFromDepartmentID(id);
});

/////////////////////////////// Modal Close Events ////////////////////////////////////
// Reloads page when contact Display Modal is closed
$('#contactDisplayModal').on('hide.bs.modal', function () {
    document.location.reload();
    //getAll();
});

// Reloads page when success modal closes and anything in the database has been changed
$('#successModal').on('hide.bs.modal', function () {
    document.location.reload();
});

// Reloads page when no results from simple search modal closes
$('#noResults').on('hide.bs.modal', function () {
    document.location.reload();
});

// Clears and resets the manage department modal
$('#manageDepartmentModal').on('hide.bs.modal', function () {
    $('#manageDepartmentModal input.inputClear').val(null).prop('disabled', true);
    $('#manageDepartmentModal select').prop('disabled', true);
    $('#updateDepartmentSubmitButton').prop('disabled', true);
});

// Clears and resets the manage location modal
$('#manageLocationModal').on('hide.bs.modal', function () {
    $('#manageLocationModal input.inputClear').val(null);
    $('#updateLocationSubmitButton').prop('disabled', true);
});

// Clears and resets the new item modals
$('.newModal').on('hide.bs.modal', function () {
    $('.newModal input.inputClear').val(null);
    $('.newModal .btn-primary').prop('disabled', true);
    $('.newModal input.disable').prop('disabled', true);
    $('.newModal select.disable').prop('disabled', true);
    $('.newModal select.selectBeginning').prop('selectedIndex', 0);
    $('.newModal input.dependantInput').attr('value', "");
});

$('#dependantsModal').on('hide.bs.modal', function () {
    $('#dependantsList').empty();
});
