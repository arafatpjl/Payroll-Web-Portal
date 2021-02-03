angular.module('MyApp') 
.controller('FabricInfoController', function ($scope, $http, $timeout, $filter, $window, FabricInfoService) {
       
    //alert(angular.toJson($scope.data));

    //Default Variable
    $scope.submitText = "Update";
    $scope.submitted = false;
    $scope.message = '';
    $scope.isFormValid = false;



    $scope.Fabricinfo = {
        //FabricCode, PJLCode, FabricMill, FabricContent, Weight, WeightUnit, FabricConst, Width, WidthUnit, FabricColour, FabricType, FabricFinish, FabricWeave, Price
        FabricCode: '',
        PJLCode: '',
        FabricMill: '',
        FabricContent: '',
        Weight: '',
        FabricConst: '',
        Width: '',
        FabricColour: '',
        FabricType: '',
        FabricFinish: '',
        MillID: ''

    };


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
        PriceUnit: '',
        PriceType: '',
        Remarks: '',
        CNFPrice: '',
        Fabricwarp: '',
        FabricMill: '',
        FabricContent: '',
        FabricColour: '',
        FabricType: '',
        FabricWeave: '',
        Fabricwaft:'',
        MillID:''
    };
    //$scope.WeightUnitList = $filter('WeightUnitList')();
    $scope.FabricStatus = function (r) {
       
        $scope.Fabric = angular.copy(r);

        //alert(angular.toJson($scope.WeightUnitList));
            //alert($scope.Fabric.WeightUnit);

        var FabricMillList = $filter('filter')($scope.FabricMillList, { Idno: $scope.Fabric.MillID }, true);
        $scope.FabricMill = FabricMillList[0];

        var FabricContentList = $filter('filter')($scope.FabricContentList, { Idno: $scope.Fabric.ContentID }, true);
        $scope.FabricContent = FabricContentList[0];

        var FabricColourList = $filter('filter')($scope.FabricColourList, { Idno: $scope.Fabric.ColourID }, true);
        $scope.FabricColour = FabricColourList[0];

        var FabricTypeList = $filter('filter')($scope.FabricTypeList, { Idno: $scope.Fabric.FabricTypeID }, true);
        $scope.FabricType = FabricTypeList[0];

        var FabricWaveList = $filter('filter')($scope.FabricWaveList, { Idno: $scope.Fabric.WeaveID }, true);
        $scope.FabricWeave = FabricWaveList[0];

        var WeightUnitList = $filter('filter')($scope.WeightUnitList, { id: $scope.Fabric.WeightUnit }, true);
        $scope.WeightUnit = WeightUnitList[0];

        var WidthUnitList = $filter('filter')($scope.WidthUnitList, { id: $scope.Fabric.WidthUnit }, true);
        $scope.WidthUnit = WidthUnitList[0];

        var PriceUnitList = $filter('filter')($scope.PriceUnitList, { id: $scope.Fabric.PriceUnit }, true);
        $scope.PriceUnit = PriceUnitList[0];


               

        //alert(angular.toJson($scope.Fabric.PriceUnit));
        //angular.element('#ModelFabric').modal('show');


    }
    // update

    $scope.UpdateFabric = function (data) {
        //alert('a');


        $scope.submitted = true;
        $scope.message = '';

        //if ($scope.isFormValid) {

        $scope.Fabric.WidthUnit = $scope.WidthUnit.id;
        $scope.Fabric.WeightUnit = $scope.WeightUnit.id;
        $scope.Fabric.PriceUnit = $scope.PriceUnit.id;
            $scope.Fabric = data;
        //alert(angular.toJson($scope.Fabric.PriceUnit));
        
            FabricInfoService.UpdateFabric($scope.Fabric).then(function (d) {

                if (d == 'Success') {
                    
                    alert('You have successfully Updated');
                    angular.element('#ModelFabric').modal('hide');
                    //$scope.f1.$setPristine();

                    //send email to report Super
                    GetFabricInfoDetail();
                    

                }
                $scope.submitText = "Update";
            });
        //}
    }


    // Populate FabricDetail
    FabricInfoService.GetFabricInfoDetail().then(function (d) {
        $scope.Fabricinfo = d.data;
        //alert(angular.toJson($scope.Fabricinfo));
        $scope.FabricInfoList = d.data;

    }, function (error) {
        alert(angular.toJson(error));
        alert('Error GetFabricInfoDetail!' + error);
    });


    $scope.byRange = function (fieldName, minValue, maxValue) {

        if (minValue === undefined) minValue = Number.MIN_VALUE;
        if (maxValue === undefined) maxValue = Number.MAX_VALUE;

        return function predicateFunc(item) {

            var val = item;
            val = val[fieldName];

            return minValue <= val && val <= maxValue;
        };
    };

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
    
    //var columnsNames = ['Unit', 'Department', 'Section', 'Name', 'Designation', 'BloodGroup', 'PreAddress', 'PerAddress', 'Religion'];
    var columnsNames = ['FabricContent','FabricCode', 'PJLCode', 'FabricMill','FabricColour', 'FabricType'];
    $scope.headers = columnsNames;
    $scope.columns = columnsNames[0];
    
    $scope.search_Placeholder = "Search";

    $scope.columnsChange = function ( value) {
      $scope.search_Placeholder = "Search  " + value + " value ";
    }

    $scope.Limit = "1000";
    $scope.FromWeight = "0.00";
    $scope.ToWeight = "500.0";
    $scope.FromPrice = "0.00";
    $scope.ToPrice = "100.0";

    $scope.check = function () {

        $scope.loading = 20;

        myhandler();

        var x = $scope.search[$scope.columns];

        //alert(angular.toJson(x));

        if (x.length === 0 || typeof x === 'undefined') {

            $scope.Limit = "100";
        } else {
            $scope.Limit = $scope.FabricInfoList.length;
        }
    };


    $scope.AddSearchType = function () {
        $scope.Limit = $scope.FabricInfoList.length;
        var obj = {
            ReportSuper: $scope.Fabricinfo[0].PJLCode
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

  
    function getUniqueArray(array) {
        var result = [];
        for (var x = 0; x < array.length; x++) {
            if (result.indexOf(array[x]) == -1)
                result.push(array[x]);
        }
        return result;
    }

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

    // Populate Fabric Content

    FabricInfoService.GetFabricContent().then(function (d) {
        $scope.FabricContentList = d.data;
    }, function (error) {
        alert('Error GetFabricContent!');
    });

    $scope.GetFabricContentID = function () {
        $scope.Fabric.ContentID = $scope.FabricContent.Idno;

    };

    // Populate Fabric Mill

    FabricInfoService.GetFabricMill().then(function (d) {
        $scope.FabricMillList = d.data;
    }, function (error) {
        alert('Error GetFabricMill!');
    });

    $scope.GetFabricMillID = function () {
        $scope.Fabric.MillID = $scope.FabricMill.Idno;

    };


    // Populate Fabric Colour

    FabricInfoService.GetFabricColour().then(function (d) {
        $scope.FabricColourList = d.data;
    }, function (error) {
        alert('Error GetFabricColour!');
    });

    $scope.GetFabricColourID = function () {
        $scope.Fabric.ColourID = $scope.FabricColour.Idno;

    };

    // Populate Fabric Type

    FabricInfoService.GetFabricType().then(function (d) {
        $scope.FabricTypeList = d.data;
    }, function (error) {
        alert('Error GetFabricType!');
    });

    $scope.GetFabricTypeID = function () {
        $scope.Fabric.FabricTypeID = $scope.FabricType.Idno;

    };

    // Populate Fabric Weave

    FabricInfoService.GetFabricWave().then(function (d) {
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
        $scope.f1.$setPristine(); //here f1 is form name
        $scope.submitted = false;
    }

})




.factory('FabricInfoService', function ($http, $q) { 


    var fac = {};


    fac.GetFabricInfoDetail = function () {
        return $http.get('/Fabric/GetFabricInfoDetail')
        
    }

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

    fac.UpdateFabric = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Fabric/FabricInfo_update',
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
   
    return fac;
});
