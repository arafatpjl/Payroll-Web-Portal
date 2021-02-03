angular.module('MyApp')
.controller('EmpOTRequApproveController', function ($scope, $http, $timeout, $filter, $window, EmpOTRequApproveService) {

    //alert(angular.toJson($scope.data));

    //Default Variable
    $scope.submitted = false;
    $scope.submitText = 'Update';
    $scope.message = '';
    $scope.CompID = '';
    $scope.isFormValid = false;
    $scope.approve = false;
    $scope.selectedAll_Approved = false;
    $scope.selectedAll_IsLock = false;

    $scope.ScheduleDate = new Date();





    $scope.data = {
        CompID: '',
        Date: new Date(),
        Department: '',
        Section: '',
        approve: ''
    };

    $scope.Approvedata = {
        CompID: '',
        Date: new Date(),
        Department: '',
        Section: '',
        Wstatus: '',
        OTRequ: '',
        RequstOT: '',
        EditReasons: ''
    };

    // Recive Parameter
    var popupParameter = $window.popupParameter;
    if (popupParameter != null) {

        $scope.data = popupParameter;



        Load_Data();
    }

    //PACKAGING	B LINE
    $scope.DesigShow = true;


    $scope.DepartmentList = [];
    $scope.SectionList = [];
    $scope.CompanyList = [];

    // Populate Unit
    EmpOTRequApproveService.GetCompany().then(function (d) {
        $scope.CompanyList = d.data;


        $scope.Company = $filter('filter')($scope.CompanyList, { ID: $scope.data.CompID }, true);

        // Populate DeptSec AND  Company Filter
        EmpOTRequApproveService.GetEmpDeptSec().then(function (d) {
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






    $scope.search_by = function () {
        // alert($scope.ScheduleDate);
        $scope.data.Date = new Date($scope.ScheduleDate);
        $scope.data.CompID = $scope.Company.ID;
        $scope.Approvedata.CompID = $scope.Company.ID;
        //$scope.Approvedata.Date = new Date($scope.ScheduleDate); 
        //alert(angular.toJson($scope.Approvedata.Date));
        // $scope.data.Department = $scope.Department.DeptName;
        //$scope.data.Section = $scope.Section.SubDeptName;
        Load_Data();
    };



    function Load_Data() {

        //// Populate GetEmpOTRequSummary
        EmpOTRequApproveService.GetEmpOTRequSummary($scope.data).then(function (d) {

            $scope.EmpList = d.data;


            $scope.Saved = $scope.EmpList.length;

        }, function (error) {
            alert('Error GetEmpOTRequApprove!');
        });

    }





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

    angular.element(document).ready(function () {
        // Your document is ready, place your code here

        var ApproveLoginID = ['2624', '114652', '105794', '243213', '114639', '90'];
        //  var ApproveLoginID = ['2624', '105794', '243213', '114639'];

        // alert(ApproveLoginID.indexOf('243213'));
        // alert(angular.toJson(ApproveLoginID));

        EmpOTRequApproveService.GetApproveLoginID().then(function (d) {


            $scope.EmpOTApprovePermissionList = d.data;

            var ApproveLoginID = [];


            angular.forEach(d.data, function (value, key) {
                ApproveLoginID.push('' + d.data[key].RegId);
            });


            if (ApproveLoginID.indexOf($scope.LoginID) > -1)
                $scope.ApprovePermission = true;
            else
                $scope.ApprovePermission = false;

        }, function (error) {
            alert('Error getRequInfoList!' + error);
        });






    });




    $scope.check_time = function (value) {

        var default_time = '02:00';

        //alert(value);

        if (value === '00:00') {
            alert('Invalid time format');
            return default_time;
        }

        if (value.length != 5) {
            alert('Invalid time format');
            return value;
        }

        var data = value.split(':');

        if (data[0].length != 2 || data[0] > 23) {
            alert('Invalid time format');
            return default_time;
        }

        if (data[1].length != 2 || data[1] > 59) {
            alert('Invalid time format');
            return default_time;
        }


        return value;

    }



    //// Company Filter
    //$scope.filterUserPermission = function (data) {
    //   // alert(data.ID);
    //    alert($scope.DepartmentList[0].ComID);
    //    alert(angular.toJson($scope.DepartmentList));
    //    return ($scope.DepartmentList.ComID.indexOf(data.ID) !== -1);
    //};






    $scope.EmpOTRequApproveList = [];
    $scope.OTRequ = '02:00';


    $scope.moveData = function (r, type) {
        // alert('1');
        // var data_temp = angular.copy(r);

        if (type === 1) {
            r.OTRequ = $scope.OTRequ;
            r.IsOTRequ = 'True';
            r.Approved = 'False';
        }
        else {
            r.OTRequ = $scope.OTRequ;
            r.IsOTRequ = 'False';
            r.Approved = 'False';


        }


    };


    $scope.moveData_all = function (type) {

        if (type === 1) {
            var IsOTRequ = 'True';
        }
        else {
            var IsOTRequ = 'False';
        }

        ////  alert(IsOTRequ);

        //  angular.forEach($scope.EmpList, function (value, key) {          
        //        //  $scope.EmpList[key].IsOTRequ = IsOTRequ;
        //  });

        angular.forEach($scope.EmpOTRequApproveList, function (value, key) {
            if ($scope.EmpOTRequApproveList[key].Approved === false) {
                $scope.EmpOTRequApproveList[key].IsOTRequ = IsOTRequ;
            }
        });

    };




    $scope.editOTStatus = function (r) {


        $scope.Approvedata = angular.copy(r);
        $scope.Approvedata.Date = $scope.ScheduleDate;
        $scope.Approvedata.RequstOT = $scope.Approvedata.OTRequ;
        //alert(angular.toJson($scope.Approvedata));


    }

    //Update Data
    $scope.OTApproveEdit = function (data) {


        if ($scope.submitText == 'Update') {
            //alert('sdsad');
            $scope.submitted = true;
            $scope.message = '';

            $scope.Approvedata = data;
            $scope.Approvedata.Date = $filter('date')($scope.Approvedata.Date, 'dd-MM-yyyy')

            //alert(angular.toJson($scope.Approvedata));

            EmpOTRequApproveService.OTApproveEditUpdate($scope.Approvedata).then(function (d) {


                if (d == 'Success') {

                    //LeaveApplicationUpdate

                    EmpOTRequApproveService.OTApproveEditUpdate($scope.Approvedata).then(function (d) {
                        angular.element('#ModaldataApprove').modal('hide');


                        alert('OT Updated Successfully');

                        // Populate Leave Apply Status
                        Load_Data();
                        //ClearForm();
                    });


                }
                else {

                    alert(d);
                }


            });


        }
    }




    $scope.getRequInfoList = function (r) {

        $scope.data.Department = r.Department;
        $scope.data.Section = r.Section;

        //  alert(angular.toJson($scope.data));

        EmpOTRequApproveService.GetEmpOTRequInfo($scope.data).then(function (d) {

            var data = d.data;
            data = $filter('filter')(data, { IsOTRequ: 'True' });
            data = $filter('filter')(data, { Wstatus: r.Wstatus });
            data = $filter('filter')(data, { OTRequ: r.OTRequ });
            // data = $filter('filter')(data, { Approved: r.Approved })
            $scope.RequInfoList = data
            //alert(angular.toJson($scope.RequInfoList));


        }, function (error) {
            alert('Error getRequInfoList!' + error);
        });
    };



    $scope.checkAll_Approved = function () {
        if ($scope.selectedAll_Approved) {
            $scope.selectedAll_Approved = true;
        } else {
            $scope.selectedAll_Approved = false;
        }
        angular.forEach($scope.EmpList, function (item) {
            item.Approved = $scope.selectedAll_Approved;
        });

    }



    $scope.checkAll_IsLock = function () {
        if ($scope.selectedAll_IsLock) {
            $scope.selectedAll_IsLock = true;
        } else {
            $scope.selectedAll_IsLock = false;
        }
        angular.forEach($scope.EmpList, function (item) {
            item.IsLock = $scope.selectedAll_IsLock;
        });

    }



    $scope.tblEmpOTRequ = {
        ComID: '3',
        Date: new Date(),
        EmpCode: '',
        OTRequ: '00:00',
        Approved: 'false',
        Created_date: new Date()

    };




    $scope.getEmpSum = function (items) {
        return items
            .map(function (x) { return x.TotalEmp; })
            .reduce(function (a, b) { return a + b; });
    };




    $scope.getHoursSum = function (items) {

        var hours = 0;
        var minutes = 0;
        var seconds = 0;


        angular.forEach(items, function (data, key) {

            var times = (data.TotalOT || '').split(':')
            hours = hours + parseInt(times[0]);
            minutes = minutes + parseInt(times[1]);
        });

        if (minutes >= 60) {
            var h = (minutes / 60) << 0
            hours += h
            minutes -= 60 * h
        }

        return hours + ':' + minutes;

    };





    $scope.UpdateStatus = function (apptype) {


        $scope.Saved = 0;


        if (!confirm('Are you sure you want to Save Data ?')) {
            return;
        }


        // Save Data from Request table
        ///////////////////////////////////////////////////

        //  alert(angular.toJson( $scope.tblEmpOTRequ));

        var data_temp = $scope.EmpList;//$filter('filter')($scope.EmpList, { Approved: 'True' });  



        angular.forEach(data_temp, function (value, key) {

            //  alert($scope.EmpOTRequisitionList[key].EmpCode);
            $scope.tblEmpOTRequ.CompID = $scope.data.CompID;
            $scope.tblEmpOTRequ.DailyDate = $scope.data.Date;
            $scope.tblEmpOTRequ.Department = data_temp[key].Department;
            $scope.tblEmpOTRequ.Section = data_temp[key].Section;
            $scope.tblEmpOTRequ.OTRequ = data_temp[key].OTRequ;
            $scope.tblEmpOTRequ.Reasons = data_temp[key].Reasons;
            $scope.tblEmpOTRequ.TotalEmp = data_temp[key].TotalEmp;
            $scope.tblEmpOTRequ.TotalOT = data_temp[key].TotalOT;
            $scope.tblEmpOTRequ.Approved = data_temp[key].Approved;
            $scope.tblEmpOTRequ.IsLock = data_temp[key].IsLock;
            $scope.tblEmpOTRequ.Wstatus = data_temp[key].Wstatus;

            //alert(angular.toJson($scope.tblEmpOTRequ.DailyDate));

            EmpOTRequApproveService.OTRequ_update_App($scope.tblEmpOTRequ).then(function (d) {

                if (d == 'Success') {

                    // alert('You have successfully Saved');
                    $scope.Saved = $scope.Saved + 1;

                }
                    //});

                else {
                    //  alert(d);
                }
            });





        });



        if (apptype === 1) {
            EmpOTRequApproveService.OTRequ_Approve_Mail($scope.tblEmpOTRequ).then(function (d) {

                if (d == 'Success') {

                    alert('You have successfully Saved');


                }
                    //});

                else {
                    //  alert(d);
                }
            });
        }




    }


    //}


    $scope.tblEmpOTApprovePermission = {
        ID: '3',
        RegId: '',
        EmailID: '',
        Created_date: new Date()

    };





    $scope.mailto = function (EmailID, RegId) {

        if (!confirm('Are you sure you want to Mail Send - ' + EmailID + '?')) {
            return;
        }

        $scope.tblEmpOTApprovePermission.ID = $scope.Company.ID;
        $scope.tblEmpOTApprovePermission.RegId = RegId;
        $scope.tblEmpOTApprovePermission.EmailID = EmailID;
        $scope.tblEmpOTApprovePermission.Created_date = $scope.ScheduleDate;




        EmpOTRequApproveService.OTRequ_Email($scope.tblEmpOTApprovePermission).then(function (d) {
            if (d == 'Success') {
                alert('Mail Sent');
                //Load_Data();
            }

            else {
                //  alert(d);
            }
        }, function (error) {
            alert('Error  Emp OT Requisition Save!');
        });

    }




    $scope.showReport = function () {
        //var $popup = $window.open("/Home/JobCardDetail", "popup", "width=800,height=800,left=50,top=50");   
        var $popup = $window.open("/Home/EmpOTRequReport", "c", "width=1000,height=1000,left=0,top=0");


        $popup.popupParameter = $scope.data;

    }





    var availableClasses = [
      "PENDING",
      "APPROVED_link"
    ];



    $scope.getClasses = function (get_value) {
        var classes = [];

        if (get_value === true) {
            get_value = "APPROVED_link";
            angular.forEach(availableClasses, function (value) {
                if (get_value.indexOf(value) != -1)
                    classes.push(value);
            });
        }
        else {
            classes.push('PENDING');
            return classes;
        }



        return classes;
    };

    //validates form on client side
    $scope.$watch('f1.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });



    //Clear Form 
    function ClearForm() {
        $scope.User = {};
        $scope.f1.$setPristine();
        //$scope.f2.$setPristine();//here f1 is form name
        $scope.submitted = false;
    }

})




.factory('EmpOTRequApproveService', function ($http, $q) {


    var fac = {};


    fac.GetCompany = function () {
        return $http.get('/Data/GetCompany')
    }


    fac.GetEmpDeptSec = function () {
        return $http.get('/Data/GetEmpDeptSec', {
            params: { Type: 'OTReq' }
        });
    }



    fac.GetEmpOTRequSummary = function (data) {
        //alert(angular.toJson(data));
        return $http.get('/EmpOTRequisition/Get_OT_Summary', {
            params: { CompID: data.CompID, DateFrom: data.Date, DateTo: data.Date }
        });
    }

    fac.GetApproveLoginID = function (data) {
        return $http.get('/EmpOTRequisition/GetApproveLoginID');
    }

    //fac.GetEmpOTSummaryRequInfo = function (data) {
    //    //alert(angular.toJson(data));
    //    return $http.get('/EmpOTRequisition/GetEmpOTSummaryRequInfo', {
    //        params: { CompID: data.CompID, Date: data.Date, Department: data.Department, Section: data.Section, Wstatus: data.Wstatus, OTRequ: data.OTRequ }
    //    });
    //}

    fac.GetEmpOTRequInfo = function (data) {
        //alert(angular.toJson(data));
        return $http.get('/EmpOTRequisition/Get_OT_Info', {
            params: { CompID: data.CompID, Date: data.Date, Department: data.Department, Section: data.Section }
        });
    }

    fac.OTRequ_Approve_Mail = function (data) {
        //  alert(angular.toJson(data));
        return $http.get('/EmpOTRequisition/OTRequ_Approve_Mail', {
            params: { CompID: data.CompID, DailyDate: data.DailyDate }
        });
    }



    //OTRequ_Update
    fac.OTRequ_update_App = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/EmpOTRequisition/OTRequ_update_App',
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

    //OTRequ_Email
    fac.OTRequ_Email = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/EmpOTRequisition/OTRequ_Email',
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
    //ot approveEdit Update

    fac.OTApproveEditUpdate = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/EmpOTRequisition/OTApproveEditUpdate',
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
