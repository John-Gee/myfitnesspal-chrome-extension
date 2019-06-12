function ToIntFromStr(text)
{
    return parseInt(text.replace(",", ""));
}

function FindElementByClass(classString)
{
    var elements = FindElementsByClass(classString);

    if (elements.length > 0)
        return elements[0];

    return undefined;
}

function FindElementsByClass(classString)
{
    var elems = document.getElementsByTagName('*'), i;

    var elements = [];

    for(i in elems)
        if ((" " + elems[i].className + " ").indexOf(" " + classString + " ") > -1)
            elements.push(elems[parseInt(i)]);

    return elements;
}

function FindMealHeaderElement()
{
    return FindElementByClass("meal_header");
}

function InsertClonedNodeAfter(parentNode, afterNode, content)
{
    var newNode = afterNode.cloneNode(false);
    newNode.innerHTML = content;
    parentNode.insertBefore(newNode, afterNode.nextSibling); 
    return newNode;
}


function GetIndexes(mealHeaderElement)
{
    var headers = mealHeaderElement.getElementsByTagName('td');

    var indexes = {};
    var afterNode = undefined;

    for(i in headers)
    {
        if(headers[i].innerHTML == undefined)
            break;
        switch(headers[i].innerText.trim().replace(/ +/g, " "))
        {
            case "Carbs\ng":
                indexes.Carbs = i;
                break;
            case "Fat\ng":
                indexes.Fat = i;
                break;
            case "Protein\ng":
                indexes.Protein = i;
                break;
            case "Fiber\ng":
                indexes.Fiber = i;
            default:
                indexes.After = i;
        }
    }

    return indexes;
}


function AddHeaders(mealHeaderElement, names, indexes)
{
    var headers = mealHeaderElement.getElementsByTagName('td');
    afterNode = headers[indexes.After];

    for(i in names)
        afterNode = InsertClonedNodeAfter(mealHeaderElement, afterNode, names[i]);
}

function AddFooters(mealHeaderElement, names, indexes)
{
    var footerElement = mealHeaderElement.parentNode.parentNode.lastChild.previousSibling;

    var tr = footerElement.getElementsByTagName('tr')[0];
    var tds = tr.getElementsByTagName('td');

    var afterNode = tds[indexes.After];

    for(i in names)
        afterNode = InsertClonedNodeAfter(tr, afterNode, names[i]);
}


