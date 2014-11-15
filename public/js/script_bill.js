$(function() {
	getBills();
})

function getBills() {
	console.log("running getBills in script_bill_add.js");
	$.ajax({
		url: "getBills",
		type: "get",
		data: {},
		success: function(bills) {
			if (bills.length == 0){
				message = "There are no bills yet."
				$("#all-bills").html(message)
			} else {
				$.ajax({
					url: "getPays",
					type: "get",
					data: {},
					success: function(pays){
						console.log(pays)
						pay_to_me = pays["pay_to_me"]
						my_payments = pays["my_payments"]
						my_past_payments = pays["my_past"]
						their_payments = pays["their_payments"]
						// console.log("Parsing My ") 
						pay_me_message = parseMyPayments(pay_to_me, bills)
						my_message = parseOwedPayments(my_payments, bills)
						my_past_message = parsePastPayments(my_past_payments, bills)
						their_message = parsePayments(their_payments, bills)
						
						if (pay_me_message.length != "") {
							$("#pay-to-me").html(pay_me_message);
							console.log("1");
						} else{ 
							$("#pay-to-me").html("You don't have any payments.")
							console.log("2");
						}
						if (my_past_message.length != "") {
							$("#my-past-payments").html(my_past_message)
							console.log("3");
						} else{ 
							$("#my-past-payments").html("You haven't made any payments.")
							console.log("4");
						}
						if (my_message.length != "") {
							$("#my-payments").html(my_message)
							console.log("5");
						} else{ 
							$("#my-payments").html("You don't have any bills assigned to you.")
							console.log("6");
						}
						if (their_message.length != ""){
							$("#their-payments").html(their_message)
							console.log("7");
						} else{
							$("#their-payments").html("No on else has to pay any bills.")
							console.log("8");
						}
					} 
				})
			}
		}
	}); 
	return false;
}

function parsePayments( pays, bills) {
	var message = ''
	pays.forEach(function(p) {
		bill_name = p.bill_name
		console.log(p)
		bills.forEach(function(bill) {
			if (bill.bill_name == bill_name && p.obsolete!="0"){
				date = new Date(bill.date).toDateString()
				message += '<li>' + p.payer + ' owes ' + p.user_name + ' $' + p.partial_amount + ' for ' + bill.bill_name
				+ ' bill </li>';
			}
		})
	})
	return message
}

function parseMyPayments( pays, bills) {
	console.log("hello");
	var message = ''
	pays.forEach(function(p) {
		bill_name = p.bill_name
		console.log(p)
		bills.forEach(function(bill) {
			if (bill.bill_name == bill_name && p.obsolete=="1" && p.check==false){
				console.log("print");
				date = new Date(bill.date).toDateString()
				message += '<li>' + p.payer + ' owes you $' + p.partial_amount + ' for ' + bill.bill_name + ' bill '
				+ '<a href="/checkPay/' + p._id + '">Complete</a> ';
			}
		})
	})
	return message
}

function parsePastPayments( pays, bills) {
	var message = ''
	pays.forEach(function(p) {
		bill_name = p.bill_name
		console.log(p)
		bills.forEach(function(bill) {
			if (bill.bill_name == bill_name && p.obsolete!="0" && (p.check==true||p.complete==true)){
				date = new Date(bill.date).toDateString()
				if(p.complete==true){
					message += '<li>You paid ' + p.user_name + ' $' + p.partial_amount + ' for ' + bill.bill_name
					+ ' bill ' + '<a href="/hidePay/' + p._id + '">Hide Bill</a>'+'</li>';
				}
				if(p.check==true){
					message += '<li>'+p.payer + ' paid you $' + p.partial_amount + ' for ' + bill.bill_name
					+ ' bill ' + '<a href="/hidePay/' + p._id + '">Hide Bill</a>'+'</li>';
				}
			}
		})
	})
	return message
}

function parseOwedPayments( pays, bills) {
	var message = ''
	pays.forEach(function(p) {
		bill_name = p.bill_name
		console.log(p)
		bills.forEach(function(bill) {
			if (bill.bill_name == bill_name && p.obsolete!="0"&& p.complete==false) {
				date = new Date(bill.date).toDateString()
				message += '<li>You owe ' + p.user_name + ' $' + p.partial_amount + ' for ' + bill.bill_name + ' bill '
				+ '<a href="/completePay/' + p._id + '">Complete</a> ';
			}
		})
	})
	return message
}

