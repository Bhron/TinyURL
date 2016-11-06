var app = angular.module('tinyUrlApp');

app.controller('urlController',
    ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {

    $http.get('/api/v1/urls/' + $routeParams.shortUrl)
        .success(function (data) {
            $scope.longUrl = data.longUrl;
            $scope.shortUrl = $routeParams.shortUrl;
            $scope.shortUrlToShow = $location.host() + '/' + $routeParams.shortUrl;
        });

    $http.get('/api/v1/urls/' + $routeParams.shortUrl + '/allClicks')
        .success(function (data) {
            if (!data) {
                // Error
                return;
            }

            if (data.allClicks) {
                $scope.allClicks = data.allClicks;
            } else {
                // Error
            }
        });

    $scope.hour = 'hour';
    $scope.day = 'day';
    $scope.month = 'month';

    $scope.getTime = function (time) {
        $scope.time = time;

        $scope.lineLabels = [];
        $scope.lineData = [];

        $http.get('/api/v1/urls/' + $routeParams.shortUrl + '/' + time)
            .success(function (data) {
                if (data.error !== undefined) {
                    // Error
                    return;
                }

                console.log(data);
                data.forEach(function (item) {
                    var legend = '';
                    if (time === 'hour') {
                        if (item._id.minute < 10) {
                            item._id.minute = '0' + item._id.minute;
                        }
                        legend = item._id.hour + ':' + item._id.minute;
                    } else if (time === 'day') {
                        legend = item._id.hour + ':00';
                    } else if (time === 'month') {
                        legend = item._id.month + '/' + info._id.day;
                    }

                    $scope['lineLabels'].push(legend);
                    $scope['lineData'].push(item.count);
                });
            });
    };

    // By default, we show the data for every hour
    $scope.getTime('hour');
    
    var renderChart = function (chart, info) {
        $scope[chart + 'Labels'] = [];
        $scope[chart + 'Data'] = [];

        $http.get('/api/v1/urls/' + $routeParams.shortUrl + '/' + info)
            .success(function (data) {
                if (data.error !== undefined) {
                    // Error
                    return;
                }

                console.log(data);
                data.forEach(function (item) {
                    $scope[chart + 'Labels'].push(item._id);
                    $scope[chart + 'Data'].push(item.count);
                });
            });
    };

    renderChart('refererChart', 'referer');
    renderChart('countryChart', 'country');
    renderChart('platformChart', 'platform');
    renderChart('browserChart', 'browser');
}]);
