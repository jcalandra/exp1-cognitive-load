function equalAnomalies (a1, a2){
   for(i = 0; i < a1.length; i++){
      if(a1[i] == -1 && a2[i] != -1) return false;
      if(a2[i] == -1 && a1[i] != -1) return false;
   }
   return true;
}

function initAnomTimeExpecter(){
   var xmlhttp;
    if (window.XMLHttpRequest)
   {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
   }
   else
   {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }

   xmlhttp.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200)
      {
         Level.anomTimeExpecter = xmlhttp.responseText.split('\r\n');
      }
   };
   xmlhttp.open("GET","expected_times.csv",false);
   xmlhttp.send();
}

export class Level {
   static anomTimeExpecter = null; //va chercher le tableau des temps attendus

   constructor(resolutionType, soundId) {
      this.resolutionType = resolutionType; //quel critère passer au niveau suivant (string)
      this.seqCount = 0; //nombre de séquences reproduites
      this.symCount = 0; //nombre de symboles reproduits
      this.seqTimer = Date.now(); //timer pour garder en mémoire le temps à des moments spécifiques
      this.anomTimer = 0; //timer pour cocher les anomalies
      this.sectionCount = 0;
      this.phraseCount = 0;
      this.sectionArray = [];
      this.phraseArray = [];
      this.fullSeq = []; //séquence de X et O pour le level
      this.userSeq = []; //séquence que l'utilisateur rentre


      if(Level.anomTimeExpecter == null){
         initAnomTimeExpecter();
      }

      this.expectedAnomalies = []; //tableau des anomalies attendues
      if(soundId>=8){
        console.log(Level.anomTimeExpecter);
        this.expectedAnomalies = Level2.anomTimeExpecter[soundId-8].split(';').slice(1);
        console.log(this.expectedAnomalies);
      }

      this.checkedAnomalies = [-1,-1,-1,-1];

      this.soundId = soundId;
   };


}
