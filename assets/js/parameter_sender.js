//this page is used in the index.html file
//1. attach listeners to each "parameter" button on the index.html pageXOffset 
//    -only up to three parameters may be selected
//2. Listen for button clicks. 
//    -if a button is clicked then save that parameterID into array for passing to user_query_result.ORDERED_NODE_SNAPSHOT_TYPE
//    -if ATLEAST one button is selected, show the "GO!" button to execute the above php File
//3. Post array of parameters (up to 3) for the above php file
//4. The buttons must be in the SignUp form ID because of css formatting.
//    -I chose to leave it this way (yes, it is a little messy) to keep things DRY

//define array of available parameter buttons 
const array_of_parameters = {
    temp: "temperature", ph: "ph",   cond: "conductivity", dopct: "dopct", domgl: "domgl",   dogain: "dogain", turb: "turbidity",   depth: "depth"
};
//freeze array so that it cannot be changed
const params = Object.freeze(array_of_parameters);
var queryToSend = new Array(3);
var datesToSend = new Array(2);
//very ugly... would add a general event listener for any clicks and take the element id as a parameter for addQuery
document.getElementById(params.temp).addEventListener("click",function(){addQuery(params.temp)});
document.getElementById(params.ph).addEventListener("click",function(){addQuery(params.ph)});
document.getElementById(params.cond).addEventListener("click",function(){addQuery(params.cond)});
document.getElementById(params.dopct).addEventListener("click",function(){addQuery(params.dopct)});
document.getElementById(params.domgl).addEventListener("click",function(){addQuery(params.domgl)});
document.getElementById(params.dogain).addEventListener("click",function(){addQuery(params.dogain)});
document.getElementById(params.turb).addEventListener("click",function(){addQuery(params.turb)});
document.getElementById(params.depth).addEventListener("click",function(){addQuery(params.depth)});

document.getElementById("goButton").addEventListener("click",sendQueryToPHP);

//function that adds queries if the maximum 3 are not reached. if a query is selected twice it is deselected.
function addQuery(nameOfParameter){
    var isInArray = queryToSend.includes(nameOfParameter);
    if (isInArray){
        //add code to change color of de-selected button
        delete queryToSend[queryToSend.indexOf(nameOfParameter)];
        buttonSelected(false,nameOfParameter);
        }
        else{
            //add code to change color of selected button
            var lastPosition =  queryToSend.length-1;
            //need to place case for pressing button multiple times???
            if(queryToSend[lastPosition] != undefined || queryToSend[lastPosition] != null){
               alert("You may only select a maximum of three buttons");
                //instead of alert, you can have the thank you message show.
               }
            else{
                queryToSend[lastPosition] = nameOfParameter;
                buttonSelected(true,nameOfParameter);
            }
        }
    //sort so that all undefined or unfilled spots in the array are at the back of the array
    queryToSend.sort();
    
    //if atleast one parameter is selected, then fade the GO button in
    var goButtonElement = document.getElementById('goButton');
    if(queryToSend[0] != undefined){
        goButtonElement.style.visibility = "visible";
        goButtonElement.style.opacity = 1;
    }
    else{
        goButtonElement.style.opacity = 0;
        goButtonElement.addEventListener("transitionend", function hide(){
            document.getElementById('goButton').style.visibility = "hidden";
            document.getElementById('goButton').removeEventListener("transitionend", hide);
        });
    }
    
}
//this function is called right after the user clicks the GO button and right before the comp executes the php file
function sendQueryToPHP(){
    var goButtonElementValue = document.getElementById("goButton");
    goButtonElementValue.value = queryToSend+','+appendDateArray();
//    alert(document.getElementById("goButton").value);
    
    
    
//document['signup-form'].goButton.value = queryToSend;
    
    
    // for (int i = 0; i < queryToSend.length -1; i++)   {
//     if(queryToSend[i] == undefined || queryToSend[i] == null){
//        ;
//        }
// }
}
// this method is used to append the date variables or add the preselected dates
//this was created because, if the dates were left preselected, then they would not pass onto the php file
function appendDateArray() {
        datesToSend[0] = document.getElementById("startDate").value;
        datesToSend[1] = document.getElementById("endDate").value;
      return datesToSend;
}

//a boolean parameter is passed because it needs less changes if the color of the buttons are changed
//since the browser returned color differs in how its represented as a value of rgb by +- 10% i decided to use a boolean
function buttonSelected(bool,nameOfParameter){
    var selectedColor = "#00755A"; //darker version of button
    var buttonElement = document.getElementById(nameOfParameter);
    var buttonColor = window.getComputedStyle(buttonElement,null).getPropertyValue('background-color');
    
    //if button was selected (true)then change the color to a deep color
    if (bool){
        buttonElement.style.backgroundColor = selectedColor;
        }
        else{ //else change the color back to the usual color
        buttonElement.style.backgroundColor = "";
        }
}


//tiny-picker javascript referenced (and used) here for the calendar on index.html

 new TinyPicker({
        firstBox:document.getElementById('startDate'),
        startDate: new Date('06/10/2018'),
        endDate: new Date(),
        allowPast: true,
        lastBox: document.getElementById('endDate'),
        months: 2,
        days: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        local: 'en-US',
        success: function(s, e){ 
            //will not use this callback because the data is too complex.
            //I only needed the date d/m/y 
            //the format i got was: Sun Jun 10 2018 00:00:00 GMT-0400 (EDT)
//            alert(s + ' ' + e); 
//
//            datesToSend[0] = s;
//            datesToSend[1] = e;
//            alert(datesToSend);
                               },
        err: function(){alert('err');}
    }).init();








