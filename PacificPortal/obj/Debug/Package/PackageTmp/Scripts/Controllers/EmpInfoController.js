angular.module('MyApp') 
.controller('EmpInfoController', function ($scope, $http,$timeout,$filter,$window, EmpInfoService) {
       
    //alert(angular.toJson($scope.data));

    //Default Variable
    $scope.submitText = "Recover";
    $scope.submitted = false;
    $scope.message = '';
    $scope.CompID = '';
    $scope.isFormValid = false;

   
    
    $scope.User = {
        RegId: '',
        Password: '',
        EmailID: '',
        MobileNoPerson: '',
        PhoneExt: '',
        Password: '',
        DeptHead: '',
        ReportSuper: '',
        DateofBirth: new Date(),
        BloodGroup: ''

    };


    //alert(angular.toJson(x));
  
    $scope.BloodGroupList = $filter('BloodGroupList')();

    //// Populate GetEmployeeInfoDetail
    EmpInfoService.GetEmployeeInfoDetail().then(function (d) {
        $scope.data = d.data;

        //Rename Object key -- ComID>Unit
         angular.forEach($scope.data, function (value, key) {
            $scope.data[key].Unit = $scope.data[key].ComID;
            delete $scope.data[key].ComID;

        });


        angular.forEach($scope.data, function (obj) {
            $scope.data.Unit = $scope.data.ComID;
            delete $scope.data.ComID;
        });
       

        $scope.EmployeeInfoList = $scope.data;
       
    }, function (error) {
        alert('Error GetEmployeeDetail!');
    });
   



    //// Populate EmployeeDetail
    EmpInfoService.GetRegistrationDetail().then(function (d) {
        $scope.User = d.data;
      
    }, function (error) {
        alert('Error GetEmployeeDetail!');
    });


    $scope.loading = 20;

  
    myhandler();

    function myhandler() {        
       
       
        if ($scope.loading < 100) {
            $scope.loading = $scope.loading + 20;
            $timeout(myhandler, 100);
        }
        else
        {
            //$scope.makeReadOnlysearchbox = false;
        }
    }



    // GET JSON ARRAY HEADERS.
    //$scope.headers = Object.keys($scope.EmployeeInfoList[0]);
    
    var columnsNames = ['Unit', 'Department', 'Section', 'Name', 'Designation', 'BloodGroup', 'PreAddress', 'PerAddress', 'Religion'];

    $scope.headers = columnsNames;
    $scope.columns = columnsNames[0];
    
    $scope.search_Placeholder = "Search";

    $scope.columnsChange = function ( value) {
      
        if (value == 'BloodGroup') {
            var ArrayData = [];
            angular.forEach($scope.BloodGroupList, function (value, key) {
                ArrayData.push(value.id);
            });

            ArrayData = getUniqueArray(ArrayData);

            $scope.search_Placeholder = ArrayData;
           

        }
        else {
            $scope.search_Placeholder = "Search  " + value + " value ";
        }
    }




    $scope.AddSearchType = function () {
        $scope.Limit = $scope.EmployeeInfoList.length;
        var obj = {
            ReportSuper: $scope.User[0].RegId
        };

        //alert(angular.toJson(obj));

        $scope.searchExact = obj;
        //$scope.search.push(obj);
       
    }

  
    $scope.removeSearchType = function (key, value) {

        delete $scope.search[key];

        if (Object.keys($scope.search).length == 0) {
            $scope.Limit = "100";
        }
    }

    $scope.removesearchExactType = function (key, value) {

        delete $scope.searchExact[key];

        if (Object.keys($scope.searchExact).length == 0) {
            $scope.Limit = "100";
        }

        if (Object.keys($scope.search).length == 0) {
            $scope.Limit = "100";
        }

    }




    $scope.Limit = "100";

    $scope.DesigShowChange = function () {

        if ($scope.DesigShow == true) {
            $scope.EmployeeInfoListgroupBy = $scope.results;
        }
        else {
            $scope.EmployeeInfoListgroupBy = [];
        }

    }

    $scope.check = function () {

        if ($scope.DesigShow == true) {
            $scope.EmployeeInfoListgroupBy = $scope.results;
        }
        else {
            $scope.EmployeeInfoListgroupBy = [];
        }
        $scope.loading = 20;
                
        myhandler();

        var x = $scope.search[$scope.columns];
        
        //alert(angular.toJson(x));
     
        if (x.length === 0 || typeof x === 'undefined') {
            
            $scope.Limit = "100";
        } else {
            $scope.Limit = $scope.EmployeeInfoList.length;
        }
    };

    
    


    $scope.mailto = function () {

        var ArrayData = [];
        angular.forEach($scope.results, function (value, key) {
            ArrayData.push(value.EmailID);
        });

        ArrayData = getUniqueArray(ArrayData);


        $window.location.href = 'mailto:' + ArrayData;

    }



    $scope.mailtoPerson = function (EmailID) {

        $window.location.href = 'mailto:' + EmailID;

    }



    function getUniqueArray(array) {
        var result = [];
        for (var x = 0; x < array.length; x++) {
            if (result.indexOf(array[x]) == -1)
                result.push(array[x]);
        }
        return result;
    }


   
    //Clear Form 
    function ClearForm() {
        $scope.User = {};
        $scope.f1.$setPristine(); //here f1 is form name
        $scope.submitted = false;
    }

})




.factory('EmpInfoService', function ($http, $q) { 


    var fac = {};


    fac.GetEmployeeInfoDetail = function () {
        return $http.get('/Data/GetEmployeeInfoDetail')
    }


    fac.GetRegistrationDetail = function () {
        return $http.get('/Data/GetRegistrationDetail')
            }


   


   
    return fac;
});
