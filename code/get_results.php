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

        fwrite($answers,"\n");
        fclose($answers);
}

if(!empty($_POST["nasa"])){
          $url_components = parse_url($_SERVER['HTTP_REFERER']);
          parse_str($url_components['query'], $params);
          $fileid = $params['resid'];
          $ecoid = $params['ecoid'];
          $answers = fopen("data".$ecoid."/resultats_".$fileid.".csv", "a");
          fwrite($answers,"questionnaire NASA_TLX: ".$_POST["nasa"]);
          fwrite($answers,";");
          fwrite($answers,"\n");
          fclose($answers);
    }
?>
