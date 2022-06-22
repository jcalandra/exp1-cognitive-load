import { Level } from "./level.js";

var audioPlayer = document.getElementById('audioplayer');
console.log(audioPlayer);
var oButton = document.getElementById('obutton');
var xButton = document.getElementById('xbutton');
var nextButton = document.getElementById('next');
var prevButton = document.getElementById('prev');
var seqDisplayer = document.getElementById('seqtable').children[0].children;
var seqCountDisplay = document.getElementById('nbseq');
var seqTimeDisplay = document.getElementById('timeseq');
var pageTitle = document.getElementById('pagetitle');
var pageText = document.getElementById('pagetext');
var anomArray = document.querySelectorAll('div.box2 > form')[0]; //tableau des anomalies
var anomLabels = document.querySelectorAll('label');

//the ID defining which sounds folder you go into
var ecoID = 0;

var level; //niveau d'avancée dans les experiences 
var lvlCount = 0; //numéro du niveau qui atttribue des propriétés aux niveaux
var finalPercent = 0; 

var fileId = 0;//identifiqnt fichier de réponse utilisateur coté JS

var trackPicked = new Array(10).fill(0);

async function fetchEco(){
    var response = await fetch("get_eco.php", {//appel au php
      method: 'get',
    });
    return response.text(); //renvoie le echo du php
}

async function writeEco(){
  //return true;
  let data = new URLSearchParams();
  data.append("ecoid", ecoID);
  fetch("get_eco.php", {
    method: 'post',
    body: data
  })
  .catch(function (error) {
    console.log(error)
  });
  return false;
}

function getRandomSign() {
   return Math.floor(Math.random() * 2);
}

function getRandomLength() { //renvoie une longueur random pour les séquences 
   return Math.floor(Math.random() * 4) + 2;
}

function newSequence() {  //crée une nouvelle séquence et initialise le timer à 0
   var seq = [];
   var length = getRandomLength();
   for(let i = 0; i < length; i++){
      var sign = "";
      var signId = getRandomSign();
      if(signId == 0){
         sign = "O";
      }
      else {
         sign = "X";
      }
      seq.push(sign);
   }
   level.seqTimer = Date.now();
   return seq; 
}

function hideElement(element){
   if(element == seqDisplayer[0] || element == seqDisplayer[1])
      element.setAttribute("hidden", true);
   else
      element.style.visibility = "hidden";
}

function revealElement(element){ //révèle un élément en html(?)
   if(element == seqDisplayer[0] || element == seqDisplayer[1])
      element.removeAttribute("hidden");
   else
      element.style.visibility = "visible";
}

function updateSeqDisplay(){ //affiche une nouvelle séquence (?)
   for(let i = 0; i < 5; i++){
      if(level.fullSeq[i] !== undefined){
         seqDisplayer[0].children[i].textContent = level.fullSeq[i];
         revealElement(seqDisplayer[0].children[i]);
         seqDisplayer[1].children[i].textContent = level.userSeq[i];
         revealElement(seqDisplayer[1].children[i]);
      }
      else{
         hideElement(seqDisplayer[0].children[i]);
         hideElement(seqDisplayer[1].children[i]);
      }
   }
}

function updateSeqCountDisplay(){
   seqCountDisplay.textContent = "Copied sequences : "+level.seqCount;
   seqTimeDisplay.textContent = "Latest copy time : "+String((Math.floor((Date.now() - level.seqTimer)/10)*0.01).toFixed(2));
}

function resetAnoms(){ //reset les anomalies
   for(let i = 0; i < 4; i++){
      anomArray[i].checked = false;
   }
}

