function replaceGoals(totalCalories, totalCarbs, totalFat, totalProtein)
{
	var classString = "first";
	var innerString = "Totals";
	var elems = document.getElementsByTagName('*'), i;
	
	var currentLabelId = parseInt(-1);
	
	for(i in elems)
	{
		if( ((" " + elems[i].className + " ").indexOf(" " + classString + " ") > -1) && (elems[i].innerHTML == innerString) )
		{
			currentLabelId = parseInt(i);
			break;
		}
	}
	
	var currentCaloriesId = currentLabelId + 1;
	var currentCarbId = currentCaloriesId + 1;
	var currentFatId = currentCarbId + 1;
	var currentProteinId = currentFatId + 1;
	
	var goalLabelId = currentProteinId + 4;
	var caloriesGoalId = goalLabelId + 1;
	var carbGoalId = caloriesGoalId + 1;
	var fatGoalId = carbGoalId + 1;
	var proteinGoalId = fatGoalId + 1;
	
	elems[caloriesGoalId].innerHTML = totalCalories;
	elems[carbGoalId].innerHTML = totalCarbs;
	elems[fatGoalId].innerHTML = totalFat;
	elems[proteinGoalId].innerHTML = totalProtein;
	
	var remainingLabelId = proteinGoalId + 4;
	var remainingCaloriesId = remainingLabelId + 1;
	var remainingCarbId = remainingCaloriesId + 1;
	var remainingFatId = remainingCarbId + 1;
	var remainingProteinId = remainingFatId + 1;
	
	elems[remainingCaloriesId].innerHTML = parseInt(totalCalories)  - parseInt(elems[currentCaloriesId].innerHTML.replace(",", ""));
	elems[remainingCarbId].innerHTML = parseInt(totalCarbs) - parseInt(elems[currentCarbId].innerHTML.replace(",", ""));
	elems[remainingFatId].innerHTML = parseInt(totalFat) - parseInt(elems[currentFatId].innerHTML.replace(",", ""));
	elems[remainingProteinId].innerHTML = parseInt(totalProtein) - parseInt(elems[currentProteinId].innerHTML.replace(",", ""));
}

function log(str) {
  console.log(str);
  logDiv.innerHTML += str + "<br>";
}

var logDiv = document.createElement("div");
logDiv.style.border = "1px dashed black";
document.body.appendChild(document.createElement("br"));
document.body.appendChild(logDiv);

$(function(){
        
        chrome.extension.sendMessage({data: true}, function(response) {
            var json = JSON.parse(response);
            
            var jsonDays = json[0];
            var days = JSON.parse(jsonDays);
            var jsonData = json[1];
            var data = JSON.parse(jsonData);
            
            var elems = document.getElementsByTagName('*'), i;
            var currentLabelId = parseInt(-1);
        
            var classString = "date";
            for(i in elems)
            {
                    if( (" " + elems[i].className + " ").indexOf(" " + classString + " ") > -1)
                    {
                            currentLabelId = parseInt(i);
                            break;
                    }
            }
            
            var innerHTML = elems[currentLabelId].innerHTML;
            
            var day = parseInt(0);
            
            for(var i = 0; i < days.length; ++i)
            {
                if(innerHTML.indexOf(days[i]) != -1)
                {
                    day = parseInt(i);
                    break;
                }
            }
            
            var goalCarbs = data[day].carbs;
            var goallFat = data[day].fat;
            var goalProtein = data[day].protein;
            var goalCalories = data[day].totaldesiredcalories;
            replaceGoals(goalCalories, goalCarbs, goallFat, goalProtein);
        
        });
});
