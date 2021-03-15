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
            //sresults.splice(0, results.length);
            let employeeList = result.data;
            //console.log(result);
            let employees = [];
            for (i = 0; i < employeeList.length; i++) {
                let formattedEmployee = employeesFormatter(employeeList[i]);
                //formattedEmployee.id = i;
                employees.push(formattedEmployee);
                //console.log(formattedEmployee);
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
            //console.log(result);
            alert(`New Employee Added`)
            $('#newEntryModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
}

const deleteDepartment = (id) => {
    $.ajax({
        url: 'libs/php/deleteDepartment.php',
        type: 'POST',
        datatype: 'JSON',
        data: {
            id: id
        },
        success: function (result) {
            console.log(result);
            if (result.status.code === "200") {
                alert('Department Deleted');
                $('#deleteOfficeModal .btn-danger').click();
            } else {
                /*let dependants = [];
                result.data.forEach(function (item) {
                    let fullName = `${item.firstName} ${item.lastName}`;
                    alert(fullName);
                    dependants.push(fullName);
                });
                let alertText = [];
                for (i = 0; i < dependants.length; i++) {
                    alertText.push(dependants[i] + "\r\n");
                }
                alert(alertText);*/
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
            console.log(result);
            if (result.status.code === "200") {
                alert('Location Deleted');
                $('#deleteOfficeModal .btn-danger').click();
            } else {
                /*let dependants = [];
                result.data.forEach(function (item) {
                    let fullName = `${item.firstName} ${item.lastName}`;
                    alert(fullName);
                    dependants.push(fullName);
                });
                let alertText = [];
                for (i = 0; i < dependants.length; i++) {
                    alertText.push(dependants[i] + "\r\n");
                }
                alert(alertText);*/
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
            console.log(result);
            alert('employee deleted');
            $('#contactDisplayModal .btn-danger').click();
            $('#deleteOfficeModal .btn-danger').click();
        },
        error: (err) => {
            console.log(err);
        }
    });
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

const getDepartments = () => {
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "POST",
        datatype: "JSON",
        success: function (result) {
            let departmentInfo = result.data;
            //departments.push(departmentInfo);
            //console.log(departmentInfo);
            departmentInfo.sort((a, b) => (a.name > b.name) ? 1 : -1);
            optionAdderWithID($('.departmentsSelect'), departmentInfo, 'name', 'name');
            checkboxAdderWithID($('#departmentCheckboxes'), departmentInfo, 'name', 'department');
            departments = departmentInfo;
            //console.log(departments);
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
            //let locations = uniqueLocationPairs(results);
            //console.log(locationsInfo);
            locationsInfo.sort((a, b) => (a.name > b.name) ? 1 : -1);
            //console.log(locationsInfo);
            optionAdderWithID($('.locationsSelect'), locationsInfo, 'name', 'name');
            checkboxAdderWithID($('#locationCheckboxes'), locationsInfo, 'name', 'location');
            locations = locationsInfo;
            //console.log(locations);
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
            //console.log(result);
            let locationObj = result.data[0];
            //console.log(locationObj);
            //$('.dependantInput').attr('value', locationObj.location);
            renderInput(locationObj);
            setSelect(locationObj);
        },
        error: (err) => {
            console.log(err)
        }
    })
}

const renderInput = (object) => {
    $('.dependantInput').attr('value', object.location);
    $('.dependantInputHidden').attr('value', object.locationID);
}

const setSelect = (object) => {
    document.getElementById("contactLocationSelect").value = object.locationID;
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
                //console.log(formattedEmployee);
            }
            //let sortedE = employees.sort((a, b) => (a.lastName > b.lastName) ? 1 : -1);
            results = employees;
            //$('#employeeList').html(renderResults({ employees: employees }));
            //$('#employeeList').insertAdjacentHTML('beforeend', (renderResults({ employees: employees })));
            document.getElementById('employeeList').insertAdjacentHTML('beforeend', (renderResults({ employees: employees })));
            //let departments = uniqueDepartmentPairs(results);
            //let locations = uniqueLocationPairs(results);
            //console.log(locations);
            let people = uniqueEmployeePairs(results);
            //console.log(people);
            //console.log(peoples);
            //let people = peoples.sort((a, b) => (a.fullName > b.fullName) ? 1 : -1);
            //console.log(people);
            //optionAdderWithID($('#contactDepartmentSelect'), departments, 'department', 'department');
            //optionAdderWithID($('#departments'), departments, 'department', 'department');
            //optionAdderWithID($('#contactLocationSelect'), locations, 'location', 'location');
            //optionAdderWithID($('#branches'), locations, 'location', 'location');
            //optionAdderWithID($('.locationsSelect'), locations, 'location', 'location');
            //optionAdderWithID($('.departmentsSelect'), departments, 'department', 'department');
            optionAdderWithID($('.employeesSelect'), people, 'fullName', 'fullName');
            //optionAdderWithID($('#employeeSelect'), people, 'fullName', 'fullName');
            //checkboxAdderWithID($('#departmentCheckboxes'), departments, 'department', 'deparment');
            //checkboxAdderWithID($('#locationCheckboxes'), locations, 'location', 'location');

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
    getDepartments();
    getLocations();
    //$('#deletesButton').click(function () {
    //console.log('I exist');
    //});

});

