//var xmlhttp = new XMLHttpRequest();
//xmlhttp.onreadystatechange = function(){
//    if (this.readyState == 4 && this.status == 200) {
//        var resultStatement_as_JSON = JSON.parse(this.responseText);
//        document.getElementById()
//    }
//}

//Getting JSON arrays of date,parameter1,2,3, and array of parameters from JS variables, echoed from PHP
//this is the data that will be plotted on the graph
var date = this.window.timestamp;
var parameter1 = this.window.parameter1;
var parameter2 = this.window.parameter2;
var parameter3 = this.window.parameter3;
var parameterArray = [parameter1,parameter2,parameter3];
var parameterTypes = this.window.parameter_types; //used to identify which variables were selected.

var test_max = 1.2;
var test_min = 0.8;
//array-dictionary of all three chart properties
var parameterDependentChartProperties = [
    {
        label:  parameterTypes[0],  //name of the label of the series...the legend
        backgroundColor:  'rgba(255, 99, 132, 0.2)', //red color for the graph backdrop
        borderColor: 'rgba(255,99,132,1)',  //red color for the line
        yAxisID: 'parameter1',   //name of the y-axis that the data will correlate with
        
        //the below parameter goes in the "options" area of chart js
        id:'parameter1',
    },
    {
        label: parameterTypes[1],    //name of the label of the series...the legend
        backgroundColor: 'rgba(54, 162, 235, 0.2)', //blue color for the graph backdrop
        borderColor: 'rgba(54, 162, 235, 1)',   //blue color for the line
        yAxisID: 'parameter2',   //name of the y-axis that the data will correlate with
        
        //the below parameter goes in the "options" area of chart js
        id:'parameter2',
    },
    {
        label: parameterTypes[2], //name of the label of the series...the legend
        backgroundColor: 'rgba(255, 206, 86, 0.2)', //yellow color for the graph backdrop
        borderColor: 'rgba(255, 206, 86, 1)',   //yellow color for the line
        yAxisID: 'parameter3',   //name of the y-axis that the data will correlate with
        
        //the below parameter goes in the "options" area of chart js
        id:'parameter3',
    }
]

//combines the date with the respective parameter data so its like: [(date0,data0),(date1,data1),(date2,data2)...(n,n)]
function combineData (parameter_i, date){
    
    var combinedArray = []
    for (var i = 0; i < this.date.length; i++){
        combinedArray.push({
            x: new Date (date[i]), //convert the date to a javascript date object
            y:  parameter_i[i] 
        });
    }
    return combinedArray;
}

//dynamically create dataset that chart.js will use
//this is used to add more charts (up to 3) for chartjs to use
function generateDataSet(specificChartProperties, parameter_i, date){
    
    return {
        label: specificChartProperties.label,
        backgroundColor: specificChartProperties.backgroundColor,
        borderColor: specificChartProperties.borderColor,
        yAxisID: specificChartProperties.yAxisID,
        
        borderWidth: 1,
        data: combineData(parameter_i, date)
    }
}
//function suggested by Andrew Welch to add a 20% buffer to the MAX y-axis scale and 40% to the MIN values. 
//This de-dramatizes the data curves
//this loops through the entire parameter array find the highest, finds the lowest and takes a 20% chunk higher or lower
function determineBufferedScale(parameter_i){
    var min = parseFloat(parameter_i[0]), max = parseFloat(parameter_i[0]), num = 0;
//    console.log(test_max + " "+ test_min);
    for (var i = 0; i < parameter_i.length; i++){
        num = parseFloat(parameter_i[i]);
        if (max < num){ //if the value is larger then take it on
            max = parameter_i[i];
            }
        if (min > num){ // if the value is smaller then take it on
            min = parameter_i[i];
        }
    }
    
    max = max * test_max;
    min = min * test_min;
    console.log("max: "+max+" min: " +min);
    return{
        suggestedMin: min,
        suggestedMax: max
    }
}

function generateOptionSet(specificChartProperties, parameter_i){
    return{
        id: specificChartProperties.id, //returns the parameter id
        type: 'linear', //using the value of series breaks the code. Probably can't handle it.
        position: 'left', //positions the y-axis on the left side of the graph
        ticks: determineBufferedScale(parameter_i)
    }
}

