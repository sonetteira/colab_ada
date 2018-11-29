//this page is used in the generated html page from user_query_result.php file
//1. attach listeners to each "parameter" button on the index.html pageXOffset 
//    -only up to three parameters may be selected
//2. Listen for button clicks. 
//    -if a button is clicked then save that parameterID into array for passing to user_query_result.ORDERED_NODE_SNAPSHOT_TYPE
//    -if ATLEAST one button is selected, show the "GO!" button to execute the above php File
//3. Post array of parameters (up to 3) for the above php file
//4. The buttons must be in the SignUp form ID because of css formatting.
//    -I chose to leave it this way (yes, it is a little messy) to keep things DRY

//boolean for keeping track whether the downsample button is pressed or not
var downsampleToggled = false;
//attach listener to the downsample button so that we know whenever it is selected
document.getElementById("downsampleToggle").addEventListener("click",function(){determineToggleState("downsampleToggle")});

    function determineToggleState(toggleID){
        
        //if the downsample button is not toggled...
        if(!downsampleToggled){
            //dim the button (showing the user that they selected the button)
            buttonSelected(downsampleToggled,toggleID);
            this.toggleDownsampleAndRedraw(downsampleToggled);
            downsampleToggled = true;
            
           }
           else{
                buttonSelected(downsampleToggled,toggleID);   
                this.toggleDownsampleAndRedraw(downsampleToggled);
                downsampleToggled = false;
           }
        
    }

//a boolean parameter is passed because it needs less changes if the color of the buttons are changed
//since the browser returned color differs in how its represented as a value of rgb by +- 10% i decided to use a boolean
function buttonSelected(bool,nameOfParameter){
    var selectedColor = "#00755A"; //darker version of button
    var buttonElement = document.getElementById(nameOfParameter);
    var buttonColor = window.getComputedStyle(buttonElement,null).getPropertyValue('background-color');
    
    //if button was selected (true)then change the color to a deep color
    if (!bool){
        buttonElement.style.backgroundColor = selectedColor;
        }
        else{ //else change the color back to the usual color
        buttonElement.style.backgroundColor = "";
        }
}












