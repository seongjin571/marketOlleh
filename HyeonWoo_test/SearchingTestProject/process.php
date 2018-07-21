<?php
	require("config/config.php");
	require("lib/db.php");

	$conn = db_init($config["host"],$config["duser"],$config["dpw"],$config["dname"]);
	$sql = "SELECT * FROM `market` WHERE `".$_GET['filed']."` LIKE '%".$_GET['search_value']."%' ORDER BY `gooname` ASC";
	$result = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html>
<head>
	<title>Searching Result</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<style>
		*{
			border: 1px solid gray;
		}
	</style>
</head>
<body>
	<ol>
		<?php
		while ($row = mysqli_fetch_assoc($result)) {
			echo '<li>'.$row['name']." / ".$row['gooname']." / ".$row['dongname']." / ".$row['newaddress']." / ".$row['oldaddress'].'</li>'."\n";
		}
		?>
	</ol>

	<form action="process.php" method="get">
		<select name="filed">
		    <option value="name" selected="selected">시장이름</option>
		    <option value="gooname">구</option>
		    <option value="dongname">동</option>
		    <option value="newaddress">도로명</option>
		    <option value="oldaddress">지번</option>
		</select>
		<input type="text" placeholder="searching" name="search_value">
		<input type="submit" value="Click">
	</form>

	<!-- <img src="./res/imgs/goomap.svg"> -->
	<table id="gooTable">
		<tr>
			<td>노원구</td>
			<td>성동구</td>
			<td>은평구</td>
			<td>양천구</td>
			<td>강북구</td>
			<td>동대문구</td>
		</tr>
		<tr>
			<td>도봉구</td>
			<td>송파구</td>
			<td>성북구</td>
			<td>관악구</td>
			<td>영등포구</td>
			<td>중구</td>
		</tr>
		<tr>
			<td>금천구</td>
			<td>서대문구</td>
			<td>강동구</td>
			<td>종로구</td>
		</tr>
		<tr>
			<td>동작구</td>
			<td>강남구</td>
			<td>마포구</td>
		</tr>
		<tr>
			<td>서초구</td>
			<td>강서구</td>
			<td>광진구</td>
		</tr>
		<tr>
			<td>구로구</td>
			<td>중랑구</td>
		</tr>
		<tr>
			<td>용산구</td>
		</tr>
	</table>

	<div>
		<input type="text" id="text_inner" value="START : " style="height:300px">
	</div>
	<script src="jquery.js"></script>
	<script src="js/process.js"></script>
	
</body>
</html>