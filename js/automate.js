//Declaration variable
var ets = [];
var trans = [];
var back = [];
var band = true;

//Declaration des classes 
class Automate{
  constructor(ets,trans){
    this.nodes = ets;
    this.links = trans;
    }
}

class etatBack{
  constructor(id,x,y,z){
    this.id = id;
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Etat {
  constructor(id,color){
    this.id = id;
    this.color = color;
  }
}

class Transition {
  constructor(des,txt, color,next){
    this.source = des;
    this.name = txt;
    this.group  = color;
    this.target = next; 
  }
}

//Controlleur de l'application
myapp.controller("controllerAutomate",function($scope){
  $scope.parseContent = function($fileContent){
  	 $scope.cont = $fileContent;
     parseContent($fileContent);
  };

  $scope.clean = function(){
    location.reload();
  }

  $scope.back = function(){
    if(back.length > 1){
      var pos = back.length - 2; 
      const distRatio = 1 + 34/Math.hypot(back[pos].x, back[pos].y, back[pos].z);
      Graph.cameraPosition({x: back[pos].x * distRatio , y: back[pos].y * distRatio ,z: back[pos].z * distRatio},null,3000);
      back.splice(back.length - 1, 1);
    }else{
      alert("You are already where you started");
    }
  }

  $scope.firstState = function(){
   var v = 1;
   //Effacer le tableaux et recommencer
   back.length = 0;
   band = true;
   Graph.nodeVal(node => {
     const distRatio = 1 + 34/Math.hypot(node.x, node.y, node.z);
      if(v === 1){
        Graph.cameraPosition({x: node.x * distRatio , y: node.y * distRatio ,z: node.z * distRatio},null,3000);
        var etatB = new etatBack(node.id,node.x,node.y,node.z);
        back.push(etatB);
        v = 2;
      } 
    });
  }	


  $scope.activeFree = function(){
    alert("You are in free mode, you can choose any automate");
    band = false;
  }
});

//Directive pour lire le fichier TXT
myapp.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};
				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});



///////////////////////////////////////////////// JAVASCRIPT //////////////////////////////////////////////////////////////////////////


//Fonction pour creer un object de type automate
function validateEtat(eta){
  var flag = false;
  for (var i = 0; i < ets.length; i++) {
    if(ets[i].id === eta){
      flag = true;
    }
  }

  if(!flag){
    const eti = new Etat(eta,'BLUE');
    ets.push(eti);
  }
}

//Fonction pour parser les donnés TXT en JSON
function parseContent(content) {
    //Variables 
    var gData = {};
    var tran;
    var eta1;
    var label;
    //Variable qui contient l'info
    var lines = content.split("\n");
    //Parcourir tout le fichier
    for (var i = 0; i < lines.length; i++) {
      //Pour creer l'onbjet automate
        if(lines[i].length > 1){
          if(i == 0){
            var currentline = lines[i].split("\n");
            currentline = lines[i].replace(/[\(\)]/g, '');  
            currentline = currentline.replace(/,/g, '');   
            currentline = currentline.split(" ");
            eta1 = new Etat(parseInt(currentline[1]),'RED');
            ets.push(eta1);
          } else {
            //variable pour couper chaque ligne du fichier
            var currentline = lines[i].split("\n");
              //Enlever les parenthese de la chaine de characters
              currentline = lines[i].replace(/[\(\)]/g, '');
              //Enlever les citations de la chaine
              currentline = currentline.replace(/['"]+/g, '');
              //Couper la chaine en 3 morceaux
              currentline = currentline.split(",",3);
              //Couper le deuxieme atribut pour obtenir le nom de lien et la couleur
              label = currentline[1].split(":");
              //Creation d'un object de type 
              tran = new Transition(parseInt(currentline[0]),label[0],label[1],parseInt(currentline[2]));
              //Ajouter l'object dans l'array
              trans.push(tran);
              validateEtat(parseInt(currentline[0]));
              validateEtat(parseInt(currentline[2]));
          }
        }
    }

var automateObject = new Automate(ets,trans);
gData = automateObject;
$("#bar").remove();
$("#file").remove();
Graph = ForceGraph3D()
  (document.getElementById('3d-graph'))
  .graphData(gData)
  .backgroundColor('#5C5C5C')
  //.width(window.innerWidth)
  .height(self.innerHeight - 60)
  .nodeId('id')
  .nodeColor('color')
  .nodeLabel('id')
  .linkLabel('name')
  .enableNodeDrag(false)
  .linkColor('group')
  .onNodeClick(node => { 
    if(back.length  === 0 || !band ){
      const distRatio = 1 + 34/Math.hypot(node.x, node.y, node.z);
      Graph.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },node, 3000); 
      var etatB = new etatBack(node.id,node.x,node.y,node.z);
      back.push(etatB);
    }else{
      if(validationWay(node.id)){
         const distRatio = 1 + 34/Math.hypot(node.x, node.y, node.z);
        Graph.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },node, 3000); 
        var etatB = new etatBack(node.id,node.x,node.y,node.z);
        back.push(etatB);
      }else {
        alert("That's not the correct way");
      }     
    } 
  })
  .linkDirectionalParticles(3)
  .linkDirectionalParticleWidth(2);
}

function validationWay(etatNext){
 var flag = false;
 for (var i = 0; i < trans.length; i++) {
   if(back[back.length-1].id === trans[i].source.id){
      if(trans[i].target.id === etatNext){
        flag = true;
      }
   }
 }
return flag;
}
