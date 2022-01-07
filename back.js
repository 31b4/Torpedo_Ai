// 0 = tenger ; 1 = hajo ; 2 = rossz talalat ; 3 = jo talalat ; 4 = felesleges odamenni
/*
HIBAK


*/
var JATEKVAN = false
var SHIP1 = false // ez azt nezi hogy az egyes hajot megtalalte e vagy sem
var DONESHIP = [false,false,false,false,false] // nezi melyik hajo van kesz
var STREAK = 0
//-------------Segédek----------------
function MasterReset(){
    window.location.reload();
}
function PlayReset(){// uj jatek
    document.getElementById("flotta").innerHTML =""
    JATEKVAN = false
    SHIP1 = false // ez azt nezi hogy az egyes hajot megtalalte e vagy sem
    DONESHIP = [false,false,false,false,false] // nezi melyik hajo van kesz
    STREAK = 0
}
//--------------Harc------------------
function StartFight(ownSea){
    document.getElementById("btn").remove()
    enemySea = []
    var flottaDiv = document.getElementById("flotta")
    flottaDiv.appendChild(MakeSea(false,enemySea,ownSea))
    RandomPlace(enemySea,false)
    MakeOnHover(false,enemySea)
    document.getElementById("Ycurrent").style.backgroundColor="green"
}
function Wincheck(who,sea){ // true= own; false = enemy
    cntr = 0
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (sea[y][x]==3){
                cntr +=1
            }
        }
    }
    if (cntr == 15) {
        if (who) {
            alert("TE NYERTÉÉÉL :)))))))))")
        }
        else{
            alert("ROBOT NYERT :(((((")
        }
        MasterReset()
    }
}
function AiAllow(ownSea){
    var aNB = [[0,-1],[0,+1],[-1,0],[+1,0]]//4 szomszed
    var hNB = [[0,-1],[0,+1]]// horizontal szomszedok
    var vNB = [[-1,0],[+1,0]]// vertical szomszedok
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {//ez a ketto ciklus vegigmegy a matrix tengerunkon
            if (ownSea[y][x]==3) {
                //dontsuk el hogy horizontalis vagy verticalis! ezaltal felesleges helyek vizsgalatat skippelhetjuk
                var hr = false // horizontal bool
                try {
                    if(ownSea[y][x-1]==3 ) {
                        hr = true
                    }
                } catch (error) {}
                try {
                    if(ownSea[y][x+1]==3) {
                        hr = true
                    }
                } catch (error) {}
                var vr = false
                try {
                    if(ownSea[y-1][x]==3) {
                        vr = true
                    }
                } catch (error) {}
                try {
                    if(ownSea[y+1][x]==3) {
                        vr = true
                    }
                } catch (error) {}
                if (hr) {//horizontal?
                    for (let i = 0; i < hNB.length; i++) {
                        try {
                            if (ownSea[y+hNB[i][0]][x+hNB[i][1]]==0 || ownSea[y+hNB[i][0]][x+hNB[i][1]]==1) {
                                return [y+hNB[i][0],x+hNB[i][1]]
                            }
                        } catch (error) {}
                    }
                }
                else if (vr) {//vertical?
                    for (let i = 0; i < vNB.length; i++) {
                        try {
                            if (ownSea[y+vNB[i][0]][x+vNB[i][1]]==0 || ownSea[y+vNB[i][0]][x+vNB[i][1]]==1) {
                                return [y+vNB[i][0],x+vNB[i][1]]
                            }
                        } catch (error) {}
                    }
                }
                else{//csak egy col!
                    for (let i = 0; i < aNB.length; i++) {
                        try {
                            if (ownSea[y+aNB[i][0]][x+aNB[i][1]]==0 || ownSea[y+aNB[i][0]][x+aNB[i][1]]==1) {
                                return [y+aNB[i][0],x+aNB[i][1]]
                            }
                        } catch (error) {} 
                    }
                }
            }
        }
    }
    return -1
}
function UselessStep(y,x,ownSea){
    var nb = [[0,-1],[0,+1],[-1,0],[+1,0],[-1,-1],[+1,+1],[-1,+1],[+1,-1]]//osszes szomszed 8db
    for (let i = 0; i < nb.length; i++) {
        try {
            if (ownSea[y+nb[i][0]][x+nb[i][1]]==3) {
                ownSea[y][x] = 4
                return true
            }
        } catch (error) {}
    }
    return false
}
function NewCordGen(ownSea) {
    var sv = []
    do {
        var y = Math.floor(Math.random() * 10);
        var x = Math.floor(Math.random() * 10);
    } while (ownSea[y][x]==2  || ownSea[y][x]==3 || ownSea[y][x]==4 || UselessStep(y,x,ownSea));
    sv.push(y)
    sv.push(x)
    return sv
}
function RobotStep(ownSea){
    setTimeout(function() {
        var y = -1
        var x = -1
        var sv= AiAllow(ownSea)
        if (sv != -1) {
            y = sv[0]
            x = sv[1]
            if (STREAK == 5) {
                DONESHIP[4] = true 
            } else if (DONESHIP[4] && STREAK == 4) {
                DONESHIP[3] = true 
            } else if (DONESHIP[3] && DONESHIP[4] && STREAK == 3) {
                DONESHIP[2] = true 
            }
            if (ownSea[y][x] == 0) {
                if (STREAK == 5 || DONESHIP[4] && STREAK == 4 || DONESHIP[3] && DONESHIP[4] && STREAK == 3 || DONESHIP[2] && DONESHIP[3] && DONESHIP[4] && STREAK == 2) {
                    ownSea[y][x] = 4
                    STREAK = 0
                    sv = NewCordGen(ownSea)
                    y = sv[0]
                    x = sv[1]
                }
            }
            else if (ownSea[y][x] == 4) {
                STREAK = 0
                sv = NewCordGen(ownSea)
                y = sv[0]
                x = sv[1]
            }

        }
        else{
            if (STREAK-1 >=0) {
                DONESHIP[STREAK-1] = true
            }
            STREAK = 0
            sv = NewCordGen(ownSea)
            y = sv[0]
                x = sv[1]
        }
        prev = [y,x]
        document.getElementById(''+y+true+x).style.backgroundColor="red"
        if (ownSea[y][x]==1) {
            document.getElementById(''+y+true+x).style.backgroundColor="#8B0000"
            document.getElementById(''+y+true+x).innerHTML="X"
            document.getElementById(''+y+true+x).style.color="whitesmoke"
            document.getElementById(''+y+true+x).style.fontSize="35px"
            ownSea[y][x] = 3 // jo talalat
            STREAK +=1
            console.log(ownSea)
            Wincheck(false,ownSea)
            RobotStep(ownSea)
        }
        else{
            ownSea[y][x] = 2 // rossz talalat
            document.getElementById("Ycurrent").style.backgroundColor="green"
            document.getElementById("Ecurrent").style.backgroundColor=""
        }
        JATEKVAN = false
    }, 500);
}
function Durrr(y,x,enemySea,ownSea){
    if (JATEKVAN) {
        return
    }
    if (enemySea[y][x]==0) {
        document.getElementById("Ecurrent").style.backgroundColor="green"
        document.getElementById("Ycurrent").style.backgroundColor=""
        document.getElementById(''+y+false+x).style.backgroundColor="red"
        enemySea[y][x]=2// rossz talalat
        JATEKVAN=true
        RobotStep(ownSea)
    }
    else if(enemySea[y][x] != 2){
        document.getElementById(''+y+false+x).style.backgroundColor="#8B0000"
        document.getElementById(''+y+false+x).innerHTML="X"
        document.getElementById(''+y+false+x).style.color="whitesmoke"
        document.getElementById(''+y+false+x).style.fontSize="35px"
        enemySea[y][x]=3 // jo talalat
        Wincheck(true,enemySea)
    }
}
//-------------Generalas---------------
function Neighbors8Check(check,sea){
    var neighbors8 = [[0,-1],[0,+1],[-1,0],[+1,0],[-1,-1],[+1,+1],[-1,+1],[+1,-1]]//osszes szomszed
    for (let i = 0; i < neighbors8.length; i++) {
        if (check[0]-neighbors8[i][0]<0 || check[1]-neighbors8[i][1]< 0 || check[0]-neighbors8[i][0]>=10 || check[1]-neighbors8[i][1]>=10) {
            continue
        }
        else if (sea[check[0]-neighbors8[i][0]][check[1]-neighbors8[i][1]] == 1) {
            return false
        }
    }
    return true
}
function Direction(y,x,i,sea){
    var dir = Math.floor(Math.random() * 2) //0=ver 1=hor
    var neighbors = [[0,-1],[0,+1],[-1,0],[+1,0]] // horizontal vizsgalattal kezd
    if (dir==0) {
        neighbors = [[-1,0],[+1,0],[0,-1],[0,+1]] // vertical vizsgalattal kezd
    }
    for (let k = 0; k < neighbors.length; k++) {
        var ship = []
        curr = [y,x]
        if (!Neighbors8Check(curr,sea)) {
            return []
        }
        var valid = true
        ship.push(curr)
        for (let j = 0; j < i-1; j++) {
            var check = [curr[0]+neighbors[k][0],curr[1]+neighbors[k][1]] //vizsgalando cord
            if (check[0] >= 0 && check[0] < 10 && check[1] >= 0 && check[1] < 10) {
                if (sea[check[0]][check[1]] == 0) {
                    if (Neighbors8Check(check,sea)) {
                        curr = [check[0],check[1]]
                        ship.push(curr)
                    }
                    else{
                        return []
                    }
                }
                else{
                    return []
                }
            }
            else{
                return []
            }
        }
        if (valid) {
            return ship
        }
    }
    return []
}
function RandomPlace(sea,who){
    for (let i = 1; i <= 5; i++) {
        while (true) {
            var y = Math.floor(Math.random() * 10);// vertical
            var x = Math.floor(Math.random() * 10);// horizontal
            var ship = Direction(y,x,i,sea)
            if (ship.length>0) {
                for (let j = 0; j < ship.length; j++) {
                    if (who) {
                        document.getElementById(''+ship[j][0]+who+ship[j][1]).style.backgroundColor="black"
                    }
                    sea[ship[j][0]][ship[j][1]]=1
                }
                break
            }
        }
    }
}
function MakeSea(who,sea,otherSea){// true = own ; false = enemy
    var table = document.createElement("table")
    var tblBody = document.createElement("tbody")
    var div = document.createElement("div")
    div.className="col"
    var p = document.createElement("p")
    if (who) {
        p.innerHTML="Hajóid"
        p.id="Ycurrent"
    }
    else{
        p.innerHTML="Ellenfél"
        p.id="Ecurrent"
    }
    p.style.fontSize="30px"
    p.style.marginTop="40px"
    div.appendChild(p)
    div.style.textAlign="center"
    for (let y = 0; y < 10; y++) {// rows
        var tr = document.createElement("tr")
        var sv = []
        for (let x = 0; x < 10; x++) {// cols
            var td = document.createElement("td")
            td.style.width="50px"
            td.style.height="50px"
            td.style.backgroundColor="#006699"
            td.style.border = '1px solid white'
            td.id = ''+y+who+x
            sv.push(0)
            if (!who) {
                td.onclick= function(){Durrr(y,x,sea,otherSea)}
            }
            tr.appendChild(td)
        }
        tblBody.appendChild(tr)
        sea.push(sv)
    }
    table.appendChild(tblBody)
    div.appendChild(table)
    return div
}
function MakeOnHover(who,sea){
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (who) {
                if (sea[y][x]==1) {
                    document.getElementById(''+y+true+x).style.cursor = "grab";
                }
            }
            else{
                document.getElementById(''+y+false+x).style.cursor = "crosshair";
            }
        }
    }
}
function StartButton(ownSea){
    var div = document.createElement("div")
    div.className="col"
    div.id="btn"
    div.style.textAlign="center"
    div.style.marginTop="100px"
    var btn = document.createElement("button")
    btn.style.width="500px"
    btn.style.height="500px"
    btn.style.backgroundColor="#006699"
    btn.innerHTML="GO"
    btn.onclick = function(){StartFight(ownSea)};
    div.appendChild(btn)
    return div
}
//---------------INFO--------------
function INFO(){
    PlayReset()
    var flottaDiv = document.getElementById("flotta")
    var p = document.createElement("p")
    p.innerHTML="A JATEK gombra kattintva lepakolja a hajókat (fekete négyzet). <br> Ha nem tetszik a lerakás akkor a gomb újboli megnyomás esetén máshova teszi.<br> Ha megelégedett a lepakolással akkor a GO gombbal véglegesítve elkezdődik a játék.<br> Ezután az ellenfél táblájában belül lehet kattintani a tetszőleg (kilövendő) négyzetre. <br>Majd vársz a robot válaszára és vica-versa."
    p.style.fontSize="30px"
    p.style.fontFamily="Roboto Mono"
    p.style.color="whitesmoke"
    p.style.marginTop="50px"
    flottaDiv.appendChild(p)
}
//---------------MAIN--------------
function Play(){
    PlayReset()
    ownSea = []
    svSea = [] // ennek nincs itt ertelme
    var flottaDiv = document.getElementById("flotta")
    flottaDiv.appendChild(MakeSea(true,ownSea,svSea))
    RandomPlace(ownSea,true)
    MakeOnHover(true,ownSea)
    flottaDiv.appendChild(StartButton(ownSea))
}