$.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onContactsSuccess: function(contacts) {
    	$("#debug").html("Found: " + contacts.length);
    	$("#deviceContacts").empty();
    	var items = [];
    	for (var i = 0; i < contacts.length; i++) {
    		console.log("displayName = '" + contacts[i].displayName + "'");
    		console.log("name.formatted = '" + contacts[i].name.formatted + "'");
    		if (contacts[i].name.formatted) {
    			items.push("<li>" + contacts[i].name.formatted + "</li>");
    		}
    	}
    	$("#deviceContacts").append(items);
    	$("#deviceContacts").listview("refresh");	
	},
	onContactsError: function() {
	   $("#debug").html("error...");
	},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
    	
    	console.log("StatusBar: " + StatusBar.isVisible);
    	StatusBar.hide();
    	console.log("StatusBar: " + StatusBar.isVisible);
    	
    	//Register an event listener on the submit action
        $('#postForm').submit(function(event) {
        	event.preventDefault();

            var contactForm = $(this).serializeObject();//$(this).serialize();
            console.log("contactForm = '" + contactForm + "'");
            
        	app.postContact(contactForm);
        });
        
        // Get ENTERPRISE Contacts
    	$.getJSON("http://10.127.91.42:8080/ETAPP-REST-1/contacts/", function(data) {
    	//$.getJSON("http://10.127.91.42:8080/ETAPP-REST-1/contacts/550803562d0eaa6bea7c31d8", function(data) {
    	    $("#enterprise_contacts_list").empty();
    	    var items = [];
    	    var contactItem = "";
    	    var contactImage = "";
    	    $.each(data, function(key, val) {
    	    //$.each([data], function(key, val) {
    	       console.log("item: " + key + " " + val.firstName);
    	       //items.push("<li><a href='#"+ key + "'>" + val.firstName +" " + val.lastName + "</a></li>");
    	       /*
    	       $.each(val, function(key2, val2) {
    	    	   contactForm += "<li>" + key2 + ": " + val2 + "</li>";
    	       });*/ 
    	       contactImage = '<img src="img/mugshots/' + val.id + '.jpg" alt="CSS"/>';
    	       //contactItem = "<li><a href='#"+ key + "'>" + val.firstName +" " + val.lastName + contactForm + "</a></li>"; 
    	       //contactItem = '<li><a href="#update_contact_page">' + val.firstName + ' ' + val.lastName + '</a></li>'; 
    	       contactItem = '<li><a href="#update_contact_page">' + contactImage + val.firstName + '<br/>' + val.lastName + '</a></li>'; 
    	       items.push(contactItem);
    	    
    	       //console.log("contactItem: " + contactItem);
    	    });
    	    items.push('<li data-role="list-divider">List Divider</li>');
    	    $("#enterprise_contacts_list").append(items);
    	    $("#enterprise_contacts_list").listview("refresh");
    	});
    	//http://10.127.91.42:8080/ETAPP-REST-1/contacts/
    	//http://localhost:8080/mobile-rest/rest/members
    	
    	    	
    	// Get DEVICE Contacts
    	/*
    	 $("#btnDeviceContacts").on("click", function(e) {
    		  console.log("button clicked, going to fetch local contacts");
    		  $("#debug").html("finding...");
    		  var options      = new ContactFindOptions();
    		  options.multiple = true;
    		  var fields       = ["displayName", "name"];
    		  navigator.contacts.find(fields, app.onContactsSuccess, app.onContactsError, options);
    	});
    	*/
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    /*
    Attempts to register a new member using a JAX-RS POST.  The callbacks
    the refresh the member table, or process JAX-RS response codes to update
    the validation errors.
     */
    postContact: function(contactForm) {
        //clear existing  msgs
        $('span.invalid').remove();
        $('span.success').remove();

        // Display the loader widget
        $.mobile.loading("show");

        console.log("contactForm = " + contactForm);
        //var contactData = JSON.stringify(contactForm.serializeArray());
        var contactData = JSON.stringify(contactForm);
    	//console.log("JSON.stringify(contactForm) = " + JSON.stringify(contactForm));
    	console.log("contactData = " + contactData);
    	
    	/*
    	 * var frm = $(document.myform);
 var data = JSON.stringify(frm.serializeArray());
    	 */
    	
        $.ajax({
            url: 'http://10.127.91.42:8080/ETAPP-REST-1/contacts',
            contentType: 'application/json',
            dataType: 'text', //'json',
            type: 'post',
            async: 'true',
            data:  contactData, //'{"firstName": "caca2", "lastName": "fritas"}',
            
            success: function(data) {
                console.log("Contact Added");

                //clear input fields
                $('#postForm')[0].reset();
 
                //mark success on the registration form
                $('#formMsgs').append($('<span class="success">Contact Added</span>'));

                //updateMemberTable();
            },
            error: function(error) {
                if ((error.status == 409) || (error.status == 400)) {
                    //console.log("Validation error registering user!");

                    var errorMsg = $.parseJSON(error.responseText);

                    $.each(errorMsg, function(index, val) {
                        $('<span class="invalid">' + val + '</span>').insertAfter($('#' + index));
                    });
                } else {
                    //console.log("error: " + error.responseText + " - unknown server issue");
                    console.log("error: " + error.status + " - unknown server issue");
                    
                    $('#formMsgs').append($('<span class="invalid">'+ error.responseText + '</span>'));
                }
            },
            complete: function() {
                // Hide the loader widget
                $.mobile.loading("hide");
            }
            
        });
    }
};

app.initialize();