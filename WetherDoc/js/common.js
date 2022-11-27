let lat = 0;
let lng = 0;

  // 対応している場合
  if( navigator.geolocation )
  {
    navigator.geolocation.getCurrentPosition(

      function( position )
      {
        // 取得した位置情報データの整理
        var data = position.coords;
        lat = data.latitude;
        lng = data.longitude;
        document.getElementById('result').innerHTML = '<h2>緯度 : ' + lat + ' 経度 : ' + lng + '</h2>';

        // 逆ジオコーディング
        const reverseurl = 'https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat='+ lat +'&lon='+ lng;
        fetch(reverseurl)
        .then(data => data.json())
        .then(json => searchCurrentPosition(json))
         function searchCurrentPosition(json) {
          document.getElementById('addressOutput').innerHTML = '<h2>場所 :' + json.results.lv01Nm + '</h2>';
         }

        // 気温
        const url = 'https://api.open-meteo.com/v1/forecast?latitude='+ lat + '&longitude='+ lng +'&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&timezone=Asia%2FTokyo';
        fetch(url)
        .then(data => data.json())
        .then(json => drawChart(json))
          function drawChart(json) {
            const mydata = {
              labels: json.daily.time,
              datasets: 
              [{
                label: '最高気温',
                data: json.daily.temperature_2m_max,
                borderColor: 'orange',
              },
              {
                label: '最低気温',
                data: json.daily.temperature_2m_min,
                borderColor: 'lightblue',
              }]
            //   {
            //     label: '体感温度(最高)',
            //     data: json.daily.apparent_temperature_max,
            //     borderColor: 'orange',
            //   },
            //   {
            //     label: '体感温度(最低)',
            //     data: json.daily.apparent_temperature_min,
            //     borderColor: 'lightblue',
            //   }]
            }

            new Chart(document.getElementById('stage'), {
              type: 'line',
              data: mydata,
            });
          }

        // 湿度
        const humidityurl = 'https://api.open-meteo.com/v1/forecast?latitude='+ lat +'&longitude='+ lng +'&hourly=relativehumidity_2m,cloudcover&timezone=Asia%2FTokyo'
        fetch(humidityurl)
        .then(data => data.json())
        .then(json => drawHumidity(json))
          function drawHumidity(json) {
            const mydata = {
              labels: json.hourly.time,
              datasets: 
              [{
                label: '湿度',
                data: json.hourly.relativehumidity_2m,
                borderColor: 'lightblue',
                radius: 0
              },
              {
                label: '雲量',
                data: json.hourly.cloudcover,
                borderColor: 'gray',
                radius: 0
              }]
            }

            new Chart(document.getElementById('humidity'), {
              type: 'line',
              data: mydata,
            });
          }

        // 気圧
        const pressureurl = 'https://api.open-meteo.com/v1/forecast?latitude='+ lat +'&longitude='+ lng +'&hourly=pressure_msl,surface_pressure&timezone=Asia%2FTokyo'
        fetch(pressureurl)
        .then(data => data.json())
        .then(json => drawPressure(json))
          function drawPressure(json) {
            const mydata = {
              labels: json.hourly.time,
              datasets: 
              [{
                label: '気圧',
                data: json.hourly.surface_pressure,
                borderColor: 'lightblue',
                radius: 0
              },
              {
                label: '海面気圧',
                data: json.hourly.pressure_msl,
                borderColor: 'navy',
                radius: 0
              }]
            }

            new Chart(document.getElementById('pressure'), {
              type: 'line',
              data: mydata,
            });
          }
        },

        function( error ){
          // エラーコード(error.code)の番号
          // 0:UNKNOWN_ERROR				  原因不明のエラー
          // 1:PERMISSION_DENIED			利用者が位置情報の取得を許可しなかった
          // 2:POSITION_UNAVAILABLE		電波状況などで位置情報が取得できなかった
          // 3:TIMEOUT					      位置情報の取得に時間がかかり過ぎた…
          var errorInfo = [
            "原因不明のエラーが発生しました。" ,
            "位置情報の取得が許可されませんでした。" ,
            "位置情報が取得できませんでした。" ,
            "位置情報の取得がタイムアウトしました。"
          ] ;

          // エラー番号
          var errorNo = error.code ;
          var errorMessage = "[エラー番号: " + errorNo + "]\n" + errorInfo[ errorNo ] ;
          alert( errorMessage ) ;
          document.getElementById("result").innerHTML = errorMessage;
        } ,
        {
          "enableHighAccuracy": false,
          "timeout": 8000,
          "maximumAge": 2000,
        }
      ) ;
    }
    else
    {
      var errorMessage = "お使いの端末は、GeoLacation APIに対応していません。" ;
      alert( errorMessage ) ;
      document.getElementById( 'result' ).innerHTML = errorMessage ;
    }