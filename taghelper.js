$(document).ready(function() {

  $.ajax({
    url: "https://toolbox.fhcrc.org/sw2srv/get_depts",
    // url: 'depts.json', // FIXME CHANGEME TODO change this back
    jsonp: 'callback',
    dataType: 'jsonp'
  });


});

// utilities

var toPlainObject = function() {
    wantedItems = ['Name', 'division', 'department', 'technical_contact',
                   'budget_number', 'description', 'service', 'project',
                   'data_classification'];
    plainObject = {};
    wantedItems.forEach(function(key) {
        value = viewModel[key]();
        if (key != "") {
            plainObject[key] = value;
        }
    });
    return plainObject;
}


var hasErrors = function() {
    if (viewModel.errors().length > 0) {
        alert("There were errors in your input.");
        viewModel.errors.showAllMessages();
        return true;
    }
    return false;
}

// ko validation & viewmodel



ko.validation.rules.pattern.message = 'Invalid.';

ko.validation.init({
    registerExtenders: true,
    messagesOnModified: true,
    insertMessages: true,
    parseInputAttributes: true,
    messageTemplate: null
}, true);



var viewModel = {
    Name: ko.observable().extend({
      required: true,
      pattern: {
        message: 'Must match pattern "^[a-z0-9\-\.]+$"',
        params: '^[a-z0-9\-\.]+$'
      }
    }),
    division: ko.observable().extend({required: true}),
    divisionOptions: ko.observableArray(
        ['ad', 'bs', 'cb', 'cp', 'cr', 'hd', 'ph', 'ra', 'sr', 'vi']),

    department: ko.observable().extend({required: true}),
    departmentOptions: ko.observableArray(),

    technical_contact: ko.observable().extend({required: true, email: true}),
    budget_number: ko.observable(),
    description: ko.observable(),

    service: ko.observable().extend({
      pattern: {
        message: 'Must match pattern "^[a-zA-Z0-9 ].$"',
        params: '^[a-zA-Z0-9 ].$'
      }
    }),

    project: ko.observable().extend({
      pattern: {
        message: 'Must match pattern "^[a-zA-Z0-9 ].$"',
        params: '^[a-zA-Z0-9 ].$'
      }
    }),

    service_category: ko.observable().extend({
      pattern: {
        message: 'Must match pattern "^[a-zA-Z0-9 ].$"',
        params: '^[a-zA-Z0-9 ].$'
      }
    }),

    data_classification: ko.observable().extend({required: true, minLength: 1}),
    data_classificationOptions: ko.observableArray(['I', 'II', 'III']),

    output: ko.observable(),

    submit: function() {
        if (viewModel.errors().length === 0) {
            alert('Thank you.');
        }
        else {
            alert('Please check your submission.');
            viewModel.errors.showAllMessages();
        }
    },

    toJson: function() {
        if (hasErrors()) {
            return
        }
        viewModel.output(JSON.stringify(toPlainObject(), null, 4));
    },
    toYaml: function() {
        if (hasErrors()) {
            return
        }
        viewModel.output(YAML.stringify(toPlainObject(), null, 4));
    },
    toTf: function() {
        if (hasErrors()) {
            return
        }
        viewModel.output(golib.toHCL(JSON.stringify(toPlainObject())));
    },
    reset: function() {
        Object.keys(viewModel).forEach(function(name) {
            if (ko.isWritableObservable(viewModel[name])) {
                viewModel[name](undefined);
            }
        });
        viewModel.errors.showAllMessages(false);
    }
};



viewModel.errors = ko.validation.group(viewModel);


ko.applyBindings(viewModel);

var callback = function(obj) {
  viewModel.departmentOptions(obj);
  viewModel.departmentOptions.extend({required: true, minLength: 1});

  $("#department_select").chosen({placeholder_text_single: "Select an option..."});


}
