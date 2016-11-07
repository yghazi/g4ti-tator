<?php 

require 'vendor/autoload.php';

use NlpTools\Tokenizers\WhitespaceAndPunctuationTokenizer;

$app = new Slim\App();

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});


$app->post('/export', function ($req, $res) {

       // Start output buffering (to capture stream contents)
       //ob_start();


       $tokenizer = new WhitespaceAndPunctuationTokenizer();       
       $request = $req->getParsedBody();
       $filename="annotated-".date('m-d-Y_hia').'.tsv'; 
       
       $text = $request['text'];
       $tags = $request['tags'];
       $fileContent = "";
       $tags = json_decode($tags);

       foreach ($tags as $key => $value) {
         $text = str_replace($value->word, 'tag'.$key, $text);
       }
       $tokens = $tokenizer->tokenize($text);
       $tokenText = '';
       foreach($tokens as $token){
          $text = $token."\tO\n";
          foreach($tags as $key => $tag){
            if('tag'.$key == $token ) {
               $parts = explode(' ', $tag->word);               
               if(count($parts) > 0){
                  $text = "";
                  foreach ($parts as $key => $part) {
                    $text .= $part."\t".$tag->tag."\n";
                  }
               }else{
                $text = $tag->word."\t".$tag->tag."\n";
               }  
               break;
            }
          }
          $fileContent .= $text;
        }

        header('Content-Type: application/json');
        
        $data = array(
          'file'=>  $filename,
          'data'=> $fileContent,

        );
        echo json_encode($data);

       
        
});



$app->run();