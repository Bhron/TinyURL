var app = angular.module('tinyUrlApp');

app.controller('homeController',
    ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.submit = function () {
        var longUrl = $scope.longUrl;
        if (!longUrl) {
            // TODO: Show some message
            return;
        }

        $http.post('/api/v1/urls', {
            longUrl: longUrl
        })
            .success(function (data) {
                $location.path('/urls/' + data.shortUrl);
            });
    }
}]);
