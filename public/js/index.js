$(document).ready(function () {

    let btn = $("#weatherBtn"),
        inputVal = $("#weatherInput");


    $(".form").on("submit", (e) => {
        e.preventDefault();
    });

    function getDateStr(params, arr) {
        var i, response,
            list = arr === "" || arr === undefined ? ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"] : arr;
        if (!typeof list) {
            return "Type Must Be An Array";
        }

        for (i = 0; i < list.length; i++) {
            if (i === params - 1) {
                response = list[i];
            }
        }
        return response;
    }

    function template(res) {
        //Get Location
        let {
            name,
            region,
            country,
            lat,
            lon,
            townId,
            localtime,
            localtime_epoch
        } = res.location;

        // Get current weather
        let {
            humidity,
            cloud,
            temp_c,
            wind_dir,
            condition,
            wind_kph,
            feelslike_c
        } = res.current;

        if (res !== undefined) {
            let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let [date, time] = localtime.split(" ");
            let [y, m, d] = date.split("-");
            let [h, mm] = time.split(":");
            Time = `${d} ${getDateStr(m, month)}, ${y} - ${h % 12}:${mm}`;
            let Img = "https://source.unsplash.com/1200x900/?" + name;


            //Header
            $("[app-temp]").text(Math.round(temp_c));
            $("[app-region]").text(name);
            $('[app-weather-text]').text(condition.text);
            $('[app-localtime]').text(Time);
            $("[app-icon]").attr("src", condition.icon);
            $("[app-wind-speed]").text("'" + Math.round(wind_kph));
            $("[app-name='base']").css("background-image", "url('" + Img + "')")
            $("[app-banner]").attr("src", Img)

            // Append weather details
            $("[app-cloudy]").text(`${cloud}%`)
            $("[app-humidity]").text(`${humidity}%`);
            $("[app-direction]").text(wind_dir);
            $("[app-feels_like]").text(Math.round(feelslike_c));

            // Append weather location
            $("[app-location-name]").text(name);
            $("[app-location-region]").text(region);
            $("[app-location-country]").text(country);
            $("[app-location-lat]").text(lat);
            $("[app-location-lon]").text(lon);
        }
    }


    function fetchWeather(val) {
        $.ajax({
            url: "/cityRequest",
            method: "POST",
            data: {
                city: val
            },
            dataType: "json",
            success: function (e) {
                if (e.error === undefined) {
                    template(e);
                    inputVal.val("");

                } else {
                    swal({
                        icon: "error",
                        title: "Something went wrong",
                        text: e.error,
                        dangerMode: true
                    })
                }
            },
            error: function (err, status) {
                if (status === "error") {
                    swal({
                        title: "Service seems not to be available available",
                        text: err.statusText,
                        icon: "error"
                    })
                }
            }
        });
    }



    btn.on("click", (e) => {
        e.preventDefault();
        let txtVal = inputVal.val().trim();

        if (txtVal !== "") {
            fetchWeather(txtVal);
        } else {
            swal({
                title: "Warning",
                icon: "warning",
                text: "You can't submit an empty field"
            }).then(() => {
                inputVal.trigger("focus")
            });
        }


    });

    fetchWeather("Abuja");
})