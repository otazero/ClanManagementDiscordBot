function timestampToTime(t){
    return new Date(t * 1000)
        .toLocaleDateString('ja', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
}
/**
 *　あらゆる時刻表記をDateTimeに変換する。
 */
class shapDatetime{
    /**
     * 
     * @param {number | string} dt 
     */
    static toDatetime(dt = new Date()){
        let datetime = '';
        switch (typeof(dt)) {
            case 'string':
                if((dt[2] === '.' && dt[5] === '.') && dt.length === 10){
                    console.log(`${dt}はイギリス式`);
                    datetime = this.#britishStyle(dt);
                }
                else if(((((dt[4] === '-' && dt[7] === '-') && dt[10] === 'T') && dt[13] === ':') && dt[16]=== ':') && (dt.length === 32)){
                    console.log(`${dt}はISO`);
                    this.#iso8061(dt);
                }
                
                break;
            
            case 'number':
                const numstr = '' + dt;
                if(numstr.length === 10){
                    console.log(`${dt}は10桁のtimestamp`);
                }
                else if (numstr.length === 13){
                    console.log(`${dt}は13桁のtimestamp`);
                }

                break;
            case 'object':
                if(dt.constructor.name === 'Date'){
                    console.log(`${dt}はDate型`);
                }
                break;
            default:
                console.log(`${dt}は...意味不明な型です`);
                break;
        }

        return datetime;
        
    }
    static #britishStyle(dt){
        let date = {year:'', month:'', day:''};
        for(let i in dt){
            if(i < 2){
                date.day += dt[i];
            }
            else if (i < 3){
                continue;
            }
            else if(i < 5){
                date.month += dt[i];
            }
            else if(i < 6){
                continue;
            }
            else{
                date.year += dt[i];
            }
        }
        const datetime = `${date.year}-${date.month}-${date.day}`;
        return datetime;
    }
    static #iso8061(dt){

    }

}

/* よく使う日付関係を返すclass */
class changeDateTime{
    //指定しなければ現在時刻
    constructor(dt = new Date()){
        // 日本の時間に修正
        // dt.setTime(dt.getTime() /*+ 32400000*/); // 1000 * 60 * 60 * 9(hour)
        console.log(dt.toLocaleDateString('ja', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        }), "test");
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

    get getMonth(){
        return this.month;
    }

    get getDate(){
        return this.year + '-' + this.month + '-' +this.day;
    }

    get getDateTime(){
        return this.year + '-' + this.month + '-' +this.day + ' ' + this.hour + ':' + this.min + ':' + this.sec;
    }
}
/*
const time = new changeDateTime();
console.log(time.getDateTime);
const dt = new Date(1527547761*1000);
console.log(dt);
console.log(timestampToTime(1527547761));
*/
/*
const ggg = new Date();
console.log(ggg.constructor.name + "test");
*/
const aaaaa = shapDatetime.toDatetime("19.11.2020");
console.log(aaaaa);
const bbbbb = shapDatetime.toDatetime("2021-02-09T18:42:22.900000+00:00");
const ccccc = shapDatetime.toDatetime(1644683669);
console.log(bbbbb + "aaa");
/*
const ddd = "19.11.2020";
console.log(ddd.length);*/