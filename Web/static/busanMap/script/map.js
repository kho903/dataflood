function busan_map(_mapContainerId, _spots, dict_a, dict_b, dict_c) {
    var WIDTH, HEIGHT,
        CENTERED,
        MAP_CONTAINER_ID = _mapContainerId,
        busan = 'busan_sig'; // 부산 지도 정보가 들어있는 json파일 import

     // 변수 지정
    var projection, path, svg,
        geoJson, features, bounds, center,
        map;
    
    // d3.js 생성 
    function create(callback) {
        // 지도 크기 지정
        HEIGHT = window.innerHeight;
        WIDTH = 1200;

        projection = d3.geoMercator().translate([WIDTH / 2, HEIGHT / 2]);
        path = d3.geoPath().projection(projection);

        // d3를 이용하여 svg 요소 생성
        svg = d3.select(MAP_CONTAINER_ID).append("svg")
            .attr("width", WIDTH)
            .attr("height", HEIGHT);

        map = svg.append("g").attr("id", "map");

        d3.json(BUSAN_JSON_DATA_URL).then(function (_data) {
            geoJson = topojson.feature(_data, _data.objects[busan]);
            features = geoJson.features;

            bounds = d3.geoBounds(geoJson);
            center = d3.geoCentroid(geoJson);

            var distance = d3.geoDistance(bounds[0], bounds[1]);
            var scale = HEIGHT / distance / Math.sqrt(2) * 1.2;

            projection.scale(scale).center(center);

            map.selectAll("path")
                .data(features)
                .enter().append("path")

                .attr("class", function (d) {
                    return "municipality c " + d.properties.SIG_KOR_NM;
                })
                .attr("d", path)
                .on("click", province_clicked_event);

            // 지도 위에 구 이름 표시
            map.selectAll("text")
                .data(features)
                .enter().append("text")
                .attr("transform", function (d) {
                    return "translate(" + path.centroid(d) + ")";
                })
                .attr("dy", ".35em")
                .attr("class", "municipality-label")
                .text(function (d) {
                    return d.properties.SIG_KOR_NM;
                });

            callback();
        });
    }

    // 지도 위 circle 표시
    function spotting_on_map() {
        var circles = map.selectAll("circle")
            .data(_spots).enter()
            .append("circle")
            .attr("class", "spot")
            .attr("cx", function (d) {
                // 표시할 x 좌표
                return 100;
            })
            .attr("cy", function (d, i) {
                // 표시할 y 좌표
                return [290, 320, 350][i];
            })
            .attr("r", "10px")
            .attr("fill", function (d, i) {
                // circle 색 지정
                return ["rgb(109,177,0)", "rgb(0, 99, 132)", "rgb(255,0,9)"][i]
            })
            .on('click', spot_clicked_event)
            .transition()
            .ease(d3.easeElastic);
    }

    // circle 클릭 이벤트 
    // 각 구 별로 불투수면, 펌프, 침수빈도 표시
    function spot_clicked_event(d, p) {
        var color;
        var each_level;
        
        // color = d3.scleLinear() 함수는 range(시작색, 끝색) 으로 각각 100단계로 쪼개서 각각의 색을 지정

        switch (p) {
            case 0:
                color = d3.scaleLinear()
                    .domain([0, 100])
                    .range(["rgb(241,255,200)", "rgb(109,177,0)"]);
                break;
            case 1:
                color = d3.scaleLinear()
                    .domain([0, 100])
                    .range(["rgb(184, 237, 255)", "rgb(0, 99, 132)"]);
                break;
            case 2:
                color = d3.scaleLinear()
                    .domain([0, 100])
                    .range(["rgb(255, 240, 243)", "rgb(255,0,9)"]);
                break;
        }

        map.selectAll("path")
            .data(features)
            .attr("style", function (d, i) {
                switch (p) {
                    case 0:
                        each_level = dict_a[d.properties.SIG_KOR_NM] * 130;
                        break;
                    case 1:
                        each_level = dict_b[d.properties.SIG_KOR_NM] * 300000000;
                        break;
                    case 2:
                        each_level = dict_c[d.properties.SIG_KOR_NM] * 500;
                        break;
                }

                return "fill: " + color(Math.ceil(each_level));
            })
    }

    // 클릭시 확대 이벤트
    function province_clicked_event(d) {
        var x, y, zoomLevel;

        if (d && CENTERED != d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            if (d.properties.SIG_KOR_NM == '강서구' || d.properties.SIG_KOR_NM == '기장군')
                zoomLevel = 1.5;
            else
                zoomLevel = 2;
            CENTERED = d;
        } else {
            x = WIDTH / 2;
            y = HEIGHT / 2;
            zoomLevel = 1;
            CENTERED = null;
        }

        map.selectAll("path")
            .classed("active", CENTERED && function (d) {
                return d === CENTERED;
            });

        map.transition()
            .duration(750)
            .attr("transform", "translate(" + WIDTH / 2 + "," + HEIGHT / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / zoomLevel + "px");
    }

    create(function () {
        spotting_on_map();
    });

}