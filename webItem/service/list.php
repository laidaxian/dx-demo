<?php
	
	$data = [];
	for($i=0;$i<20;$i++){
		$data[$i] = ['img'=>'../assets/images/pic.png','k'=>$i];
	}
	echo json_encode( ["code"=>1,"data"=>$data] );

?>
