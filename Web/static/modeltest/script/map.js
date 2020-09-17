function busan_dong_map(_mapContainerId, _spots, dict_predict) {
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
                            'px; top:' + (mouse[1] - 35) + 'px;')
                        .text(d.properties.EMD_KOR_NM);
                })
                .on('mouseout', function () {
                    tooltip.classed('hidden', true);
                })
                .attr("class", function (d) {
                    return "municipality c " + d.properties.EMD_KOR_NM;
                })
                .attr("d", path)
                .on("click", province_clicked_event);
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
                    100, 145, 190, 235, 280, 325,
                    370, 415, 460, 505, 550, 595,
                    100, 145, 190, 235, 280, 325,
                    370, 415, 460, 505, 550, 595,
                    100, 145, 190, 235
                ][i];
            })
            .attr("cy", function (d, i) {
                return [
                    // 표시할 y 좌표
                    230, 230, 230, 230, 230, 230,
                    230, 230, 230, 230, 230, 230,
                    280, 280, 280, 280, 280, 280,
                    280, 280, 280, 280, 280, 280,
                    330, 330, 330, 330
                ][i] - 80;
            })
            .attr("r", "20px")
            .attr("fill", function (d, i) {
                // 침수가 일어났던 시간 circle에만 red 색 지정
                if (i === 22 || i === 23)
                    return "red"
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
                    80, 145, 190, 235, 280, 325,
                    370, 415, 460, 505, 550, 595,
                    100, 145, 190, 235, 280, 325,
                    370, 415, 460, 505, 550, 595,
                    80, 145, 190, 235
                ][i] - 5;
            })
            .attr("dy", function (d, i) {
                return [
                    // 표시할 y 좌표
                    230, 230, 230, 230, 230, 230,
                    230, 230, 230, 230, 230, 230,
                    280, 280, 280, 280, 280, 280,
                    280, 280, 280, 280, 280, 280,
                    330, 330, 330, 330
                ][i] - 79;
            })
            .attr("class", "spot")
            .style('fill', 'white')
            .style('font-size', '12px')
            .text(function (d, i) {
                if (i === 0)
                    return "23일 0";
                else if (i === 24)
                    return "24일 0";
                else if (i >= 24)
                    return i - 24;
                else
                    return i;
            })
    }

    // circle 클릭 이벤트
    // 각각 시간별로 침수위험도 표시
    function spot_clicked_event(d, p) {
        var each_level;
        
        // color = d3.scleLinear() 함수는 range(시작색, 끝색) 으로 각각 100단계로 쪼개서 각각의 색을 지정
        var color = d3.scaleLinear()
            .domain([0, 100])
            .range(["rgb(255, 255, 255)", "rgb(255, 0, 0)"]);

        map.selectAll("path")
            .data(features)
            .attr("style", function (d, i) {
                each_level = dict_predict[p][d.properties.EMD_KOR_NM] * 100;
                return "fill: " + color(Math.ceil(each_level));
            });
        str = '2020년 7월 23일 ' + p + '시';
        if (p > 23) {
            date = '2020년 7월 24일';
            time = p - 24;
            str = date + time + '시';
        }
        a = document.getElementById('title');
        a.innerHTML = str
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

function colorchange(dict_predict, count) {
    var map = d3.select("#map");
    check = map.selectAll("path");

    check.transition().attr("style", function (d, i) {
        color = d3.scaleLinear()
            .domain([0, 100])
            .range(["rgb(255, 255, 255)", "rgb(255, 0, 0)"]);
        each_level = dict_predict[count][d.properties.EMD_KOR_NM] * 100;
        return "fill: " + color(Math.ceil(each_level));
    });
}