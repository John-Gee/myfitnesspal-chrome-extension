function CalculateTotalCaloriesFromMacros(totalCarbs, totalFat, totalProtein)
{
    return (totalCarbs * 4) + (totalFat * 9) + (totalProtein * 4);
}

function ToIntFromStr(text)
{
    return parseInt(text.replace(",", ""));
}

function CalculateTotalCaloriesFromStrMacros(totalCarbs, totalFat, totalProtein)
{
    var intTotalCarbs = ToIntFromStr(totalCarbs);
    var intTotalFat = ToIntFromStr(totalFat);
    var intTotalProtein = ToIntFromStr(totalProtein);
    
    return CalculateTotalCaloriesFromMacros(intTotalCarbs, intTotalFat, intTotalProtein);
}

function FindElementByClass(classString)
{
    var elems = document.getElementsByTagName('*'), i;
    
    for(i in elems)
         if ((" " + elems[i].className + " ").indexOf(" " + classString + " ") > -1)
              return elems[parseInt(i)];
    return undefined;
}

function FindMealHeaderElement()
{
    return FindElementByClass("meal_header");    
    //return FindElementByClass(document.getElementsByTagName('tbody')[0], "meal_header");
}

function InsertClonedNodeAfter(parentNode, afterNode, content)
{
    var newNode = afterNode.cloneNode(false);
    newNode.innerHTML = content;
    parentNode.insertBefore(newNode, afterNode.nextSibling); 
    return newNode;
}

function AddHeaders(mealHeaderElement, names, afterName, indexes)
{  
    var headers = mealHeaderElement.getElementsByTagName('td');
    
    var afterNode = undefined;
    
    for(i in headers)
    {
     if((headers[i].innerHTML != undefined) && (headers[i].innerHTML.indexOf(afterName) != -1))
     {
         afterNode = headers[i];
         indexes.After = i;
     }
     
     if(headers[i].innerHTML == "Carbs")
         indexes.Carbs = i;
     else if(headers[i].innerHTML == "Fat")
         indexes.Fat = i;
     else if(headers[i].innerHTML == "Protein")
         indexes.Protein = i;
    }
    
    for(i in names)
    {
     afterNode = InsertClonedNodeAfter(mealHeaderElement, afterNode, names[i]);
    }
}

function AddFooters(mealHeaderElement, names, indexes)
{
    var footerElement = mealHeaderElement.parentNode.parentNode.lastChild.previousSibling;
    
    var tr = footerElement.getElementsByTagName('tr')[0];
    var tds = tr.getElementsByTagName('td');
    
    var afterNode = tds[indexes.After];
    
    for(i in names)
    {
     afterNode = InsertClonedNodeAfter(tr, afterNode, names[i]);
    }
}

function AddDerivedCalories(mealHeaderElement, indexes)
{
    var tableElement = mealHeaderElement.parentNode;
    var trs = tableElement.getElementsByTagName('tr');
    
    for(i in trs)
    {
     if(i == 0)
         continue;
     
     var tds = trs[i].getElementsByTagName('td');
     for(j in tds)
     {
         if(j == indexes.After)
         {
          var totalCalories = CalculateTotalCaloriesFromStrMacros(tds[indexes.Carbs].innerHTML, tds[indexes.Fat].innerHTML, tds[indexes.Protein].innerHTML);       
          if(!isNaN(totalCalories))
          {
              var newNode = InsertClonedNodeAfter(trs[i], tds[j], totalCalories);
              SetColorElement(newNode);
          }
          break;
         }
     }
     
     if(i == trs.length - 1)
         break;
    }
}

function ReplaceGoals(totalCalories, totalCarbs, totalFat, totalProtein)
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
    
    /*elems[remainingCaloriesId].innerHTML = parseInt(totalCalories)  - parseInt(elems[currentCaloriesId].innerHTML.replace(",", ""));     
    elems[remainingCarbId].innerHTML = parseInt(totalCarbs) - parseInt(elems[currentCarbId].innerHTML.replace(",", ""));
    elems[remainingFatId].innerHTML = parseInt(totalFat) - parseInt(elems[currentFatId].innerHTML.replace(",", ""));
    elems[remainingProteinId].innerHTML = parseInt(totalProtein) - parseInt(elems[currentProteinId].innerHTML.replace(",", ""));*/
     
    UpdateRemainingElement(elems[remainingCaloriesId], totalCalories, elems[currentCaloriesId].innerHTML);
    UpdateRemainingElement(elems[remainingCarbId], totalCarbs, elems[currentCarbId].innerHTML);
    UpdateRemainingElement(elems[remainingFatId], totalFat, elems[currentFatId].innerHTML);
    UpdateRemainingElement(elems[remainingProteinId], totalProtein, elems[currentProteinId].innerHTML);
}

