
const authLink = "https://www.strava.com/oauth/token"
let sequentialReds = ["#fff5f0","#fff4ef","#fff4ee","#fff3ed","#fff2ec","#fff2eb","#fff1ea","#fff0e9","#fff0e8","#ffefe7","#ffeee6","#ffeee6","#ffede5","#ffece4","#ffece3","#ffebe2","#feeae1","#fee9e0","#fee9de","#fee8dd","#fee7dc","#fee6db","#fee6da","#fee5d9","#fee4d8","#fee3d7","#fee2d6","#fee2d5","#fee1d4","#fee0d2","#fedfd1","#feded0","#feddcf","#fedccd","#fedbcc","#fedacb","#fed9ca","#fed8c8","#fed7c7","#fdd6c6","#fdd5c4","#fdd4c3","#fdd3c1","#fdd2c0","#fdd1bf","#fdd0bd","#fdcfbc","#fdceba","#fdcdb9","#fdccb7","#fdcbb6","#fdc9b4","#fdc8b3","#fdc7b2","#fdc6b0","#fdc5af","#fdc4ad","#fdc2ac","#fdc1aa","#fdc0a8","#fcbfa7","#fcbea5","#fcbca4","#fcbba2","#fcbaa1","#fcb99f","#fcb89e","#fcb69c","#fcb59b","#fcb499","#fcb398","#fcb196","#fcb095","#fcaf94","#fcae92","#fcac91","#fcab8f","#fcaa8e","#fca98c","#fca78b","#fca689","#fca588","#fca486","#fca285","#fca183","#fca082","#fc9e81","#fc9d7f","#fc9c7e","#fc9b7c","#fc997b","#fc987a","#fc9778","#fc9677","#fc9475","#fc9374","#fc9273","#fc9071","#fc8f70","#fc8e6f","#fc8d6d","#fc8b6c","#fc8a6b","#fc8969","#fc8868","#fc8667","#fc8565","#fc8464","#fb8263","#fb8162","#fb8060","#fb7f5f","#fb7d5e","#fb7c5d","#fb7b5b","#fb795a","#fb7859","#fb7758","#fb7657","#fb7455","#fa7354","#fa7253","#fa7052","#fa6f51","#fa6e50","#fa6c4e","#f96b4d","#f96a4c","#f9684b","#f9674a","#f96549","#f86448","#f86347","#f86146","#f86045","#f75e44","#f75d43","#f75c42","#f65a41","#f65940","#f6573f","#f5563e","#f5553d","#f4533c","#f4523b","#f4503a","#f34f39","#f34e38","#f24c37","#f24b37","#f14936","#f14835","#f04734","#ef4533","#ef4433","#ee4332","#ed4131","#ed4030","#ec3f2f","#eb3d2f","#eb3c2e","#ea3b2d","#e93a2d","#e8382c","#e7372b","#e6362b","#e6352a","#e5342a","#e43229","#e33128","#e23028","#e12f27","#e02e27","#df2d26","#de2c26","#dd2b25","#dc2a25","#db2924","#da2824","#d92723","#d72623","#d62522","#d52422","#d42321","#d32221","#d22121","#d12020","#d01f20","#ce1f1f","#cd1e1f","#cc1d1f","#cb1d1e","#ca1c1e","#c91b1e","#c71b1d","#c61a1d","#c5191d","#c4191c","#c3181c","#c2181c","#c0171b","#bf171b","#be161b","#bd161a","#bb151a","#ba151a","#b91419","#b81419","#b61419","#b51319","#b41318","#b21218","#b11218","#b01218","#ae1117","#ad1117","#ac1117","#aa1017","#a91016","#a71016","#a60f16","#a40f16","#a30e15","#a10e15","#a00e15","#9e0d15","#9c0d14","#9b0c14","#990c14","#970c14","#960b13","#940b13","#920a13","#900a13","#8f0a12","#8d0912","#8b0912","#890812","#870811","#860711","#840711","#820711","#800610","#7e0610","#7c0510","#7a0510","#78040f","#76040f","#75030f","#73030f","#71020e","#6f020e","#6d010e","#6b010e","#69000d","#67000d"]
let brightReds = sequentialReds.slice(0,223)
let reversedReds = brightReds.reverse();
function speedColor(num) {
    return  reversedReds[Math.round(num)];
}

