angular.module('MyApp')
.controller('WeeklyOTReportController', function ($scope, $http, $timeout, $filter, $window, WeeklyOTReportService) {

    //alert(angular.toJson($scope.data));


    //Default Variable
    $scope.submitted = false;
    $scope.message = '';
    $scope.CompID = '';
    $scope.isFormValid = false;
    $scope.submitText = 'Preview';
    $scope.f1_submitted = false;
    $scope.f1_isFormValid = false;

    $scope.FromDate = new Date();
    $scope.ToDate = new Date();

    //$scope.Reasons = '';

    //$scope.Currdate = $filter('date')(new Date(), 'dd-MM-yyyy');
    //$scope.CurrTime = $filter('date')(new Date(), 'HH:mm:ss');


    //alert(angular.toJson($scope.Currdate));
    //alert(angular.toJson($scope.CurrTime));


    $scope.data = {
    
        CompID: '3',
        FromDate: new Date(),
        ToDate: new Date()
     
    };

    // Recive Parameter
    var popupParameter = $window.popupParameter;
    if (popupParameter != null) {



        $scope.data = popupParameter;
        //alert(angular.toJson($scope.data));
        Summary_Data();
    }

    //PACKAGING	B LINE
    $scope.DesigShow = true;



    // Populate Unit
    WeeklyOTReportService.GetCompany().then(function (d) {
        $scope.CompanyList = d.data;

        $scope.Company = $filter('filter')($scope.CompanyList, { ID: $scope.data.CompID }, true);

        // Populate DeptSec AND  Company Filter
        WeeklyOTReportService.GetEmpDeptSec().then(function (d) {
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



    $scope.search_by = function (type) {
        $scope.EmpList = [];
        $scope.EmpOTRequisitionList = [];

        Load_Data();
    }





    function Load_Data() {

        $scope.data.CompID = $scope.Company.ID;
       
        //// Populate GetEmployeeInfoDetail
        WeeklyOTReportService.GetEmpOTRequisition($scope.data).then(function (d) {



        }, function (error) {
            alert('Error GetEmpOTRequisition!');
        });

    }

    $scope.Weekly_Summary_search = function (type) {
       

        $scope.data.CompID = $scope.Company.ID;
        $scope.data.FromDate = new Date($scope.FromDate);
        $scope.data.ToDate = new Date($scope.ToDate);
     
         //alert(angular.toJson($scope.data));

        Summary_Data();
    }


    function Summary_Data() {
        //alert('d');


        WeeklyOTReportService.GetEmpWeeklyOTSummary($scope.data).then(function (d) {

            $scope.EmpOTWeeklySummaryList = d.data;


        }, function (error) {
            alert('Error GetEmpOTSummary!');
        });

    }


    $scope.showOTCard = function (data) {

        //$scope.User = data;
        //$scope.User.RegId = $scope.UserCode.RegId;
        alert('asa');

        //alert(angular.toJson(data));

        WeeklyOTReportService.GetEmpWeeklyOTSummary($scope.data).then(function (d) {

            $scope.EmpOTWeeklySummaryList = d.data;

        }, function (error) {
            alert('Error GetJobCard!');
        });



    }


    $scope.showOTCard = function (data) {
        $scope.f1_submitted = true;
        $scope.message = '';


        //$scope.User.RegId = $scope.UserCode.RegId;

        if ($scope.f1_isFormValid) {
            //var $popup = $window.open("/Home/JobCardDetail", "popup", "width=800,height=800,left=50,top=50");   
            var $popup = $window.open("/Home/WeeklyOTDetail", "c", "width=1000,height=1000,left=0,top=0");


            $popup.WeeklyOTParameter = data;

        } else {
            $scope.message = '';

        }
    }



    $scope.GetEmpOTRequSummary = function (type) {

        //// Populate GetEmpOTRequSummary
        WeeklyOTReportService.GetEmpOTRequSummary($scope.data).then(function (d) {

            var data = $filter('filter')(d.data, { Department: $scope.Department.DeptName });

            $scope.EmpList_Summary = data;

        }, function (error) {
            alert('Error GetEmpOTRequApprove!');
        });

    }

    $scope.getEmpSum = function (items) {
        return items
            .map(function (x) { return x.WStatus.length; })
            .reduce(function (a, b) { return a + b; });
    };


    //validates form on client side
    $scope.$watch('f1.$valid', function (newValue) {
        $scope.f1_isFormValid = newValue;
    });

 




    //Clear Form 
    function ClearForm() {
        $scope.User = {};
        $scope.f1.$setPristine(); //here f1 is form name
        $scope.submitted = false;
    }

})




.factory('WeeklyOTReportService', function ($http, $q) {


    var fac = {};



    fac.GetCompany = function () {
        return $http.get('/Data/GetCompany')
    }





    fac.GetEmpOTRequisition = function (data) {
        //alert(angular.toJson(data));
        return $http.get('/EmpOTRequisition/Get_OT_Info', {
            params: { CompID: data.CompID, Date: data.Date, Department: data.Department, Section: data.Section }
        });
    }

    fac.GetEmpWeeklyOTSummary = function (data) {
        //alert(angular.toJson(data));
        return $http.get('/EmpOTRequisition/Get_Weekly_OT_Summary', {
            params: { CompID: data.CompID, FromDate: data.FromDate, ToDate: data.ToDate }
        });
    }


    fac.GetEmpOTRequSummary = function (data) {
        //alert(angular.toJson(data));
        return $http.get('/EmpOTRequisition/Get_OT_Summary', {
            params: { CompID: data.CompID, DateFrom: data.Date, DateTo: data.Date }
        });
    }












    return fac;
});