function UpdateRemainingElement(element, total, current)
{
    element.innerHTML = parseInt(total)  - parseInt(current.replace(",", ""));
    SetColorElement(element);
}

function SetColorElement(element)
{
    if(parseInt(element.innerHTML) > 0)
        element.className = "positive";
    else
        element.className = "negative";
}

function removejscssfile(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement)
 
    for (var i=allsuspects.length; i>=0; i--) //search backwards within nodelist for matching elements to remove
    {
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}

function log(str) {
    console.log(str);
    logDiv.innerHTML += str + "<br>";
}

function getFullX(x) {
    if(x > 9)
        return x;
    
    return "0".concat(x);
}

Date.prototype.addDays = function(n) {
    var time = this.getTime();
    var newDate = new Date(time + (n * 24 * 60 * 60 * 1000));
    this.setTime(newDate.getTime());
    return this;
};

Date.prototype.getFullMonth = function() {
    var month = this.getMonth() + 1;
    return getFullX(month);
};

Date.prototype.getFullDate = function() {
    var date = this.getDate();
    return getFullX(date);
};

var logDiv = document.createElement("div");
logDiv.style.border = "1px dashed black";
document.body.appendChild(document.createElement("br"));
document.body.appendChild(logDiv);

$(function(){
     
    chrome.runtime.sendMessage({data: true}, function(response) {
        var json = JSON.parse(response);
        var days = JSON.parse(json[0]);
        var data = JSON.parse(json[1]);
        var fixURL = JSON.parse(json[2]);
     
        if (fixURL)
        {
            var url = document.URL;
            var dateParam = "?date=";
            if(url.indexOf(dateParam) == -1)
            {          
                var nextElement = FindElementByClass("next");
                var nextDate = nextElement.href.substring(nextElement.href.indexOf(dateParam) + 6);
            
                var d = new Date(nextDate);
                d.addDays(-1);
                var year = d.getFullYear()
                var month = d.getFullMonth()
                var date = d.getFullDate()
                
                var addURL = "/diary/add";
                var newAddURL = addURL.concat(dateParam, year, "-", month, "-", date);
                document.body.innerHTML = document.body.innerHTML.replace(/\/diary\/add/g, newAddURL);
            }
        }

        var dateElement = FindElementByClass("date");

        var day = parseInt(0);

        for(var i = 0; i < days.length; ++i)
        {
            if(dateElement.innerHTML.indexOf(days[i]) != -1)
            {
                day = parseInt(i);
                break;
            }
        }

        var goalCarbs = data[day].carbs;
        var goallFat = data[day].fat;
        var goalProtein = data[day].protein;
        var goalCalories = data[day].totaldesiredcalories;

        var mealHeaderElement = FindMealHeaderElement();

        // cannot end with 'n'
        var postName = "Protei";
        var names = [];
        names.push("DerivedCalories");

        var indexes = {};

        AddHeaders(mealHeaderElement, names, postName, indexes);
        AddFooters(mealHeaderElement, names, indexes);

        ReplaceGoals(goalCalories, goalCarbs, goallFat, goalProtein);
        AddDerivedCalories(mealHeaderElement, indexes);         

        $('.google_ads_with_related_links').remove();
        removejscssfile("show_ads.js", "js");

        var contentElem = document.getElementsByTagName("content");
        content.removeChild(content.firstChild);

        var divs = document.body.children;
        for (var i=divs.length - 1; i>=0; --i)
        {
            if(divs[i].outerHTML.replace('"', '').replace('"', '') == "<div style=border: 1px dashed black;></div>")
            {
                divs[i].parentNode.removeChild(divs[i]);
            }
        }
    });
});

