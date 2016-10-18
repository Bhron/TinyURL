var app = angular.module('tinyUrlApp');

app.controller('urlController',
    ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {

    $http.get('/api/v1/urls/' + $routeParams.shortUrl)
        .success(function (data) {
            $scope.longUrl = data.longUrl;
            $scope.shortUrl = $routeParams.shortUrl;
            $scope.shortUrlToShow = $location.host() + '/' + $routeParams.shortUrl;
        });

    // $http.get('/api/v1/urls/' + $routeParams.shortUrl + '/allClicks')
    //     .success(function (data) {
    //         $scope.allClicks = data.allClicks;
    //     });

    // var renderChart = function (chart, infos) {
    //     $scope[chart + 'Labels'] = [];
    //     $scope[chart + 'Data'] = [];
    //
    //     $http.get('/api/v1/urls/' + $routeParams.shortUrl + '/' + 'infos')
    //         .success(function (data) {
    //             data.forEach(function (info) {
    //                 $scope[chart + 'Labels'].push();
    //                 $scope[chart + 'Data'].push();
    //             });
    //         });
    // };
    //
    // renderChart('pie', 'referer');
}]);
