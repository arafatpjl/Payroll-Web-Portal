angular.module('MyApp')
.controller('LeaveController', function ($scope, $filter, $window, LeaveService) {



    //alert(angular.toJson($scope.data));

    //Default Variable

    $scope.UpdateText = "Update";
    $scope.submitted = false;
    $scope.message = '';
    $scope.isFormValid = false;




    $scope.LeaveSummary = {
        RegId: '',
        Year: new Date().getFullYear()
    };

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


    $scope.LeaveRow = {
        RegId: '',
        AppliedDate: new Date(),
        ActingPerson: '',
        RequestTo: '',
        LDays: '1',
        LType: '',
        FrDate: new Date(),
        ToDate: new Date(),
        Reasons: '',
        Status: '',
        StatusReasons: '',
        Created_date: new Date(),
        Created_By: '',
        Updated_date: new Date(),
        Updated_by: ''


    };

    var LeaveRows_Org = angular.copy($scope.LeaveRow);



    $scope.LeaveAdd = $scope.LeaveRow;


    $scope.EmployeeDetail = {
        RegId: '',
        EmployeeCode: '',
        Name: '',
        Department: '',
        Section: '',
        Designation: ''
    };





    $scope.UserLeave = {
        RegId: '',
        Month: '',
        Year: ''
    };




    $scope.HalfDayShow = true;


    $scope.ChangeLeaveType = function () {

        $scope.HalfDay = false;
        $scope.HalfDayShow = true;
        $scope.LeaveAdd.LDays = '1';


        //if ($scope.LType.name == "NW") {
        //    $scope.HalfDayShow = false;
        //}
    };



    $scope.ChangeHalfDay = function () {

        if ($scope.HalfDay == true) {
            $scope.LeaveAdd.ToDate = $scope.LeaveAdd.FrDate;
            $scope.LeaveAdd.LDays = '0.5';
        }
        else {
            $scope.LeaveAdd.ToDate = $scope.LeaveAdd.FrDate;
            $scope.LeaveAdd.LDays = '1';
        }
    };




    $scope.FilterMyLeave = function (item) {
        return item.RegId === $scope.User.RegId;
    };


    $scope.FilterTeamMemberLeave = function (item) {
        return item.RegId != $scope.User.RegId;
    };


    // date diff
    $scope.dayDiff = function (start, end) {

        var days = moment.duration(end.diff(start)).asDays() + 1;

        if (days < 1) {
            $scope.LeaveAdd.ToDate = new Date($scope.LeaveAdd.FrDate);
            days = 1;
        }

        $scope.LeaveAdd.LDays = Math.round(days);//Math.ceil(days) //parseInt(days);

        if ($scope.HalfDay == true) {
            $scope.LeaveAdd.ToDate = $scope.LeaveAdd.FrDate;
            $scope.LeaveAdd.LDays = '0.5';
        }
    }




    //Get Leave Type
    $scope.LeaveTypeList = [
                { name: 'EL', id: 'EL' },
                { name: 'CL', id: 'CL' },
                { name: 'SL', id: 'SL' },
                //{ name: 'NW', id: 'NW' }
    ];




    //$scope.LeaveStatus = [
    //    //{ id: "APPROVED", name: "APPROVED" },
    //    //{ id: "PENDING", name: "PENDING" },
    //    { id: "CANCELED", name: "CANCELED" },
    //    //{ id: "DECLINED", name: "DECLINED" }

    //];


    $scope.LeaveStatus = [
      //{ id: "APPROVED", name: "APPROVED" },
      //{ id: "PENDING", name: "PENDING" },
       "CANCELED",
      //{ id: "DECLINED", name: "DECLINED" }

    ];

    $scope.editLeaveStatus = function (r, type) {

        if (type == 0) {
            $scope.LeaveStatus = [
          "CANCELED"
            ];
        }
        else {
            $scope.LeaveStatus = [
                       "APPROVED",
                        "DECLINED"
            ];

        }


        $scope.LeaveRow = angular.copy(r);

    }







    LeaveService.GetRegistrationDetail().then(function (d) {

        $scope.User = d.data[0];

        $scope.LeaveSummary.RegId = $scope.User.RegId;

        var ReportSuper = d.data[0].ReportSuper;
        LeaveService.GetEmployeeDetailByRegId(ReportSuper).then(function (d) {
            $scope.RequestEmployeeDetail = d.data[0];
        }, function (error) {
            alert('Error GetEmployeeDetailByRegId!');
        });
    });



    // Populate Unit
    LeaveService.GetCompany().then(function (d) {
        $scope.CompanyList = d.data;
    }, function (error) {
        alert('Error!');
    });








    // Populate EmployeeDetail
    LeaveService.GetEmployeeDetail().then(function (d) {
        $scope.EmployeeDetail = d.data;

        LeaveService.GetUserDetailBySession().then(function (d) {
            $scope.UserDetail = d.data[0];
            $scope.EmployeeDetail = $filter('filter')($scope.EmployeeDetail, { Department: $scope.UserDetail.Department }, true);

        });


    }, function (error) {
        alert('Error GetEmployeeDetail');
    });





    //validates form on client side
    $scope.$watch('LeaveSummary.Year', function (newValue) {

        // Populate LeaveSummary
        GetLeaveSummary();

        // Populate Leave Apply Status
        GetLeaveApplyStatus();
    });



    // Populate LeaveSummary
    GetLeaveSummary();


    function GetLeaveSummary() {
        // Populate LeaveSummary
        LeaveService.GetLeaveSummary($scope.LeaveSummary).then(function (d) {
            //alert(angular.toJson(d.data));
            $scope.LeaveSummaryList = d.data;

        }, function (error) {
            alert('Error GetLeaveSummary !' + error);
        });
    }





    // Populate Leave Apply Status
    GetLeaveApplyStatus();


    function GetLeaveApplyStatus() {
        // Populate Leave Apply Status
        LeaveService.GetLeaveApplyStatus($scope.LeaveSummary).then(function (d) {

            //alert(angular.toJson(d.data));
            $scope.LeaveApplyStatusList = d.data;

        }, function (error) {
            alert('Error GetLeaveApplyStatus');
        });
    }





    //sHOW LEAVE sUMMARY
    $scope.ShowLeaveCard = function () {
        var $popup = $window.open("/Home/LeaveCardDetail", "popup", "width=1000,height=1000,left=0,top=0");

        $scope.UserLeave = $scope.LeaveSummary;
        $popup.LeaveSummaryParameter = $scope.UserLeave;
    }




    var availableClasses = [
       "APPROVED",
       "CANCELED",
       "DECLINED",
       "PENDING"];

    $scope.getClasses = function (get_value) {
        var classes = [];
        //alert(get_value);
        angular.forEach(availableClasses, function (value) {
            if (get_value.indexOf(value) != -1)
                classes.push(value);
        });
        //alert(classes);
        //classes.push("BUDDHIST");
        return classes;
    };




    //validates form on client side
    $scope.$watch('f1.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });

    //validates form on client side
    $scope.$watch('f2.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });



    //Save Data
    $scope.LeaveApplication = function (data) {

        $scope.submitted = true;
        $scope.message = '';

        //alert($scope.isFormValid);

        if ($scope.isFormValid) {


            $scope.LeaveRow = data;

            $scope.LeaveRow.RegId = $scope.User.RegId;
            $scope.LeaveRow.AppliedDate = new Date();
            $scope.LeaveRow.RequestTo = $scope.RequestEmployeeDetail.RegId;
            $scope.LeaveRow.ActingPerson = $scope.ActingPerson.RegId;
            $scope.LeaveRow.LType = $scope.LType.id;

            $scope.LeaveRow.Status = "PENDING";

            LeaveService.LeaveApplication($scope.LeaveRow).then(function (d) {
                //alert(d);
                if (d == 'Success') {
                    angular.element('#ModalLeaveApp').modal('hide');
                    alert('You have successfully Applied');

                    $scope.LeaveAdd = angular.copy(LeaveRows_Org);
                    $scope.f1.$setPristine();

                    // Populate Leave Apply Status
                    GetLeaveApplyStatus();

                    //ClearForm();


                    LeaveService.LeaveApplicationMail($scope.LeaveRow).then(function (d) {

                    });




                }

                else {
                    alert(d);

                    //return;
                }

                $scope.submitText = "Submit";
            });



        }
    }



    //Update Data
    $scope.LeaveApplicationUpdate = function (data) {

        if ($scope.UpdateText == 'Update') {
            $scope.submitted = true;
            $scope.message = '';


            $scope.LeaveRow = data;

            $scope.LeaveRow.AppliedDate = new Date(parseInt($scope.LeaveRow.AppliedDate.substr(6)));
            $scope.LeaveRow.FrDate = new Date(parseInt($scope.LeaveRow.FrDate.substr(6)));
            $scope.LeaveRow.ToDate = new Date(parseInt($scope.LeaveRow.ToDate.substr(6)));

            //alert(angular.toJson($scope.LeaveRow));
            //$scope.LeaveRow.Status = "CANCELED";

            if ($scope.LeaveRow.Status == "APPROVED") {

                //LeaveInsertMainDatabase
                LeaveService.LeaveInsertMainDatabase($scope.LeaveRow).then(function (d) {


                    if (d == 'Success') {

                        //LeaveApplicationUpdate

                        LeaveService.LeaveApplicationUpdate($scope.LeaveRow).then(function (d) {
                            angular.element('#ModalUpdateStatus').modal('hide');


                            alert('Leave Updated Successfully');

                            // Populate Leave Apply Status
                            GetLeaveApplyStatus();
                            //ClearForm();
                        });


                    }
                    else {

                        alert(d);
                    }


                });
            }
            else {


                LeaveService.LeaveApplicationUpdate($scope.LeaveRow).then(function (d) {
                    angular.element('#ModalUpdateStatus').modal('hide');


                    alert('Leave Updated Successfully');

                    // Populate Leave Apply Status
                    GetLeaveApplyStatus();
                    //ClearForm();
                });

            }




            //LeaveService.LeaveApplicationUpdate($scope.LeaveRow).then(function (d) {

            //    if (d == 'Success') {

            //        //alert(angular.toJson($scope.LeaveRow));
            //        if ($scope.LeaveRow.Status == "APPROVED") {

            //            LeaveService.LeaveInsertMainDatabase($scope.LeaveRow).then(function (d) {
            //            });
            //        }

            //        angular.element('#ModalUpdateStatus').modal('hide');


            //        alert('Leave Updated Successfully');


            //        // Populate Leave Apply Status
            //        GetLeaveApplyStatus();
            //        //ClearForm();
            //    }
            //    $scope.UpadteText = "Update";
            //});


        }
    }


    //Clear Form 
    function ClearForm() {
        //$scope.User = {};
        //$scope.LeaveRow = {};
        $scope.f1.$setPristine(); //here f1 is form name
        $scope.f2.$setPristine(); //here f2 is form name
        $scope.submitted = false;
    }

})


.factory('LeaveService', function ($http, $q) {

    var fac = {};



    fac.GetCompany = function () {
        return $http.get('/Data/GetCompany')
    }


    fac.GetEmployeeDetail = function () {
        return $http.get('/Data/GetEmployeeDetail')
    }


    fac.GetUserDetailBySession = function () {
        return $http.get('/Data/GetUserDetailBySession')
    }


    fac.GetRegistrationDetail = function () {
        return $http.get('/Data/GetRegistrationDetail')
    }

    fac.GetEmployeeDetailByRegId = function (RegId) {
        return $http.get('/Data/GetEmployeeDetailByRegId', {
            params: { RegId: RegId }
        });
    }

    //, {params:{"param1": val1, "param2": val2}})
    fac.GetEmployeeName = function (ID) {
        return $http.get('/Data/GetEmployeeName', { params: { "EmployeeCode": ID } })
    }


    //fac.GetLeaveApplyUp = function () {
    //    return $http.get('/Data/GetLeaveApplyUp')
    //}




    fac.GetLeaveSummary = function (data) {
        return $http.get('/Leave/GetLeaveSummary', {
            params: { Year: data.Year }
        });


    }


    fac.GetLeaveApplyStatus = function (data) {
        return $http.get('/Leave/GetLeaveApplyStatus', {
            params: { Year: data.Year }
        });
    }





    fac.LeaveApplication = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Leave/LeaveApplication',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            alert('Error!' + e);
            defer.reject(e);
        });
        return defer.promise;
    }



    fac.LeaveApplicationMail = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Leave/LeaveApplicationMail',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            alert('Error!');
            defer.reject(e);
        });
        return defer.promise;
    }




    fac.LeaveApplicationUpdate = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/Leave/LeaveApplicationUpdate',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            alert('Error!');
            defer.reject(e);
        });
        return defer.promise;
    }



    fac.LeaveInsertMainDatabase = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/Leave/LeaveInsertMainDatabase',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            alert('Error!');
            defer.reject(e);
        });
        return defer.promise;
    }


    return fac;
});


