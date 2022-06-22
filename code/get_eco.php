<?php

if($_SERVER["REQUEST_METHOD"] == "GET") { //récupérer données
    $file_contents = file_get_contents("ecoUsed.txt");

    $num1 = substr_count($file_contents, '1'); // combien de fois on rencontre la substring dans la chaine de caractères
    $num2 = substr_count($file_contents, '2');
    $randi = rand(1,2);

    if($num1 > $num2) echo '2';
    elseif($num1 < $num2) echo '1';  //favoriser la moins représentée, sauf si égal alors aléatoire
    else echo $randi; //renvoi dans le code JS
}
if($_SERVER["REQUEST_METHOD"] == "POST") { //écrire données
    $ecofile = fopen("ecoUsed.txt", "a");
    if(!empty($_POST["ecoid"])){
      fwrite($ecofile, $_POST["ecoid"]); //écriture dans un fichier
    }
    fclose($ecofile);
}
?>
