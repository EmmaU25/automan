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
  $scope.band = true;
  $scope.backs = [];
  $scope.ets = [];
  $scope.trans = [];
  $scope.cont = "";

  $scope.parseContent = function($fileContent){
  	 $scope.cont = $fileContent;
     //if($scope.checkboxModel){
      $scope.parserCont($fileContent);
     /*}else {
      $scope.neighbourhood();
     }*/ 
  };

  
  $scope.neighbourhood = function(){
    alert("technicals problems :)");
  }


  $scope.clean = function(){
    location.reload();
  };

  $scope.back = function(){
    if($scope.backs.length > 1){
      var pos = $scope.backs.length - 2; 
      const distRatio = 1 + 34/Math.hypot($scope.backs[pos].x, $scope.backs[pos].y, $scope.backs[pos].z);
      Graph.cameraPosition({x: $scope.backs[pos].x * distRatio , y: $scope.backs[pos].y * distRatio ,z: $scope.backs[pos].z * distRatio},null,3000);
      $scope.backs.splice($scope.backs.length - 1, 1);
      $scope.table();
    }else{
      alert("You are already where you started");
    }
  }

  $scope.firstState = function(){
   var bande = true;
   //Effacer le tableaux et recommencer
   $scope.backs.length = 0;
   $scope.band = true;
   Graph.nodeVal(node => {
     const distRatio = 1 + 34/Math.hypot(node.x, node.y, node.z);
      if(bande){
        Graph.cameraPosition({x: node.x * distRatio , y: node.y * distRatio ,z: node.z * distRatio},null,3000);
        var etatB = new etatBack(node.id,node.x,node.y,node.z);
        $scope.$apply(function(){
          $scope.backs.push(etatB);
        });
        bande = false;
      } 
    });
  }	

  $scope.focusCamera = function(id){
    const distRatio = 1 + 34/Math.hypot($scope.backs[id].x, $scope.backs[id].y, $scope.backs[id].z);
    Graph.cameraPosition({x: $scope.backs[id].x * distRatio , y: $scope.backs[id].y * distRatio ,z: $scope.backs[id].z * distRatio},null,3000);
    $scope.backs.splice(id+1);
  }

  $scope.activeFree = function(){
    alert("You are in free mode, you can choose any automate");
    $scope.band = false;
  }

  $scope.camera = function(){
    const distRatio = 1 + 34/Math.hypot($scope.backs[$scope.backs.length - 1].x, $scope.backs[$scope.backs.length - 1].y, $scope.backs[$scope.backs.length - 1].z);
    Graph.cameraPosition({x: $scope.backs[$scope.backs.length - 1].x * distRatio , y: $scope.backs[$scope.backs.length - 1].y * distRatio ,z: $scope.backs[$scope.backs.length - 1].z * distRatio},null,3000);
  }


  $scope.parserCont = function(content){
    //Variables 
    var gData = {};
    //Variable qui contient l'info
    var lines = content.split("\n");
    //Parcourir tout le fichier
      for (var i = 0; i < lines.length; i++) {
        //Pour creer l'onbjet automate
          if(lines[i].length > 1){
            if(i === 0){
              var currentline = lines[i].split("\n");
              currentline = lines[i].replace(/[\(\)]/g, '');  
              currentline = currentline.replace(/,/g, '');   
              currentline = currentline.split(" ");
              var eta1 = new Etat(parseInt(currentline[1]),'RED');
              $scope.ets.push(eta1);
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
                var label = currentline[1].split(":");
                //Couper le neigthboroute
                if(currentline[0].indexOf("N") != -1){
                  var neigth = currentline[0].split(":",3);
                  var tran = new Transition(parseInt(neigth[0]),label[0],label[1],parseInt(currentline[2]));
                  $scope.trans.push(tran);
                  $scope.validate(parseInt(currentline[2]));
                  $scope.neigthB(neigth);

                }else {
                  //Creation d'un object de type 
                  var tran = new Transition(parseInt(currentline[0]),label[0],label[1],parseInt(currentline[2]));
                  //Ajouter l'object dans l'array
                  $scope.trans.push(tran);
                   $scope.validate(parseInt(currentline[0]));
                   $scope.validate(parseInt(currentline[2]));
                }
            }
          }
      }

  var automateObject = new Automate($scope.ets,$scope.trans);
  console.log(automateObject);
  gData = automateObject;
  $("#bar").remove();
  $("#file").remove();
  Graph = ForceGraph3D()
    (document.getElementById('3d-graph'))
    .graphData(gData)
    .backgroundColor('#5C5C5C')
    .width(self.innerWidth - 245)
    .height(self.innerHeight - 60)
    .nodeId('id')
    .nodeColor('color')
    .nodeLabel('id')
    .linkLabel('name')
    .enableNodeDrag(false)
    .linkColor('group')
    .onNodeClick(node => { 
      if($scope.backs.length  === 0 || !$scope.band ){
        const distRatio = 1 + 34/Math.hypot(node.x, node.y, node.z);
        Graph.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },node, 3000); 
        var etatB = new etatBack(node.id,node.x,node.y,node.z);
         $scope.$apply(function(){ 
            $scope.backs.push(etatB);
         });
      }else{
        if($scope.validationWay(node.id)){
           const distRatio = 1 + 34/Math.hypot(node.x, node.y, node.z);
          Graph.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },node, 3000); 
          var etatB = new etatBack(node.id,node.x,node.y,node.z);
          $scope.$apply(function(){ 
            $scope.backs.push(etatB);
          });
        }else {
          alert("That's not the correct way");
        }     
      } 
    })
    .linkDirectionalParticles(3)
    .linkDirectionalParticleWidth(2);
  };

  $scope.neigthB = function(etat){
    var flag = false;
    for (var i = 0; i < $scope.ets.length; i++) {
      if($scope.ets[i].id === parseInt(etat[0])){
        switch (etat[2]) {
          case "GB":
            $scope.ets[i].color = '#F3F781';
            break;
          case "RB":
            $scope.ets[i].color = '#F7FE2E';
            break;
          case "GR":
            $scope.ets[i].color = '#AEB404';
            break;
          case "GRB":
            $scope.ets[i].color = '#B3B301';
            break;
          default:
            // statements_def
            break;
        }
        flag = true;
      }
    }

    if(!flag){
      switch (etat[2]) {
        case "GB":
          var eti = new Etat(parseInt(etat[0]),'#fdff00');
          $scope.ets.push(eti);
          break;
        case "RB":
          var eti = new Etat(parseInt(etat[0]),'#dedf1f');
          $scope.ets.push(eti);
          break;
        case "GR":
          var eti = new Etat(parseInt(etat[0]),'#bebf00');
          $scope.ets.push(eti);
          break;
        case "GRB":
          var eti = new Etat(parseInt(etat[0]),'#ffff00');
          $scope.ets.push(eti);
          break;
        default:
          // statements_def
          break;
      }
    }

  }

  $scope.validate = function(eta){
    var flag = false;
    for (var i = 0; i < $scope.ets.length; i++) {
      if($scope.ets[i].id === eta){
        flag = true;
      }
    }

    if(!flag){
      const eti = new Etat(eta,'BLUE');
      $scope.ets.push(eti);
    }
  }

  $scope.validationWay = function(etatNext){
     var flag = false;
     if($scope.backs[$scope.backs.length-1].id === etatNext){
      alert("This's the same state");
     }else{
       for (var i = 0; i < $scope.trans.length; i++) {
         if($scope.backs[$scope.backs.length-1].id === $scope.trans[i].source.id){
            if($scope.trans[i].target.id === etatNext){
              flag = true;
            }
         }
      }
     }
    return flag;
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