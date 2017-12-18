var ethnicityChart = dc.rowChart("#ethnicity-chart");
var entryStatusChart = dc.rowChart("#entry-status-chart"); //entryStatus
var gradStatusChart = dc.pieChart("#grad-status-chart"); //gradStatus
var genderChart = dc.pieChart("#gender-chart");//gender
var hourChart = dc.pieChart("#hour-chart");//hour
 var yearChart = dc.lineChart("#year-chart"); //year
 var seriesChart = dc.seriesChart("#series-chart");

d3.csv("kp.csv", function (error, csv) {
    var data = crossfilter(csv);
    var all = data.groupAll();

    // Formatting helpers
    var parseDate = d3.time.format('%Y');
    var numFormat = d3.format(",");

    // format the data
    csv.forEach(function (d){
        d.censusYear = parseDate.parse(d.year);
        });

    // define the dimensions and groups to be used by the charts
    var ethnicities = data.dimension(function (d) { return d.raceEthnicity; });
    var ethnicityCount = ethnicities.group().reduceSum(function(d) { return d.count; });

    var entryStatuses = data.dimension(function (d) { return d.entryStatus; });
//        var entryStatuses = ['Preschool','1st-4th','5th-6th','7th-8th','9','10','11','12','HS Grad','Assoc. voc','Assoc. acdm','Some college','Prof school','Bachelors','Masters','Doctorate'];
  var entryStatusCount = entryStatuses.group().reduceSum(function(d) { return d.count; });
    var gradStatuses = data.dimension(function (d) { return d.undergradStatus; });
    var gradStatusCount = gradStatuses.group().reduceSum(function(d) { return d.count; });

    var genders = data.dimension(function (d) { return d.gender; });
    var genderCount = genders.group().reduceSum(function(d) { return d.count; });

  var hours = data.dimension(function (d) { return d.hour; });
    var hourCount = hours.group().reduceSum(function(d) { return d.count; });

    var censusYears = data.dimension(function (d) { return d.censusYear; });
    var censusYearCount = censusYears.group().reduceSum(function(d) { return d.count; });

    var ethnicitiesByYear = data.dimension(function (d) { return [d.raceEthnicity,d.censusYear]; });
    var ethnicitiesByYearCount = ethnicitiesByYear.group().reduceSum(function(d) { return d.count; });

        // tooltips
        var pieTip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function (d) { return "<span style='color: #f0027f'>" +  d.data.key + "</span> : "  + numFormat(d.value); });

        var barTip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function (d) { return "<span style='color: #c6dbef'>" + d.key + "</span> : " + numFormat(d.value);});

        var seriesTip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function (d) { return "<span style='color: #c6dbef'>" + d.data.key[0] + " ("+ parseDate(d.data.key[1]) + ")" + "</span> : " + numFormat(d.data.value);});

        var areaTip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function (d) { return "<span style='color: #c6dbef'>" + parseDate(d.data.key) + "</span> : " + numFormat(d.data.value);});


        // the records count
        dc.dataCount("#data-count-top")
                .dimension(data)
                .group(all);

        // the ethnicity chart
        ethnicityChart.width(500)
                .height(260)
                .margins({top: 10, right: 100, bottom: 30, left: 120})
                .transitionDuration(1000)
                .dimension(ethnicities)
                .group(ethnicityCount)
                .ordinalColors(["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666","#49006a"])
                    // ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"])
                .labelOffsetX([-8])
                .labelOffsetY([15])
                .title(function () { return ""; })
                .elasticX(true)
                .xAxis().ticks(4);

//       var names = ["Preschool", "1st-4th", "5th-6th", "7th-8th", "9th", "10th", "11th", "12th", "HS-grad", "Assoc-voc", "Assoc-acdm", "Some-college", "Prof-school", "Bachelors", "Masters", "Doctorate"];
        // the entry status chart
        entryStatusChart.width(500)
                .height(260)
                .margins({top: 10, right: 40, bottom: 30, left: 120})
                .transitionDuration(1000)
                .dimension(entryStatuses)
                .group(entryStatusCount)
                .ordinalColors(['rgb(34, 94, 168)'])

                    // ['rgb(127,205,187)','rgb(65,182,196)','rgb(29,145,192)','rgb(34,94,168)','rgb(37,52,148)','rgb(8,29,88)'])
                .labelOffsetX([-8])
                .labelOffsetY([8])
                .title(function () { return ""; })
                .elasticX(true)
                .xAxis().ticks(4);

        // the grad status chart
        gradStatusChart.width(400)
                .height(200)
//             				.margins({top: 0, right: 0, bottom: 0, left: 50})
                .transitionDuration(1000)
                .radius(80)
                .innerRadius(40)
                .dimension(gradStatuses)
                .group(gradStatusCount)
                .ordinalColors(["#92c5de","#2166ac"])
                .title(function () { return ""; })
                .legend(dc.legend().x(50).y(0))
                .renderLabel(false);;

        // the gender chart
        genderChart.width(400)
                .height(200)
