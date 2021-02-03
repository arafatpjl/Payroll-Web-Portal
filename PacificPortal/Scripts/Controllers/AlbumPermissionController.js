angular.module('MyApp')
.controller('AlbumPermissionController', function ($scope, $window, $filter, AlbumPermissionService) {

    //alert(angular.toJson($scope.data));

    $scope.submitted = false;

    $scope.ModelTile = 'New Album Group';

    $scope.button = 'Save';


    $scope.AlbumGroup = {
        GroupName: '',
        AlbumID: '',
        SecurityCode: ''
    };




    //// Populate GetAlbumDetail
    GetAlbumGroupDetail();
    GetAllAlbumDetail();

    function GetAlbumGroupDetail() {

        //alert($scope.LastDate);

        AlbumPermissionService.GetAlbumGroupDetail().then(function (d) {
            $scope.AlbumGrouplist = d.data;
            //alert($scope.LastDate);
        }, function (error) {
            alert('Error GetAlbumGroupDetail!');
        });

    }

    function GetAllAlbumDetail() {

        //alert($scope.LastDate);

        AlbumPermissionService.GetAllAlbumDetail().then(function (d) {
            $scope.AvailableAlbum = d.data;
            //alert($scope.LastDate);
        }, function (error) {
            alert('Error GetAlbumGroupDetail!');
        });

    }


    $scope.available = [];
    $scope.selected = [];

    $scope.moveItem = function (items, from, to) {

        angular.forEach(items, function (item) {
            var idx = from.indexOf(item);
            from.splice(idx, 1);
            to.push(item);
        });

        // clear selection
        $scope.available = "";
        $scope.selected = "";
    };

    $scope.moveAll = function (from, to) {

        angular.forEach(from, function (item) {
            to.push(item);
        });
        from.length = 0;        
    };



    
    
    


    
    $scope.AlbumCreate = function () {

        GetAllAlbumDetail();

        $scope.available = [];
        $scope.selected = [];

        $scope.selectedAlbum = [];
       

        $scope.AlbumGroup = {
            GroupName: '',
            AlbumID: '',
            SecurityCode: ''
        };

        $scope.ModelTile = 'New Album Group';
        $scope.button = 'Save';
        angular.element('#ModalAlbumNew').modal('show');
    }

    $scope.AlbumPreview = function (GroupID) {

        
       
        AlbumPermissionService.GetAlbumURL(GroupID).then(function (d) {

            $window.open(d.data);

           
        }, function (error) {
            alert('Error GetAlbumGroupDetail!');
        });
    }

    $scope.AlbumChange = function () {
       
        //alert($scope.AlbumGroup[0].ID);
        AlbumPermissionService.GetAlbumDetailByGroup($scope.AlbumGroup[0].ID).then(function (d) {
            $scope.selectedAlbum = d.data;

            //alert($scope.LastDate);
        }, function (error) {
            alert('Error GetAlbumGroupDetail!');
        });
        $scope.ModelTile = 'Update Album Group';
        $scope.button = 'Update';
        angular.element('#ModalAlbumNew').modal('show');

        $scope.AlbumGroup = $scope.AlbumGroup[0];

    };



    //validates form on client side
    $scope.$watch('f1.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });



    $scope.SaveGroup = function (AlbumGroup) {
       // alert(angular.toJson($scope.selectedAlbum));
    var ArrayData = [];
    angular.forEach($scope.selectedAlbum, function (value, key) {        
        ArrayData.push(value.ID);
    });
    
    //alert(angular.toJson($scope.AlbumGroup));
    //alert(angular.toJson(ArrayData));

    $scope.AlbumGroup = AlbumGroup;
    $scope.AlbumGroup.AlbumID = '' + ArrayData; 
    //alert(angular.toJson($scope.AlbumGroup));
    $scope.submitted = true;
    $scope.message = '';

        //alert($scope.isFormValid);

    if ($scope.isFormValid) {

       
        if ($scope.button == 'Save') {

            AlbumPermissionService.Album_Group_insert($scope.AlbumGroup).then(function (d) {
                alert(d);
                angular.element('#ModalAlbumNew').modal('hide');
            });
        }

        if ($scope.button == 'Update') {
            AlbumPermissionService.Album_Group_update($scope.AlbumGroup).then(function (d) {
                alert(d);
                angular.element('#ModalAlbumNew').modal('hide');
            });
        }

    }


    };


   

    $scope.selectedAlbum = [];
    //$scope.AvailableAlbum = [{
    //    id: 1,
    //    name: 'Album 1'
    //}, {
    //    id: 2,
    //    name: 'Album 2'
    //}, {
    //    id: 3,
    //    name: 'Album 3'
    //}, {
    //    id: 4,
    //    name: 'Album 4'
    //}];


   
    

})
.factory('AlbumPermissionService', function ($http, $q) {

    var fac = {};

    fac.GetAlbumGroupDetail = function () {
        return $http.get('/Album/GetAlbumGroupDetail', {
            params: { AlbumGroup: '' }
        });
    }


    fac.GetAllAlbumDetail = function () {
        return $http.get('/Album/GetAllAlbumDetail', {
            params: { AlbumGroup: '' }
        });
    }

    fac.GetAlbumDetailByGroup = function (GroupID) {
        return $http.get('/Album/GetAlbumDetailByGroup', {
            params: { GroupID: GroupID }
        });
    }
    
    fac.GetAlbumURL = function (GroupID) {
        return $http.get('/Album/GetAlbumURL', {
            params: { GroupID: GroupID }
        });
    }
    

    fac.Album_Group_insert = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Album/Album_Group_insert',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            // alert('Error!');
            defer.reject(e);
        });
        return defer.promise;
    }



    fac.Album_Group_update = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Album/Album_Group_update',
            method: 'POST',
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            // alert('Error!');
            defer.reject(e);
        });
        return defer.promise;
    }

    
    return fac;
});

