angular.module('MyApp') 
.controller('JobCardDetailController', function ($scope, $window ,JobCardService) {
       


    //alert(angular.toJson($scope.data));

    $scope.JobCardParameter = {
        RegId: '',
        Month: '',       
        Year: ''
    };


    $scope.EmployeeDetail = {
        EmployeeCode: '',
        Name: '',
        Department: '',
        Section: '',
        Designation: ''
    };
    
    

    // Recive Parameter
    $scope.JobCardParameter = $window.JobCardParameter;

    //alert($scope.JobCardParameter);

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];

    $scope.monthName = monthNames[$scope.JobCardParameter.Month - 1];


  

    // Populate GetEmployeeDetailByRegId
    JobCardService.GetEmployeeDetailByRegId($scope.JobCardParameter.RegId).then(function (d) {
        $scope.EmployeeDetail = d.data[0];       
    }, function (error) {
        alert('Error GetEmployeeDetailByRegId!');
    });


    JobCardService.GetJobCard($scope.JobCardParameter).then(function (d) {

        //alert(angular.toJson(d.data));
        $scope.GetJobCardDetail = d.data;
       
        //var StatusALL = [];
        //$scope.GetJobCardDetail.forEach(function (entry) {
        //    StatusALL.push({ Status: entry.Status });
        //});

        //$scope.GetJobCardSummary = StatusALL;
        //alert(angular.toJson($scope.GetJobCardSummary));

    }, function (error) {
        alert('Error GetJobCard!');
    });


    

})


.factory('JobCardService', function ($http, $q) { 
  
    var fac = {};

    fac.GetEmployeeDetail = function () {
        return $http.get('/Home/GetEmployeeDetail')
    }

    fac.GetEmployeeDetailByRegId = function (RegId) {
        return $http.get('/Data/GetEmployeeDetailByRegId', {
            params: { RegId: RegId }
        });
    }


    fac.GetJobCard = function (data) {
        return $http.get('/Data/GetJobCard', {
            params: { RegId: data.RegId, Month: data.Month, Year: data.Year }
        });
       
    }
    


    return fac;
});

