angular.module('MyApp') 
.controller('LeaveCardDetailController', function ($scope, $window,  LeaveCardService) {
       


    //alert(angular.toJson($scope.data));


    $scope.LeaveCardParameter = {
        RegId: '',
        Year: ''
    };



    $scope.LeaveCardParameter = $window.LeaveSummaryParameter;

  
    //alert(angular.toJson($scope.LeaveCardParameter));

    // Populate EmployeeDetails

    //LeaveCardService.GetEmployeeDetail().then(function (d) {
    //    $scope.EmployeeDetail = d.data;
    //}, function (error) {
    //    alert('Error!');
    //});



    // Populate GetEmployeeDetailByRegId
    LeaveCardService.GetEmployeeDetailByRegId($scope.LeaveCardParameter.RegId).then(function (d) {
        $scope.EmployeeDetail = d.data[0];
    }, function (error) {
        alert('Error GetEmployeeDetailByRegId!');
    });



    // Populate LeaveSummary
    LeaveCardService.GetLeaveSummary($scope.LeaveCardParameter).then(function (d) {
        //alert(angular.toJson(d.data));
        $scope.LeaveSummaryList = d.data;

    }, function (error) {
        alert('Error GetLeaveSummary !' + error);
    });

    LeaveCardService.GetLeaveEnjoyDetail($scope.LeaveCardParameter).then(function (d) {
        //alert(angular.toJson(d.data));
        $scope.LeaveCardDetails = d.data;
    }, function (error) {
        alert('Error GetLeaveEnjoyDetail!');
    });


    

})


.factory('LeaveCardService', function ($http, $q) { 
  
    var fac = {};

    //fac.GetEmployeeDetail = function () {
    //    return $http.get('/Home/GetEmployeeDetail')
    //}

    fac.GetEmployeeDetailByRegId = function (RegId) {
        return $http.get('/Data/GetEmployeeDetailByRegId', {
            params: { RegId: RegId }
        });
    }

    fac.GetLeaveSummary = function (data) {
        return $http.get('/Leave/GetLeaveSummary', {
            params: { Year: data.Year }
        });


    }


    fac.GetLeaveEnjoyDetail = function (data) {
        return $http.get('/Leave/GetLeaveEnjoyDetail', {
            params: { RegId: data.RegId, Year: data.Year }
        });


    }


    return fac;
});

