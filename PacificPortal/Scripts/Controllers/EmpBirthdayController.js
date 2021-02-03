angular.module('MyApp') 
.controller('EmpBirthdayController', function ($scope, $http,$timeout,$filter,$window, EmpBirthdayService) {
       

    //alert(angular.toJson($scope.data));


    //// Populate GetEmployeeInfoDetail
    EmpBirthdayService.GetEmployeeInfoDetail().then(function (d) {
        $scope.EmployeeInfoList = d.data;
       
    }, function (error) {
        alert('Error GetEmployeeDetail!');
    });
   

   
    //Clear Form 
    function ClearForm() {
        $scope.User = {};
        $scope.f1.$setPristine(); //here f1 is form name
        $scope.submitted = false;
    }

})




.factory('EmpBirthdayService', function ($http, $q) { 


    var fac = {};


    fac.GetEmployeeInfoDetail = function () {
        return $http.get('/Data/GetEmployeeBirthDay')
    }

   
    return fac;
});
