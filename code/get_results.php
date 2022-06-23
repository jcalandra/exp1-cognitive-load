<?php

if($_SERVER["REQUEST_METHOD"] == "POST") {
        $answers = fopen("data".$_POST["ecoId"]."/resultats_".$_POST["fileId"].".csv", "a");
        if(!empty($_POST["lvlsize"]) && !empty($_POST["lvltime"])){
           fwrite($answers,$_POST["lvlsize"].";".$_POST["lvltime"]);
           fwrite($answers,";");
        }
        if(!empty($_POST["trackid"])){
           fwrite($answers,"track".$_POST["trackid"]);
           fwrite($answers,";");
        }
        if(!empty($_POST["phrases"])){
                fwrite($answers,"tableau des phrases: ".$_POST["phrases"]);
                fwrite($answers,";");
             }
        if(!empty($_POST["sections"])){
                fwrite($answers,"tableau des sections: ".$_POST["sections"]);
                fwrite($answers,";");
             }
        if(!empty($_POST["nasa"])){
                  fwrite($answers,"questionnaire NASA_TLX: ".$_POST["nasa"]);
                  fwrite($answers,";");
            }

        fwrite($answers,"\n");
        fclose($answers);
}
?>