function AddNetCarbs(mealHeaderElement, indexes, goalCarbs)
{
    var tableElement = mealHeaderElement.parentNode;
    var trs = tableElement.getElementsByTagName('tr');
    var totalNetCarbs = undefined;

    for(i in trs)
    {
        if(i == 0)
            continue;

        var tds = trs[i].getElementsByTagName('td');
        for(j in tds)
        {
            if(j == indexes.After)
            {
                if (i == trs.length - 2)
                    var netCarbs = goalCarbs;

                else if (i == trs.length - 1)
                    var netCarbs = goalCarbs - totalNetCarbs;

                else
                    var netCarbs = ToIntFromStr(tds[indexes.Carbs].innerText) - ToIntFromStr(tds[indexes.Fiber].innerText);

                    if (i == trs.length - 3)
                        totalNetCarbs = netCarbs;

                if(!isNaN(netCarbs))
                {
                    var newNode = InsertClonedNodeAfter(trs[i], tds[j], netCarbs);
                    SetColorElement(newNode);
                }

                break;
            }
        }

        if(i == trs.length - 1)
            break;
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
                var totalCalories = (ToIntFromStr(tds[indexes.Carbs].innerText) * 4) + (ToIntFromStr(tds[indexes.Fat].innerText) * 9) + (ToIntFromStr(tds[indexes.Protein].innerText) * 4);

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
    var goalLabelId    = parseInt(-1);
    var remainingLabelId = parseInt(-1);

    for(i in elems)
    {
        if (elems[i].className == classString)
        {
            switch(elems[i].innerText.trim())
            {
                case "Totals":
                    currentLabelId = parseInt(i);
                    break;
                case "Your Daily Goal":
                    goalLabelId = parseInt(i);
                    break;
                case "Remaining":
                    remainingLabelId = parseInt(i);
                    break;
            }
        }
    }

    var currentCaloriesId = currentLabelId + 1;
    var currentCarbId = currentCaloriesId + 2;
    var currentFatId = currentCarbId + 3;
    var currentProteinId = currentFatId + 3;

    var caloriesGoalId = goalLabelId + 1;
    var carbGoalId = caloriesGoalId + 2;
    var fatGoalId = carbGoalId + 3;
    var proteinGoalId = fatGoalId + 3;

    elems[caloriesGoalId].innerHTML = totalCalories;
    elems[carbGoalId].innerHTML = totalCarbs;
    elems[fatGoalId].innerHTML = totalFat;
    elems[proteinGoalId].innerHTML = totalProtein;

    var remainingCaloriesId = remainingLabelId + 1;
    var remainingCarbId = remainingCaloriesId + 1;
    var remainingFatId = remainingCarbId + 1;
    var remainingProteinId = remainingFatId + 1;

    UpdateRemainingElement(elems[remainingCaloriesId], totalCalories, elems[currentCaloriesId].innerHTML);
    UpdateRemainingElement(elems[remainingCarbId], totalCarbs, elems[currentCarbId].innerHTML);
    UpdateRemainingElement(elems[remainingFatId], totalFat, elems[currentFatId].innerHTML);
    UpdateRemainingElement(elems[remainingProteinId], totalProtein, elems[currentProteinId].innerHTML);
}

function UpdateRemainingElement(element, total, current)
{
    element.innerText = parseInt(total)  - parseInt(current.replace(",", ""));
    SetColorElement(element);
}

function SetColorElement(element)
{
    if(parseInt(element.innerHTML) > 0)
        element.className = "positive";
    else
        element.className = "negative";
}

function removejscssfile(filename, filetype)
{
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement)

    for (var i=allsuspects.length; i>=0; i--) //search backwards within nodelist for matching elements to remove
    {
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}

function log(str)
{
    console.log(str);
    logDiv.innerHTML += str + "<br>";
}

function getFullX(x)
{
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

function GetMonthName(monthNumber)
{
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    var number = parseInt(monthNumber);

    if (isNaN(number) || (number < 1) || (number > 12))
        return "undefined";

    return monthNames[number - 1];
}

var logDiv = document.createElement("div");
logDiv.style.border = "1px dashed black";
document.body.appendChild(document.createElement("br"));
document.body.appendChild(logDiv);

$(function(){

    chrome.runtime.sendMessage({data: true}, function(response) {
        var json        = JSON.parse(response);
        var days        = JSON.parse(json[0]);
        var data        = JSON.parse(json[1]);
        var fixURL      = JSON.parse(json[2]);
        var addNetCarbs = JSON.parse(json[3]);

        if (fixURL)
        {
            var url = document.URL;
            var dateParam = "date=";
            if(url.indexOf(dateParam) == -1)
            {
                var nextElement = FindElementByClass("next");
                var nextDate = nextElement.href.substring(nextElement.href.indexOf(dateParam) + 6);

                var nextDateValues = nextDate.split("-");
                // fix for UTC parsing
                var d = new Date(GetMonthName(nextDateValues[1]).concat(" ", nextDateValues[2], ", ", nextDateValues[0]));
                d.addDays(-1);
                var year = d.getFullYear()
                var month = d.getFullMonth()
                var date = d.getFullDate()

                var addURL = "/food/add_to_diary?";
                var newAddURL = addURL.concat(dateParam, year, "-", month, "-", date, "&");
                var addFoodElements = FindElementsByClass("add_food");
                for(var i = 0; i < addFoodElements.length; ++i)
                    addFoodElements[i].href = addFoodElements[i].href.replace(addURL, newAddURL);
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

        var names = ["Derived Calories<div class=\"subtitle\">kcal</div>"];

        var indexes = GetIndexes(mealHeaderElement);
        if (addNetCarbs && ("Fiber" in indexes))
            names.unshift("Net Carbs<div class=\"subtitle\">g</div>");

        AddHeaders(mealHeaderElement, names, indexes);
        AddFooters(mealHeaderElement, names, indexes);

        ReplaceGoals(goalCalories, goalCarbs, goallFat, goalProtein);
        AddDerivedCalories(mealHeaderElement, indexes);
        if (names[0].includes("Net Carbs" ))
            AddNetCarbs(mealHeaderElement, indexes, goalCarbs);

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
