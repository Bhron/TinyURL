var app = angular.module('tinyUrlApp');

app.controller('urlController',
    ['$scope', '$http', '$routeParams', '$window', function ($scope, $http, $routeParams, $window) {
    // $scope.longUrlClicked = function () {
    //     const longUrl = $scope.longUrl;
    //     if (!longUrl) {
    //         return;
    //     }
    //
    //     $window.location.href = longUrl;
    // };

    $scope.shortUrlClicked = function () {
        const longUrl = $scope.longUrl;
        if (!longUrl) {
            return;
        }

        $window.location.href = longUrl;
    };

    $http.get('/api/v1/urls/' + $routeParams.shortUrl)
        .success(function (data) {
            $scope.longUrl = data.longUrl;
            $scope.shortUrl = $routeParams.shortUrl;
        });

    $http.get('/api/v1/urls/' + $routeParams.shortUrl + '/totalClicks')
        .success(function (data) {
            $scope.totalClicks = data.totalClicks;
        });

    var renderChart = function (chart, infos) {
        $scope[chart + 'Labels'] = [];
        $scope[chart + 'Data'] = [];

        $http.get('/api/v1/urls/' + $routeParams.shortUrl + '/' + 'infos')
            .success(function (data) {
                data.forEach(function (info) {
                    $scope[chart + 'Labels'].push();
                    $scope[chart + 'Data'].push();
                });
            });
    };

    renderChart('pie', 'referer');
}]);