function numToMins(num) {
    return Math.floor(num) + ":" +  Math.round(((num % 1)*6000)/100);
}

console.log(sequentialReds.length)
function reAuthPersonal(){
    fetch(authLink, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: '54733',
            client_secret: '94390e3fb81c4de14d55c4983dc20388cbe628ef',
            refresh_token: '0cec6481e41265ed524b13a27262b3a4a74ee797',
            grant_type: 'refresh_token'
        })
    })
    .then(response => response.json())
        .then(response => getActivities(response))
}

function getActivities(res) {
    const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}&per_page=200`;
    fetch(activities_link)
        .then(res => res.json())
        .then(activityData => {
            console.log(activityData.length)
            console.log(activityData)
            let paceArr = []
            for(let i = 0; i < activityData.length; i ++){
                let distance = activityData[i].distance;
                let time = activityData[i].moving_time;
                paceArr.push([new Date(activityData[i].start_date), paceConverter(distance, time)])
            }
            console.log(paceArr)

            function paceConverter(m, s){
                return (s / 60) / (m * 0.000621371192)
            }
        
            function weeksInMonth(month) {
                let m = d3.timeMonth.floor(month)   //first day of month
                return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
                //returns length of all weeks b/t first day of this month and first day of next month
            }

            let minDate = d3.min(paceArr, (d) => new Date(d[0]))
            let maxDate = d3.max(paceArr, (d) => new Date(d[0]))
        
            const cellMargin = 2;
            const cellSize = 20;

            //https://github.com/d3/d3-time-format
            let day = d3.timeFormat("%w"),
            week = d3.timeFormat("%U"),
            format = d3.timeFormat("%Y-%m-%d"),
            titleFormat = d3.utcFormat("%a, %m-%d"),
            monthName = d3.timeFormat("%B"),
            months = d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);
            //minDate returns the smallest date, maxDate returns the largest date 
            console.log(months);    //returns the first day of everymonth in range
            const canvas = d3.select("#graph")
                                //svg for each month
                                .selectAll("svg")
                                .data(months)
                                .enter()
                                .append("svg")
                                .attr("class", "month")
                                .attr("height", ((cellSize * 7) + (cellMargin * 8) + 20))
                                .attr("width", function(d) {
                                    let columns = weeksInMonth(d);
                                    console.log(columns)
                                    return ((cellSize * columns) + cellMargin * (columns + 1));
                                })
                                .append("g")
            canvas.append("text")
                    .attr("class", "month-name")
                    .attr("y", (cellSize * 7) + (cellMargin * 8) + 15 )
                    .attr("x", function(d) {
                        var columns = weeksInMonth(d);
                        return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
                    })
                    .attr("text-anchor", "middle")
                    .text((d) => monthName(d))
            let rect = canvas.selectAll("rect.day")
                            //dataset is Array of the first days of every month
                            .data(function(d,i) {
                                console.log(d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)))
                                return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1))
                            })
                            .enter()
                            .append("rect")
                            .attr("class", "day")
                            .attr("width", cellSize).attr("height", cellSize)
                            .attr("rx", 3).attr("ry", 3)
                            .attr("fill", '#eaeaea')
                            .attr("y", (d) => (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin)
                            .attr("x", (d) => ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin)
                            .on("mouseover", function(d) {
                                d3.select(this).classed('hover', true)
                            })
                            .on("mouseout", function(d) {
                                d3.select(this).classed('hover', false);
                            })
                            .datum(format)
            rect.append("title")
                .text((d) => titleFormat(new Date(d)))
            
            var lookup = d3.nest()
                            .key((d) => format(new Date(d[0])))
                            .rollup(function(d) { return d3.mean(d, (d) => d[1])})
                            .object(paceArr)
            console.log(lookup)
            console.log(Object.values(lookup))
            //object with dates as properties and speed as values
            //d3.extent(Object.values(lookup))
             var scale = d3.scaleLinear()
                             .domain(d3.extent(Object.values(lookup)))
                             .range([0,255]);
            rect.filter(function(d) {
                    //console.log(d in lookup); 
                    return d in lookup;
                })
                .style("fill", function(d) { 
                    //console.log(`${d} ${scale(lookup[d])}`);
                    return speedColor(scale(lookup[d])); 
                })
                .select("title")
                .text(function(d) { return titleFormat(new Date(d)) + " " +  numToMins(lookup[d]); });    
    });
}        

reAuthPersonal()