function updateDisplay(){
   switch(level.resolutionType){
      case 'next_pressed':
         hideElement(oButton);
         hideElement(xButton);
         hideElement(seqDisplayer[0]);
         hideElement(seqDisplayer[1]);
         hideElement(seqCountDisplay);
         hideElement(seqTimeDisplay);
         for(let i = 0; i < anomArray.length; i++){
            hideElement(anomArray[i]);
            hideElement(anomLabels[i]);
         }
         if(lvlCount <= 17 && lvlCount != 0)
            revealElement(prevButton);
         else
            hideElement(prevButton);
         revealElement(pageTitle);
         revealElement(pageText);
         if(level.soundId != -1){
            revealElement(audioPlayer);
            audioPlayer.src = 'sounds'+ecoID+'/track_'+level.soundId+'.mp3';
            audioPlayer.controls = true;
            audioPlayer.setAttribute("loop", true);
            hideElement(nextButton);
         }
         else{
            hideElement(audioPlayer);
            revealElement(nextButton);
         }
      break;

      case 'seqs_solved':
         revealElement(oButton);
         revealElement(xButton);
         revealElement(seqDisplayer[0]);
         revealElement(seqDisplayer[1]);
         revealElement(seqCountDisplay);
         revealElement(seqTimeDisplay);
         for(let i = 0; i < anomArray.length; i++){
            hideElement(anomArray[i]);
            hideElement(anomLabels[i]);
         }
         revealElement(prevButton);
         hideElement(nextButton);
         revealElement(pageTitle);
         revealElement(pageText);
         hideElement(audioPlayer);
         updateSeqDisplay();
         updateSeqCountDisplay();
      break;

      case 'sound_played':
         hideElement(oButton);
         hideElement(xButton);
         hideElement(seqDisplayer[0]);
         hideElement(seqDisplayer[1]);
         hideElement(seqCountDisplay);
         hideElement(seqTimeDisplay);
         for(let i = 0; i < anomArray.length; i++){
            hideElement(anomArray[i]);
            hideElement(anomLabels[i]);
         }
         hideElement(prevButton);
         hideElement(nextButton);
         revealElement(pageTitle);
         revealElement(pageText);
         revealElement(audioPlayer);
         audioPlayer.src = 'sounds'+ecoID+'/track_'+level.soundId+'.mp3';
         audioPlayer.controls = true;
         audioPlayer.removeAttribute("loop");
         updateSeqDisplay();
         updateSeqCountDisplay();
      break;
   }
}

audioPlayer.onplay = function(){
   audioPlayer.controls = false;
   if(level.resolutionType != 'next_pressed') {
      revealElement(oButton);
      revealElement(xButton);
      revealElement(seqDisplayer[0]);
      revealElement(seqDisplayer[1]);
      revealElement(seqCountDisplay);
      revealElement(seqTimeDisplay);
   }
   else {
      revealElement(nextButton);
   }
   for(let i = 0; i < anomArray.length; i++){
      revealElement(anomArray[i]);
      revealElement(anomLabels[i]);
   }
   level.anomTimer = Date.now();
   level.seqTimer = Date.now();
};

async function fetchgo(data){
  console.log(data.toString());
  return true; //arrêt d'enregistrement des données 

  data.append("fileId", fileId);
  data.append("ecoId", ecoID);

  fetch("get_results.php", {
    method: 'post',
    body: data
  })/*
  .then(function (response) {
     return response.text();
  })
  .then(function (text) {
    console.log(text);
  })*/
  .catch(function (error) {
    console.log(error)
  });

  return false;
}

function anomIdToStr(id){ //renvoie l'anomalie selon son id et l'ecoID
   switch(id){
      case 0:
         return (ecoID==1)?"Arpeggio":"Droplets";//return (ecoID==1)?"Melodie":"Gouttes";
      break;
      case 1:
         return (ecoID==1)?"Drone":"Birds";//return (ecoID==1)?"Bourdon":"Oiseaux";
      break;
      case 2:
         return (ecoID==1)?"Jingle":"Water";//return (ecoID==1)?"Sonnerie":"Etat Eau";
      break;
      case 3:
         return (ecoID==1)?"Bell":"Sizzle";//return (ecoID==1)?"Cloche":"Friture";
      break;
      default:
         return "erreur";
      break;
   }
}

function anomToString(anomArray){
   var txt = "";

   for(let i = 0; i < anomArray.length; i++){
      if(anomArray[i] != -1){
         txt += ((txt=="")?"":", ") + anomIdToStr(i);
      }
   }

   if(txt == "") txt = "Aucune";

   txt += ".";

   return txt;
}

function successPercent(){ //pourcentage de réussite 
   var perc = 0.0;
   for(let i = 0; i < level.checkedAnomalies.length; i++){
      if((level.checkedAnomalies[i]==-1) && (level.expectedAnomalies[i]==-1) || (level.checkedAnomalies[i]!=-1) && (level.expectedAnomalies[i]!=-1)){
         perc += 100.0;
      }
   }
   return perc/level.checkedAnomalies.length;
}

function endLvlText(inTraining){ //affichage du texte des séquences reproduites 
   var txt = "Vous avez reproduit "+ level.seqCount +" séquences ("+ level.symCount +" symboles) en "+ (Math.floor((Date.now() - level.anomTimer)/10)*0.01).toFixed(0) +"s.<br/>Anomalies cochées : "+anomToString(level.checkedAnomalies) + (inTraining?"<br/>Anomalies à cocher : "+ anomToString(level.expectedAnomalies):"") + "<br/>Votre réponse est à "+ successPercent() + "% correcte.";
   return txt;
}

