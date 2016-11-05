<?php 

require 'vendor/autoload.php';

use NlpTools\Tokenizers\WhitespaceAndPunctuationTokenizer;

$app = new Slim\App();

$app->post('/export', function ($req, $res) {

       // Open the output stream
       //$fs = fopen('php://output', 'w');

       // Start output buffering (to capture stream contents)
       ob_start();
       $tokenizer = new WhitespaceAndPunctuationTokenizer();       
       $request = $req->getParsedBody();
       $filename="annotated-".date('m-d-Y_hia').'.tsv'; 
       
       $text = $request['text'];
       $tokens = $tokenizer->tokenize($text);
       //print_r($token);	
       $tags = $request['tags'];
       $fileContent = "";
       foreach($tokens as $token){
          $fileContent .= $token."\t";
	  $text = 'O';
	foreach($tags as $tag){
          if($tag['word'] == $token ) {
             $text = $tag['tag'];
	     break;
		
          }
	}
	$fileContent .= $text;
          $fileContent .= "\n";

       }

        //fwrite($fs, $fileContent);
	//$string = ob_get_clean();
	header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
	header("Content-Type: application/force-download", FALSE);
	header("Content-Type: application/download", FALSE);
	header('Content-Disposition: attachment;filename="'.$filename.'"');
	header('Content-Transfer-Encoding: Binary');
	header('Pragma: public');	
        header('Content-Length: '.strlen($fileContent));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Expires: 0');
	//readfile($string);
    //ob_clean();    
    //flush();
    //readfile('php://output');    
    //exit();

        //exit($string);
	echo $fileContent;
        //exit;

	//$res->write($fileContent);
});



$app->run();