/************* JQuery helper Functions ***************/
const modalGenerator = (object) => {
    //console.log(object);
    $('#employeeId').attr('value', object.id);
    $('#fullName').attr('value', object.fullName);
    $('#firstName').attr('value', object.firstName);
    $('#lastName').attr('value', object.lastName);
    $('#contactEmail').attr('value', object.email);
    document.getElementById("contactDepartmentSelect").value = object.departmentObj.id;
    document.getElementById("contactLocationSelect").value = object.locationObj.id;
    //$('#contactLocation').attr('value', object.location);
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
    /*     let departments = uniqueDepartmentPairs(results);
        let locations = uniqueLocationPairs(results);
        optionAdderWithID($('#contactDepartmentSelect'), departments, 'department');
        optionAdderWithID($('#contactLocationSelect'), locations, 'location'); */
    modalGenerator(employee);
    formEditor();

});

$('#team').on('click', '#deleteButton', function () {
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
    /*     let departments = uniqueDepartmentPairs(results);
        let locations = uniqueLocationPairs(results);
        optionAdderWithID($('#contactDepartmentSelect'), departments, 'department');
        optionAdderWithID($('#contactLocationSelect'), locations, 'location'); */

    //alert(`Are you sure you want to delete ${employee.fullName}??`);
    //deleteEmployee(employee.)
    $('#warningFullName').html(employee.fullName);
    $('#deleteWarning').alert();
    console.log(employee.id);

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

const uniqueEmployeePairs = (array) => {
    let results = Array.from(new Set(array.map(s => s.fullName))).sort().map(fullName => {
        return {
            fullName: fullName,
            id: array.find(s => s.fullName === fullName).id
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
    //let locations = uniqueItemFinder(results, "location");
    //let locations = results.map(item => item.location).filter((value, index, self) => self.indexOf(value) === index).sort();
    //console.log(locations);
    //let select = $('#branches');
    //optionAdder(select, locations);
    //let departments = uniqueItemFinder(results, 'department');
    //let departments = results.map(item => item.department).filter((value, index, self) => self.indexOf(value) === index).sort();
    //let select2 = $('#departments');
    //optionAdder(select2, departments);
    //let people = uniqueItemFinder(results, 'fullName');
    //let people = results.map(item => item.fullName).filter((value, index, self) => self.indexOf(value) === index).sort();
    //let select3 = $('#employeeSelect');
    //optionAdder(select3, people);
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

const optionAdderWithID = (select, array, param, param2) => {
    array.forEach(function (item) {
        let option = document.createElement('option');
        option.innerHTML = item[param];
        option.value = item.id;
        option.name = item[param2];
        select.append(option);
    });
}

/*const checkboxAdderWithID = (container, array, param, nameParam) => {
    array.forEach(function (item) {
        container.append(
            $(document.createElement('div')).prop({
                class: "form-check"
            })).append(
                $(document.createElement('input')).prop({
                    id: item.id,
                    name: nameParam,
                    value: item[param],
                    type: "checkbox",
                    class: "form-check-input"
                })
            ).append(
                $(document.createElement('label')).prop({
                    for: nameParam,
                    class: "form-check-label"
                }).html(item[param])
            )
    });
}*/

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

/*$('#branch').click(function () {
    $('#branches').prop('disabled', false);
    $('#branches').focus();
    $('#branches').addClass('focusedInput');
    $('#departments').prop('disabled', true);
    $('#departments').removeClass('focusedInput').prop('selectedIndex', 0);;
    $('#employeeSelect').prop('disabled', true);
    $('#employeeSelect').removeClass('focusedInput').prop('selectedIndex', 0);
    $('#submitDelete').prop('disabled', true);
});*/

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

/* $('#department').click(function () {
    $('#departments').prop('disabled', false);
    $('#departments').focus();
    $('#departments').addClass('focusedInput');
    $('#branches').prop('disabled', true);
    $('#branches').removeClass('focusedInput').prop('selectedIndex', 0);;
    $('#employeeSelect').prop('disabled', true);
    $('#employeeSelect').removeClass('focusedInput').prop('selectedIndex', 0);
    $('#submitDelete').prop('disabled', true);
}); */

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

/* $('#person').click(function () {
    $('#employeeSelect').prop('disabled', false);
    $('#employeeSelect').focus();
    $('#employeeSelect').addClass('focusedInput');
    $('#branches').prop('disabled', true);
    $('#branches').removeClass('focusedInput').prop('selectedIndex', 0);
    $('#departments').prop('disabled', true);
    $('#departments').removeClass('focusedInput').prop('selectedIndex', 0);
    $('#submitDelete').prop('disabled', true);
}); */

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

// Do more functions like this to make the submit buttons work on modals
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
    //console.log(results.length);
    //$('.modal').modal('hide');
    //$('select .contactSelect').empty();
    //$('select .form-control option:not(:first)').remove();
    //$('#branches').empty();
    //let selectToClear = $('#branches');
    //selectToClear.find('option:gt(0)').remove();
    //console.log($('#branches'));
    //$('#branches option').empty()
    //   .append('<option selected="selected">Choose...</option>');
    //console.log($('#branches'));
    $('#newContactLocation').attr('value', '');
    $('select option:not(.first)').remove();
    $('#employeeList').empty();
    $('.generate-check').remove();
    $('#simpleSearch').val(null);
    $(document).scrollTop(0);
    getAll();
    getDepartments();
    getLocations();
});

$('#contactDisplayModal').on('hidden.bs.modal', function () {
    if ($('#manageModal').hasClass('show')) {
        $('#dismissButton').click();
    }
});

/* const deleteFormResetter = () => {
    $('#deleteOfficeModalForm :input[type=radio]').prop('checked', false);
    $('#deleteOfficeModalForm .focusedInput').prop('disabled', true);
    $('#deleteOfficeModalForm .focusedInput').prop('selectedIndex', 0);
} */

const checkboxFormResetter = () => {
    $('.resetChecks :input[type=radio]').prop('checked', false);
    $('.resetChecks .focusedInput').prop('disabled', true);
    $('.resetChecks .focusedInput').prop('selectedIndex', 0);
}

const idFinder = (array, id) => {
    let found = array.filter(obj => {
        return obj.id === id;

    });
    //console.log(found);
    return found[0];
}

$('#newContactDepartmentSelect').change(function () {
    let id = $('#newContactDepartmentSelect option:selected').val();
    // console.log(id);
    getLocationFromDepartmentID(id);
});

$('#contactDepartmentSelect').change(function () {
    let id = $('#contactDepartmentSelect option:selected').val();
    getLocationFromDepartmentID(id);
});

$('.dependantSelect').change(function () {
    let id = $('.dependantSelect option:selected').val();
    //console.log(id);
    getLocationFromDepartmentID(id);
})

$('#manageEmployeeSelect').change(function () {
    //let parents = $(this).parents();
    //let topLevel = parents[5];
    //let id = topLevel.id;
    let employeeId = $('#manageEmployeeSelect option:selected').val();
    let employee = idFinder(results, employeeId);
    //console.log(employeeId);
    //$('#manageModal').modal('hide');
    //$('#dismissButton').click();
    modalGenerator(employee);
    //$('#dismissButton').click();
    formEditor();
    //$('#dismissButton').click();
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
    console.log($('#simpleSearch').val());
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

$('#deleteButtonModal').click(function () {
    console.log($('#employeeId').val());
    deleteEmployee($('#employeeId').val());
});

$('#submitDelete').click(function () {
    //deleteEmployee($('#employeeSelect option:selected').val());
    //console.log($('#employeeSelect option:selected').val());
    if ($('#person').prop("checked")) {
        deleteEmployee($('#employeeSelect option:selected').val());
    } else if ($('#department').prop("checked")) {
        deleteDepartment($('#departments option:selected').val());
    } else if ($('#deleteLocation').prop("checked")) {
        console.log($('#branches option:selected').val());
        deleteLocation($('#branches option:selected').val());
        //deleteLocation($('#branches option:selected').val());
    }
})

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