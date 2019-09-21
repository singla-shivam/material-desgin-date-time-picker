(((global, factory) => {    
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.DTP = factory());
})(this, () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['S','M','T','W','T','F','S'];
    const noOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    var dtp = {}

    //dtp["id"].y2 - current years in years table e.g 2019, 2019+24, 2019+48
    //dtp["id"].y - current year selected
    var datePicker = function(element, options){    
        if(!element){
            console.error("the element is null");
            return;
        }
        if(element.tagName.toUpperCase() != "INPUT"){
            console.error("The element to be instanciated should be input field only");
            return;
        }
        if(!element.id){
            console.error("The element must have an id");
            return;
        }
        if(element.type.toUpperCase() != "TEXT"){
            console.error("The element to be instanciated should be text type only");
            return;
        }
        element.setAttribute('pattern', "^(0[1-9]|[12][0-9]|3[01])[\/](0[1-9]|1[012])[\/][0-9]{4}$");
        const nowDate = new Date()
        element.value = `${nowDate.getDate().toString().padStart(2, '0')}/${nowDate.getMonth().toString().padStart(2, '0')}/${nowDate.getFullYear()}`;
        element.parentNode.classList.add("select-none");
        var container = element.parentNode.querySelector(".dtp-container");
        if(!container) {
            console.error("d_root is null");
        }
        element.onfocus = function(event){
            var container = event.target.parentNode.querySelector(".dtp-container");
            container.classList.remove("dtp-container-hide");
            //console.log(event.target.offsetLeft, event.target.offsetTop)
            //console.log(container)
            if((window.innerHeight - event.target.offsetTop < 380) && window.innerHeight >= 340 && event.target.offsetTop >= 340) container.style.top = (event.target.offsetTop - 368) + "px";
            else container.style.top = (event.target.offsetTop + 24)  + "px"
            if(window.innerWidth - event.target.offsetLeft < 310) container.style.left = (event.target.offsetLeft - 304) + "px";
            else container.style.left = (event.target.offsetLeft + 4)  + "px"
            container.style.display = "block";
        }
        element.addEventListener('click', (event) => {event.stopPropagation()});
        container.addEventListener('click', (event) => {event.stopPropagation()});
        window.addEventListener('click', () => {
            if(container.style.display == "block"){
                container.classList.add("dtp-container-hide");
                setTimeout(() => {container.style.display = "none";}, 200);
            }
        });
        dtp[element.id] = {};
        if(options){
            if(options.max) dtp[element.id].max = options.max;
            if(options.min) dtp[element.id].min = options.min;
        }
        container.setAttribute("data-id", element.id);      
        make(container, new Date());
    }

    // initial build
    var make = function(element, today){
        let id = element.getAttribute("data-id");
        let p = document.getElementById(id).parentNode;
        dtp[id].y = today.getFullYear();
        dtp[id].m = today.getMonth();
        var d = document.createElement("div");
        d.className = "dtp-controls";
        element.appendChild(d);
        d.innerHTML += "<button class=\"dtp-change-month dtp-ripple-upgraded dtp-ripple-upgraded--unbounded dtp-button\" data-id=" + id+ "><div class=\"dtp-previous dtp-next\" data-id=" + id + "></div></button>";
        d.innerHTML += "<button class=\"dtp-change-month2 dtp-ripple-upgraded dtp-ripple-upgraded--unbounded dtp-button\" data-id=" + id + "><div class=\"dtp-previous\" data-id=" + id + "></div></button>";
        var b = document.createElement("button");
        b.className = "dtp-control-button";
        b.setAttribute("data-id", id);
        d.appendChild(b);
        b.innerHTML = months[today.getMonth()] + " " + today.getFullYear();
        b.innerHTML += "<div class=\"dtp-arrow\"></div>";
        var div = document.createElement("div");
        div.className = "dtp-table-div";
        element.appendChild(div);
        mp(id)
        showOneMonth(today, id);
        p.querySelector(".dtp-control-button").addEventListener('click', showYears2);
    }

    // show years table
    var showYears = function(x, id){
        let p = document.getElementById(id).parentNode;
        var div = p.querySelector(".dtp-table-div");
        div.innerHTML = "";
        var table = document.createElement("table");
        table.className = "dtp-table";
        var r = document.createElement("tr");
        r.className = "dtp-table-row-head";
        table.appendChild(r);
        if(x >= dtp[id].max) x = dtp[id].max - 1;
        let y = x - 20; 
        //console.log(y, x);
        if(y < dtp[id].min) y = dtp[id].min
        if((x - y) < 20) x = x + (23 - (x - y));
        else x = x + 3;
        if(x > dtp[id].max) x = dtp[id].max
        p.querySelector(".dtp-control-button").innerHTML = y + "-" + (x) + "<div class=\"dtp-arrow\" data-id='" + id + "' style=\"transform:rotate(180deg) translateY(3px)\"></div>";
        //console.log(y, x);
        for(let i = 0; i < 6 && y<=x; i++){
            let row = document.createElement("tr");
            for(var j = 0; j < 4; j++,y++){
                let cell = document.createElement("td");
                cell.className = "dtp-table-cell";
                cell.setAttribute("data-id", id);
                var classes = "dtp-table-cell-div " + ((y > x) ? " " : "dtp-table-cell-div-hover")
                if(y == new Date().getFullYear()) cell.innerHTML = "<div class='" + classes + " dtp-table-cell-div-s1' data-id='" + id + "'>"+ ((y > x) ? "" : y) + "</div>";
                else if(y == dtp[id].y) cell.innerHTML = "<div class='" + classes + " dtp-table-cell-div-s2' data-id='" + id + "'>"+ ((y > x) ? "" : y) + "</div>";
                else  cell.innerHTML = "<div class=" + classes + "  data-id='" + id + "'>"+ ((y > x) ? "" : y) + "</div>";
                row.appendChild(cell);
            }
            table.appendChild(row);
        }        
        div.appendChild(table); 
        dtp[id].y2 = x;
        U2();
    }

    // show one month
    var showOneMonth = function(today, id){
        if(today.target){
            id = today.target.getAttribute("data-id")
            //console.log(months.indexOf(today.target.innerHTML))
            today = new Date(dtp[id].y, months.indexOf(today.target.innerHTML))
            //console.log(today)
        }
        let p = document.getElementById(id).parentNode;
        if(today.getFullYear() > dtp[id].max || today.getFullYear() < dtp[id].min) return;
        p.querySelector(".dtp-control-button").addEventListener('click', showYears2);
        dtp[id].y = today.getFullYear();
        dtp[id].m = today.getMonth();
        p.querySelector(".dtp-control-button").innerHTML = months[today.getMonth()] + " " + today.getFullYear();
        p.querySelector(".dtp-control-button").innerHTML += "<div class=\"dtp-arrow\" data-id='" + id + "'></div>";
        var div = p.querySelector(".dtp-table-div");
        div.innerHTML = "";
        var table = document.createElement("table");
        table.className = "dtp-table";
        var row = document.createElement("tr");
        row.className = "dtp-table-row-head";
        days.forEach(day => {
            var cell = document.createElement("td");
            cell.className = "dtp-table-cell-days";
            cell.innerHTML = day;
            row.appendChild(cell);            
        });
        table.appendChild(row);
        row = document.createElement("tr");
        row.style.height = "8px";
        table.appendChild(row);
        var tbody = document.createElement("tbody");
        tbody.className = "dtp-table-tbody";
        row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.className = "dtp-table-cell-title";
        cell.style.width = (window.getComputedStyle(document.body).getPropertyValue("--dtp-cell-width").replace("px","")*2 - 16) + "px";
        cell.colSpan = "2";
        cell.innerHTML = months[today.getMonth()];
        row.appendChild(cell);
        var iDay = 1;
        if(new Date(today.getFullYear(), today.getMonth(), 1).getDay() > 1){
            for(let i = 2 ; i < 7; i++){
                let cell = document.createElement("td");
                cell.className = "dtp-table-cell";   
                if(i >= new Date(today.getFullYear(), today.getMonth(), 1).getDay()){
                    cell.innerHTML = iDay;
                    cell.setAttribute("data-id", id);
                    iDay++;     
                }     
                row.appendChild(cell);
            }
        }
        tbody.appendChild(row);
        var upx = noOfDays[today.getMonth()];
        if(today.getFullYear()%4 == 0 && (today.getFullYear()%100 != 0 || today.getFullYear()%400 == 0) && today.getMonth() == 1) upx++;
        for(var i = 0; i < 5; i++){
            row = document.createElement("tr");
            row.className = "dtp-table-row";
            for(let j = 1 ; j <= 7 &&  iDay <= upx; j++){
                let cell = document.createElement("td");
                cell.className = "dtp-table-cell";
                cell.setAttribute("data-id", id);
                if(j > new Date(today.getFullYear(), today.getMonth(), iDay).getDay()){
                    cell.innerHTML = iDay;
                    iDay++;
                }   
                row.appendChild(cell);                             
            }
            tbody.appendChild(row);            
        }
        tbody.appendChild(row);
        table.appendChild(tbody);
        div.appendChild(table);
        U()
    }

    // month + 1
    var showNextMonth = function(e){
        showOneMonth(new Date(dtp[e.target.getAttribute("data-id")].y, dtp[e.target.getAttribute("data-id")].m - 1), e.target.getAttribute("data-id"));
    }

    // month - 1
    var showPreviousMonth = function(e){
        showOneMonth(new Date(dtp[e.target.getAttribute("data-id")].y, dtp[e.target.getAttribute("data-id")].m + 1), e.target.getAttribute("data-id"));
    }

    // years - 20
    var showPreviousYears = function(e){
        showYears(dtp[e.target.getAttribute("data-id")].y2 - 24, e.target.getAttribute("data-id"));

    }

    // years + 4
    var showNextYears = function(e){
        showYears(dtp[e.target.getAttribute("data-id")].y2 + 24, e.target.getAttribute("data-id"));
    }

    // show years
    var showYears2 = function(e){
        let x = e.target;
        let id = x.getAttribute("data-id");
        mo(id);
        mn(id);
        let p = document.getElementById(id).parentNode;
        el(id, "dtp-control-button").removeEventListener('click', showYears2);
        el(id, "dtp-control-button").addEventListener('click', (e) => showOneMonth(new Date(dtp[id].y, dtp[id].m), id));
        dtp[id].y2 = dtp[id].y;
        showYears(dtp[id].y2, id);
    }

    // show months after selecting a year
    var showMonths = function(e){
        e.stopPropagation();
        let id = e.target.getAttribute("data-id");
        mm(id);
        let p = document.getElementById(id).parentNode;
        dtp[id].y = e.target.innerHTML;
        var div = p.querySelector(".dtp-table-div");
        div.innerHTML = "";
        p.querySelector(".dtp-control-button").innerHTML = e.target.innerHTML;
        var table = document.createElement("table");
        table.className = "dtp-table";
        var r = document.createElement("tr");
        r.className = "dtp-table-row-head";
        table.appendChild(r);
        div.appendChild(table);
        let k = 0;
        for(let i =0; i < 3 && k < 12; i++){
            let row = document.createElement("tr");
            for(let j = 0 ; j < 4; j++, k++){
                let cell = document.createElement("td");
                cell.className = "dtp-table-cell";
                cell.innerHTML = months[k];
                cell.setAttribute("data-id", e.target.getAttribute("data-id"));
                cell.addEventListener('click', showOneMonth)
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
    }

    var mm = function(id){
        el(id, 'dtp-change-month2').removeEventListener('click', showPreviousYears);
        el(id, 'dtp-change-month').removeEventListener('click', showNextYears);
    }

    var mn = function(id){
        el(id, 'dtp-change-month2').addEventListener('click', showPreviousYears);
        el(id, 'dtp-change-month').addEventListener('click', showNextYears);
    }

    var mo = function(id){
        el(id, 'dtp-change-month2').removeEventListener('click', showNextMonth);
        el(id, 'dtp-change-month').removeEventListener('click', showPreviousMonth);
    }
    
    var mp = function(id){
        el(id, 'dtp-change-month2').addEventListener('click', showNextMonth);
        el(id, 'dtp-change-month').addEventListener('click', showPreviousMonth);
    }

    //upgrade months table
    var U = function(){
        var ls = document.getElementsByClassName("dtp-table-cell");
        let id = ls[8].getAttribute("data-id");
        p = document.getElementById(id).parentNode;
        for(let i = 0; i < ls.length; i++){
            if(ls[i].innerHTML){
                ls[i].addEventListener('click', (e) => {
                    let id = e.target.getAttribute("data-id");
                    let p = document.getElementById(id).parentNode;
                    if(p.querySelector(".dtp-table-cell-selected")) p.querySelector(".dtp-table-cell-selected").classList.remove("dtp-table-cell-selected");
                    ls[i].classList.add("dtp-table-cell-selected");
                    let y = dtp[id].y,
                        m = dtp[id].m + 1,
                        d = ls[i].innerHTML;
                    dtp[id].selectedDate = y + "-" + m + "-" + d;
                    document.getElementById(id).value = f(d) + "/" + f(m) + "/" + y;
                    var ev = new CustomEvent("change");
                    document.getElementById(id).dispatchEvent(ev);
                    p.querySelector(".dtp-container").classList.add("dtp-container-hide");
                    setTimeout(() => {p.querySelector(".dtp-container").style.display = "none";}, 200);
                });
            }
        }
        mp(id);
        mm(id);
    }

    //upgrade years table
    var U2 = function(){
        var ls = document.getElementsByClassName("dtp-table-cell");
        for(let i = 0; i < ls.length; i++){
            if(ls[i].childNodes[0].innerHTML){
                ls[i].addEventListener('click', showMonths)
            }
        }
    }
    
    var timePicker = (element, options) =>{
        if(!element){
            console.error("the element is null");
            return;
        }
        if(element.tagName.toUpperCase() != "INPUT"){
            console.error("The element to be instanciated should be input field only");
            return;
        }
        if(!element.id){
            console.error("The element must have an id");
            return;            
        }
        if(element.type.toUpperCase() != "TEXT"){
            console.error("The element to be instanciated should be text type only");
            return;
        }
        element.setAttribute('pattern', "^(0[0-9]|1[012]|3[01])[\:](0[0-9]|[1-5][0-9])[\ ][AP]M$");
        element.value = "12:00 PM";
        element.parentNode.classList.add("select-none");
        var container = element.parentNode.querySelector(".dtp-container");
        if(!container) {
            console.error("d_root is null");
        }
        element.onfocus = function(event){
            var container = event.target.parentNode.querySelector(".dtp-container");
            container.classList.remove("dtp-container-hide");
            if(window.innerHeight - event.target.offsetTop < 320) container.style.top = (event.target.offsetTop - 320) + "px";
            else container.style.top = (event.target.offsetTop + 24)  + "px"
            if(window.innerWidth - event.target.offsetLeft < 240) container.style.left = (event.target.offsetLeft - 240) + "px";
            else container.style.left = (event.target.offsetLeft + 4)  + "px";
            tm(event.target.id)
            container.style.display = "block";
        }
        element.addEventListener('click', (event) => {event.stopPropagation()});
        container.addEventListener('click', (event) => {event.stopPropagation()});
        window.addEventListener('click', () => {
            if(container.style.display == "block"){
                document.getElementById(element.id).value = f(dtp[element.id].hr) + ":" + f(dtp[element.id].min) + " " + dtp[element.id].am;
                container.classList.add("dtp-container-hide");
                setTimeout(() => {container.style.display = "none";}, 200);
            }
        });
        dtp[element.id] = {
            hr : f(new Date().getHours()),
            min : f(new Date().getMinutes()),
            am : (new Date().getHours() > 12) ? "PM" : "AM"
        };
        if(options){
            if(options.max) dtp[element.id].max = options.max;
            if(options.min) dtp[element.id].min = options.min;
        }
        container.setAttribute("data-id", element.id);
        t = "m";
        tm(element.id);
    }

    //initial build
    var tm = (id) => {
        if(t != "h"){
            t = "h";
            let hr = dtp[id].hr;
            let mins = dtp[id].min;
            let amORpm = dtp[id].am;
            hr = hr > 12 ? hr - 12 : hr;
            document.getElementById(id).value = f(hr) + ":" + f(mins) + " " + amORpm;
            let p = document.getElementById(id).parentNode;
            let container = p.querySelector(".dtp-container");
            container.innerHTML = "";
            let div = document.createElement("div");
            div.className = "dtp-time-div-1";
            div.innerHTML = "<span class='dtp-hr-value dtp-time-active' data-id='" + id + "'>" + f(hr) + "</span><span>&nbsp;:&nbsp;</span><span class='dtp-min-value' data-id='" + id + "'>" + f(mins) + "</span><span>&nbsp;</span><span class='dtp-ampm-value' data-id='" + id + "'> " + amORpm + "</span>";
            container.appendChild(div);
            let div2 = document.createElement("div");
            div2.className = "dtp-time-div-2";
            container.appendChild(div2);
            let clock = document.createElement("div");
            clock.className = "dtp-clock";
            let cx = document.createElement("div");
            cx.className = "dtp-clock-center";
            let pointer = document.createElement("div");
            pointer.className = "dtp-clock-pointer";
            clock.appendChild(pointer);
            clock.appendChild(cx);
            for(let i = 1; i <= 12; i++){
                let el = document.createElement("div");
                el.className = "dtp-clock-elements0 dtp-clock-element" + i;
                el.innerHTML = i;
                el.setAttribute("data-id", id);
                if(i == hr){
                    el.classList.add("dtp-clock-element-active");
                    pointer.style.transform = "rotate(" + (i*30 - 90) + "deg)";
                    dtp[id].hr = i;
                    dtp[id].min = mins;
                }
                el.addEventListener('click', tmin);
                clock.appendChild(el);
            }
            div2.appendChild(clock);
            el(id, "dtp-hr-value").addEventListener('click', thr);
            el(id, "dtp-min-value").addEventListener('click', (e) => {
                tmin(e);
            });
            el(id, "dtp-ampm-value").addEventListener('click', (e) => {
                let id = e.target.getAttribute("data-id");
                if(dtp[id].am == "AM"){
                    el(id, "dtp-ampm-value").innerHTML = "PM";
                    dtp[id].am = "PM";
                }
                else{
                    el(id, "dtp-ampm-value").innerHTML = "AM";
                    dtp[id].am = "AM";
                }
            });
            let div3 = document.createElement("div");
            div3.className = "dtp-time-div-3";
            container.appendChild(div3);
            div3.innerHTML = "<button class=\"dtp-control-button dtp-time-cancel dtp-button-unelevated\" data-id='" + id + "'>Cancel</button>&nbsp;<button class=\"dtp-control-button dtp-time-done dtp-button-unelevated\" data-id='" + id + "'>done</button>"
            el(id, "dtp-time-cancel").addEventListener('click', c);
            el(id, "dtp-time-done").addEventListener('click', c);
        }
    }

    // set hour and show minutes
    var tmin = (e) => {
        e.stopPropagation();
        if(t != "m"){
            t = "m";
            let element = e.target;
            let id = element.getAttribute('data-id');
            let p = document.getElementById(id).parentNode;
            let elements = p.getElementsByClassName("dtp-clock-elements0");
            let clock = el(id, "dtp-clock");
            if(element.tagName == "DIV") dtp[id].hr = element.innerHTML;
            if(element.tagName == "DIV") el(id, "dtp-clock-pointer").style.transform = "rotate(" + ((element.innerHTML) * 30 - 90) + "deg)";
            if(element.tagName == "DIV") el(id, "dtp-clock-element-active").classList.remove("dtp-clock-element-active");
            if(element.tagName == "DIV") element.classList.add("dtp-clock-element-active");
            for(let i = 1; i <= 60; i++){
                let el = document.createElement("div");
                if(i%5 == 0){
                    el.className = "dtp-clock-elements0 dtp-clock-element" + (i/5) + " dtp-opacity-0";
                    el.innerHTML = f(i);
                    el.style.zIndex = 2;
                    el.setAttribute("data-rotate", i*6);
                    if(i == dtp[id].min) el.classList.add("dtp-clock-element-active")
                    if(i == dtp[id].min && element.tagName == "DIV") element.classList.add("dtp-clock-element-active");
                }
                else{
                    let r1 = (i * 6 - 90);
                    let r2 = -r1;
                    el.className = "dtp-clock-elements0";
                    el.innerHTML = "<div class=''></div>"
                    el.style.transform = "rotate(" + r1 + "deg) translate(63px) rotate(" + r2 + "deg)";
                    el.setAttribute("data-rotate", i*6)
                    if(i == dtp[id].min){
                        setTimeout(() => {
                            el.style.background = ch("--dtp-primary-light");
                            el.innerHTML = "<div class='dtp-clock-minutes'></div>"
                        }, 400)
                    }
                }
                el.setAttribute("data-id", id);
                el.addEventListener('click', tsm);
                clock.appendChild(el);
            }
            let newElements = p.getElementsByClassName("dtp-opacity-0");
            setTimeout(() => {
                el(id, "dtp-clock-pointer").style.opacity = 0;
                for(let i = 1; i <= 12; i++){
                    elements[i - 1].classList.remove("dtp-clock-element" + i);
                    elements[i - 1].classList.add("dtp-clock-element-hide" + i);
                    newElements[0].classList.remove("dtp-opacity-0");
                }
            }, 250);
            setTimeout(() => {
                el(id, "dtp-hr-value").innerHTML = f(dtp[id].hr);
                el(id, "dtp-time-active").classList.remove("dtp-time-active");
                el(id, "dtp-min-value").classList.add("dtp-time-active");
                el(id, "dtp-clock-pointer").style.opacity = 1;
                el(id, "dtp-clock-pointer").style.transform = "rotate(" + ((dtp[id].min) * 6 - 90) + "deg)";
            }, 350)
            setTimeout(() => {
                rm(id)
            }, 600);
        }
    }

    // show hours
    var thr = (e) => {
        e.stopPropagation();
        if(t != "h"){
            t = "h";
            let id = e.target.getAttribute('data-id');
            let p = document.getElementById(id).parentNode;
            let clock = el(id, "dtp-clock");
            let elements = p.getElementsByClassName("dtp-clock-elements0");
            for(let i = 1; i <= 12; i++){
                let elx = document.createElement("div");
                elx.className = "dtp-clock-elements0 dtp-clock-element" + i + " dtp-opacity-0";
                elx.innerHTML = i;
                elx.setAttribute("data-id", id);
                if(i == dtp[id].hr){
                    elx.classList.add("dtp-clock-element-active");
                    //el(id, "dtp-clock-pointer").style.transform = "rotate(" + (i*30 - 90) + "deg)";
                }
                elx.addEventListener('click', tmin);
                clock.appendChild(elx);
            }
            let newElements = p.getElementsByClassName("dtp-opacity-0");
            setTimeout(() => {
                el(id, "dtp-clock-pointer").style.opacity = 0;
                for(let i = 1; i <= 60; i++){
                    elements[i - 1].style.transform = "";
                    if(i%5 == 0){
                        elements[i - 1].classList.remove("dtp-clock-element" + (i/5));
                        elements[i - 1].classList.add("dtp-clock-element-hide" + (i/5));
                    }
                    else{
                        let r1 = (i * 6 - 90);
                        let r2 = -r1;
                        elements[i - 1].classList.add("dtp-remove");
                        elements[i - 1].style.transform = "rotate(" + r1 + "deg) translate(80px) rotate(" + r2 + "deg)";
                        elements[i - 1].style.opacity = 0;
                    }
                    if(newElements[0]) newElements[0].classList.remove("dtp-opacity-0");
                }
            }, 250);
            setTimeout(() => {
                el(id, "dtp-time-active").classList.remove("dtp-time-active");
                el(id, "dtp-hr-value").classList.add("dtp-time-active");
                el(id, "dtp-clock-pointer").style.opacity = 1;
                el(id, "dtp-clock-pointer").style.transform = "rotate(" + ((dtp[id].hr) * 30 - 90) + "deg)";            
            }, 350)
            setTimeout(() => {
                rm(id)
            }, 600);
        }
    }

    // set minutes
    var tsm = (e) => {
        let element = e.target;
        let id = element.getAttribute("data-id");
        if(el(id, "dtp-clock-minutes")){
            var ax = el(id, "dtp-clock-minutes");
            ax.parentNode.style.background = "unset";
            ax.classList.remove("dtp-clock-minutes");
        }
        if(el(id, "dtp-clock-element-active")){
            var ay = el(id, "dtp-clock-element-active");
            ay.classList.remove("dtp-clock-element-active");
        }
        if(element.innerHTML.includes("div")){
            element.childNodes[0].classList.add("dtp-clock-minutes");
            element.style.background = ch("--dtp-primary-light");
            el(id, "dtp-clock-pointer").style.transform = "rotate(" + (element.getAttribute("data-rotate") - 90 ) + "deg)";
            el(id, "dtp-min-value").innerHTML = f((element.getAttribute("data-rotate")/6));
            dtp[id].min =  f((element.getAttribute("data-rotate")/6))
        }
        else{
            element.classList.add("dtp-clock-element-active");
            el(id, "dtp-clock-pointer").style.transform = "rotate(" + (element.getAttribute("data-rotate") - 90 ) + "deg)";
            el(id, "dtp-min-value").innerHTML = f(element.innerHTML);
            dtp[id].min =  f(element.innerHTML)
        }
        
    }

    // format integers
    var f = (o) => {
        o = parseInt(o, 10)
        if(o == 60) return "00";
        else if(o == 0) return "00";
        else return ((o < 10) ? "0" + o : o)
    }

    //get element
    var el = (id, clas) => {
        return document.getElementById(id).parentNode.querySelector("." + clas);
    }

    //get color of opacity 0.3
    var ch = (x) =>{
        x = getComputedStyle(document.documentElement).getPropertyValue(x);
        if(x.includes("#")){
          x = x.replace("#", "")
          x = x.trim()
          return "rgba(" + parseInt(x.substring(0,2), 16) +"," + parseInt(x.substring(2,4), 16) + "," + parseInt(x.substring(4,6), 16)+",0.3)"
        }
        else{
            x = x.replace("rgb", "");
            x = x.replace("(", "")
            x = x.replace(")", "")
            x = x.split(",")
            return "rgba(" + x[0] + "," + x[1] + "," + x[2] + ",0.3)";
        }
    }

    // remove
    var rm = (id) => {
        for(let i = 1; i <= 12; i++){
            try{
                document.getElementById(id).parentNode.getElementsByClassName("dtp-clock-element-hide" + i)[0].remove();
            }catch(e){}
        }
        for(let i = 0 ; i <60; i++){
            try{
                document.getElementById(id).parentNode.getElementsByClassName("dtp-remove")[0].remove()
            }catch(e){}
        }
    }

    var c = (e) => {
        e.stopPropagation();
        var ex = e.target;
        let id = ex.getAttribute("data-id");
        if(ex.className.includes("cancel")){
            dtp[id].hr = document.getElementById(id).value.substring(0,2);
            dtp[id].min = document.getElementById(id).value.substring(3,5);
            dtp[id].am = document.getElementById(id).value.substring(6,8);
            let cx = el(id, "dtp-container")
            cx.classList.add("dtp-container-hide");
            setTimeout(() => {cx.style.display = "none";}, 200);
        }
        else{
            document.getElementById(id).value = f(dtp[id].hr) + ":" + f(dtp[id].min) + " " + dtp[id].am;
            let cx = el(id, "dtp-container")
            cx.classList.add("dtp-container-hide");
            setTimeout(() => {cx.style.display = "none";}, 200);
            var ev = new CustomEvent("change");
            document.getElementById(id).dispatchEvent(ev);
        }
    }

    var t = ""

    class DTP{
        constructor(){
        }
    }

    DTP.prototype.datePicker = datePicker;
    DTP.prototype.timePicker = timePicker;
    return DTP;

}))
