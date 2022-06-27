import { Level } from "./level2.js";

var audioPlayer = document.getElementById('audioplayer');
var oButton = document.getElementById('obutton');
var xButton = document.getElementById('xbutton');
var skipButton = document.getElementById('skipbutton');
//var phrase = document.getElementById('phrase');
//var section = document.getElementById('section');
var nextButton = document.getElementById('next');
var prevButton = document.getElementById('prev');
var seqDisplayer = document.getElementById('seqtable').children[0].children;
//var seqCountDisplay = document.getElementById('nbseq');
//var seqTimeDisplay = document.getElementById('timeseq');
var pageTitle = document.getElementById('pagetitle');
var pageText = document.getElementById('pagetext');
var anomArray = document.querySelectorAll('div.box2 > div.column')[0]; //tableau HTML des anomalies
var anomLabels = document.querySelectorAll('label');
var formNasa = document.getElementById('formNasa');
var nasaButton = document.getElementById('nasaButton');
var phraseText = document.getElementById('phraseText');
var sectionText = document.getElementById('sectionText');

//the ID defining which sounds folder you go into
var ecoID=1;
console.log("le type d'ecoID est:"+typeof ecoID);
var level; //niveau d'avancée dans les experiences
var lvlCount = 0; //numéro du niveau qui atttribue des propriétés aux niveaux
var finalPercent = 0;
var premSongsArray = [10, 11, 12]; //ID des musiques de test
var songsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]; //ID des musiques de test
var blue = 0;
var begin_exp = 19;
var end_exp = 37;

var fileId = 0;//identifiant fichier de réponse utilisateur coté JS

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

function SkipValue() { //pour les séquences à mettre en bleu
   blue = (Math.random() < 0.2);
}

function shuffleArray(array) { //mélange un tableau
   for (let i = array.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     const temp = array[i];
     array[i] = array[j];
     array[j] = temp;
   }
}