function pickTrack(){ //choisit un random track qui n'a jamais été choisi 
   let i = Math.floor(Math.random() * 10);
   while(trackPicked[i]!=0){
      i = Math.floor(Math.random() * 10);
   }
   trackPicked[i] = 1;
   return i;
}

function resetLevel(){
   switch(lvlCount){
      case 0 :
      init_new_resfile();
      setupCheckboxLabels();
      console.log(ecoID);
         level = new Level('next_pressed', -1);
         pageTitle.textContent = "Expérience attention partagée"
         pageText.innerHTML = "Ce jeu a pour but d'évaluer la reconnaissance de differents types de sons lors de l'exécution de deux tâches simultanées.<br/>Votre rôle est de reconstituer les séquences de X et de O qui vous seront présentées, tout en annotant les caractéristiques du son que vous entendrez en arrière-plan.<br/><br/>Le port d'un casque ou d'écouteurs est recommandé.<br/>Cliquez sur '->' pour commencer la phase d'entrainement.<br/><br/>Vous pourrez refaire l'entrainement autant de fois qu'il vous semblera nécessaire.";
      break;
      case 1 :
         level = new Level('seqs_solved', -1);
         pageTitle.textContent = "Tâche 1 : Réécriture de séquences";
         pageText.innerHTML = "Pour reconstituer une séquence, cliquez sur les boutons X et O dans l'ordre affiché.<br/><br/>Réécrivez 10 séquences avant de pouvoir cliquer sur '->'";
      break;
      case 2 :
         level = new Level('next_pressed', -1);
	 pageTitle.textContent = "Tâche 2 : Annotation de sons";
         pageText.innerHTML = "En parallèle de la réécriture, vous devrez écouter des bandes-sons constituées d'éléments traduisant deux types de situations (normale ou anormale) et annoter les situations anormales pour les niveaux où vous les entendrez.<br/>Ces différents sons vous seront décrits au cours de la prochaine phase de l'entrainement.<br/><br/>Ces sons tournent en boucle. Prenez le temps de les écouter et de vous en imprégner.<br/><br/>Cliquez sur '->' pour commencer.";
      break;
      case 3 :
         level = new Level('next_pressed', 0);
	 pageTitle.textContent = "Premier élément sonore : \""+anomIdToStr(0)+"\"";
         pageText.innerHTML = ((ecoID==1)?"Un arpège sur 3 notes, qui reste régulier en temps normal.":"Un son de gouttes d'eau tombant régulièrement.")+"<br/><br/>Lancez la lecture ci-dessous pour l'écouter, puis cliquez sur '->' pour passer au son suivant.";
      break;
      case 4 :
         level = new Level('next_pressed', 1);
	 pageTitle.textContent = "\""+anomIdToStr(0)+"\" en situation anormale";
         pageText.innerHTML = "En situation anormale pour \""+anomIdToStr(0)+"\", "+((ecoID==1)?"l'arpège devient irrégulier et son volume augmente.":"les gouttes produisent un son plus fort et distordu.")+"<br/>Quand cela se produit, cochez la case '"+anomIdToStr(0)+"' dans le sélecteur à droite.<br/><br/>Lancez la lecture ci-dessous pour l'écouter, puis cliquez sur '->' pour passer au son suivant.";
      break;
      case 5 :
         level = new Level('next_pressed', 2);
	 pageTitle.textContent =  "Deuxième élément sonore : \""+anomIdToStr(1)+"\"";
         pageText.innerHTML = ((ecoID==1)?"Un bourdonnement continu dans les basses fréquences.<br/>Celui-ci peut fluctuer légèrement, mais on ne considère que les changements forts et durables comme des anomalies.":"Une piste ambiante de chants d'oiseaux.")+"<br/><br/>Lancez la lecture ci-dessous pour l'écouter, puis cliquez sur '->' pour passer au son suivant.";
      break;
      case 6 :
         level = new Level('next_pressed', 3);
	 pageTitle.textContent =  "\""+anomIdToStr(1)+"\" en situation anormale";
         pageText.innerHTML = "En situation anormale, "+((ecoID==1)?"le bourdon devient irrégulier et son volume augmente.":"des chants de corbeaux (\"trop bas\") ou des cris de canard (\"trop haut\") deviennent audibles.")+"<br/>Dans l'exemple ci-dessous, l'anomalie alterne entre trop haut et trop bas.<br/>Quand cela se produit, cochez la case '"+anomIdToStr(1)+"'.<br/><br/>Lancez la lecture ci-dessous pour l'écouter, puis cliquez sur '->' pour passer au son suivant.";
      break;
      case 7 :
         level = new Level('next_pressed', -1);
	 pageTitle.textContent =  "Troisième élément sonore : \""+anomIdToStr(2)+"\"";
         pageText.innerHTML = "En temps normal, cet élément ne produit aucun son.<br/>Cependant deux types d'anomalies différents peuvent se présenter.<br/><br/>Cliquez sur '->' pour passer au son suivant.";
      break;
      case 8 :
         level = new Level('next_pressed', 4);
	 pageTitle.textContent =  "\""+anomIdToStr(2)+"\" en situation anormale 1";
         pageText.innerHTML = ((ecoID==1)?"Une sonnerie synthétique joue une note basse.":"Un craquèlement de glace devient audible.")+"<br/>Quand cela se produit, cochez la case '"+anomIdToStr(2)+"'.<br/><br/>Lancez la lecture ci-dessous pour l'écouter, puis cliquez sur '->' pour passer au son suivant.";
      break;
      case 9 :
         level = new Level('next_pressed', 5);
	 pageTitle.textContent =  "\""+anomIdToStr(2)+"\" en situation anormale 2";
         pageText.innerHTML = ((ecoID==1)?"Une sonnerie synthétique joue une note aigüe.":"Un son d'eau en ébullition devient audible.")+"<br/>Quand cela se produit, cochez la case '"+anomIdToStr(2)+"'.<br/><br/>Lancez la lecture ci-dessous pour l'écouter, puis cliquez sur '->' pour passer au son suivant.";
      break;
      case 10 :
         level = new Level('next_pressed', 6);
	 pageTitle.textContent =  "Quatrième élément sonore : \""+anomIdToStr(3)+"\".";
         pageText.innerHTML = "Ponctuellement, un son de "+((ecoID==1)?"cloche synthétique":"grésillement")+" devient audible.<br/>Quand cela se produit, cochez la case '"+anomIdToStr(3)+"'.<br/><br/>Lancez la lecture ci-dessous pour l'écouter, puis cliquez sur '->' pour passer au son suivant.";
      break;
      case 11 :
         level = new Level('next_pressed', 7);
	 pageTitle.textContent =  "Son au complet";
         pageText.innerHTML = "Au cours de l'évaluation, l'ensemble de ces sons est mixé pour produire une bande son comme celle de l'exemple ci-dessous.<br/><br/>Tant que tout va bien, seuls "+anomIdToStr(0)+" et "+anomIdToStr(1)+" sont audibles et réguliers.<br/>Dans ces situations, vous n'aurez rien à cocher.<br/><br/>Lancez la lecture ci-dessous pour l'écouter, puis cliquez sur '->' pour passer au premier niveau d'entrainement.";
      break;
      case 38 :
        writeEco();
         pageTitle.textContent = "Merci pour votre participation à cette évaluation.";
         pageText.innerHTML = "Votre score final est de "+finalPercent+"%.<br/><br/>Cliquez sur '->' pour répondre à un bref sondage avant de partir.";
         level = new Level('next_pressed', -1);
      break;
      case 39 :
         //location.replace("survey.html?resid="+fileId+"&ecoid="+ecoID);
         if(ecoID==1) location.replace("https://forms.gle/wBCanCqvDEMueGmw6");
         else if(ecoID==2) location.replace("https://forms.gle/zJh7Eryyb39J5w2B6");
      break;
      default:
         if(lvlCount >= 12 && lvlCount <= 17){
            if(lvlCount % 2 == 0){
               pageTitle.textContent = "Entrainement : Niveau "+(lvlCount/2-5)+"/3";
               pageText.innerHTML = "Un exemple de niveau :<br/>Lancez la lecture ci-dessous, puis complétez autant de séquences que possible et cochez les anomalies.";
               level = new Level('sound_played', 7+lvlCount/2-5);
            } //lvlCount pair -> exercice
            else{
               pageTitle.textContent = "Bilan Entrainement "+((lvlCount-1)/2-5);
               pageText.innerHTML = endLvlText(true) + (lvlCount!=17?"<br/><br/>Cliquez sur le bouton '->' pour passer au prochain niveau d'entrainement.":"<br/><br/>Cliquez sur le bouton '->' pour passer à l'évaluation.<br/>Ou sur '<-' pour recommencer l'entrainement.");
               level = new Level('next_pressed', -1);
            } //lvlCount impair -> bilan de l'exercice
         }
         else if(lvlCount >= 18 && lvlCount <= 37){
            if(lvlCount % 2 == 0){
               pageTitle.textContent = "Level "+(lvlCount/2-8)+"/10";//"Niveau "+(lvlCount/2-8)+"/10";
               pageText.innerHTML = "Start the player below and rewrite as many sequences as possible while labelling the anomalies you hear.";//"Lancez la lecture ci-dessous, puis complétez autant de séquences que possible et cochez les anomalies.";
               level = new Level('sound_played', pickTrack()+11);
               //console.log(level.soundId);
            }
            else{
               pageTitle.textContent = "Bilan Niveau "+((lvlCount-1)/2-8);
               pageText.innerHTML = endLvlText(false) + "<br/><br/>Cliquez sur le bouton '->' pour passer au prochain niveau.";
               finalPercent += successPercent()/10;
               level = new Level('next_pressed', -1);
            }
         }
         else{
            pageTitle.textContent = "Erreur";
            pageText.innerHTML = "Ce niveau n'existe pas.";
         }
      break;
   }
   if(level.resolutionType == 'sound_played') {
      let data = new URLSearchParams();
      data.append("trackid", level.soundId);
      fetchgo(data);
   }
   level.fullSeq = newSequence();
   level.userSeq = [];
   resetAnoms();
   if(!audioPlayer.paused) audioPlayer.pause();
   updateDisplay();
}

