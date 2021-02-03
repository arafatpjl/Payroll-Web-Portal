angular.module('MyApp') 
.controller('EmpOTRequisitionController', function ($scope, $http,$timeout,$filter,$window, EmpOTRequisitionService) {
       
    //alert(angular.toJson($scope.data));


    //Default Variable
    $scope.submitted = false;
    $scope.message = '';
    $scope.CompID = '';
    $scope.isFormValid = false;

    $scope.ScheduleDate= new Date();
   

    $scope.data = {
        CompID: '3',
        Date: new Date(),
        Department: 'PACKAGING',
        Section: 'CORRUGATION'
    };


    //PACKAGING	B LINE
    $scope.DesigShow = true;
    


    // Populate Unit
    EmpOTRequisitionService.GetCompany().then(function (d) {
        $scope.CompanyList = d.data;

        $scope.Company = $filter('filter')($scope.CompanyList, { ID: $scope.data.CompID }, true);

        // Populate DeptSec AND  Company Filter
        EmpOTRequisitionService.GetEmpDeptSec().then(function (d) {
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


    // Populate DeptSec
    //EmpOTRequisitionService.GetEmpDeptSec().then(function (d) {
    //    $scope.DepartmentList = d.data;
    //    $scope.SectionList = d.data;
    //}, function (error) {
    //    alert('Error!' + error);
    //});



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
        $scope.data.Department = $scope.Department.DeptName;
        $scope.data.Section = $scope.Section.SubDeptName;

        //// Populate GetEmployeeInfoDetail
        EmpOTRequisitionService.GetEmpOTRequisition($scope.data).then(function (d) {

            $scope.EmpList = d.data;
            $scope.EmpOTRequisitionList = d.data;

          
            var data = $filter('filter')($scope.EmpOTRequisitionList, { IsOTRequ: 'True' });
           
            if (data.length > 0) {
                $scope.Reasons = angular.copy(data[0].Reasons);
                $scope.Saved = data.length;
            }
            else {
                $scope.Saved =0;
            }

           


            $scope.SaveShow = true;

            var data = $filter('filter')($scope.EmpOTRequisitionList, { IsLock: 'True' });

            if (data.length > 0)
            {
                $scope.SaveShow = false; 
            }






        }, function (error) {
            alert('Error GetEmpOTRequisition!');
        });

    }




    $scope.GetEmpOTRequSummary = function (type) {

        //// Populate GetEmpOTRequSummary
    EmpOTRequisitionService.GetEmpOTRequSummary($scope.data).then(function (d) {

        var data = $filter('filter')(d.data, { Department: $scope.Department.DeptName });

        $scope.EmpList_Summary = data;

    }, function (error) {
        alert('Error GetEmpOTRequApprove!');
    });

    }






    angular.element(document).ready(function () {
        // Your document is ready, place your code here
        $scope.RoadFilter = [];
        $scope.EmpTypeFilter = [];
        $scope.StartTimeFilter = [];
        $scope.RoadNameList = [];
        $scope.EmpTypeList = ['Junior', 'Senior'];
        $scope.StartTimeFilter = 'ALL';
    });


    $scope.EmpOTRequisitionList = [];
    $scope.OTRequ = '02:00';
   

    $scope.moveData = function (r,type) {
        // alert('1');
        // var data_temp = angular.copy(r);

        if (type === 1) {
            r.OTRequ = $scope.OTRequ;
            r.IsOTRequ = 'True';
           // r.Approved = 'False';
        }
        else {
            r.OTRequ = $scope.OTRequ;
            r.IsOTRequ = 'False';
           // r.Approved = 'False';


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

        angular.forEach($scope.EmpOTRequisitionList, function (value, key) {
            if ($scope.EmpOTRequisitionList[key].Approved === false) {
                $scope.EmpOTRequisitionList[key].IsOTRequ = IsOTRequ;
                $scope.EmpOTRequisitionList[key].OTRequ = $scope.OTRequ;
            }
        });

    };



  
        
   
   
    $scope.check_time = function (value) {

       var up_value = value;

        if (value.length!=5)
        {            alert('Invalid time format');
        up_value= '02:00';           
        }


        var data = value.split( ':');

        if (data[0] > 12 ) {
            alert('Invalid time format');
            up_value = '02:00';
        }

        if (data[1] > 59) {
            alert('Invalid time format');
            up_value = '02:00';
        }

        return up_value;

            }

    //  [ComID]
    //, [Date]
    //, [EmpCode]
    //, [OTRequ]
    //, [Approved]
    //, [Created_date]
    //, [Created_By]
    //, [Updated_date]
    //, [Updated_by]

    $scope.tblEmpOTRequ = {
        ComID: '3',
        Date: new Date(),
        EmpCode: '',
        OTRequ: '00:00',
        Approved: 'false',
        Reasons: '',
        Created_date: new Date(),
        Created_By: '',
        Updated_date: new Date(),
        Updated_by: ''
    };
    


 






    //$scope.Saved = 0;



    $scope.OTRequ_update = function () {

        if (!confirm('Are you sure you want to Save Data ?')) {
            return;

        }

        var message = '';
        $scope.Saved = 0;

        // Delete All data for this date,department and Section  

        EmpOTRequisitionService.OTRequ_delete($scope.data).then(function (d) {
      
            if (d == 'Success') {

                $scope.Saved = 0; 

            // Save Data from Request table
            ///////////////////////////////////////////////////
            $scope.tblEmpOTRequList = [];

            // alert(angular.toJson($scope.EmpOTRequisitionList));

            var data = $filter('filter')($scope.EmpOTRequisitionList, { IsOTRequ: 'True' });

           

            angular.forEach(data, function (value, key) {

                //  alert($scope.EmpOTRequisitionList[key].EmpCode);
                $scope.tblEmpOTRequ.ComID = $scope.data.CompID;
                $scope.tblEmpOTRequ.Date = new Date();
                $scope.tblEmpOTRequ.EmpCode = data[key].EmpCode;
                $scope.tblEmpOTRequ.OTRequ = data[key].OTRequ;
                $scope.tblEmpOTRequ.Approved = data[key].Approved;
                $scope.tblEmpOTRequ.Reasons = $scope.Reasons;
                

                EmpOTRequisitionService.OTRequ_update($scope.tblEmpOTRequ).then(function (d) {
                    if (d == 'Success') {
                        //  alert('You have successfully Saved');
                        message = 'You have successfully Saved';
                        $scope.Saved = $scope.Saved + 1;
                    }

                    else {
                        // alert(d);
                        message = 'You have successfully Saved';
                    }
                }, function (error) {
                    // alert('Error  Emp OT Requisition Save!');
                    message = 'Error  Emp OT Requisition Save!';
                });

            });


            }

                //Emp OT Requisition

            else {
              //  alert(d);
            }
        }, function (error) {
            alert('Error Emp OT Requisition Delete!');
        });

      
        //  alert(message);

        //  Load_Data();
    }

    


    //Clear Form 
    function ClearForm() {
        $scope.User = {};
        $scope.f1.$setPristine(); //here f1 is form name
        $scope.submitted = false;
    }

})




.factory('EmpOTRequisitionService', function ($http, $q) { 


    var fac = {};



    fac.GetCompany = function () {
        return $http.get('/Data/GetCompany')
    }



    fac.GetEmpDeptSec = function () {
        return $http.get('/Data/GetEmpDeptSec', {
            params: { Type: 'OTReq' }
        });
    }

    

    

    fac.GetEmpOTRequisition = function (data) {
        //alert(angular.toJson(data));
        return $http.get('/EmpOTRequisition/Get_OT_Info', {
            params: { CompID: data.CompID, Date: data.Date, Department: data.Department, Section: data.Section }
        });
    }


    fac.GetEmpOTRequSummary = function (data) {
        //alert(angular.toJson(data));
        return $http.get('/EmpOTRequisition/Get_OT_Summary', {
            params: { CompID: data.CompID, DateFrom: data.Date, DateTo: data.Date }
        });
    }




    //OTRequ_delete
    fac.OTRequ_delete = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/EmpOTRequisition/OTRequ_delete',
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




    //EmpOTRequisitionUpdate
    fac.OTRequ_update = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/EmpOTRequisition/OTRequ_update',
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
