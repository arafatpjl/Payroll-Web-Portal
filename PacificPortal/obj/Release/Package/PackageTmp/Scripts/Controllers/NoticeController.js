angular.module('MyApp') 
.controller('NoticeController', function ($scope, $http,$timeout,$filter,$window, NoticeService) {
       

    //alert(angular.toJson($scope.data));

    $scope.File_Name = "";
    
    // Populate NoticeService
    NoticeService.GetNotice().then(function (d) {       
        $scope.NoticeList = d.data;

    }, function (error) {
        alert('Error GetNotice');
    });



    $scope.GetNoticeURL = function (URL) {
        $scope.File_Name = URL;
    };




    //$scope.File_Name = "Festival_2018.pdf";

    function ClearForm() {
        $scope.User = {};
        $scope.f1.$setPristine(); //here f1 is form name
        $scope.submitted = false;
    }

    //GetNotice

})




.factory('NoticeService', function ($http, $q) { 


    var fac = {};


    fac.GetNotice = function () {       
        return $http.get('/Data/GetNotice')
    }

   
    return fac;
});