function newSequence() {  //crée une nouvelle séquence et initialise le timer à 0
   var seq = [];
   SkipValue();
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
         if(blue){
            (seqDisplayer[0].children[i]).setAttribute("style", "color:blue");
         }
         else{
            (seqDisplayer[0].children[i]).setAttribute("style", "color:black");
         }
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




function updateDisplay(){
   switch(level.resolutionType){
      case 'next_pressed':
         hideElement(anomArray);
         hideElement(oButton);
         hideElement(xButton);
         hideElement(skipButton);
         hideElement(seqDisplayer[0]);
         hideElement(seqDisplayer[1]);
         //hideElement(seqCountDisplay);
         //hideElement(seqTimeDisplay);
         for(let i = 0; i < anomArray.length; i++){
            hideElement(anomArray[i]);
            hideElement(anomLabels[i]);
         }
         if(lvlCount <= begin_exp - 8 && lvlCount != 0)
            revealElement(prevButton);
         else
            hideElement(prevButton);
            revealElement(pageTitle);
            revealElement(pageText);
         if(level.soundId != -1){
            revealElement(audioPlayer);
            audioPlayer.src = 'sounds/track_'+level.soundId+'.mp3';
            audioPlayer.controls = true;
            audioPlayer.setAttribute("loop", true);
            hideElement(nextButton);
         }
         else{
            hideElement(audioPlayer);
            revealElement(nextButton);
         }
         if (lvlCount == 9){
           revealElement(formNasa);
         }

         else if(lvlCount<begin_exp - 8 || lvlCount>end_exp || lvlCount%2!=0){
            hideElement(formNasa);
         }
         else{
            revealElement(formNasa);
            //hideElement(nextButton);
         }
      break;

      case 'seqs_solved':
         hideElement(anomArray);
         revealElement(oButton);
         revealElement(xButton);
         revealElement(skipButton);
         revealElement(seqDisplayer[0]);
         revealElement(seqDisplayer[1]);
         //revealElement(seqCountDisplay);
         //revealElement(seqTimeDisplay);
         for(let i = 0; i < anomArray.length; i++){
            hideElement(anomArray[i]);
            hideElement(anomLabels[i]);
         }
         revealElement(prevButton);
         hideElement(nextButton);
         hideElement(formNasa);
         revealElement(pageTitle);
         revealElement(pageText);
         hideElement(audioPlayer);
         updateSeqDisplay();
      break;

      case 'seqs_solved_with_timer':
          hideElement(anomArray);
          hideElement(oButton);
          hideElement(xButton);
          hideElement(skipButton);
          hideElement(seqDisplayer[0]);
          hideElement(seqDisplayer[1]);
          hideElement(formNasa);
          //hideElement(seqCountDisplay);
          //hideElement(seqTimeDisplay);
          for(let i = 0; i < anomArray.length; i++){
             hideElement(anomArray[i]);
             hideElement(anomLabels[i]);
          }
          hideElement(prevButton);
          //hideElement(nextButton);
          revealElement(pageTitle);
          revealElement(pageText);
          revealElement(audioPlayer);
          audioPlayer.src = 'sounds/track_'+level.soundId+'.mp3';
          audioPlayer.controls = true;
          audioPlayer.removeAttribute("loop");
          updateSeqDisplay();
       break;

      case 'sound_played':
         hideElement(anomArray);
         hideElement(oButton);
         hideElement(xButton);
         hideElement(skipButton);
         hideElement(seqDisplayer[0]);
         hideElement(seqDisplayer[1]);
         hideElement(formNasa);
         //hideElement(seqCountDisplay);
         //hideElement(seqTimeDisplay);
         for(let i = 0; i < anomArray.length; i++){
            hideElement(anomArray[i]);
            hideElement(anomLabels[i]);
         }
         hideElement(prevButton);
         //hideElement(nextButton);
         revealElement(pageTitle);
         revealElement(pageText);
         revealElement(audioPlayer);
         audioPlayer.src = 'sounds/track_'+level.soundId+'.mp3';
         audioPlayer.controls = true;
         audioPlayer.removeAttribute("loop");
         updateSeqDisplay();
      break;

      case 'sound_played_wo_seq':
         hideElement(anomArray);
         hideElement(oButton);
         hideElement(xButton);
         hideElement(skipButton);
         hideElement(seqDisplayer[0]);
         hideElement(seqDisplayer[1]);
         hideElement(formNasa);
         //hideElement(seqCountDisplay);
         //hideElement(seqTimeDisplay);
         for(let i = 0; i < anomArray.length; i++){
            hideElement(anomArray[i]);
            hideElement(anomLabels[i]);
         }
         hideElement(prevButton);
         //hideElement(nextButton);
         revealElement(pageTitle);
         revealElement(pageText);
         revealElement(audioPlayer);
         audioPlayer.src = 'sounds/track_'+level.soundId+'.mp3';
         audioPlayer.controls = true;
         audioPlayer.removeAttribute("loop");
      break;
   }
   if(lvlCount==9){
      hideElement(formNasa);
   }
}

audioPlayer.onplay = function(){
   audioPlayer.controls = false;
   if(level.resolutionType != 'next_pressed' && level.resolutionType != 'sound_played_wo_seq' && ecoID==1 || level.resolutionType === 'seqs_solved_with_timer') {
      revealElement(oButton);
      revealElement(xButton);
      revealElement(skipButton);
      revealElement(seqDisplayer[0]);
      revealElement(seqDisplayer[1]);
      //revealElement(seqCountDisplay);
      //revealElement(seqTimeDisplay);
   }
   else if(level.resolutionType === 'next_pressed') {
      revealElement(nextButton);
   }
   if(level.resolutionType != 'seqs_solved_with_timer'){
     for(let i = 0; i < anomArray.length; i++){
        revealElement(anomArray[i]);
        revealElement(anomLabels[i]);
     }
     revealElement(anomArray);
     level.anomTimer = Date.now();
     level.seqTimer = Date.now();
     (level.phraseArray).push(0);
     (level.sectionArray).push(0);
   }
   else{
    for(let i = 0; i < anomArray.length; i++){
       hideElement(anomArray[i]);
       hideElement(anomLabels[i]);
    }
    hideElement(anomArray);
    level.anomTimer = Date.now();
    level.seqTimer = Date.now();
   }
 }


async function fetchgo(data){
  console.log(data.toString());
  //return true;

  data.append("fileId", fileId);
  data.append("ecoId", ecoID);

  fetch("get_results.php", {
    method: 'post',
    body: data
  })
  /*.then(function (response) {
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


/*function successPercent(){ //pourcentage de réussite
   var perc = 0.0;
   for(let i = 0; i < level.checkedAnomalies.length; i++){
      if((level.checkedAnomalies[i]==-1) && (level.expectedAnomalies[i]==-1) || (level.checkedAnomalies[i]!=-1) && (level.expectedAnomalies[i]!=-1)){
         perc += 100.0;
      }
   }
   return perc/level.checkedAnomalies.length;
}*/

function endLvlTextSeq(inTraining){ //affichage du texte des séquences reproduites
   var txt1 = "Vous avez reproduit "+ level.seqCount +" séquences ("+ level.symCount +" symboles) en "+ (Math.floor((Date.now() - level.anomTimer)/10)*0.01).toFixed(0) +"s" /*+ "<br/>Votre réponse est à "+ successPercent() + "% correcte."*/;
   var txt2 = "\n";
   var txt3 = "Vous avez fait " + level.totalClicks + " clics totaux pour " + level.symCount + " clics utiles, soit un ratio de " + Math.round(level.symCount/level.totalClicks*1000)/10 + "% de clics utiles <br/>.";
   var txt = txt1 + txt2 + txt3;
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
         nasaButton.href="NASA.html?ecoid="+ecoID+"&resid="+fileId;
         //nasaButton.onclick="window.open('NASA.html?ecoid="+ecoID+"&resid="+fileId+",'_blank');"; 
         shuffleArray(songsArray);
         shuffleArray(premSongsArray);
         writeEco();
         console.log("ordre", songsArray);
         //setupCheckboxLabels();
         level = new Level('next_pressed', -1);
         pageTitle.textContent = "Bienvenue!"
         pageText.innerHTML = "Merci pour votre participation à cette expérience!<br/><br/> Ce jeu a pour but d'étudier le phénomène de la perception musicale. Votre rôle sera d'écouter attentivement des oeuvres musicales afin d'annoter les fin de phrases et de section que vous reconnaissez. Vous devrez par ailleurs effectuer un exercice de reproduction de chaînes de caractères 'X' et '0'" +((ecoID==1)?", puis effectuer les deux exercices en simultané":"") + ".<br/><br/> Cette expérience va se dérouler en plusieurs étapes:<ol> <li> Tout d'abord, vous effectuerez des sessions d'entraînement sur les tâches à effectuer </li><li>Dans un second temps, vous reproduirez pendant un temps défini un ensemble de séquence de caractères 'X' et 'O' présentés à l'écran.</li> <li> Dans la troisième partie de l'étude vous seront présentées des pièces musicales et nous vous demanderons de les segmenter d'une manière qui vous semble intuitive" +((ecoID==1)?", en effectuant la tâche de reproduction des séquences en simultané":"") + ". </li> <li> Après chaque pièce musicale, vous remplirez un court questionnaire qui nous aidera à évaluer votre effort lors de l'exécution de la tache </li><li>Enfin, vous répondrez à un court questionnaire concernant vos compétences musicales.</li> </ol> Vos performances et résultats sont totalement anonymes et vous ne serez en aucun cas lié à vos réponses. <br/> <br/> Si vous souhaitez avoir plus de détails sur l'expérimentation, n'hésitez pas à nous laisser votre adresse email à la fin de l'enquête." ;
      break;
      case 1:
         level = new Level('next_pressed', -1);
         pageTitle.textContent = "Explications";
         console.log("ecoID vaut"+ ecoID);
         pageText.innerHTML = ("<br/>Lors de l'expérience, vous écouterez douze pièces musicales. Votre tâche est de vous concentrer sur les morceaux que vous entendrez et, chaque fois que vous pensez pouvoir entendre la fin d'une phrase musicale, pressez la touche 'T' de votre clavier. Chaque fois que vous pensez entendre la fin d'une partie musicale plus longue, une section/période musicale, pressez la touche 'G' du clavier. <br/> La fin d'une section enregistre en même temps la fin d'une phrase, il est donc inutile d'appuyer sur les deux simultanément. <br/>"+((ecoID==1)?"<br/>En parallèle, vous jouerez à un jeu simple. Votre tâche sera de répéter des séquences  de 'X' et 'O' afin qu'ils correspondent à l'image affichée. <br/> Attention! Si la séquence présentée est écrite en bleu - vous ne devrez pas la copier! Cliquez sur le button 'skip' au lieu de la recopier. <br/>":"")+"<br/> La <u> phrase musicale </u> est comme une phrase linguistique - c'est une pensée, mais véhiculée par la musique. <br/> Une <u> section musicale </u> est cependant une partie plus grande, comme une histoire, une ambiance. <br/> <br/> Essayez de suivre vos intuitions en distinguant les deux.");
      break;
      case 2 :
         level = new Level('next_pressed', -1);
	       pageTitle.textContent = "Entrainement";
         pageText.innerHTML = "Lors des étapes suivantes vous allez effectuer trois sessions d'entraînement.";
         //pageText.innerHTML = "Lors de la prochaine étape, vous allez entendre une pièce musicale d'entrainement. <br/> Vous allez devoir la segmenter selon phrase et section musicale"+((ecoID==1)?", et reproduire des séquences de X et O en même temps.":".")+"<br/><br/> Appuyez sur la flèche pour continuer.";
      break;
      case 3 :
         level = new Level('seqs_solved_with_timer', 100);
	       pageTitle.textContent = "Entrainement 1";
         pageText.innerHTML = "Complétez un maximum de séquences de 'X' et de 'O' en évitant les clics inutiles.<br/> <br/>  Pour reproduire une séquence, cliquez à l'aide de la souris successivement sur les cases sous la séquence à reproduire. Si la séquence apparait en bleu, appuyez directement sur le bouton 'skip'.<br/> <br/>  Cliquez sur play pour lancer le chronomètre, et complétez les séquences en même temps. L'exercice se terminera automatiquement lorsque le chronomètre sera terminé.";
      break;
      case 4:
         pageTitle.textContent = "Bilan Entrainement 1";
         pageText.innerHTML = endLvlTextSeq(true) + "<br/><br/>Cliquez sur le bouton '->' pour passer à l'entraînement suivant.<br/>Ou sur '<-' pour recommencer l'entrainement.";
         level = new Level('next_pressed', -1);
      break;
      case 5 :
         level = new Level('sound_played_wo_seq', 73572);
         pageTitle.textContent = "Entrainement 2";
         pageText.innerHTML = "Vous allez écouter une oeuvre musicale.<br/> <br/>  Appuyez sur la touche 'T' de votre clavier lorsque vous entendez la fin d'une phrase.<br/> <br/>  Appuyez sur la touche 'G' de votre clavier lorsque vous entendez la fin d'une section.<br/><br/> La fin d'une section enregistre en même temps la fin d'une phrase, il est donc inutile d'appuyer sur les deux simultanément. <br/> <br/>  Cliquez sur play pour lancer le morceau, et effectuez la segmentation en même temps. L'exercice se terminera automatiquement lorsque le morceau sera terminé.";
      break;
      case 6:
         pageTitle.textContent = "Bilan Entrainement 2";
         pageText.innerHTML = "<br/><br/>Cliquez sur le bouton '->' pour passer à l'entraînement suivant.<br/>Ou sur '<-' pour recommencer l'entrainement.";
         level = new Level('next_pressed', -1);
      break;
      case 7 :
         level = new Level('sound_played', 7357);
         pageTitle.textContent = "Entrainement 3";
         pageText.innerHTML = "Vous allez écouter une oeuvre musicale.<br/> <br/>  Appuyez sur la touche 'T' de votre clavier lorsque vous entendez la fin d'une phrase.<br/> <br/>  Appuyez sur la touche 'G' de votre clavier lorsque vous entendez la fin d'une section."+((ecoID==1)?" En même temps, reproduisez les séquences de 'X' et 'O' présentées sur l'interface. En cas de difficultés, favorisez la tâche de segmentation.":"")+"<br/> <br/>  Cliquez sur play pour lancer le morceau, et effectuez la segmentation en même temps. L'exercice se terminera automatiquement lorsque le morceau sera terminé.";
      break;
      case 8:
         pageTitle.textContent = "Bilan Entrainement 3";
         pageText.innerHTML = ((ecoID==1)?endLvlTextSeq(true):"") +"Cliquez sur le bouton '->' pour passer à la présentation du questionnaire.<br/>Ou sur '<-' pour recommencer l'entrainement.";
         level = new Level('next_pressed', -1);
      break;
      case 9 :
         pageTitle.textContent = "Exemple de questionnaire";
         pageText.innerHTML = "A la fin de chaque morceau, vous répondrez à un questionnaire obligatoire dont le contenu est le suivant. Vous devrez évaluer votre charge mentale pour différents aspects sur une échelle, puis comparer l'impact de ceux-ci les uns par rapport aux autres. <br/> <br/> <u> Prenez bien le temps de lire chaque question et les intitulés sur les échelles! </u> <br/> (Attention, pour la question \"Performance\" l'échelle est inversée!)";
         pageText.innerHTML = " A la fin de chaque morceaux vous répondrez à un questionnaire obligatoire dont le contenu est le suivant: <br/> <br/> Tout d'abord, si vous venez d'écouter une chanson, nous vous demanderons si vous avez déjà entendu l'oeuvre avant cette expérience. <br/> <br/> <img width=70% height=70% class=\"fit-picture\" src=\"heard.png\"> <br/><br/> Ensuite, vous devrez évaluer votre charge mentale pour différentes aspects sur une échelle. Prenez bien le temps de lire chaque question et les intitulés sur les échelles! </u> <br/> (Attention, pour la question \"Performance\" l'échelle est inversée!) <br/><br/> <img width=100% height=100% class=\"fit-picture\" src=\"formulaire.png\"><br/> <br/> Enfin, vous comparerez l'impact des différents aspects sur la charge de travail les uns par rapport aux autres. Par exemple: <br/><br/> <img width=70% height=70% class=\"fit-picture\" src=\"compare.png\">"
         level = new Level('next_pressed', -1);
      break;
      case 10:
         pageTitle.textContent = "Partie expérimentale";
         pageText.innerHTML = "Vous allez maintenant commencer la partie expérimentale.<br/><br/>Bonne chance !";
      break;
      case 11 :
         level = new Level('seqs_solved_with_timer', 400);
         pageTitle.textContent = "Reproduction de séquences.";
         pageText.innerHTML = "Complétez un maximum de séquences de 'X' et de 'O' en évitant les clics inutiles.<br/> <br/>  Pour reproduire une séquence, cliquez à l'aide de la souris successivement sur les cases sous la séquence à reproduire. Si la séquence apparait en bleu, appuyez directement sur le bouton 'skip'. Essayez de garder la même intesité d'effort pendant toute la durée de l'exercice.<br/> <br/>  Cliquez sur play pour lancer le chronomètre, et complétez les séquences en même temps. L'exercice se terminera automatiquement lorsque le chronomètre sera terminé. La session dure 4 minutes.";
      break;
      case 12:
         pageTitle.textContent = "Bilan reproduction de séquences.";
         pageText.innerHTML = endLvlTextSeq(true) + "<br/> <br/>  Assurez vous d'avoir bien rempli le formulaire ci dessous avant de passer à la suite. Votre réponse à la première question n'est pas importante vu qu'il n'y avait pas d'oeuvre à écouter durant cette phase. " + "<br/><br/>Vous pourrez ensuite cliquer sur le bouton '->' pour passer au prochain morceau";
         level = new Level('next_pressed', -1);
      break;

      case 13 :
         level = new Level('sound_played_wo_seq', premSongsArray.pop());
         pageTitle.textContent = "Morceau 1/12";
         pageText.innerHTML = "Lancez la lecture ci-dessous, et segmentez de manière intuitive le morceau en phrases et en sections.";
      break;
      case 14:
         pageTitle.textContent = "Bilan Morceau 1";
         pageText.innerHTML = "Assurez vous d'avoir bien rempli le formulaire ci dessous avant de passer à la suite <br/><br/>Vous pourrez ensuite cliquer sur le bouton '->' pour passer au prochain morceau";
         level = new Level('next_pressed', -1);
      break;
      case 15 :
         level = new Level('sound_played_wo_seq', premSongsArray.pop());
         pageTitle.textContent = "Morceau 2/12";
         pageText.innerHTML = "Lancez la lecture ci-dessous, et segmentez de manière intuitive le morceau en phrases et en sections.";
      break;
      case 16:
         pageTitle.textContent = "Bilan Morceau 2";
         pageText.innerHTML = " Assurez vous d'avoir bien rempli le formulaire ci dessous avant de passer à la suite <br/><br/>Vous pourrez ensuite cliquer sur le bouton '->' pour passer au prochain morceau";
         level = new Level('next_pressed', -1);
      break;
      case 17 :
         level = new Level('sound_played_wo_seq', premSongsArray.pop());
         pageTitle.textContent = "Morceau 3/12";
         pageText.innerHTML = "Lancez la lecture ci-dessous, et segmentez de manière intuitive le morceau en phrases et en sections.";
      break;
      case 18:
         pageTitle.textContent = "Bilan Morceau 3";
         pageText.innerHTML = " Assurez vous d'avoir bien rempli le formulaire ci dessous avant de passer à la suite <br/><br/>Vous pourrez ensuite cliquer sur le bouton '->' pour passer au prochain morceau";
         level = new Level('next_pressed', -1);
      break;


      case 37 :
         pageTitle.textContent = "Merci pour votre participation à cette évaluation.";
         pageText.innerHTML = "Votre score final est de "+finalPercent+"%.<br/><br/>Cliquez sur '->' pour répondre à un bref sondage avant de partir.";
         level = new Level('next_pressed', -1);
      break;
      case 38 :
         location.assign("survey.html?ecoid="+ecoID+"&resid="+fileId);
      break;
      default:
         if(lvlCount >= begin_exp && lvlCount <= end_exp){
            if(lvlCount % 2 != 0){
               pageTitle.textContent = "Morceau "+((lvlCount-9)/2-1)+"/12";
               if (lvlCount == 19 && ecoID==1){
                 pageText.innerHTML = " Attention ! A partir de maintenant, vous devrez reproduire des séquences de 'X' et de 'O' en même temps qu'indiquer les fins de phrases et les fins de section.  <br/> <br/> Pour rappel, pour reproduire une séquence, cliquez à l'aide de la souris successivement sur les cases sous la séquence à reproduire. Si la séquence apparait en bleu, cliquez directement sur le bouton 'skip'. <br/> <br/> <u> Si la tâche est trop difficile, concentrez-vous sur la tâche de segmentation des phrases et sections.</u> ";
               }
               else{
                 pageText.innerHTML = "";
               }
               pageText.innerHTML += " Lancez la lecture ci-dessous,"+((ecoID==1)?" puis complétez autant de séquences que possible":"")+ " et segmentez de manière intuitive le morceau en phrases et en sections.";
               level = new Level('sound_played', songsArray.pop());
            } //lvlCount impair -> exercice
            else{
               pageTitle.textContent = "Bilan Morceau "+((lvlCount-10)/2-1);
               pageText.innerHTML = ((ecoID==1)?endLvlTextSeq(true):"") + (lvlCount!=end_exp? "<br/> <br/>  Assurez vous d'avoir bien rempli le formulaire ci dessous avant de passer à la suite " + "<br/><br/>Vous pourrez ensuite cliquer sur le bouton '->' pour passer au prochain morceau":"<br/><br/>Cliquez sur le bouton '->' pour terminer l'évaluation");
               level = new Level('next_pressed', -1);
            } //lvlCount pair -> bilan de l'exercice
         }
         else{
            pageTitle.textContent = "Erreur";
            pageText.innerHTML = "Ce niveau n'existe pas.";
         }
      break;
   }
   if(level.resolutionType == 'sound_played' || level.resolutionType == 'sound_played_wo_seq' ||level.resolutionType == 'seqs_solved_with_timer') {
      let data = new URLSearchParams();
      data.append("trackid", level.soundId);
      fetchgo(data);
   }
   level.fullSeq = newSequence();
   level.userSeq = [];
   if(!audioPlayer.paused) audioPlayer.pause();
   updateDisplay();
}

function nextLevel(){//change de niveau
   lvlCount++;
   console.log("niveau:"+lvlCount);
   resetLevel();
}

function prevLevel(){//niveau précédent
   if(lvlCount!=begin_exp) lvlCount--;
   else lvlCount = 1;
   resetLevel();
}


audioPlayer.onended = async function(){ //jsp trop
   if(audioPlayer.controls == false){
      let data = new URLSearchParams();
      await fetchgo(data);
      data = new URLSearchParams();
      data.append("sections", level.sectionArray.join(";"));
      data.append("phrases", level.phraseArray.join(";"));
      await fetchgo(data);
      nextLevel();
   }
};


function writeTime(level, button){//note le temps de click de la phrase ou section
   //let data = new URLSearchParams();
   //data.append("lvlsize", level.fullSeq.length);
   //data.append(button, Date.now()-level.seqTimer);
   //fetchgo(data);
   if(button==="section") {
      (level.sectionArray).push(Date.now()-level.anomTimer);
      level.sectionCount++;
   }
   if(button==="phrase") {
      (level.phraseArray).push(Date.now()-level.anomTimer);
      level.phraseCount++;
   }
}


function checkSign(level, sign){//ajoute un symbole dans la case
   var curPos = level.userSeq.length;
   level.totalClicks += 1;
   if(level.fullSeq[curPos] == sign && blue==0){
      level.userSeq.push(sign);
      level.symCount += 1;
      updateSeqDisplay();
   }
   if(blue==1 && sign=="skip"){
      let data = new URLSearchParams();
      data.append("lvlsize", 0);
      data.append("lvltime", Date.now()-level.seqTimer);
      fetchgo(data);
      level.seqCount++;
      level.fullSeq = newSequence();
      level.userSeq = [];
      updateSeqDisplay();
      level.seqTimer = Date.now();
   }
   if(level.fullSeq.length == level.userSeq.length){
      let data = new URLSearchParams();
      data.append("lvlsize", level.fullSeq.length);
      data.append("lvltime", Date.now()-level.seqTimer);
      fetchgo(data);
      level.seqCount++;
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

skipButton.onclick = function(event){
   event.preventDefault();
   checkSign(level, "skip");
}

document.onkeydown = function(e) {
   var key = e.key;
   if(lvlCount==5 || lvlCount==7 || lvlCount >= begin_exp - 6 && lvlCount <= end_exp && lvlCount % 2 != 0){
      if(key == 't'){ //touche t du clavier
         writeTime(level, "phrase");
         phraseText.setAttribute('style', 'color:red;text-align:center');
      }
      if(key == 'g'){ //touche g du clavier
         writeTime(level, "section");
         writeTime(level, "phrase");
         sectionText.setAttribute('style', 'color:red;text-align:center');
      }
   }
}

document.onkeyup = function(e) {
   var key = e.keyCode;
   if(lvlCount==5 || lvlCount==7 || lvlCount >= begin_exp - 6 && lvlCount <= end_exp && lvlCount % 2 != 0){
      if(key == 84){ //touche t du clavier
         phraseText.setAttribute('style', 'color:black;text-align:center');
      }
      if(key == 71){ //touche g du clavier
         sectionText.setAttribute('style', 'color:black;text-align:center');
      }
   }
}


nextButton.onclick = function(event){
   event.preventDefault();
   nextLevel();
}

prevButton.onclick = function(event){
   event.preventDefault();
   prevLevel();
}


async function init_new_resfile(){
  let data = new URLSearchParams();
  data.append("eco", ecoID);
  var response = await fetch("new_resfile.php", {
    method: 'post',
    body: data
  });
    return response.text();
}

fetchEco().then(function(response){
    ecoID = response;
    init_new_resfile().then(function(response){
      fileId = response;
      resetLevel();
    });
});
