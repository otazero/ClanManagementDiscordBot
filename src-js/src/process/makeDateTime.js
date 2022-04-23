/* よく使う日付関係を返すclass */
class nowDateTime{
    //指定しなければ現在時刻
    constructor(dt = new Date()){
        // 日本の時間に修正
        dt.setTime(dt.getTime() + 32400000); // 1000 * 60 * 60 * 9(hour)
        // 日付を数字として取り出す
        let year  = dt.getFullYear();
        let month = dt.getMonth()+1;
        let day   = dt.getDate();
        let hour  = dt.getHours();
        let min   = dt.getMinutes();
        let sec   = dt.getSeconds();
        // 値が1桁であれば '0'を追加 
        if (month < 10) {
            month = '0' + month;
        }
        if (day   < 10) {
            day   = '0' + day;
        }
        if (hour   < 10) {
            hour  = '0' + hour;
        }
        if (min   < 10) {
            min   = '0' + min;
        }
        if (sec   < 10){
            sec   = '0' + sec;
        }
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.min = min;
        this.sec = sec;
    }

    getMonth(){
        return this.month;
    }

    getDate(){
        return this.year + '-' + this.month + '-' +this.day;
    }

    getDateTime(){
        return this.year + '-' + this.month + '-' +this.day + ' ' + this.hour + ':' + this.min + ':' + this.sec;
    }
}

module.exports = nowDateTime;