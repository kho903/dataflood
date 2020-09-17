function busan_dong_map(_mapContainerId, _spots, dict_0, dict_1, dict_2, dict_3) {
    var WIDTH, HEIGHT,
        CENTERED,
        MAP_CONTAINER_ID = _mapContainerId,
        busan = 'emd';

    var projection, path, svg,
        geoJson, features, bounds, center,
        map, places;

    function create(callback) {
        HEIGHT = window.innerHeight;
        WIDTH = 1200;

        projection = d3.geoMercator().translate([WIDTH / 2, HEIGHT / 2]);
        path = d3.geoPath().projection(projection);

        svg = d3.select(MAP_CONTAINER_ID).append("svg")
            .attr("width", WIDTH)
            .attr("height", HEIGHT);

        map = svg.append("g").attr("id", "map");
        places = svg.append("g").attr("id", "places");


        d3.json(BUSAN_JSON_DATA_URL).then(function (_data) {
            geoJson = topojson.feature(_data, _data.objects[busan]);
            features = geoJson.features;

            bounds = d3.geoBounds(geoJson);
            center = d3.geoCentroid(geoJson);

            var distance = d3.geoDistance(bounds[0], bounds[1]);
            var scale = HEIGHT / distance / Math.sqrt(2) * 1.2;

            projection.scale(scale).center(center);

            // tooltip 생성(map 각 동별로 hover 시 동 이름 띄우기)
            var tooltip = d3.select("#map").append("g")
                .attr('class', 'hidden tooltip');

            map.selectAll("path")
                .data(features)
                .enter().append("path")
                .attr('class', function (d) {
                    return 'province ' + d.properties.EMD_KOR_NM;
                })
                .attr('d', path)
                .on('mousemove', function (d) {
                    var mouse = d3.mouse(svg.node()).map(function (d) {
                        return parseInt(d);
                    });
                    // tooltip 위치 지정
                    tooltip.classed('hidden', false)
                        .attr('style', 'left:' + (mouse[0] + 35) +
                            'px; top:' + (mouse[1] - 35) + 'px')
                        .text(d.properties.EMD_KOR_NM);
                })
                .on('mouseout', function () {
                    tooltip.classed('hidden', true);
                })
                .attr("class", function (d) {
                    return "municipality c " + d.properties.EMD_KOR_NM;
                })
                .attr("d", path)
                .on("click", province_clicked_event)
            // 지도 애니메이션 duration() 시간별로 색깔 각각 지정 후 main.html 에서
            // 받아온 각 딕셔너리별로 each_level을 정해서 색 변경
            // color = d3.scleLinear() 함수는 range(시작색, 끝색) 으로 각각 100단계로 쪼개서 각각의 색을 지정
            // each_level = dict_**[d.properties.EMD_KOR_NM] 뒤에 수치를 곱하여 [0, 100]단위로 임의 정규화

            callback();
        });
    }

    // 지도 위 circle 표시
    function spotting_on_map() {
        var circles = map.selectAll("circle")
            .data(_spots).enter()
            .append("circle")
            .attr("class", "spot")
            .attr("cx", function (d, i) {
                return [
                // 표시할 x 좌표
                    100, 145, 190, 235
                ][i];
            })
            .attr("cy", function (d, i) {
                return [
                // 표시할 y 좌표
                    230, 230, 230, 230
                ][i] - 80;
            })
            .attr("r", "20px")
            .attr("fill", function (d, i) {
                // circle 색 지정
                return ["brown", "rgb(0, 99, 132)", "rgb(77, 11, 88)", "rgb(109,177,0)"][i]
            })
            .on('click', spot_clicked_event)
            .transition()
            .ease(d3.easeElastic);

        map.selectAll("text")
            .append("circle")
            .data(_spots).enter()
            .append("text")
            .attr("dx", function (d, i) {
                return [
                    // 표시할 x 좌표
                    100, 145, 190, 235
                ][i] - 3;
            })
            .attr("dy", function (d, i) {
                return [
                    // 표시할 y 좌표
                    230, 230, 230, 230
                ][i] - 79;
            })
            .attr("class", "spot")
            .style('fill', 'white')
            .style('font-size', '12px')
            .text(function (d, i) {
                if (i === 0)
                    return "0";
                else if (i === 1)
                    return "1";
                else if (i === 2)
                    return "2";
                else if (i === 3)
                    return "3";
            })
    }

    // circle 클릭 이벤트
    // 현재, +1시간, +2시간, +3시간 후 예상 침수 위험도 표시
    function spot_clicked_event(d, p) {
        var color;
        var each_level;
        // color = d3.scleLinear() 함수는 range(시작색, 끝색) 으로 각각 100단계로 쪼개서 각각의 색을 지정

        switch (p) {
            case 0:
                color = d3.scaleLinear()
                    .domain([0, 100])
                    .range(["#f2dfd3", "#964b00"]);
                break;
            case 1:
                color = d3.scaleLinear()
                    .domain([0, 100])
                    .range(["rgb(184, 237, 255)", "rgb(0, 99, 132)"]);
                break;
            case 2:
                color = d3.scaleLinear()
                    .domain([0, 100])
                    .range(["rgb(250, 219, 255)", "rgb(77, 11, 88)"]);
                break;
            case 3:
                color = d3.scaleLinear()
                    .domain([0, 100])
                    .range(["rgb(241,255,200)", "rgb(109,177,0)"]);
                break;
        }
        a = document.getElementById('title');
        map.selectAll("path")
            .data(features)
            .attr("style", function (d, i) {
                switch (p) {
                    case 0:
                        each_level = dict_0[d.properties.EMD_KOR_NM] * 100;
                        a.innerHTML = year + ' 년 ' + month + ' 월 ' + day + ' 일 ' + hour + " : " + minute + " 기준 데이터"
                        break;
                    case 1:
                        each_level = dict_1[d.properties.EMD_KOR_NM] * 100;
                        a.innerHTML = year + ' 년 ' + month + ' 월 ' + day + ' 일 ' + hour + " : " + minute + " 기준 +1시간 데이터"
                        break;
                    case 2:
                        each_level = dict_2[d.properties.EMD_KOR_NM] * 100;
                        a.innerHTML = year + ' 년 ' + month + ' 월 ' + day + ' 일 ' + hour + " : " + minute + " 기준 +2시간 데이터"
                        break;
                    case 3:
                        each_level = dict_3[d.properties.EMD_KOR_NM] * 100;
                        a.innerHTML = year + ' 년 ' + month + ' 월 ' + day + ' 일 ' + hour + " : " + minute + " 기준 +3시간 데이터"
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
            zoomLevel = 1.5;
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
            .duration(450)
            .attr("transform", "translate(" + WIDTH / 2 + "," + HEIGHT / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / zoomLevel + "px");
    }

    create(function () {
        spotting_on_map();
    });
}