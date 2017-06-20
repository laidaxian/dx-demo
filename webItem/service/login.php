<?php
	define('ACCOUNT','13760668882');
	define('PASSWORD','111111');

	$account = isset($_POST['account']) ? $_POST['account'] : '';
	$password = isset($_POST['password']) ? $_POST['password'] : '';
	
	if($account == ACCOUNT && $password == PASSWORD){
		echo json_encode( ["code"=>1,"data"=>"ok"] );
		exit;
	}

	echo json_encode( ["code"=>0,"data"=>"account or password errror"] );

?>
