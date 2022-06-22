<?php

        $url_components = parse_url($_SERVER['HTTP_REFERER']);
        parse_str($url_components['query'], $params);
        $fileid = $params['resid'];
				$ecoid = $params['ecoid'];

        $answers = fopen("data".$ecoid."/resultats_".$fileid.".csv", "a");
        if(!empty($_POST["age"])){
           fwrite($answers,$_POST["age"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["gender"])){
           fwrite($answers,$_POST["gender"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["xpjv"])){
           fwrite($answers,"Jamais/Tres souvent;".$_POST["xpjv"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["xpbt"])){
           fwrite($answers,"Silencieux/Assourdissant;".$_POST["xpbt"]);
           fwrite($answers,"\n");
        }
        if(!empty($_POST["admail"])){
           fwrite($answers,$_POST["admail"]);
           fwrite($answers,"\n");
        }
        fclose($answers);

	echo "<h1>Merci pour votre participation.</h1><p>Vos réponses ont bien été enregistrées. Vous pouvez à présent quitter cette page.</p>";
?>
