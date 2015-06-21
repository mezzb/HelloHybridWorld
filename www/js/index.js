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
    		//console.log("displayName = '" + contacts[i].displayName + "'");
    		//console.log("name.formatted = '" + contacts[i].name.formatted + "'");
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
    	 
    	// Store object
    	var storeObject = {
    		id				: '',
    	    firstName		: '',
    	    lastName		: '',
    	    city			: '',
    	    state			: '',
    	    email			: '',
    	    contactPhone	: ''
    	}
    	
    	var listObject = {
    			itemID : null
		}

    	/*
    	$(document).on('pagebeforeshow', '#contact_details_page', function(){       
    	    $('#contact_details_page [data-role="content"]').html('You have selected Link' + listObject.itemID);
    	});
    	
    	$(document).on('pagebeforeshow', '#enterprise_contacts_list_page', function(){
    		
    		console.log("entering #enterprise_contacts_list_page");
    	    $('#enterprise_contacts_listview li a').each(function(){
    	        var elementID = $(this).attr('id');      
    	        console.log("elementID = '" + elementID + "'");
    	        $(document).on('click', '#'+elementID, function(event){  
    	            if(event.handled !== true) // This will prevent event triggering more then once
    	            {
    	                listObject.itemID = elementID; // Save li id into an object, localstorage can also be used, find more about it here: http://stackoverflow.com/questions/14468659/jquery-mobile-document-ready-vs-page-events
    	                $.mobile.changePage( "#contact_details_page", { transition: "slide"} );
    	                event.handled = true;
    	            }              
    	        });
    	    });
    	});
    	*/
    	
    	$(document).on('pagebeforeshow', '#contact_details_page', function(e, data){     
    		//alert("My name is " + data.prevPage.find('#mugshot').val());
    		//console.log("My name is " + storeObject.firstName + " " + storeObject.city);
    		//alert("Just hit the contact_details_page");
    		console.log("Just hit the contact_details_page");
    	});
    	
    	//console.log("StatusBar: " + StatusBar.isVisible);
    	StatusBar.hide();
    	//console.log("StatusBar: " + StatusBar.isVisible);
      
    	//Register an event listener on the submit action
        $('#postForm').submit(function(event) {
        	event.preventDefault();

            var contactForm = $(this).serializeObject();
            //console.log("contactForm = '" + contactForm + "'");
             
        	app.postContact(contactForm);
        });
        
        // Get ENTERPRISE Contacts
    	$.getJSON("http://10.127.91.42:8080/ETAPP-REST-1/contacts/", function(contacts) {
    	//$.getJSON("http://10.127.91.42:8080/ETAPP-REST-1/contacts/550803562d0eaa6bea7c31d8", function(data) {
    	    $("#enterprise_contacts_listview").empty();
    	    var items = [];
    	    var contactItem = "";
    	    var contactImage = "";
    	    $.each(contacts, function(index, contact) {
    	       //console.log("item: " + index + " " + contact.firstName + " city: " + contact.city);
    	       //items.push("<li><a href='#"+ index + "'>" + contact.firstName +" " + contact.lastName + "</a></li>");
    	       /*
    	       $.each(contact, function(index2, contactField) {
    	    	   contactForm += "<li>" + index2 + ": " + contactField + "</li>";
    	       });*/ 
    	        
    	       contactImage = '<img id="mugshot" src="img/mugshots/' + contact.id + '.jpg" alt="CSS"/>';
    	       //contactItem = "<li><a href='#"+ index + "'>" + contact.firstName +" " + contact.lastName + contactForm + "</a></li>"; 
    	       //contactItem = '<li><a href="#update_contact_page">' + contact.firstName + ' ' + contact.lastName + '</a></li>'; 
    	       contactItem = '<li><a href="#" id="' + contact.id + '">' + contactImage + contact.firstName + '<br/>' + contact.lastName + '</a></li>'; 
    	       items.push(contactItem);
    	    
    	       //console.log("contactItem: " + contactItem);
    	    });
    	    items.push('<li data-role="list-divider">List Divider</li>');
    	    $("#enterprise_contacts_listview").append(items);
    	    $("#enterprise_contacts_listview").listview("refresh");
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

        //console.log("contactForm = " + contactForm);
        //var contactData = JSON.stringify(contactForm.serializeArray());
        var contactData = JSON.stringify(contactForm);
    	//console.log("JSON.stringify(contactForm) = " + JSON.stringify(contactForm));
    	//console.log("contactData = " + contactData);
    	
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