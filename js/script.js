//-------------------------------function to display payment message with last 4 digits-----------------------------------------------//

window.onload = function () {  //html and css needs to load before this can be ran   
    var lastFourQuery = window.location.search;        //retrieve entire "?lastFour=[eg 1234]" query string and store in lastFourQuery
    var params = new URLSearchParams(lastFourQuery);       //create an object that can be used to work with individual parameters
    var lastFourDigits = params.get("lastFour");      //use .get to retieve the value associated with the lastFour parameter
    var successMsg = "Payment from card **** **** **** " + lastFourDigits + " successful";    //store desired succes message as a variable
    document.getElementById("SuccessMsg").innerHTML = successMsg;     //set innerHTML of desired div to the success message
};

//-------------------------------function to display payment message with last 4 digits-----------------------------------------------//

//------------------------------------------defines options for expiry dropdowns------------------------------------------------------//

var currentYear = new Date().getFullYear();  //get current year

//fill options for expiry year
for (var i = 0; i <= 10; i++) {  //count forward to populate with the next 10 years
    var year = currentYear + i;  //next year = this year + i
    var option = document.createElement("option");  //create <option> element
    option.value = year;         //set option value and text to the calulated year
    option.textContent = year;   //
    document.getElementById("expiry-year").appendChild(option);  //"assign" that option to the correct element
}

//fill options for expiry month
for (var i = 1; i <= 12; i++) {   //count from 1 to 12
    var option = document.createElement("option");  //create <option> called option
    option.value = i;            //set option value and text equal to i
    option.textContent = i;      //
    document.getElementById("expiry-month").appendChild(option);   //assign option to the correct element
}

//------------------------------------------defines options for expiry dropdowns------------------------------------------------------//

document.getElementById("submit-btn").addEventListener("click", handleSubmit);     //run the regex validation when submit buttin is clicked

//------------------------------------------REGEX Validation for card------------------------------------------------------------------//

// Define function to handle form submission
function handleSubmit() {

    // define form input values as variables
    var cardNumber = document.getElementById("card-number-input").value;
    var cvv = document.getElementById("cvv-input").value;
    var month = document.getElementById("expiry-month").value;
    var year = document.getElementById("expiry-year").value;

    const creditcardRegex = /^5[1-5][0-9]{14}$/
    if (!cardNumber.match(creditcardRegex)) {
        document.getElementById("alert").innerHTML = "enter a 16 digit card number starting 51-55";
        document.getElementById("alert").classList = "error";         //change the class of the alert element so that its colour can be red
        return 0;
    }

    const thisYear = new Date().getFullYear();            //get the current year and month
    const thisMonth = new Date().getMonth();              //
    if((year == "year") ||(month == "month")){
        document.getElementById("alert").innerHTML = "Enter a date";
        document.getElementById("alert").classList = "error";
        return 0;
    }
    else if ((year == thisYear) && (month < thisMonth + 1)) {     //month plus 1 because months start at 0, not 1
        document.getElementById("alert").innerHTML = "card expired, use a valid date";
        document.getElementById("alert").classList = "error";
        return 0;
    }




    const cvvRegex = /^[0-9]{3,4}$/     //regex to allow input to be 3 or 4 numbers
    if (!cvv.match(cvvRegex)) {
        let cvvMsg = cvv + " is not a valid cvv";                 //
        if (cvv == "") {                                          //  to display two different error messages for cvv based on wether it is blank or doesnt match the regex
            cvvMsg = "Enter a valid cvv";                         //
        }                                                         //
        document.getElementById("alert").innerHTML = cvvMsg;
        document.getElementById("alert").classList = "error";
        return 0;
    }
    apiSubmit();
};
//------------------------------------------REGEX Validation for card------------------------------------------------------------------//

//------------------------------------ Api submission----------------------------------------------------------------------------------//
function apiSubmit() {

    cardNumber = document.getElementById("card-number-input").value;
    var cvv = document.getElementById("cvv-input").value;
    var month = document.getElementById("expiry-month").value;
    var year = document.getElementById("expiry-year").value;
    console.log(cardNumber, month, year, cvv);

    const url = "https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard";
    const data = {
        "master_card": cardNumber,
        "exp_year": year,
        "exp_month": month,
        "cvv_code": cvv
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            if (response.status === 200) {    //use 200 OK code not 201 added to database code
                return response.json();
            } else if (response.status === 400) {
                throw "Bad data was sent to the server";
            } else {
                throw "Something went wrong";
            }
        })

        .then((resJson) => {
            var lastFourDigits = cardNumber.toString().slice(-4); //slice last 4 digits of card number
            var successUrl = "success.html?lastFour=" + lastFourDigits;   //store the last 4 digits as a query parameter appeneded to lastFour
            window.location.href = successUrl;     //change page to "url"
        })

        .catch((error) => {
            document.getElementById("alert").innerHTML = error;
            document.getElementById("alert").classList = "error";
        })
};

//------------------------------------ Api submission----------------------------------------------------------------------------------//


