JATEKVAN = false
prev = []
var INDEX =0
//-------------Segédek----------------
function MasterReset(){
    window.location.reload();
}
function PlayReset(){// uj jatek
    document.getElementById("flotta").innerHTML =""
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
    }
}
function AiAllow(y,x,ownSea){
    
    neighbors = [[0,-1],[0,+1],[-1,0],[+1,0]]//4 szomszed
    
        
    
    return [y+neighbors[INDEX][0],x+neighbors[INDEX][1]]
}
function RobotStep(ownSea,bool){
    setTimeout(function() {
        var x = -1
        var y = -1
        if (bool) {
            sv= AiAllow(prev[0],prev[1],ownSea)
            y = sv[0]
            x = sv[1]
        }
        else{
            do {
                y = Math.floor(Math.random() * 10);
                x = Math.floor(Math.random() * 10); 
            } while (ownSea[y][x]==2 || ownSea[y][x]==3);
        }
        prev = [y,x]
        document.getElementById(''+y+true+x).style.backgroundColor="red"
        console.log(ownSea)
        console.log("asdasdsa")
        if (ownSea[y][x]==1) {
            document.getElementById(''+y+true+x).innerHTML="X"
            document.getElementById(''+y+true+x).style.color="whitesmoke"
            document.getElementById(''+y+true+x).style.fontSize="35px"
            ownSea[y][x] = 3 // jo talalat
            Wincheck(false,ownSea)
            RobotStep(ownSea,true)
            INDEX++
            if (INDEX == 4) {
                INDEX == 0
            }
        }
        else{
            ownSea[y][x] = 2 // rossz talalat
            document.getElementById("Ycurrent").style.backgroundColor="green"
            document.getElementById("Ecurrent").style.backgroundColor=""
        }
        JATEKVAN = false
        
    }, 1000);
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
        INDEX = 0
        RobotStep(ownSea,false)
        
    }
    else if(enemySea[y][x] != 2){
        document.getElementById(''+y+false+x).style.backgroundColor="red"
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
    var tblBody = document.createElement("tbody");
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
            td.style.border = '1px solid white';
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
