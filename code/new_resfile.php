<?php
$n = 0;
$eco = $_POST["eco"];
$answers = fopen("data".$eco."/resultats_".$n.".csv", "r");
while($answers != FALSE){
   fclose($answers);
   $n++;
   $answers = fopen("data".$eco."/resultats_".$n.".csv", "r");
}
$answers = fopen("data".$eco."/resultats_".$n.".csv", "w");
fclose($answers);
echo $n;
?>