//determine if there are more parameters selected
//this method will add one or two more charts up to 3 charts total
function addDataSets(parameterDependentChartProperties, parameterArray, date){
    for (var i = 0; i < parameterTypes.length; i++ ) {
        configuration.data.datasets.push(generateDataSet(parameterDependentChartProperties[i], parameterArray[i], date));
        configuration.options.scales.yAxes.push(generateOptionSet(parameterDependentChartProperties[i], parameterArray[i]));
    }
}

//+Purpose: Toggles the downsampling and un-downsampling of all graphs on the screen. This is useful to look at the finer details of the
//graph.
//+Function: This function gets called by a function that listens for a click on the the "toggle downsample" button. It checks the boolean that was passed in and downsamples the chart or un-downsamples the chart. A quirk of this method lies in the re-downsampling and how it interacts with Chartjs. The chart must be updated twice to properley position the graphs on the screen.
//There is a slight lag when re-downsampling the data bc js needs to redownsample. Maybe keeping the downsampled array would help decrease the lag.
function toggleDownsampleAndRedraw(enable){

    //DEBUG STATEMENTS:
//    console.log("the value of enable is"+enable + "and the value of downsample is"+chart.options.downsample.enabled);
//    console.log("before chart update " +
//               chart.options.downsample.enabled,
//               chart.options.downsample.threshold,
//               chart.options.downsample.auto,
//               chart.options.downsample.onInit,
//               chart.options.downsample.restoreOriginalData,
//               chart.options.downsample.preferOriginalData
//                   );

    if (enable){
        this.chart.options.downsample.enabled = true;
//        console.log(chart.data.datasets[0]);
        chart.update({
        duration: 0,
//            You can choose different animations by visiting the following websites
//            https://easings.net
//            http://www.chartjs.org/docs/latest/configuration/animations.html#easing
        easing: 'easeOutBack'
                    });
//the below update needs to be called so that the above chart update will load. Seems like this is an issue with downsample code
        chart.update({
        duration: 1200,
        easing: 'easeInOutBack'
                    });
//        console.log(chart.data.datasets[0]);
    }
    //The else case will run first to un-downsample the data
    else{
        //disable downsampling so that changes to the graph won't automatically be downsampled
        this.chart.options.downsample.enabled = false;
        //replace the downsampled data with the original data for 1-3 data sets
        for( var i = 0; i < parameterTypes.length; i++){
            this.chart.data.datasets[i].data = this.chart.data.datasets[i].originalData;
        }
        
        
//          useful debug command to see two arrays in an object: original data and data. You need to paste the original data into the                 data array to un-downsample the graphs
//        console.log(chart.data.datasets[0]);
        
        chart.update({
    duration: 0
        });
    }
}

//chart configuration
var configuration =  {
    type: 'line',//this is a line graph so we use the graph type line+-
    data: {
        datasets: [ 
            
        ]
            },
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                ticks: {
                  autoSkip: true,
                },
                time: {
                    unit: 'minute', //best parameter to specify. http://www.chartjs.org/docs/latest/axes/cartesian/time.html#time-units
                    distribution: 'linear', //series or linear as parameter to have varying distances 
                    displayFormats: {   
//                    minute: 'YYYY-MM-DD HH:mm' //use this to show the year as well
                    minute: 'MM-DD HH:mm' // use this to only show month
//                        2018-06-15 23:45:00 example format of date coming from database  
                },
                    bounds: 'data' //don't know if this does anything.. left in here just incase we have to deal with larger datasets
                                    //more info of bounds is under "scale bounds" in the above link.
                    }
            }],
            // three y-axises for the three parameters.. three was chosen as the maximum comparison as advised by Andrew Welch
            yAxes: [
                   ]
        },
        //makes the dots that indicate a point disapear . nothing else is changed
        elements:{
          point: {
            radius: 2, 
          }
        },
        downsample: {
            enabled: true, 
            threshold: 100 //Change to display varying amounts of points. (Arbitrarily chose 100)
            ,auto: true // if true, downsamples the graph all the time. 
            ,onInit: true // if true, downsample the graph on initialization of the graph
            ,restoreOriginalData: false //if true, toggling the legends makes the graph go from downsampled to undownsampled
            ,preferOriginalData: true // creates an array called original data when true
        }
    }
    
    
};


// adding in the data to the charts
addDataSets(parameterDependentChartProperties, parameterArray, date);

var chart, canvas;
window.onload = function () {
     canvas = document.getElementById("myChart");
     chart = new Chart(canvas, configuration);

};