function nextLevel(){//change de niveau
   lvlCount++;
   resetLevel();
}

function prevLevel(){//niveau précédent
   if(lvlCount!=17) lvlCount--;
   else lvlCount = 1;
   resetLevel();
}


audioPlayer.onended = async function(){ //jsp trop 
   if(audioPlayer.controls == false){
      let data = new URLSearchParams();
      for(let i = 0; i < 4; i++){
         data.append(anomArray[i].name, level.expectedAnomalies[i]);
      }
      await fetchgo(data);
      data = new URLSearchParams();
      for(let i = 0; i < 4; i++){
         data.append(anomArray[i].name, level.checkedAnomalies[i]);
      }
      await fetchgo(data);
      nextLevel();
   }
};

function checkSign(level, sign){//ajoute un symbole dans la case
   var curPos = level.userSeq.length;
   if(level.fullSeq[curPos] == sign){
      level.userSeq.push(sign);
      level.symCount += 1;
      updateSeqDisplay();
   }
   if(level.fullSeq.length == level.userSeq.length){
      let data = new URLSearchParams();
      data.append("lvlsize", level.fullSeq.length);
      data.append("lvltime", Date.now()-level.seqTimer);
      fetchgo(data);
      level.seqCount++;
      updateSeqCountDisplay();
      level.fullSeq = newSequence();
      level.userSeq = [];
      updateSeqDisplay();
      level.seqTimer = Date.now();
   }

   if(level.resolutionType == 'seqs_solved' && level.seqCount >= 10){
      revealElement(nextButton);
   }
}

