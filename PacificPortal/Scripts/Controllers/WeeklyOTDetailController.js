angular.module('MyApp')
.controller('WeeklyOTDetailController', function ($scope, $http, $timeout, $filter, $window, WeeklyOTReportService) {

    //alert(angular.toJson($scope.data));


    //Default Variable
    //$scope.submitted = false;
    //$scope.message = '';
    //$scope.CompID = '';
    //$scope.isFormValid = false;
    //$scope.submitText = 'Preview';
    //$scope.f1_submitted = false;
    //$scope.f1_isFormValid = false;

    $scope.FromDate = new Date();
    $scope.ToDate = new Date();

    //$scope.Reasons = '';

    //$scope.Currdate = $filter('date')(new Date(), 'dd-MM-yyyy');
    //$scope.CurrTime = $filter('date')(new Date(), 'HH:mm:ss');


    //alert(angular.toJson($scope.Currdate));
    //alert(angular.toJson($scope.CurrTime));


    $scope.WeeklyOTParameter = {
    
        CompID: '3',
        FromDate: new Date(),
        ToDate: new Date()
     
    };

    // Recive Parameter
    $scope.WeeklyOTParameter = $window.WeeklyOTParameter;
   

    //$scope.showOTCard = function (data) {

        //$scope.User = data;
        //$scope.User.RegId = $scope.UserCode.RegId;
  

        //alert(angular.toJson(data));

    //    WeeklyOTReportService.GetEmpWeeklyOTSummary($scope.data).then(function (d) {

    //        $scope.EmpOTWeeklySummaryList = d.data;

    //    }, function (error) {
    //        alert('Error GetJobCard!');
    //    });



    //}

        WeeklyOTReportService.GetEmpWeeklyOTSummary($scope.WeeklyOTParameter).then(function (d) {

        //alert(angular.toJson(d.data));
        $scope.GetOTCardDetail = d.data;

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




.factory('WeeklyOTReportService', function ($http, $q) {


    var fac = {};



    //fac.GetCompany = function () {
    //    return $http.get('/Data/GetCompany')
    //}





    //fac.GetEmpOTRequisition = function (data) {
    //    //alert(angular.toJson(data));
    //    return $http.get('/EmpOTRequisition/Get_OT_Info', {
    //        params: { CompID: data.CompID, Date: data.Date, Department: data.Department, Section: data.Section }
    //    });
    //}

    fac.GetEmpWeeklyOTSummary = function (data) {
        //alert(angular.toJson(data));
        return $http.get('/EmpOTRequisition/Get_Weekly_OT_Summary', {
            params: { CompID: data.CompID, FromDate: data.FromDate, ToDate: data.ToDate }
        });
    }


    //fac.GetEmpOTRequSummary = function (data) {
    //    //alert(angular.toJson(data));
    //    return $http.get('/EmpOTRequisition/Get_OT_Summary', {
    //        params: { CompID: data.CompID, DateFrom: data.Date, DateTo: data.Date }
    //    });
    //}












    return fac;
});
