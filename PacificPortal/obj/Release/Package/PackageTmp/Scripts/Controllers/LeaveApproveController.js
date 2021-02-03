angular.module('MyApp') 
.controller('LeaveApproveController', function ($scope, $http,$timeout,$filter,$window, LeaveApproveService) {
       


    //alert(angular.toJson($scope.data));


    //Default Variable
    $scope.submitted = false;
    $scope.message = '';
    $scope.CompID = '';
    $scope.isFormValid = false;


    $scope.data = {
        Month: '',
        Year: ''
    };


    $scope.months = [
           { name: 'January', id: 1 },
           { name: 'February', id: 2 },
           { name: 'March', id: 3 },
           { name: 'April', id: 4 },
           { name: 'May', id: 5 },
           { name: 'June', id: 6 },
           { name: 'July', id: 7 },
           { name: 'August', id: 8 },
           { name: 'September', id: 9 },
           { name: 'October', id: 10 },
           { name: 'November', id: 11 },
           { name: 'December', id: 12 }]

    ;



    $scope.data.Year = new Date().getFullYear();






    $scope.search_by = function () {
        Load_Data();
    };



    function Load_Data() {


        //// Populate GetEmployeeLeaveApproved

        LeaveApproveService.GetEmployeeLeaveApproved($scope.data).then(function (d) {

           // alert(angular.toJson(d.data));

            $scope.EmpList = $filter('filter')(d.data, { ComID: $scope.Company.ID }, true);
           // alert(angular.toJson($scope.EmpList));

        }, function (error) {
            alert('Error GetEmployeeLeaveApproved!');
        });

    }




    // Populate Unit
    LeaveApproveService.GetCompany().then(function (d) {
        $scope.CompanyList = d.data;


        // Populate DeptSec AND  Company Filter
        LeaveApproveService.GetEmpDeptSec().then(function (d) {

            $scope.DepartmentList = d.data;
            $scope.SectionList = d.data;
            $scope.ComID = extractColumn($scope.DepartmentList, 'ComID')

            // alert(angular.toJson(ComID));

        }, function (error) {
            alert('Error!' + error);
        });



    }, function (error) {
        alert('Error!' + error);
    });




    $scope.containsComparator = function (expected, actual) {
        // alert(expected + '_' + actual);
        return actual.indexOf(expected) > -1;
    };



    function extractColumn(arr, column) {
        function reduction(previousValue, currentValue) {
            previousValue.push(currentValue[column]);
            return previousValue;
        }

        return arr.reduce(reduction, []);
    }


    //Clear Form 
    function ClearForm() {
        $scope.User = {};
        $scope.f1.$setPristine(); //here f1 is form name
        $scope.submitted = false;
    }

})




.factory('LeaveApproveService', function ($http, $q) { 


    var fac = {};


    fac.GetCompany = function () {
        return $http.get('/Data/GetCompany')
    }


    fac.GetEmpDeptSec = function () {
        return $http.get('/Data/GetEmpDeptSec', {
            params: { Type: 'HRApprove' }
        });
    }



    fac.GetEmployeeLeaveApproved = function (data) {
        //alert(angular.toJson(data));
        return $http.get('/Leave/GetEmployeeLeaveApproved', {
            params: { Month: data.Month, Year: data.Year }
        });
    }



    return fac;
});
