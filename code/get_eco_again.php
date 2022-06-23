<?php
if($_SERVER["REQUEST_METHOD"] == "GET") {
$url_components = parse_url($_SERVER['HTTP_REFERER']);
        parse_str($url_components['query'], $params);
        $ecoID = $params['ecoid'];
        echo $ecoID;
}
?>