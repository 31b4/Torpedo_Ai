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
    flottaDiv.appendChild(MakeSea(false,enemySea))
    RandomPlace(enemySea,false)
    MakeOnHover(false,enemySea)
    document.getElementById("Ycurrent").style.backgroundColor="green"

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
function MakeSea(who,sea){// true = own ; false = enemy
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
function StartButton(){
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
    btn.onclick = function(){StartFight()};
    div.appendChild(btn)
    return div
}
//---------------MAIN--------------
function Play(){
    PlayReset()
    ownSea = []
    var flottaDiv = document.getElementById("flotta")
    flottaDiv.appendChild(MakeSea(true,ownSea))
    RandomPlace(ownSea,true)
    MakeOnHover(true,ownSea)
    flottaDiv.appendChild(StartButton(ownSea))
}
