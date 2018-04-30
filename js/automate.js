//Declaration des classes 
class Automate{
  constructor(ets,trans){
    this.nodes = ets;
    this.links = trans;
    }
}

class etatBack{
  constructor(id,x,y,z,txt){
    this.id = id;
    this.x = x;
    this.y = y;
    this.z = z;
    this.txt = txt;
  }
}

class Etat {
  constructor(id,color,counter){
    this.id = id;
    this.color = color;
    this.counter = counter;
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
  $scope.backs = [];
  $scope.ets = [];
  $scope.trans = [];
  $scope.freeMode = false;
  $scope.isDisabled = true;
  $scope.doIt = false;
  $scope.btns = false;
  $scope.counter = false;


  $scope.parseContent = function($fileContent){   
    if($scope.isDisabled){
      $scope.parserCont($fileContent);
      $scope.btns = true;
      $scope.nameFile = document.getElementById('graphAutomate').files[0].name;
    }else {
      $scope.parseContre($fileContent);
      $scope.draw();
      $scope.doIt = true;
      $scope.counter = true;
    }
  };

  $scope.yes = function(){
    $scope.isDisabled = false;
  };
  
  $scope.not = function(){
    $scope.draw();
    $scope.doIt = true;
  };

  $scope.clean = function(){
    location.reload();
  };

  $scope.back = function(){
    if($scope.backs.length > 1){
      var pos = $scope.backs.length - 2; 
      const distRatio = 1 + 34/Math.hypot($scope.backs[pos].x, $scope.backs[pos].y, $scope.backs[pos].z);
      Graph.cameraPosition({x: $scope.backs[pos].x * distRatio , y: $scope.backs[pos].y * distRatio ,z: $scope.backs[pos].z * distRatio},null,3000);
      $scope.backs.splice($scope.backs.length - 1, 1);
      $scope.backs[$scope.backs.length - 1].txt = null;
    }else{
      alert("You are already where you started");
    }
  };

  $scope.firstState = function(){
   var bande = true;
   //Effacer le tableaux et recommencer
   $scope.backs.length = 0;
   $scope.freeMode = false;
    Graph.nodeVal(node => {
      if(bande){
        const distRatio = 1.50 + 40/Math.hypot(node.x, node.y, node.z);
        console.log( (node.x * distRatio) +" - "+ (node.y * distRatio) +" - "+ (node.y * distRatio));
        Graph.cameraPosition({x: node.x * distRatio , y: node.y * distRatio ,z: node.z * distRatio},node,3000);
        var etatB = new etatBack(node.id,node.x,node.y,node.z);
        $scope.$apply(function(){ $scope.backs.push(etatB); });
        bande = false;
      } 
    });
  };


  $scope.focusCamera = function(id){
    const distRatio = 1 + 34/Math.hypot($scope.backs[id].x, $scope.backs[id].y, $scope.backs[id].z);
    Graph.cameraPosition({x: $scope.backs[id].x * distRatio , y: $scope.backs[id].y * distRatio ,z: $scope.backs[id].z * distRatio},null,3000);
    $scope.backs.splice(id+1);
    $scope.backs[$scope.backs.length - 1].txt = null;
  };

  $scope.activeFree = function(){
    alert("You are in explore mode, you can choose any state");
    $scope.backs.length = 0;
    $scope.freeMode = true;
  };

  $scope.camera = function(){
    const distRatio = 1 + 34/Math.hypot($scope.backs[$scope.backs.length - 1].x, $scope.backs[$scope.backs.length - 1].y, $scope.backs[$scope.backs.length - 1].z);
    Graph.cameraPosition({x: $scope.backs[$scope.backs.length - 1].x * distRatio , y: $scope.backs[$scope.backs.length - 1].y * distRatio ,z: $scope.backs[$scope.backs.length - 1].z * distRatio},null,3000);
  }

  $scope.parseContre = function(cont){
    var src, tar;
    var lines = cont.split("\n");
    for (var i = 1; i < lines.length; i++) {
      if(lines[i].length > 1){
        var currentline = lines[i].split("\n");
        //Enlever les parenthese de la chaine de characters
        currentline = lines[i].replace(/[\(\)]/g, '');
        //Couper la chaine en 3 morceaux
        currentline = currentline.split(",",3);
        src = parseInt(currentline[0]);
        tar = parseInt(currentline[2]);
        $scope.searchEtatsCounter(src);
        $scope.searchEtatsCounter(tar);
        //parcourir le tableau des transitions
        for (var z = 0; z < $scope.trans.length; z++) {
          if($scope.trans[z].source === src && $scope.trans[z].target === tar){
            $scope.trans[z].group = "#FFFF00";
          }
        }
      }
    }
  };

  $scope.searchEtatsCounter = function(ets){
    for (var i = 0; i < $scope.ets.length; i++) {
      if ($scope.ets[i].id === ets){
          $scope.ets[i].counter = true;
      } 
    }
  }

  $scope.clkInitialState =  function(){
    $scope.backs.length = 0;
    $scope.freeMode = false;
    Graph.width(self.innerWidth - 495);
  };

  $scope.parserCont = function(content){
    var currentline, label,neigth, tran;
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
          var eta1 = new Etat(parseInt(currentline[1]),'RED',false);
          $scope.ets.push(eta1);
        } else {
        //variable pour couper chaque ligne du fichier
          currentline = lines[i].split("\n");
          //Enlever les parenthese de la chaine de characters
          currentline = lines[i].replace(/[\(\)]/g, '');
          //Enlever les citations de la chaine
          currentline = currentline.replace(/['"]+/g, '');
          //Couper la chaine en 3 morceaux
          currentline = currentline.split(",",3);
          //Couper le deuxieme atribut pour obtenir le nom de lien et la couleur
          label = currentline[1].split(":");
          //Couper le neigthboroute
          if(currentline[0].indexOf("N") != -1){
            neigth = currentline[0].split(":",3);
            tran = new Transition(parseInt(neigth[0]),label[0],label[1],parseInt(currentline[2]));
            $scope.trans.push(tran);
            $scope.validate(parseInt(currentline[2]));
            $scope.neigthB(neigth);
          }else {
            //Creation d'un object de type 
            tran = new Transition(parseInt(currentline[0]),label[0],label[1],parseInt(currentline[2]));
            //Ajouter l'object dans l'array
            $scope.trans.push(tran);
            //Valider si l'etats sont deja dans le tableu
            $scope.validate(parseInt(currentline[0]));
            $scope.validate(parseInt(currentline[2]));
          }
        }
      }
    }
  };
  