oButton.onclick = function(event){
   event.preventDefault();
   checkSign(level, "O");
};

xButton.onclick = function(event){
   event.preventDefault();
   checkSign(level, "X");
};

nextButton.onclick = function(event){
   event.preventDefault();
   nextLevel();
}

prevButton.onclick = function(event){
   event.preventDefault();
   prevLevel();
}

for(let i = 0; i < 4; i++){
   anomArray[i].onclick = function(){
      var time = Date.now()-level.anomTimer;
      if(anomArray[i].checked)
      	{
           //console.log("Checked anom "+ i +" at time : "+ time +".");
           level.checkedAnomalies[i] = time;
        }
      else
        {
           //console.log("Unchecked anom "+ i +" at time : "+ time +".");
           level.checkedAnomalies[i] = -1;
        }
      //console.log(level.checkedAnomalies);
   }
}

function setupCheckboxLabels(){
  for(var i = 1; i <= 4; i++){
    var label = document.getElementById("anoLabel"+i);
    label.textContent = anomIdToStr(i-1);
  }
}

async function init_new_resfile(){
  let data = new URLSearchParams();
  data.append("eco", ecoID);
  fetch("new_resfile.php", {
    method: 'post',
    body: data
  })
  .then(function (response) {
     return response.text();
  })
  .then(function (text) {
    fileId = text;
  })
  .catch(function (error) {
    console.log(error)
  });

  return false;
}

fetchEco().then(function(response){
    ecoID = response;
    resetLevel();
});