//             				.margins({top: 0, right: 0, bottom: 0, left: 500})
                .transitionDuration(1000)
                .radius(80)
                .innerRadius(40)
                .dimension(genders)
                .group(genderCount)
                .title(function () { return ""; })
                .ordinalColors(["#9ecae1","#2171b5"])
                //.ordinalColors(["#5254a3","#6b6ecf","#9c9ede","#637939","#e7cb94","#843c39", "#bfd3e6","#ad494a","#d6616b","#e7969c","#7b4173","#a55194","#ce6dbd","#de9ed6"])
                // .colors(["#e7298a","#ce1256", "#f768a1","#dd3497","#e78ac3","#f1b6da","#c51b7d"])
                // .colorDomain([1,29])
                // .colorAccessor(function (d) {return d.ugArea;})
                .legend(dc.legend().x(50).y(0))
                .renderLabel(false);

  //the hour chart
              hourChart.width(400)
                .height(200)
                .transitionDuration(1000)
                .radius(80)
                .innerRadius(40)
                .dimension(hours)
                .group(hourCount)
                .title(function () { return ""; })
                .ordinalColors(["#9ecae1","#2171b5"])
                .legend(dc.legend().x(50).y(0))
                .renderLabel(false);

        // the area time series
        yearChart.width(0)
                .height(0)
                .margins({top: 0, right: 0, bottom: 0, left: 0})
                .transitionDuration(1000)
                .dimension(censusYears)
                .group(censusYearCount)
                .elasticY(false)
                .brushOn(false)
                .ordinalColors(["steelblue"])
                .x(d3.time.scale().domain([new Date(1983, 01, 01), new Date(2013, 12, 31)]))
                .xUnits(d3.time.years)
                 .renderHorizontalGridLines(true)
                 .renderArea(true)
                 .title(function (d) { return d.key[0] + " ("+ parseDate(d.key[1]) + ") "  + numFormat(d.value); })
                 .title(function () { return ""; })
                .filterPrinter(function (filters) {
                    var filter = filters[0], s = "";
                    var dateObj = new Date(filter[0]);
                    s += (dateObj.getFullYear() + 1) + " - " + parseDate(filter[1]);
                    return s;
                })
                 .yAxis().ticks(5);

        // the series chart
        seriesChart.width(0)
                .height(0)
                .margins({top: 0, right: 0, bottom: 0, left: 0})
                .transitionDuration(1000)
                .dimension(ethnicitiesByYear)
                .group(ethnicitiesByYearCount)
                .elasticY(true)
                .brushOn(false)
                .ordinalColors(["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666","#49006a"])
                .x(d3.time.scale().domain([new Date(1983, 01, 01), new Date(2013, 12, 31)]))
                .chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
                .seriesAccessor(function(d) {return d.key[0];})
                .keyAccessor(function(d) {return +d.key[1];})
                .valueAccessor(function(d) {return +d.value;})
                .xUnits(d3.time.years)
                 .renderHorizontalGridLines(true)
                .filterPrinter(function (filters) {
                    var filter = filters[0], s = "";
                    var dateObj = new Date(filter[0]);
                    s += (dateObj.getFullYear() + 1) + " - " + parseDate(filter[1]);
                    return s;
                })
                 .title(function () { return ""; })
                 .legend(dc.legend().x(450).y(40).itemHeight(13).gap(5).horizontal(1).legendWidth(150).itemWidth(150))
                 .yAxis().ticks(5);

        // the second record count
        dc.dataCount("#data-count-bottom")
                .dimension(data)
                .group(all);

        // the data table
        dc.dataTable(".dc-data-table")
                            .dimension(entryStatuses)
                            .group(function (d) {
                                return d.entryStatus;
                            })
                            .size(170)
                            .columns([
                                function (d) { return d.undergradStatus; },
                                function (d) { return d.entryStatus; },
                                function (d) { return d.raceEthnicity; },
                                function (d) { return d.gender; },
        function (d) { return d.email; }
                                //function (d) { return d.year; },
                                //function (d) { return d.count; }
                            ])
                            .sortBy(function (d) {
                                return d.raceEthnicity;
                            })
                            .order(d3.ascending)
                            .renderlet(function (table) {
                                table.selectAll(".dc-table-group").classed("info", true);
                            });

         dc.renderAll();

         // set up the tool tips
            d3.selectAll(".pie-slice").call(pieTip);
            d3.selectAll(".pie-slice").on('mouseover', pieTip.show)
                .on('mouseout', pieTip.hide);

            d3.selectAll("g.row").call(barTip);
            d3.selectAll("g.row").on('mouseover', barTip.show)
                .on('mouseout', barTip.hide);

            d3.selectAll("#series-chart circle.dot").call(seriesTip);
            d3.selectAll("#series-chart circle.dot")
                .on('mouseover.foo', seriesTip.show)
                .on('mouseout.foo', seriesTip.hide);


            d3.selectAll("#year-chart circle.dot").call(areaTip);
            d3.selectAll("#year-chart circle.dot")
                .on('mouseover.bar', areaTip.show)
                .on('mouseout.bar', areaTip.hide);
});
