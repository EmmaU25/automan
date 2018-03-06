class Automate{
  constructor(id,title,color){
    this.initial = id;
    this.nom_transition = title;
    this.nom_states = color;
    this.Etats = [];
    }

     addEtats(des,txt,color,next){
      var etat = new Etats(des,txt,color,next);
      Etats.push(etat);
    }
     hola(){
      console.log("Hola mundo");
    }
}
class Etat {
  constructor(des,txt, color, next){
    this.from = des;
         
  }
}

class Transition{
  constructor(src,trgt){
    this.source = src;
    this.target = trgt;
  }
}

//Fonction pour telecharger le fichier
function uploadFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var read = new FileReader();
  read.onload = function(e) {
    var content = e.target.result;
    parseContent(content);
  };
  read.readAsText(file);
}

//Focntion pour parser les donnés TXT en JSON
function parseContent(content) {
    //Couper chaque ligne du fichier aprés saut de ligne
    var lines = content.split("\n");
    //Array à stocker les donnés
    var result = [];
    //Creation de l'automate
    var automateObject;
    //Parcourir tout le fichier
    for (var i = 0; i < lines.length-1; i++) {
      //Pour creer l'onbjet automate
        if(i == 0){
          var currentline = lines[i].split("\n");
          currentline = lines[i].replace(/[\(\)]/g, '');  
          currentline = currentline.replace(/,/g, '');   
          currentline = currentline.split(" ");
          automateObject = new Automate(parseInt(currentline[1]),parseInt(currentline[2]),parseInt(currentline[3]));
        }
        //variable pour stocker le titre et la couleur
          var title;
          //variable pour couper chaque ligne du fichier
          var currentline = lines[i].split("\n");
          if(currentline.length > 0){
            //Enlever les parenthese de la chaine de characters
            currentline = lines[i].replace(/[\(\)]/g, '');
            //Enlever les citations de la chaine
            currentline = currentline.replace(/['"]+/g, '');
            //Couper la chaine en 3 morceaux
            currentline = currentline.split(",",3);
            //Couper le deuxieme atribut pour obtenir le nom de lien et la couleur
            title = currentline[1].split(":");
            //Creation d'un object de type automate
            const etat = new Etat(parseInt(currentline[0]),title[0],title[1],parseInt(currentline[2]));
            //Ajouter l'object dans l'array
            result.push(etat);
          }

    } 
automateObject.Etats = result;        
      //Conversion de l'array en JSON
console.log(JSON.stringify(automateObject));
}
//Asignation d'un event au bouton du fichier HTML
var el = document.getElementById('file-input');
el.addEventListener('change', uploadFile, false);

  
