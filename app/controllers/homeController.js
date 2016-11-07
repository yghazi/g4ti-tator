app.controller('homeController',function($scope, $http){
	$scope.allTags = [];
	$scope.rawText = "";
	/*$("#text-editor").highlightTextarea({
	});*/

	function getInputSelection(elem){
	 if(typeof elem != "undefined"){
	  s=elem[0].selectionStart;
	  e=elem[0].selectionEnd;
	  return elem.val().substring(s, e);
	 }else{
	  return '';
	 }
	}

	$scope.selectedText = false;
	$( "#text-editor" ).on('select',function() {
		var selectedText = getInputSelection($(this));
		$scope.selectedText = selectedText;
	  	$scope.$apply()
	});

	$scope.jsonTags = "";
	$scope.addTag = function(){
		$scope.allTags.push({word:$scope.selectedText, tag:$scope.tagName})
		$scope.jsonTags = JSON.stringify($scope.allTags, null,0);
		$scope.selectedText = false;
		$scope.tagName = "";
	}

	$scope.export = function(){
		var data = {
			text: $scope.rawText,
			tags: $scope.jsonTags
		}
		var request = {
			url:"api/index.php/export",
			method: 'POST',
			data: data,
			headers:{
				'Content-Type':'application/json'
			}
		}
		$http(request).then(function(res){
			
			var file = new Blob([ res.data.data ], {
		        type : 'application/tsv'
		    });
		    var fileURL = URL.createObjectURL(file);
		    var a         = document.createElement('a');
		    a.href        = fileURL; 
		    a.target      = '_blank';
		    a.download    = res.data.file;
		    document.body.appendChild(a);
		    a.click();
		})
	}
})