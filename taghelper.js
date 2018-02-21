$(document).ready(function() {
  // $("#department_select").chosen();

  $.ajax({
    url: "https://toolbox.fhcrc.org/sw2srv/get_depts",
    jsonp: 'callback',
    dataType: 'jsonp'
  });


});


ko.validation.rules.pattern.message = 'Invalid.';

ko.validation.init({
    registerExtenders: true,
    messagesOnModified: true,
    insertMessages: true,
    parseInputAttributes: true,
    messageTemplate: null
}, true);


var captcha = function(val) {
    return val == 11;
};

var mustEqual = function(val, other) {
    return val == other;
};

var viewModel = {
    Name: ko.observable().extend({
      required: true,
      pattern: {
        message: 'Must match pattern "^[a-z0-9\-\.]+$"',
        params: '^[a-z0-9\-\.]+$'
      }
    }),
    division: ko.observable().extend({required: true}),

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

    data_classification: ko.observable().extend({required: true}),

    submit: function() {
        if (viewModel.errors().length === 0) {
            alert('Thank you.');
        }
        else {
            alert('Please check your submission.');
            viewModel.errors.showAllMessages();
        }
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
  obj.unshift("");
  viewModel.departmentOptions(obj);
  viewModel.departmentOptions.extend({required: true, minLength: 1});
  $("#department_select").chosen({placeholder_text_single: "Select an option..."});
}
