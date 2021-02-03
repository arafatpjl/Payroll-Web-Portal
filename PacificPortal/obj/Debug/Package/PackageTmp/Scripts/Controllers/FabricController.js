
angular.module('MyApp')
.controller('FabricController', function ($scope, FabricProfileService, $window, $filter, $http) {


    //alert(angular.toJson($scope.data));

    $scope.submitText = "Save";
    $scope.submitText2 = "Save";
    $scope.submitText3 = "Save";
    $scope.submitText4 = "Save";
    $scope.submitText5 = "Save";
    $scope.submitText6 = "Save";
    $scope.submitted = false;
    $scope.submitted2 = false;
    $scope.submitted3 = false;
    $scope.submitted4 = false;
    $scope.submitted5 = false;
    $scope.submitted6 = false;
    $scope.message = '';
    $scope.isFormValid = false;


    $scope.Fabric = {

        FabricCode: '',
        PJLCode: '',
        Weight: '',
        WeightUnit: '',
        WeightType: '',
        FabricConst: '',
        Width: '',
        WidthUnit: '',
        FabricFinish: '',
        Price: '',
        PriceType: '',
        PriceUnit: '',
        Remarks: '',
        CNFPrice: '',
        Fabricwarp: '',
        Fabricwaft: ''
    };

    $scope.New = {

        FabricMill: '',
        FABRICCONTENT: '',
        FabricColour: '',
        FabricType: '',
        FabricWave: ''
       
    };

    $scope.WeightUnitList = [
          { name: 'OZ', id: 'OZ' },
          { name: 'GM', id: 'GM' },
          { name: 'KG', id: 'KG' },
          { name: 'NULL', id: 'NULL' },
          { name: 'GSM', id: 'GSM' },
          { name: 'GM/M2', id: 'GM/M2' },
          { name: 'BW', id: 'BW' },
          { name: 'INC', id: 'INC' }

    ];



    $scope.WidthUnitList = [
           { name: 'INC', id: 'INC' },
           { name: 'Feet', id: 'FT' },
           { name: 'CM', id: 'CM' },
           { name: 'OZ', id: 'OZ' },
            { name: 'NULL', id: 'NULL' }

    ];


    $scope.PriceUnitList = [
         { name: 'MTR', id: 'MTR' },
         { name: 'YD', id: 'YD' },
         { name: 'N/A', id: 'N/A' }

    ];

  



    //validates form on client side
    $scope.$watch('f1.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });
    //validates form on client side
    $scope.$watch('f2.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });
    //validates form on client side
    $scope.$watch('f3.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });
    $scope.$watch('f4.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });
    $scope.$watch('f5.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });
    $scope.$watch('f6.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });


    //Save Data
    $scope.SaveData = function (data) {
   

        if ($scope.submitText == 'Save') {
           
            $scope.submitted = true;
            $scope.message = '';
                       
            if ($scope.isFormValid) {
               
                $scope.Fabric.WidthUnit = $scope.WidthUnit.id;
                $scope.Fabric.WeightUnit = $scope.WeightUnit.id;
                $scope.Fabric.PriceUnit = $scope.PriceUnit.id;
                $scope.Fabric = data;
                //alert(angular.toJson($scope.Fabric.PriceUnit));


                FabricProfileService.SaveFormData($scope.Fabric).then(function (d) {
                    if (d == 'Success') {
                        alert('You have successfully Save Data');
                       
                        ClearForm();
                    }
                    else {
                        alert(d);
                    }
                    $scope.submitText = "Save";
                });

            }
            else {
                $scope.message = '';
            }
        }
    }

    //Save New Mill
    $scope.SavenewMill = function (data) {


        if ($scope.submitText2 == 'Save') {

            $scope.submitted2 = true;
            $scope.message = '';

            if ($scope.isFormValid) {

              
                //alert(angular.toJson($scope.New.FabricMill));


                FabricProfileService.SaveMill($scope.New).then(function (d) {
                    if (d == 'Success') {
                        alert('You have successfully Save Data');
                        angular.element('#ModelFabricMill').modal('hide');
                        //$scope.f2.$setPristine();
                        ClearForm();
                    }
                    else {
                        alert(d);
                    }
                    $scope.submitText2 = "Save";
                });

            }
            else {
                $scope.message = '';
            }
        }
    }

    //Save New COntent
    $scope.SavenewContent = function (data) {


        if ($scope.submitText3 == 'Save') {

            $scope.submitted3 = true;
            $scope.message = '';

            if ($scope.isFormValid) {


                //alert(angular.toJson($scope.New.FabricMill));


                FabricProfileService.SaveContent($scope.New).then(function (d) {
                    if (d == 'Success') {
                        alert('You have successfully Save Data');
                        angular.element('#ModelFabricContent').modal('hide');
                        ClearForm();
                    }
                    else {
                        alert(d);
                    }
                    $scope.submitText3 = "Save";
                });

            }
            else {
                $scope.message = '';
            }
        }
    }

    //Save New Colour
    $scope.SavenewColour = function (data) {


        if ($scope.submitText4 == 'Save') {

            $scope.submitted4 = true;
            $scope.message = '';
           

            if ($scope.isFormValid) {
             

                //alert(angular.toJson($scope.New.FabricMill));


                FabricProfileService.SaveColour($scope.New).then(function (d) {
                    if (d == 'Success') {
                        alert('You have successfully Save Data');
                        angular.element('#ModelColour').modal('hide');

                        ClearForm();
                    }
                    else {
                        alert(d);
                    }
                    $scope.submitText4 = "Save";
                });

            }
            else {
                $scope.message = '';
            }
        }
    }

    //Save New CoType
    $scope.SavenewType = function (data) {


        if ($scope.submitText5 == 'Save') {

            $scope.submitted5 = true;
            $scope.message = '';

            if ($scope.isFormValid) {


                //alert(angular.toJson($scope.New.FabricMill));


                FabricProfileService.SaveType($scope.New).then(function (d) {
                    if (d == 'Success') {
                        alert('You have successfully Save Data');
                        angular.element('#ModelFabricType').modal('hide');
                        ClearForm();
                    }
                    else {
                        alert(d);
                    }
                    $scope.submitText5 = "Save";
                });

            }
            else {
                $scope.message = '';
            }
        }
    }
    //Save New CoType
    $scope.SavenewWeave = function (data) {


        if ($scope.submitText6 == 'Save') {

            $scope.submitted6 = true;
            $scope.message = '';

            if ($scope.isFormValid) {


                //alert(angular.toJson($scope.New.FabricWave));


                FabricProfileService.SaveWeave($scope.New).then(function (d) {
                    if (d == 'Success') {
                        alert('You have successfully Save Data');
                        angular.element('#ModelWeabe').modal('hide');
                        ClearForm();
                    }
                    else {
                        alert(d);
                    }
                    $scope.submitText6 = "Save";
                });

            }
            else {
                $scope.message = '';
            }
        }
    }
    // Populate Fabric Content

    FabricProfileService.GetFabricContent().then(function (d) {
        $scope.FabricContentList = d.data;
    }, function (error) {
        alert('Error GetFabricContent!');
    });

    $scope.GetFabricContentID = function () {
        $scope.Fabric.ContentID = $scope.FabricContent.Idno;

    };

    // Populate Fabric Mill

    FabricProfileService.GetFabricMill().then(function (d) {
        $scope.FabricMillList = d.data;
    }, function (error) {
        alert('Error GetFabricMill!');
    });

    $scope.GetFabricMillID = function () {
        $scope.Fabric.MillID = $scope.FabricMill.Idno;
       
    };


    // Populate Fabric Colour

    FabricProfileService.GetFabricColour().then(function (d) {
        $scope.FabricColourList = d.data;
    }, function (error) {
        alert('Error GetFabricColour!');
    });

    $scope.GetFabricColourID = function () {
        $scope.Fabric.ColourID = $scope.FabricColour.Idno;

    };

    // Populate Fabric Type

    FabricProfileService.GetFabricType().then(function (d) {
        $scope.FabricTypeList = d.data;
    }, function (error) {
        alert('Error GetFabricType!');
    });

    $scope.GetFabricTypeID = function () {
        $scope.Fabric.FabricTypeID = $scope.FabricType.Idno;

    };

    // Populate Fabric Weave

    FabricProfileService.GetFabricWave().then(function (d) {
        $scope.FabricWaveList = d.data;
    }, function (error) {
        alert('Error GetFabricWave!');
    });

    $scope.GetFabricWeaveID = function () {
        $scope.Fabric.WeaveID = $scope.FabricWeave.Idno;

    };


    //Clear Form 
    function ClearForm() {
        $scope.Fabric = {};
        $scope.f1.$setPristine();
        //$scope.f2.$setPristine();
        //$scope.f3.$setPristine();
        //$scope.f4.$setPristine();
        //$scope.f5.$setPristine();
        //$scope.f6.$setPristine();
        $scope.submitted = false;
        $scope.submitted2 = false;
        $scope.submitted3 = false;
        $scope.submitted4 = false;
        $scope.submitted5 = false;
        $scope.submitted6 = false;
        //$scope.submitted3 = false;
    }

})


.factory('FabricProfileService', function ($http, $q) {

    var fac = {};

    fac.GetFabricContent = function () {
        return $http.get('/Fabric/GetFabricContent')
    }

    fac.GetFabricMill = function () {
        return $http.get('/Fabric/GetFabricMill')
    }

    fac.GetFabricColour = function () {
        return $http.get('/Fabric/GetFabricColour')
    }

    fac.GetFabricType = function () {
        return $http.get('/Fabric/GetFabricType')
    }

    fac.GetFabricWave = function () {
        return $http.get('/Fabric/GetFabricWave')
    }

    var getModelAsFormData = function (data) {
        var dataAsFormData = new FormData();
        angular.forEach(data, function (value, key) {
            dataAsFormData.append(key, value);
        });
        return dataAsFormData;
    };

    
    fac.SaveFormData = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Fabric/FabricInfo_insert',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            alert('Error SaveFormData!');
            defer.reject(e);
        });
        return defer.promise;
    }

    fac.SaveMill = function (data) {
        //alert(angular.toJson(data));
        var defer = $q.defer();
        $http({
            url: '/Fabric/FabricMill_insert',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            alert('Error SaveMill!');
            defer.reject(e);
        });
        return defer.promise;
    }

    fac.SaveContent = function (data) {
        //alert(angular.toJson(data));
        var defer = $q.defer();
        $http({
            url: '/Fabric/FabricContent_insert',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            alert('Error SaveContent!');
            defer.reject(e);
        });
        return defer.promise;
    }

    fac.SaveColour = function (data) {
        //alert(angular.toJson(data));
        var defer = $q.defer();
        $http({
            url: '/Fabric/FabricColour_insert',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            alert('Error SaveColour!');
            defer.reject(e);
        });
        return defer.promise;
    }
    fac.SaveType = function (data) {
        //alert(angular.toJson(data));
        var defer = $q.defer();
        $http({
            url: '/Fabric/FabricType_insert',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            alert('Error SaveType!');
            defer.reject(e);
        });
        return defer.promise;
    }

    fac.SaveWeave = function (data) {
        //alert(angular.toJson(data));
        var defer = $q.defer();
        $http({
            url: '/Fabric/FabricWeave_insert',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            alert('Error SaveWeave!');
            defer.reject(e);
        });
        return defer.promise;
    }

 
    return fac;

});



