angular.module('MyApp')
.controller('AlbumAdminController', function ($scope, $window,$location, $filter,AlbumAdminService) {
    
    //alert(angular.toJson($scope.data));

    var AlbumGroup = 1;


    //var AlbumGroup = $location.search().Group_ID;
    //alert(AlbumGroup);

    $scope.Album = {       
        Name: '',
        Description: '',
        SnapDate: '',
        URL: '',
        TemplateImage: '',
        YSNActive: ''
    };


    $scope.submitted = false;
    

    var ms = new Date().getTime() + 86400000;
    $scope.LastDate = new Date(ms);

   
    $scope.NameSearch = '';
    
    $scope.imagesList = [];

 
    //// Populate GetAlbumDetail
    GetAlbumDetail();


    function GetAlbumDetail() {
       
        //alert($scope.LastDate);

        AlbumAdminService.GetAlbumDetail(AlbumGroup, $scope.LastDate, $scope.NameSearch).then(function (d) {
            $scope.AlbumDetailList = d.data;

            angular.forEach(d.data, function (value) {
                $scope.LastDate = new Date(parseInt(value.SnapDate.substr(6)));
            });
            //alert($scope.LastDate);
        }, function (error) {
            alert('Error GetAlbumDetail!');
        });

    }




    $scope.NewAlbumDialog = function () {

        $scope.Album = {
            Name: '',
            Description: '',
            SnapDate: '',
            URL: '',
            TemplateImage: '',
            YSNActive: ''
        };

        angular.element('#ModalAlbumNew').modal('show');

    }

    $scope.search_by = function () {

        
        var value = $scope.searchDate;

        if (!value || value == undefined || value == "" || value.length == 0) {
            //$scope.searchDate
            var ms = new Date().getTime() + 86400000;
            $scope.LastDate = new Date(ms);

        }
        else {
            $scope.LastDate = angular.copy($scope.searchDate);
            $scope.LastDate = new Date($scope.LastDate);
        }

        GetAlbumDetail();
    }


    $scope.advstatus = false;
    $scope.NextLoad = function () {

        $scope.advstatus = true;
        //// Populate GetEmployeeInfoDetail

        AlbumAdminService.GetAlbumDetail(AlbumGroup, $scope.LastDate, $scope.NameSearch).then(function (d) {

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

        //// Populate GetEmployeeInfoDetail
        AlbumAdminService.GetAlbumImages($scope.Album).then(function (d) {
            $scope.AlbumImagesList = d.data;
            // alert(angular.toJson($scope.Album));

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

            var src = 'http://' + host + "/Home/GetImg?imageURL=" + image_urls;
            promises.push(loadImage(src));

        })

        return $q.all(promises).then(function (results) {
            console.log('promises array all resolved');
            $scope.results = results;
        });
    }




    
    $scope.uploadFile = function (event) {
        

        $scope.advstatus = true;
        $scope.$apply();


        var files = event.target.files;

       

        files2 = files;

        angular.forEach(files, function (flowFile, i) {

            $scope.imagesList[i] = {};


            $scope.imagesList[i].Name = flowFile.name ;
            $scope.imagesList[i].size = flowFile.size;
            $scope.imagesList[i].Status = 'Uploading';
            
            //alert(flowFile.size/(1024*1024));

            var flowFile_size = flowFile.size / (1024 * 1024);

            if (flowFile_size > 2) {
                //alert('Please select File size < 2 MB');               
                //return;
            }

            var fileReader = new FileReader();
            var image = new Image();



            fileReader.onload = function (event) {

                var uri = event.target.result;
                image.src = uri;
                image.onload = function () {

                    //alert(this.width + " " + this.height);    


                    //filesLoaded++;
                    //if (filesLoaded === files.length) {
                    //    console.log('Files already loaded');
                    //    $scope.progress = 100;
                    //    // Do some stuff when all files are loaded...
                    //}
                    //else {
                    //    console.log((100 * filesLoaded / files.length) + '% loaded');
                    //    $scope.progress = 100 * (filesLoaded / files.length);
                    //    $scope.$apply(); // Is it mandatory?
                    //}


                    $scope.$apply();
                };


                fileReader.onloadend = function (e) {
                 

                    $scope.$apply();
                    //alert($scope.progress);
                }


                $scope.imagesList[i].uri = uri;

              

            };
            fileReader.readAsDataURL(flowFile);
        });




       

        angular.forEach(files, function (file,i) {

            var Form_Data = new FormData();

         //   alert(angular.toJson($scope.Album));

            //angular.forEach($scope.Album, function (value, key) {
            //    alert(value);
            //    Form_Data.append(key, value);
            //});
            //alert($scope.Album.URL);

            Form_Data.append("ID", $scope.Album.ID);
            Form_Data.append("URL", $scope.Album.URL);

            Form_Data.append('file', file);
    
            AlbumAdminService.UpdateAlbumPic(Form_Data).then(function (d) {

                $scope.advstatus = false;
                $scope.$apply();
                $scope.imagesList[i].Status = d;
                //alert(d);

            });

        });


      

    }


    //ZoomImage
    $scope.ZoomImage = function (data) {

       // alert(angular.toJson(data));     
        var ImageURL = "http://localhost:36224/Home/GetImg?imageURL=" + data;
        $window.open(ImageURL);
    }



    //Update Albun
    $scope.UpdateAlbum = function () {

            AlbumAdminService.Album_update($scope.Album).then(function (d) {
               // alert(d);
            });
        
    }



    //TemplateImage
    $scope.TemplateImage = function (data) {

        $scope.Album.TemplateImage = data;

        if (!confirm('Are you sure you want to save this as Template Image?')) {
            return;
			} 
					
        //  alert($scope.Album.TemplateImage);

			// Save it!
            AlbumAdminService.Album_update($scope.Album).then(function (d) {
                alert(d);
            });
    }


    //Save Data
    $scope.DeleteImage = function (data) {


        $scope.Album.TemplateImage = data;

        if (confirm('Are you sure you want to Delete this Image ? -- ' + data)) {
            // DeleteImage it!

            AlbumAdminService.DeleteImage($scope.Album).then(function (d) {
                alert(d);
            });

        } else {
            // Do nothing!
        }
    }

    //validates form on client side
    $scope.$watch('f1.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });

    //Save Data
    $scope.CreateNewAlbum = function (data) {

        //alert(angular.toJson($scope.isFormValid));
      

            $scope.submitted = true;
            $scope.message = '';


            if ($scope.isFormValid) {

                AlbumAdminService.CreateNewAlbum(data).then(function (d) {

                    alert(d);

                    var ms = new Date().getTime() + 86400000;
                    $scope.LastDate = new Date(ms);
                    GetAlbumDetail();

                    angular.element('#ModalAlbumNew').modal('hide');

                   

                });
            }
        

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

                //  alert(src);
                // var  src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/LARGE_elevation.jpg/800px-LARGE_elevation.jpg';

                image.src = src

                image.onload = function () {
                   // $scope.advstatus = true;
                };

                image.onloadend = function () {
                    $scope.log.push("loaded image: " + src);
                   // $scope.advstatus = false;
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

            var src = 'http://' + host + "/Home/GetImg?imageURL=" + image_urls;
            promises.push(loadImage(src));
        })

        return $q.all(promises).then(function (results) {
            console.log('promises array all resolved');
            $scope.results = results;
        });
    }




})
.factory('AlbumAdminService', function ($http, $q) {

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
   



    fac.UpdateAlbumPic = function (Form_Data) {


        //alert(Form_Data);

        var defer = $q.defer();

        var url = '/Album/FileUpload';

        $http.post(url, Form_Data, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .success(function (d) {
            //success
            //alert(d);
            defer.resolve(d);
        })
        .error(function (e) {
            //failed
            //alert('FileUpload');
           // alert('Error!');
            defer.reject(e);
        });

        return defer.promise;
    }


    
    fac.CreateNewAlbum = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Album/Album_insert',
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

    fac.DeleteImage = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Album/DeleteImage',
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

    fac.Album_update = function (data) {
        var defer = $q.defer();
        $http({
            url: '/Album/Album_update',
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

