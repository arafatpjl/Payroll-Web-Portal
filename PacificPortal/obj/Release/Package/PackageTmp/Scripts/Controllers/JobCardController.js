angular.module('MyApp')
.controller('JobCardController', function ($scope, $window, $filter,JobCardService) {

    //alert(angular.toJson($scope.data));


    $scope.submitText = 'Preview';
   
    $scope.message = '';
   

    $scope.f1_submitted = false;
    $scope.f2_submitted = false;

    $scope.f1_isFormValid = false;
    $scope.f2_isFormValid = false;


    $scope.User = {       
        RegId: '',
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


        
    $scope.User.Year = new Date().getFullYear();

    

    //$scope.User.Month


    //alert($scope.User.Month);


   


    $scope.AttenRow = {
        RegId: '',
        AppliedDate: new Date(),
        Name: '',
        prDate: new Date("2015-03-25T12:00:00-06:00"),
        TimeIn: new Date("2015-03-25T12:00:00-06:00"),
        LateHrs: new Date("2015-03-25T12:00:00-06:00"),
        TimeOut: new Date("2015-03-25T12:00:00-06:00"),
        Status: '',
        Shift: '',
        Reasons: '',
        Created_date: new Date(),
        Created_By: '',
        Updated_date: new Date(),
        Updated_by: ''


    };


    //validates form on client side
    $scope.$watch('f1.$valid', function (newValue) {
        $scope.f1_isFormValid = newValue;
    });

    //validates form on client side
    $scope.$watch('f2.$valid', function (newValue) {
        $scope.f2_isFormValid = newValue;
    });


    function toTime(timeString) {
        var timeTokens = timeString.split(':');
        return new Date(1970, 0, 1, timeTokens[0], timeTokens[1]);
    }

   
    $scope.editAttenStatus = function (r, type) {

       
        $scope.AttenRow = angular.copy(r);

        $scope.AttenRow.TimeIn = toTime(r.TimeIn);
        $scope.AttenRow.TimeOut = toTime(r.TimeOut);

        //$scope.AttenRow.TimeIn = $filter('date')($scope.AttenRow.TimeIn, 'HH:mm');
        //$scope.AttenRow.TimeOut = $filter('date')($scope.AttenRow.TimeOut, 'HH:mm');

        //alert($scope.AttenRow.TimeIn);

    }
   


    $scope.GetMonthID = function (Id) {

        $scope.User.Month = Id;

        GetJobCard();
        GetAttenApplyStatus();

         
    }




    $scope.PopupClose = function () {
      

        $scope.AttenRow.TimeIn = $filter('date')($scope.AttenRow.TimeIn, 'HH:mm');
        $scope.AttenRow.TimeOut = $filter('date')($scope.AttenRow.TimeOut, 'HH:mm');

        //alert($scope.AttenRow.TimeIn);

        //GetJobCard();
    }

    //get JobCard
    function GetJobCard() {
        JobCardService.GetJobCard($scope.User).then(function (d) {

            $scope.GetJobCardDetail = d.data;

        }, function (error) {
            alert('Error GetJobCard!');
        });
    }


    //get Team member GetAttenApplyStatus
    function GetAttenApplyStatus() {       
        JobCardService.GetAttenApplyStatus($scope.User).then(function (d) {

            $scope.GetAttenApplyStatusList = d.data;

        }, function (error) {
            alert('Error GetAttenApplyStatusList!');
        });

    }




    //validates form on client side
    $scope.$watch('f1.$valid', function (newValue) {
        $scope.f1_isFormValid = newValue;       
    });



    // Populate GetTeamMemberBySession
    JobCardService.GetTeamMemberBySession().then(function (d) {
        $scope.TeamMemberList = d.data;
    }, function (error) {
        alert('Error!');
    });


    //// Populate EmployeeDetail
    //JobCardService.GetEmployeeDetail().then(function (d) {
    //    $scope.EmployeeDetail = d.data;

    //}, function (error) {
    //    alert('Error!');
    //});



    JobCardService.GetUserDetailBySession().then(function (d) {

        $scope.User.RegId = d.data[0].RegId;
        $scope.User.Month = new Date().getMonth() + 1;

        $scope.selectedmonths = $scope.User.Month;        
        GetJobCard();
        GetAttenApplyStatus();

       
    });

    

    
    //update Data
    $scope.AttendenceUpdate = function (data) {

        $scope.f2_submitted = true;
        $scope.message = '';

        //alert($scope.f2_isFormValid);


        if ($scope.f2_isFormValid) {
            
            $scope.AttenRow = data;

            //$scope.AttenRow.TimeIn = $filter('date')($scope.AttenRow.TimeIn, 'HH:mm');
            //$scope.AttenRow.TimeOut = $filter('date')($scope.AttenRow.TimeOut, 'HH:mm');

            if ($filter('date')($scope.AttenRow.TimeIn, 'HH:mm') === '00:00') {
                alert('Invalid Time In - 00:00');
                return;
            }

            if ($scope.AttenRow.TimeIn > $scope.AttenRow.TimeOut)
            {
                alert('Invalid Time In Out ' );
                return;
            }


            if ($filter('date')($scope.AttenRow.TimeOut, 'HH:mm') === '00:00') {
                alert('Invalid Time Out - 00:00');
                return;
            }

            $scope.AttenRow.RegId = $scope.User.RegId;
            $scope.AttenRow.AppliedDate = new Date();
            $scope.AttenRow.prDate = new Date(parseInt($scope.AttenRow.prDate.substr(6)));


        


            JobCardService.EmpAttenUpdate($scope.AttenRow).then(function (d) {
              
                if (d == 'Success') {

                    angular.element('#ModalUpdateStatus').modal('hide');
                    alert('You have successfully Updated');

                    // Populate JobCard
                    GetJobCard();


                    $scope.f1.$setPristine();


                    //ClearForm();
                }

                else {
                    alert(d);

                    //return;
                }

                $scope.submitText = "Submit";
            });



        }
    }




    //attendence Data approved and insert

    $scope.EmpAttenApprove = function (data) {

        data.prDate = new Date(parseInt(data.prDate.substr(6)));

        JobCardService.EmpAttenApprove(data).then(function (d) {

            if (d == 'Success') {

                // Populate Apply Status
                    GetAttenApplyStatus();
                    
                }
                $scope.UpadteText = "Update";
            });


    }

    // Decline attendence

    $scope.EmpAttenDecline = function (data) {

        data.prDate = new Date(parseInt(data.prDate.substr(6)));

        JobCardService.EmpAttenDecline(data).then(function (d) {

            if (d == 'Success') {

                // Populate Apply Status
                GetAttenApplyStatus();

            }
            $scope.UpadteText = "Update";
        });


    }
    

    $scope.ShowJobCard = function (data) {
      
        $scope.User = data;
        $scope.User.RegId = $scope.UserCode.RegId;
      

        JobCardService.GetJobCard($scope.User).then(function (d) {

            $scope.GetJobCardDetail = d.data;

        }, function (error) {
            alert('Error GetJobCard!');
        });

       
        
    }

    

    var availableClasses = [
       "A",
       "M",
       "PENDING",
       "others"
    ];



    $scope.getClasses = function (get_value) {
        var classes = [];
       
        if (get_value == 'A' || get_value == 'M' || get_value == 'PENDING') {

            angular.forEach(availableClasses, function (value) {
                if (get_value.indexOf(value) != -1)
                    classes.push(value);
            });
        }
        else {
            classes.push('others');
            return classes;
        }


       
        return classes;
    };

 

    $scope.showJobCard = function (data) {
        $scope.f1_submitted = true;
        $scope.message = '';

       
        $scope.User.RegId = $scope.UserCode.RegId;
       
        if ($scope.f1_isFormValid) {           
            //var $popup = $window.open("/Home/JobCardDetail", "popup", "width=800,height=800,left=50,top=50");   
            var $popup = $window.open("/Home/JobCardDetail", "c", "width=1000,height=1000,left=0,top=0");


            $popup.JobCardParameter = data;

        } else {
            $scope.message = '';

        }
    }


})
.factory('JobCardService', function ($http, $q) {

    var fac = {};

    fac.GetUserDetailBySession = function () {
        return $http.get('/Data/GetUserDetailBySession')
    }

    fac.GetTeamMemberBySession = function () {
        return $http.get('/Data/GetTeamMemberBySession')
    }

    fac.GetEmployeeDetail = function () {
        return $http.get('/Data/GetEmployeeDetail')
    }


    fac.GetJobCard = function (data) {
        return $http.get('/Data/GetJobCard', {
            params: { RegId: data.RegId, Month: data.Month, Year: data.Year }
        });

    }

    fac.GetAttenApplyStatus = function (data) {        
        return $http.get('/Attendence/GetAttenApplyStatus', {
            params: { RegId: data.RegId, Month: data.Month, Year: data.Year }
        });

    }


  
    


    fac.EmpAttenUpdate = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Attendence/EmpAttenUpdate',
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


    fac.EmpAttenApprove = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Attendence/EmpAttenApprove',
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


    

    fac.EmpAttenDecline = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Attendence/EmpAttenDecline',
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

