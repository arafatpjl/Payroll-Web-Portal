angular.module('MyApp')
.controller('DeshboardController', function ($scope,$window, DeshboardService) {


    //alert(angular.toJson($scope.data));

    $scope.submitText = 'Preview';
    $scope.submitted = false;
    $scope.message = '';
   
    $scope.isFormValid = false;

    $scope.User = {
        CompID: '',
        EmpCode: '',
        Month: '',       
        Year: ''  
    };
    




    // Populate Unit
    DeshboardService.GetTeamMember().then(function (d) {       
        //$scope.EmployeeDetail = d.data;
    }, function (error) {
        alert('Error GetTeamMember!');
    });


    $scope.showJobCard = function (data) {
        $scope.submitted = true;
        $scope.message = '';

        if ($scope.isFormValid) {           
            var $popup = $window.open("/Home/JobCard", "popup", "width=800,height=800,left=50,top=50");           
            $popup.JobCardParameter = data;

        } else {
            $scope.message = '';

        }
    }


})
.factory('DeshboardService', function ($http, $q) {

    var fac = {};




    
    fac.GetTeamMember = function () {        
        return $http.get('/Data/GetTeamMember')
    }

   

    return fac;
});

