angular.module('MyApp') 
.controller('BusScheduleController', function ($scope, $http,$timeout,$filter,$window, BusScheduleService) {
       
    //alert(angular.toJson($scope.data));

    //Default Variable
    $scope.submitted = false;
    $scope.message = '';
    $scope.CompID = '';
    $scope.isFormValid = false;

    $scope.ScheduleDate= new Date();
   

    $scope.User = {       
        ScheduleDate: new Date(),
    };

    $scope.DesigShow = true;
    



    angular.element(document).ready(function () {
        // Your document is ready, place your code here
       
        $scope.EmpTypeList = ['Junior', 'Senior'];
        $scope.StartTimeFilter = 'ALL';

    });



    //// search by
    $scope.search_by = function (value) {
        Load_Data();
    };


    //// Reset
    $scope.Reset = function (value) {
        $scope.RoadFilter = [];
        $scope.EmpTypeFilter = [];
        $scope.StartTimeFilter = [];
    };



    Load_Data();

    function Load_Data() {

    

        $scope.User.ScheduleDate = $scope.ScheduleDate;

        //// Populate GetEmployeeInfoDetail
        BusScheduleService.GetBusSchedule($scope.User).then(function (d) {

            $scope.RoadFilter = [];
           

            $scope.BusScheduleList = d.data;

            

            //************ RoadName
            var ArrayData = [];
            angular.forEach($scope.BusScheduleList, function (value, key) {
                ArrayData.push($scope.BusScheduleList[key].RoadName);
            });


            $scope.RoadNameList = getUniqueArray(ArrayData);


            //************ VehicleTypeList
            var ArrayData = [];
            ArrayData.push("ALL");
            angular.forEach($scope.BusScheduleList, function (value, key) {
                ArrayData.push($scope.timeFunction($scope.BusScheduleList[key].StartTime));
                //ArrayData.push($scope.BusScheduleList[key].StartTime);
            });

            $scope.StartTimeList = getUniqueArray(ArrayData);
            
          

            //************ VehicleTypeList
            var ArrayData = [];
            angular.forEach($scope.BusScheduleList, function (value, key) {
                ArrayData.push($scope.BusScheduleList[key].VehicleType);
            });
            $scope.VehicleTypeList = getUniqueArray(ArrayData);



            //************ Driver
            var ArrayData = [];
            angular.forEach($scope.BusScheduleList, function (value, key) {
                ArrayData.push($scope.BusScheduleList[key].Driver);
            });
            $scope.DriverList = getUniqueArray(ArrayData);

           
            //************ StartingPoint
            var ArrayData = [];
            angular.forEach($scope.BusScheduleList, function (value, key) {
                ArrayData.push($scope.BusScheduleList[key].StartingPoint);
            });
            $scope.StartingPointList = getUniqueArray(ArrayData);


            //************ Destination
            var ArrayData = [];
            angular.forEach($scope.BusScheduleList, function (value, key) {
                ArrayData.push($scope.BusScheduleList[key].Destination);
            });
            $scope.DestinationList = getUniqueArray(ArrayData);



          //  alert(angular.toJson(getUniqueArray($scope.data)));

            


        }, function (error) {
            alert('Error GetBusSchedule!');
        });

    }
        
   

    $scope.growableOptions_VehicleTypeList = {
        displayText: 'Select or Add a New',
        addText: 'Add New',
        onAdd: function (text) {
            var newItem = text;
            $scope.VehicleTypeList.push(newItem);
            return newItem;
        }
    };


    $scope.growableOptions_DriverList = {
        displayText: 'Select or Add a New',
        addText: 'Add New',
        onAdd: function (text) {
            var newItem = text;
            $scope.DriverList.push(newItem);
            return newItem;
        }
    };


    $scope.growableOptions_StartingPointList = {
        displayText: 'Select or Add a New',
        addText: 'Add New',
        onAdd: function (text) {
            var newItem = text;
            $scope.StartingPointList.push(newItem);
            return newItem;
        }
    };


    $scope.growableOptions_DestinationList = {
        displayText: 'Select or Add a New',
        addText: 'Add New',
        onAdd: function (text) {
            var newItem = text;
            $scope.DestinationList.push(newItem);
            return newItem;
        }
    };

    $scope.growableOptions_RoadNameList = {
        displayText: 'Select or Add a New',
        addText: 'Add New',
        onAdd: function (text) {
            var newItem = text;
            $scope.RoadNameList.push(newItem);
            return newItem;
        }
    };


    $scope.getClasses = function (get_value) {
        var classes = [];
        //alert(get_value);
        classes.push(get_value);
        return classes;
    };
   
    
    
    $scope.time_Match = function (criteria) {
        return function (r) {
            if (criteria==='ALL')
            {
                return r;
            }
            else
            {
            }
            return $scope.timeFunction(r.StartTime) === criteria;
        };
    };


    $scope.timeFunction = function (timeObj) {
        var min = timeObj.Minutes < 10 ? "0" + timeObj.Minutes : timeObj.Minutes;
        var sec = timeObj.Seconds < 10 ? "0" + timeObj.Seconds : timeObj.Seconds;
        var hour = timeObj.Hours < 10 ? "0" + timeObj.Hours : timeObj.Hours;
        return hour + ':' + min;
        //return hour + ':' + min + ':' + sec;
    };
   

    

    $scope.edit_data = function (r) {
      
        angular.element('#ModalUpdateStatus').modal('show');
        $scope.RowData = angular.copy(r);
        $scope.RowData.StartTime = $scope.RowData.StartTime.Hours + ':' + $scope.RowData.StartTime.Minutes;
    }


    $scope.Update = function (RowData) {
       
        BusScheduleService.BusScheduleUpdate(RowData).then(function (d) {
          
            if (d == 'Success') {
                alert('You have successfully Updated');              
                angular.element('#ModalUpdateStatus').modal('hide');

                Load_Data();
            }

            else {
                alert(d);
            }
        }, function (error) {
            alert('Error GetBusSchedule!');
        });
    }
   


    $scope.add_data = function (RowData) {
        

        if (!confirm('Are you sure you want to Add a Row?')) {
            return;
        }
       
        RowData.Date = new Date(parseInt(RowData.Date.substr(6)));
        RowData.StartTime = RowData.StartTime.Hours + ':' + RowData.StartTime.Minutes;
        //alert(angular.toJson(RowData));

        //return;
        BusScheduleService.BusScheduleAdd(RowData).then(function (d) {

            if (d == 'Success') {
                //alert('Added successfully');               

                Load_Data();
            }

            else {
                alert(d);
            }
        }, function (error) {
            alert('Error GetBusSchedule!');
        });
    }


    $scope.delete_data = function (RowData) {


        if (!confirm('Are you sure you want to Delete this Row?')) {
            return;
        }

        BusScheduleService.BusScheduleDelete(RowData).then(function (d) {
            if (d == 'Success') {
                Load_Data();
            }

            else {
                alert(d);
            }
        }, function (error) {
            alert('Error GetBusSchedule!');
        });
    }


    $scope.BusSchedule = {
        Date: new Date(),
        RoadName: '',
        Publish:  false,
        ToDate: new Date(),
        Created_By: ''
    };


    $scope.CopyBusSchedule = function (BusSchedule) {

        //************ Vehicle
        var ArrayData = [];
        angular.forEach($scope.results, function (value, key) {
            ArrayData.push($scope.results[key].ID);
        });


        $scope.BusSchedule.RoadName = "" + getUniqueArray(ArrayData) + "";
        $scope.BusSchedule.Date = $scope.BusSchedule.ToDate;

        if (!confirm('Are you sure you want to Copy Bus Schedule?')) {
            return;
        }


        BusScheduleService.CopyBusSchedule($scope.BusSchedule).then(function (d) {
            if (d == 'Success') {
                alert('You have successfully Updated');
                Load_Data();
            }

            else {
                alert(d);
            }
        }, function (error) {
            alert('Error GetBusSchedule!');
        });
    }



    $scope.PublishBusSchedule = function (Publish) {

        
        //************ Vehicle
        var ArrayData = [];
        angular.forEach($scope.results, function (value, key) {
            ArrayData.push($scope.results[key].ID);
        });
      
        
        $scope.BusSchedule.RoadName =""+ getUniqueArray(ArrayData)+"";
       
        //alert($scope.BusSchedule.RoadName);

        $scope.BusSchedule.Publish = Publish;
        

        if (!confirm('Are you sure you want to Update Publish of Bus Schedule?')) {
            return;
        }


        BusScheduleService.PublishBusSchedule($scope.BusSchedule).then(function (d) {
            if (d == 'Success') {
                alert('You have successfully Updated');
                Load_Data();
            }

            else {
                alert(d);
            }
        }, function (error) {
            alert('Error GetBusSchedule!');
        });
    }

    


    $scope.ReportBusSchedule = function () {
        alert('Updating!');

    };


    


    function getUniqueArray(array) {
        var result = [];
        for (var x = 0; x < array.length; x++) {
            if (result.indexOf(array[x]) == -1)
                result.push(array[x]);
        }

        result.sort();
        return result;
    }


    //Clear Form 
    function ClearForm() {
        $scope.User = {};
        $scope.f1.$setPristine(); //here f1 is form name
        $scope.submitted = false;
    }

})




.factory('BusScheduleService', function ($http, $q) { 


    var fac = {};


    fac.GetBusSchedule = function (data) {
        return $http.get('/BusSchedule/GetBusSchedule', {
            params: { ScheduleDate: data.ScheduleDate.toISOString() }
        });
    }

    //BusScheduleUpdate
    fac.BusScheduleUpdate = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/BusSchedule/BusScheduleUpdate',
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


    //BusScheduleUpdate
    fac.BusScheduleAdd = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/BusSchedule/BusScheduleAdd',
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

    //BusScheduleDelete
    fac.BusScheduleDelete = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/BusSchedule/BusScheduleDelete',
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
    

    //BusScheduleDelete
    fac.CopyBusSchedule = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/BusSchedule/CopyBusSchedule',
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

    //BusScheduleDelete
    fac.PublishBusSchedule = function (data) {
        //alert(data);
        var defer = $q.defer();
        $http({
            url: '/BusSchedule/PublishBusSchedule',
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