  //Function pour dessiner le graph
  $scope.draw = function(){
  var gData  = {};
  var automateObject = new Automate($scope.ets,$scope.trans);
  gData = automateObject;
  Graph = ForceGraph3D()
    (document.getElementById('3d-graph'))
    .graphData(gData)
    .backgroundColor('#5C5C5C')
    .width(self.innerWidth - 495)
    .height(self.innerHeight - 70)
    .nodeId('id')
    .nodeColor('color')
    .nodeLabel('id')
    .linkLabel('name')
    .enableNodeDrag(false)
    .linkColor('group')
    .onNodeClick(node => {

      const distRatio = 1 + 50/Math.hypot(node.x, node.y, node.z);
      console.log( (node.x * distRatio) +" - "+ (node.y * distRatio) +" - "+ (node.y * distRatio));
      var etatB; 
      if($scope.backs.length === 0 && !$scope.freeMode && !$scope.counter){
        Graph.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },node, 3000); 
        etatB = new etatBack(node.id,node.x,node.y,node.z,null);
        $scope.$apply(function(){ $scope.backs.push(etatB);});
      }else if ($scope.freeMode) {
        Graph.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },node, 3000); 
      }else if($scope.counter){
        if ($scope.backs.length === 0 && $scope.validationCounter(node.id)) {
          Graph.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },node, 3000); 
          etatB = new etatBack(node.id,node.x,node.y,node.z,null);
          $scope.$apply(function(){$scope.backs.push(etatB);});
        }else if($scope.validationCounter(node.id) && $scope.validationWay(node.id)){
          Graph.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },node, 3000); 
          etatB = new etatBack(node.id,node.x,node.y,node.z,null);
          $scope.$apply(function(){ $scope.backs.push(etatB);});
        }else{
          alert("The state does not belong to the counter example or is not the correct address");
        }
      }else{
        if($scope.validationWay(node.id)){
          Graph.cameraPosition({ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },node, 3000); 
          etatB = new etatBack(node.id,node.x,node.y,node.z,null);
          $scope.$apply(function(){ $scope.backs.push(etatB);});
        }else {
          alert("That's not the correct way");
        }     
      } 
    })
    .linkDirectionalParticles(3)
    .linkDirectionalParticleWidth(2);
  };

  $scope.validationCounter = function(nd){
    var isvalide = false;
    for (var i = 0; i < $scope.ets.length; i++) {
      if($scope.ets[i].id === nd && $scope.ets[i].counter){
        isvalide = true;
      } 
    }
    return isvalide;
  }
  
  //Function pour verifier si un etat est neighBournd
  $scope.neigthB = function(etat){
    var flag = false;
    var eti;
    for (var i = 0; i < $scope.ets.length; i++) {
      if($scope.ets[i].id === parseInt(etat[0])){
        switch (etat[2]) {
          case "G":
            $scope.ets[i].color = '#B18904';
            break;
          case "R":
            $scope.ets[i].color = '#FE9A2E';
            break;
          case "GR":
            $scope.ets[i].color = '#FACC2E';
            break;
          case "GRB":
            $scope.ets[i].color = '#F7FE2E';
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
        case "G":
          eti = new Etat(parseInt(etat[0]),'#B18904',false);
          $scope.ets.push(eti);
          break;
        case "R":
          eti = new Etat(parseInt(etat[0]),'#FE9A2E',false);
          $scope.ets.push(eti);
          break;
        case "GR":
          eti = new Etat(parseInt(etat[0]),'#FACC2E',false);
          $scope.ets.push(eti);
          break;
        case "GRB":
          eti = new Etat(parseInt(etat[0]),'#F7FE2E',false);
          $scope.ets.push(eti);
          break;
        default:
          // statements_def
          break;
      }
    }
  };

  //Function pour valider si un etat existe deja dans le tableu
  $scope.validate = function(eta){
    var flag = false;
    var eti;
    for (var i = 0; i < $scope.ets.length; i++) {
      if($scope.ets[i].id === eta){
        flag = true;
      }
    }

    if(!flag){
      if(eta === -1){
        eti = new Etat(eta,' #D8D8D8',false);
        $scope.ets.push(eti);
      }else{
        eti = new Etat(eta,'BLUE',false);
        $scope.ets.push(eti);
      }

    }
  }

  //Function pour valider si l'utlisateur est vers la bonne direction
  $scope.validationWay = function(etatNext){
    var flag = false;
    if($scope.backs[$scope.backs.length-1].id === etatNext){
      alert("This's the same state");
    }else{
     for (var i = 0; i < $scope.trans.length; i++) {
       if($scope.backs[$scope.backs.length-1].id === $scope.trans[i].source.id && $scope.trans[i].target.id === etatNext){
          $scope.backs[$scope.backs.length-1].txt = $scope.trans[i].name;
          flag = true;
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

