'use strict';

angular.module('v2App')
  .controller('MainCtrl', function ($scope, $http, $q) {

    $scope.query = {
            keywords : 'forest',
            size : 25
        };

    $scope.limiters = {
        type: [],
        subject: [],
        dateBefore: [],
        dateAfter: []
    }

    var queryOpts = {
        key: '1068fc55492c7f63c961485c136ee67f',
        url: 'http://api.dp.la/v2/items?q=',
        facets: 'sourceResource.date.begin,sourceResource.subject.name,sourceResource.type,sourceResource.spatial.name'
    };


    
    $scope.search = function() {

        $scope.loading = true;

            var apiCall = queryOpts.url 
                    + $scope.query.keywords
                    + "&sourceResource.type=" + $scope.limiters.type.toString()
                    + "&sourceResource.subject=" + $scope.limiters.subject.toString()
                    + "&page_size=" + $scope.query.size
                    + '&facets=' + queryOpts.facets
                    + "&callback=JSON_CALLBACK" 
                    + '&api_key=' + queryOpts.key;

        console.log('apicall', apiCall);


        $http.jsonp(apiCall).
             success(function(data, status, headers, config) {

                $scope.loading = false;
              
                var d = data;
                console.log(d);

                $scope.count = d.count;


                $scope.results = d.docs;

                $scope.aggs = {

                    type : d.facets['sourceResource.type'],
                    subject : d.facets['sourceResource.subject.name'],
                    date : d.facets['sourceResource.date.begin'].entries
                }

                // console.log($scope.aggs.date);

             }).
             error(function(data, status, headers, config) {

                $scope.loading = false;

                $scope.error = true;

             });
    }

    // add & remove filters

    $scope.addTypeFilter = function(filter) {
        if($scope.limiters.type.indexOf(filter) < 0 ){
            $scope.limiters.type.push(filter);
            $scope.search();
        }
    }

    $scope.rmTypeFilter = function(filter) {
        var i = $scope.limiters.type.indexOf(filter);
        if (i < 0) { return; } else {
            $scope.limiters.type.splice(i,1);
            $scope.search();
        }
    }

    $scope.addSubjFilter = function(filter) {
        if($scope.limiters.type.indexOf(filter) < 0 ){
            $scope.limiters.subject.push(filter);
            $scope.search();
        }
    }

    $scope.rmSubjFilter = function(filter) {
        var i = $scope.limiters.subject.indexOf(filter);
        if (i < 0) { return; } else {
            $scope.limiters.subject.splice(i,1);
            $scope.search();
        }
    }

    // pass data from child directives (d3)
    $scope.onClick = function(data){
        $scope.$apply(function(){
            data
        });
    }

    $scope.search();
  });


