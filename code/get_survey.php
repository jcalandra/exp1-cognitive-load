<?php

        $url_components = parse_url($_SERVER['HTTP_REFERER']);
        print_r($url_components);
        parse_str($url_components['query'], $params);
        $fileid = $params['resid'];
		   $ecoid = $params['ecoid'];

        $answers = fopen("data".$ecoid."/resultats_".$fileid.".csv", "a");
        if(!empty($_POST["age"])){
           fwrite($answers,"Age;".$_POST["age"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["gender"])){
           fwrite($answers,"Genre;".$_POST["gender"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["fm"])){
           fwrite($answers,"Durée formation musicale;".$_POST["fm"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["dpi"])){
           fwrite($answers,"Durée pratique d'un instrument;".$_POST["dpi"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["pm"])){
           fwrite($answers,"Pratique musicale actuelle;".$_POST["pmo"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["ptm"])){
           fwrite($answers,"Fréquence/semaine;".$_POST["ptm"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["pa"])){
           fwrite($answers,"Problème d'audition;".$_POST["pa"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["admail"])){
           fwrite($answers,$_POST["admail"]);
           fwrite($answers,"\n");
        }
        fclose($answers);

	echo "<h1>Merci pour votre participation.</h1><p>Vos réponses ont bien été enregistrées. Vous pouvez à présent quitter cette page.</p>";
?>
