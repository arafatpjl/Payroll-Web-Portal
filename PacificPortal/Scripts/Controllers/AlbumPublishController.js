angular.module('MyApp')
.controller('AlbumPublishController', function ($scope, $window, $q,$location, $timeout, $filter, AlbumPublishService) {
    
    //alert(angular.toJson($scope.data));

    //var AlbumGroup = $location.search().Group_ID;
    //alert(AlbumGroup);

    var AlbumGroup = 0;
    var AlbumSecurityCode = 'dgfdg';

    var EntryAlbumSecurityCode = '';

    var ms = new Date().getTime() + 86400000;
    $scope.LastDate = new Date(ms);


    $scope.YSN_preventRightClick = true;

    $scope.NameSearch = '';

    $scope.imagesList = [];

    $scope.viewLoaded = false;

    angular.element(function () {

        AlbumSecurityCode = $scope.AlbumSecurityCode;

       //alert(AlbumSecurityCode);

        var value = $scope.AlbumSecurityCode;
        if (!value || value == undefined || value == "" || value.length == 0) {
            AlbumGroup = 2;
            GetAlbumDetail();

        }

        else {

            AlbumGroup = $scope.AlbumID;
           // alert(AlbumGroup);
           // GetAlbumDetail();
            angular.element('#ModalAlbumNew').modal();                  // initialized with defaults
            angular.element('#ModalAlbumNew').modal({ keyboard: false });  // initialized with no keyboard
            angular.element('#ModalAlbumNew').modal('show');

        }

       // alert(AlbumGroup);

    });


    angular.element('#ModalAlbumNew').on('hide.bs.modal', function (e) {

        //if (EntryAlbumSecurityCode != AlbumSecurityCode) {
        //    e.preventDefault();
        //}
        //else
        //{

        //}
    });


    //?Group_ID=3

    angular.element('#ModalAlbumNew').on('hidden.bs.modal', function () {
      //  alert('hidden Successfully');
       
        angular.element('#ModalAlbumNew').removeData('bs.modal')
    });

  

    //AlbumGroup = 4;
    //alert(AlbumGroup);
    //GetAlbumDetail();
    //$scope.$apply();

    $scope.CheckAlbumSecurityCode = function (AlbumGroup) {
        //AlbumGroup = 4;
        //alert(AlbumGroup);
        //GetAlbumDetail();
        //$scope.$apply();


        //angular.element('#ModalAlbumNew').modal('hide');
        //return;
        if (AlbumGroup.AlbumSecurityCode == AlbumSecurityCode) {

            GetAlbumDetail();

            EntryAlbumSecurityCode = AlbumSecurityCode;

            //alert('Login Successfully 2');
            angular.element('#ModalAlbumNew').modal('hide');
            ////angular.element('#ModalAlbumNew').removeData('bs.modal')
            ////// Populate Album Publish

            $scope.YSN_preventRightClick = false;
        }
        else {
            alert('Login Falied');
        }
    }

    





    function GetAlbumDetail() {

        //alert($scope.LastDate);
        //alert(AlbumGroup);
        //alert($scope.NameSearch);

        AlbumPublishService.GetAlbumDetail(AlbumGroup, $scope.LastDate, $scope.NameSearch).then(function (d) {

            //alert(d.data);
            $scope.AlbumDetailList = d.data;
            //alert($scope.AlbumDetailList);
            angular.forEach(d.data, function (value) {
                $scope.LastDate = new Date(parseInt(value.SnapDate.substr(6)));
            });


            $timeout(function () {
                $scope.viewLoaded = true;
            }, 2000);

            angular.element('#carousel-custom').carousel();

            //alert($scope.LastDate);
        }, function (error) {
            alert('Error GetAlbumDetail!');
        });

    }


    

    $scope.NextLoad = function () {

        $scope.advstatus = true;
        //// Populate GetEmployeeInfoDetail

        AlbumPublishService.GetAlbumDetail(AlbumGroup, $scope.LastDate, $scope.NameSearch).then(function (d) {

            angular.forEach(d.data, function (value) {
                $scope.AlbumDetailList.push(value);
                //alert(angular.toJson(value));
                $scope.LastDate = new Date(parseInt(value.SnapDate.substr(6)));
            });

            $scope.$apply();


            $timeout(function () {
                $scope.advstatus = false;
            }, 5000);


        }, function (error) {
            alert('Error GetAlbumDetail!');
        });



    }




    $scope.SlideShow = function (AlbumDetail) {


        $scope.imagesList = [];
        $scope.AlbumImagesList = [];

        $scope.Album = angular.copy(AlbumDetail);
        $scope.Album.SnapDate = new Date(parseInt($scope.Album.SnapDate.substr(6)));
        $scope.Album.Created_date = new Date(parseInt($scope.Album.Created_date.substr(6)));

        // alert(angular.toJson($scope.Album));

        //Close all Model
      
       

      

        //// Populate GetEmployeeInfoDetail
        AlbumPublishService.GetAlbumImages($scope.Album).then(function (d) {
            $scope.AlbumImagesList = d.data;

            angular.element('#ModalShowImageSlide').modal('show');           

        }, function (error) {
            alert('Error GetAlbumImages!');
        });


       

        //angular.element('#ModalShowImageSlide').modal('show');
        //angular.element('#ModalUpdateStatus').modal('hide');
    }


    angular.element('#ModalShowImageSlide').on('shown.bs.modal', function () {

        $scope.advstatus = true;

        preLoad().then(function () {
            $scope.nextLoad = "Starting the next load activity..."
        });

    });
    


    

    function preLoad() {

        $scope.log = [];
    $scope.nextLoad = "Waiting for preLoad...";
        var promises = [];

        function loadImage(src) {
            return $q(function (resolve, reject) {
                var image = new Image();

                  //alert(src);
             // var  src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/LARGE_elevation.jpg/800px-LARGE_elevation.jpg';

                image.src = src

                image.onload = function () {
                    $scope.advstatus = true;
                };
               
                image.onloadend = function () {

                    $scope.log.push("loaded image: " + src);
                    $scope.advstatus = false;
                    angular.element('#carousel-custom').carousel();
                    resolve(image);
                };

                image.onerror = function (e) {
                    reject(e);
                };
            })
        }

        //$scope.ImagesList = angular.element('#carousel-custom').find('img').map(function () { return this.src; }).get();
        //alert($scope.ImagesList.length);
        //$scope.ImagesList.forEach(function (src) {
        //   // alert(src);
        //    promises.push(loadImage(src));
        //})



        $scope.AlbumImagesList.forEach(function (image_urls) {


            var host = $location.host();
           // alert(host);

            // var src = "http://localhost:36221/Home/GetImg?imageURL=" + image_urls;

            var src = 'http://'+host + "/Home/GetImg?imageURL=" + image_urls;
            promises.push(loadImage(src));

        })

        return $q.all(promises).then(function (results) {
            console.log('promises array all resolved');
            $scope.results = results;
        });
    }

    


    //angular.element('#preloader').delay(35000).fadeOut('slow', function () {
    //    angular.element("#ModalShowImageSlide").attr('data-ride', "carousel");
    //});




})
.factory('AlbumPublishService', function ($http, $q) {

    var fac = {};



    fac.GetAlbumDetail = function (AlbumGroup, LastDate, NameSearch) {
        return $http.get('/Album/GetAlbumDetail', {
            params: { AlbumGroup: AlbumGroup, AfterDate: LastDate, NameSearch: NameSearch }
        });
    }


    fac.GetAlbumImages = function (Album) {
        return $http.get('/Album/GetAlbumImages', {
            params: { album_ID: Album.ID, album_URL: Album.URL }
        });
    }

    return fac;
});

