function el(name)
{
    return document.getElementById(name);
}

function toggleLineupDropdown()
{
    el("lineupDropdownDiv").classList.toggle("dropdownShow");
}

let teamBlue = null;
let teamRed = null;

let sorting = "nationForward";
let lineupHasBeenSelected = false;

function selectLineup(name, ignoreToggle) // type = bottom or top lineup
{
    if (!ignoreToggle) toggleLineupDropdown();

    el("lineupButton").innerHTML = name;
    const type = name.split("_")[1] === '1' ? "bottom" : "top";

    const lineupVehicles = getAllVehiclesInLineup(name, type);
    teamBlue = lineupVehicles.blue;
    teamRed = lineupVehicles.red;

    fillLineupTable();

    localStorage.setItem("lineup", name);
    lineupHasBeenSelected = true;
}

function changeSorting(newSorting)
{
    sorting = newSorting;
    fillLineupTable();
}

function fillLineupTable()
{
    el("lineupBlue").innerHTML = "";
    el("lineupRed").innerHTML = "";

    // Head
    function addHeader(tableName, isLeftOrder)
    {
        const tr = document.createElement("tr");
        tr.style.textShadow = "1px 1px 1px black";
        tr.style.fontWeight = "bolder";
        el(tableName).appendChild(tr);

        const headerClass = isLeftOrder ? "tableHeaderBlue" : "tableHeaderRed";

        const tdNation = document.createElement("td");
        tdNation.innerHTML = locale === "en" ? en.nation : ru.nation;
        tdNation.style.fontSize = "0.7em";
        tdNation.style.width = "10%";
        tdNation.classList.add(headerClass);
        tdNation.onclick = () => { sorting !== 'nationForward' ? changeSorting('nationForward') : changeSorting('nationInverse'); };

        const tdClass = document.createElement("td");
        tdClass.innerHTML = locale === "en" ? en.cl : ru.cl;
        tdClass.style.fontSize = "0.7em";
        tdClass.style.width = "10%";
        tdClass.classList.add(headerClass);
        tdClass.onclick = () => { sorting !== 'classForward' ? changeSorting('classForward') : changeSorting('classInverse'); };

        const tdBR = document.createElement("td");
        tdBR.innerHTML = locale === "en" ? en.br : ru.br;
        tdBR.classList.add(headerClass);
        tdBR.onclick = () => { sorting !== 'brForward' ? changeSorting('brForward') : changeSorting('brInverse'); };

        const tdName = document.createElement("td");
        tdName.innerHTML = locale === "en" ? en.name : ru.name;
        tdName.classList.add(headerClass);
        tdName.onclick = () => { sorting !== 'nameForward' ? changeSorting('nameForward') : changeSorting('nameInverse'); };

        if (isLeftOrder)
        {
            tr.appendChild(tdNation);
            tr.appendChild(tdClass);
            tr.appendChild(tdBR);
            tr.appendChild(tdName);
        }
        else
        {
            tr.appendChild(tdName);
            tr.appendChild(tdBR);
            tr.appendChild(tdClass);
            tr.appendChild(tdNation);
        }
    }

    // Sorting

    function sortVehicles(a, b)
    {
        switch (sorting)
        {
            case "nationForward": return a.nation.localeCompare(b.nation);
            case "nationInverse": return b.nation.localeCompare(a.nation);

            case "classForward": return a.cl.localeCompare(b.cl);
            case "classInverse": return b.cl.localeCompare(a.cl);

            case "brForward": return a.br.localeCompare(b.br);
            case "brInverse": return b.br.localeCompare(a.br);

            case "nameForward": return a.enName.localeCompare(b.enName);
            case "nameInverse": return b.enName.localeCompare(a.enName);
        }
    }

    teamBlue.sort(sortVehicles);
    teamRed.sort(sortVehicles);

    addHeader("lineupBlue", true);
    addHeader("lineupRed", false);

    function addVehicle(tableName, vehicle, isLeftOrder)
    {
        const tr = document.createElement("tr");
        tr.style.textShadow = "1px 1px 1px black";
        el(tableName).appendChild(tr);

        const tdNation = document.createElement("td");
        const tdClass = document.createElement("td");
        const tdBR = document.createElement("td");
        const tdName = document.createElement("td");

        if (isLeftOrder)
        {
            tr.appendChild(tdNation);
            tr.appendChild(tdClass);
            tr.appendChild(tdBR);
            tr.appendChild(tdName);
        }
        else
        {
            tr.appendChild(tdName);
            tr.appendChild(tdBR);
            tr.appendChild(tdClass);
            tr.appendChild(tdNation);
        }

        tdNation.appendChild(getNation(vehicle.nation));
        tdClass.appendChild(getClass(vehicle.cl));
        tdBR.innerHTML = vehicle.br;
        tdName.innerHTML = (locale === "ru" && vehicle.ruName !== "") ? vehicle.ruName : vehicle.enName;
    }

    for (const v of teamBlue)   addVehicle("lineupBlue", v, true);
    for (const v of teamRed)    addVehicle("lineupRed", v, false);
}

function getNation(nation)
{
    const img = document.createElement("img");
    img.style.maxWidth = "60%";
    img.style.filter = "drop-shadow(1px 1px 2px #000000)";
    let src;
    let title;

    switch (nation)
    {
        case "ussr":        src = "flags/ussr.png";     title = "USSR"; break;
        case "germany":     src = "flags/germany.png";  title = "Germany"; break;
        case "usa":         src = "flags/usa.png";      title = "USA"; break;
        case "britain":     src = "flags/britain.png";  title = "Great Britain"; break;
        case "france":      src = "flags/france.png";   title = "France"; break;
        case "italy":       src = "flags/italy.png";    title = "Italy"; break;
        case "japan":       src = "flags/japan.png";    title = "Japan"; break;
        case "china":       src = "flags/china.png";    title = "China"; break;
        case "sweden":      src = "flags/sweden.png";   title = "Sweden"; break;
        case "israel":      src = "flags/israel.png";   title = "Israel"; break;
    }

    img.src = src;
    img.title = title;
    return img;
}

function getClass(cl)
{
    const img = document.createElement("img");
    img.style.maxWidth = "60%";
    img.style.filter = "drop-shadow(1px 1px 2px #000000)";
    let src;
    let title;

    switch (cl)
    {
        case "light":       src = "classes/light.png";      title = "Light Tank"; break;
        case "medium":      src = "classes/medium.png";     title = "Medium Tank"; break;
        case "heavy":       src = "classes/heavy.png";      title = "Heavy Tank"; break;
        case "spg":         src = "classes/spg.png";        title = "SPG"; break;
        case "spaa":        src = "classes/spaa.png";       title = "SPAA"; break;
        case "fighter":     src = "classes/fighter.png";    title = "Fighter"; break;
        case "attacker":    src = "classes/attacker.png";   title = "Attacker"; break;
        case "bomber":      src = "classes/bomber.png";     title = "Bomber"; break;
        case "heli":        src = "classes/heli.png";       title = "Helicopter"; break;
    }

    img.src = src;
    img.title = title;
    return img;
}