angular.module('MyApp') 
.controller('HelpLineControllerController', function ($scope, $http,$timeout, HelpLineControllerService) {
       
    //alert(angular.toJson($scope.data));

    //Default Variable
    $scope.submitText = "Recover";
    $scope.submitted = false;
    $scope.message = '';
    $scope.CompID = '';
    $scope.isFormValid = false;

   

    $scope.User = {
        CompID: '',
        EmployeeCode: '',
        Name: '',
        RegId: ''
    };

  


    

   
    //// Populate GetEmployeeInfoDetail
    HelpLineControllerService.GetEmployeeInfoDetail().then(function (d) {
        $scope.EmployeeInfoList = d.data;
       
        ////$scope.ProfilePic = '../images/users/blank-profile-picture.png';
        //$scope.ProfilePic = '../images/users/' + d.data[0].RegId + '.png';

      
        //$http.get($scope.ProfilePic).then(function () {
        //    $scope.ProfilePic = '../images/users/' + d.data[0].RegId + '.png';
        //}, function (error) {
        //    //alert(error);
        //    $scope.ProfilePic = '../images/users/blank-profile-picture.png';
        //}
        //          );


    }, function (error) {
        alert('Error GetEmployeeDetail!');
    });
   


    $scope.loading = 10;

    setTimeout(function () {
        $scope.$apply(function () {
            $scope.loading = 100;
        });


    }, 5000);

    myhandler();
    function myhandler() {        
       
       
        if ($scope.loading < 100) {
            $scope.loading = $scope.loading + 5;
            $timeout(myhandler, 200);
        }
    }



    // GET JSON ARRAY HEADERS.
    //$scope.headers = Object.keys($scope.EmployeeInfoList[0]);
    
    var monthNames = ['Name', 'Department', 'Section', 'Designation', 'BloodGroup', 'PreAddress', 'PerAddress', 'Religion'];
    $scope.headers = monthNames;
    $scope.columns = monthNames[0];

    $scope.Limit = "100";



    ////validates form on client side
    //$scope.$watch('search', function (newValue) {
        
    //    alert(newValue);
    //    if (newValue === undefined || newValue === null) {
    //        $scope.Limit = "12";
    //    } else {
    //        $scope.Limit = "10000";
    //    }
        
    //});

    $scope.check = function () {

        $scope.loading = 10;
        myhandler();

        var x = $scope.search[$scope.columns];
        
        //alert(angular.toJson(x));
     
        if (x.length === 0 || typeof x === 'undefined') {
            
            $scope.Limit = "100";
        } else {
            $scope.Limit = $scope.EmployeeInfoList.length;
        }
    };

    // Populate Unit
    HelpLineControllerService.GetCompany().then(function (d) {
        $scope.CompanyList = d.data;
    }, function (error) {
        alert('Error!' + error);
    });


    $scope.GetCompID = function () {
        $scope.User.CompID = $scope.Company.ID;
        $scope.User.CompName = $scope.Company.Name;
    };



    //validates form on client side
    $scope.$watch('f1.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });
    //Save Data
    $scope.HelpLineController = function (data) {


        if ($scope.submitText == 'Recover') {
            $scope.submitted = true;
            $scope.message = '';           
            if ($scope.isFormValid) {
                //$scope.submitText = 'Please Wait...';
                $scope.User = data;

                //Registration Check

                HelpLineControllerService.HelpLineController($scope.User).then(function (d) {
                   
                    if (d == 'Success') {
                        alert("Temporary Password sent to your email ID");
                        window.location.pathname = 'Home/Deshboard';
                        //alert('Success');
                        ClearForm();
                    }
                    else
                    {
                        alert(d);
                    }

                    $scope.submitText = "Recover";
                });
            }
            else {
                $scope.message = '';

            }
        }
    }
    //Clear Form 
    function ClearForm() {
        $scope.User = {};
        $scope.f1.$setPristine(); //here f1 is form name
        $scope.submitted = false;
    }

})




.factory('HelpLineControllerService', function ($http, $q) { 


    var fac = {};


    fac.GetEmployeeInfoDetail = function () {
        return $http.get('/Data/GetEmployeeInfoDetail')
    }


    fac.GetCompany = function () {
        return $http.get('/Data/GetCompany')
    }
    

    fac.GetEmployeeDetailByEmpCode = function (data) {
        return $http.get('/Data/GetEmployeeDetailByEmpCode', {
            params: { CompID: data.CompID, EmpCode: data.EmployeeCode }
        });
    }

    
   
    fac.HelpLineController = function (data) {
        
        var defer = $q.defer();

        var data_emp = fac.GetEmployeeDetailByEmpCode(data);

        data_emp.then(function (result) {
            //alert(angular.toJson(result));
            if (result.data.length < 1) {
                defer.resolve('Login ID Not avaiable');
                return defer.promise;
            }
            else {
                data.RegId = result.data[0].RegId;
                data.Updated_by = result.data[0].Name;
                
                //alert($scope.User.RegId)
                $http({
                    url: '/User/HelpLineController',
                    method: 'POST',
                    data: JSON.stringify(data),
                    headers: { 'content-type': 'application/json' }
                }).success(function (d) {
                    // Success callback
                    defer.resolve(d);
                }).error(function (e) {
                    //Failed Callback
                    alert('Error HelpLineController!');
                    defer.reject(e);
                });
            }
        });




       
        return defer.promise;
    }
    return fac;
});
