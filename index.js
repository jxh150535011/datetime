/*
jxh150535011
*/

const main = {
	dateFormat(format,date,options){
        format=format||'yyyy-MM-dd';
        if(!date)return;
        let syntax=this.syntax(format),
            data={
                'y+':date.getFullYear(),
                'M+':date.getMonth()+1,
                'd+':date.getDate(),
                'h+':date.getHours(),
                'H+':date.getHours(),
                'm+':date.getMinutes(),
                's+':date.getSeconds(),
                'q+':Math.floor((date.getMonth()+3)/3),
                'W':date.getDay()
        };
        let str=syntax.formatString,rexs=syntax.rexs;
        for (let i = 0,len=rexs.length; i<len; i++) {
            let rex=rexs[i],value=''+(data[rex.key]||'');
            let subl=Math.max(rex.match.length,value.length);
            value=('0000'+value).substr(-subl);
            str=str.replace(rex.key,value);
        }
        data['value']=str;
        return data;
	},
    /**
    * 将有效的日期字符串或数字转换为日期
    */
    parseToDate(odate,format) {
        if (typeof odate=='string') return this.parseToDateStr(odate,format);
        else if (typeof odate === 'number')  return new Date(odate);
        else if (odate instanceof Date) return odate;///Date/.test(Object.prototype.toString.call(odate))
    },
    stringToRegExp(str){//将一段字符串 处理成有效的正则表达式 可支持的字符格式
        return str.replace(/([\[\]\\\/.\{\}\(\)?\-])/gi,'\\$1');
    },
    regExpMap:{
        'y+':'(\\d{4})',
        'M+':'(1[012]|0?[1-9])',
        'd+':'(3[01]|[12]\\d|0?[1-9])',
        'h+':'([01]?[0-9]|[2][0-3])',
        'H+':'([01]?[0-9]|[2][0-3])',
        'm+':'([0-5]?[0-9])',
        's+':'([0-5]?[0-9])',
        'q+':'(\\d)',
        'S':'([\\d]{0,3})',
        'W':'(.)'
    },
    cache:{},
    syntax(format){
	    /**
	    * 检测一个字符串是否是一个有效的日期字符串
	    */
        //(\s+([01]?[0-9]|[2][0-3])) 小时
        //(:+[0-5]?[0-9]) 分钟
        //(:+[0-5]?[0-9]) 秒
        //正向后行断言
        //(小时(分钟|秒){0,2})?
        let rexFormat=format;
        let formatString=format||'';
        if(rexFormat)
            rexFormat=this.stringToRegExp(rexFormat);
        else
            rexFormat='^yyyy[\\-\\/]MM[\\-\\/]dd(?:(?:#0+hh)(?::mm)?(?::ss)?)?$';//#0 用于表述 特殊 字符 防止被转义[\\s|T]
        let cache=this.cache[rexFormat];
        if(!cache){
            let rexs=[];//{key,match,format,index} {y+ yyyy (\\d{4}) 0 }
            let keys=['d+','y+','M+','h+','H+','m+','s+'];//d 先进行匹配
            for (let i = 0,len=keys.length; i < len; i++) {
                let key=keys[i],value=this.regExpMap[key],match=new RegExp(key).exec(rexFormat);
                if(match){
                    rexs.push({
                        key:key,
                        format:value,
                        match:match[0],
                        index:match.index
                    });
                }
            }
            for (let i = 0,len=rexs.length; i<len; i++) {
                let key=rexs[i].key;
                formatString=formatString.replace(new RegExp(key),rexs[i].key);//标题名称格式化
                rexFormat=rexFormat.replace(new RegExp(key),rexs[i].format);//能校验  真实日期格式
            }
        	//((\s+([01]?[0-9]|[2][0-3]))(:+[0-5]?[0-9]){0,2})?
            rexFormat=rexFormat.replace('#0','[\\s|T]');
            this.cache[format]=cache={
                rexFormat:new RegExp(rexFormat),
                formatString:formatString,
                rexs:rexs.sort(function(a,b){return a.index-b.index;})
            };
        }
        cache.rexFormat.lastIndex=0;
        return cache;
    },
    parseToDateStr(string,format) {
        /* /Date(1498320000000+0800)/ */
        if(/^[0-9]+$/.test(string)){
            return new Date(parseInt(string,10));
        }
        let r1=/^\/Date\((\d+)([+-]\d+)?\)\/$/,match;
        if((match=r1.exec(string))){//匹配
            return new Date(parseInt(match[1],10));
        }
        //rl[2]--;
        let syntax=this.syntax(format),data=null;
        if((match=syntax.rexFormat.exec(string))){
            let rexs=syntax.rexs;
            data={};
            for (let i = 0,len=rexs.length; i<len; i++) {
                data[rexs[i].key]=parseInt(match[i+1]);
        	}
        }
        if(data){
            let maxDay=31;
            //对日需要做下额外验证 只不会超过31
            switch(data['M+']){
                case 4:case 6:case 9:case 11:{
                    maxDay=30;
                    break;
                }
                case 2:{
                    maxDay=28;
                    if((data['y+']%4==0&&data['y+']%100!=0)||data['y+']%400==0){//瑞年
                        maxDay++;
                    }
                    break;
                }
            }
            if(data['d+']>maxDay)return null;
            return new Date(data['y+']<100?0:data['y+'], (data['M+']||1) - 1, data['d+']||0, data['h+']||0,  data['m+']||0, data['s+']||0,0);
        }
        //year, month, day, hours, minutes, seconds, milliseconds
        return null;
    },
    /*
    设置了zone之后，将date 转换为当前时区所对应zone时区的(时间[stamp=false]或时刻[stamp=true])
    例如 zone(8) ，将date(981014400000 东8区时间 '2001-01-01 8:0:0') 以zone时区 转换为当前时区时间('2001-01-01 8:0:0'),它们为同一个时间 却为不同的时刻
    new Date(y,m,d) new Date(long) 之间的不同在于 long 指代某一个时刻
    例如
        date('2001-01-01 8:0:0') zone=8 stamp=true 会返回目标时区对应的时刻('2001-01-01 0:0:0' GMT+0000) 否则没有意义 
        date(981014400000) zone=8 stamp=false 会返回目标时区对应的时间('2001-01-01 8:0:0' GMT+0000) 否则没有意义
    */
    parse(date, format, zone , stamp) {//stamp 默认为false ,以date是以zone时区所在的(时间[false]|时刻[true])，转换为当前时区
        if (typeof format == 'number') {
            stamp = zone;
            zone = format;
            format = '';
        }
	//以时间为准的解析格式下 如果zone为null 并且date 为string 会默认进行gtm格式解析 并给 zone 进行赋值
	//预留代码
	//if(!stamp && zone = null && typeof date == 'string'){
	//	zone = /^\/Date\([-]?\d+([+-]\d+)\)\/$/.exec(date);
	//	zone = zone && zone[1] && Math.round(parseInt(zone[1])/100);
	//}
        date = this.parseToDate(date, format);
        if (zone != null && date) {
            //减去- zone*60  根据当前时间 计算出当前是否为夏时令
            //date.getTimezoneOffset() 格林时区-当前的时区
            var offset = (date.getTimezoneOffset() + zone * 60) * 60 * 1000;
            date = new Date(date.getTime() + (stamp&&(-offset)||offset));//当前时区  跟 北京时间 的偏移值 对于时间戳的数据 根据不同时区 生成北京时间对应的当地时间 这样getTime的数值一定要注意正确性
        }
        return date;
    },
    format(date, format, zone) {
        date = this.parse(date,zone);
        return !date?'':this.dateFormat(format,date)['value'];
    },
    getAge(start,today){
        today=this.parseToDate(today);
        start=this.parseToDate(start);
        if(!today||!start)return 0;
        let age = today.getFullYear() - start.getFullYear();
        //即便生日当天 也还不能计算为满一周岁 必须得次日
        if (today.getMonth() < start.getMonth() || today.getMonth() === start.getMonth() && today.getDate() <= start.getDate()) {
            age--;
        }
        return age;
    }
};


/*
    if(Object.prototype.parseToDate!='function'){
        if(Object.defineProperty){
            Object.defineProperty(Object.prototype, 'parseToDate', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: function (format, zone) {
                    return _exports.parse((this instanceof Date) ? this : this.valueOf(), format, zone);
                }
            });
            Object.defineProperty(Object.prototype, 'formatToDateString', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: function (format, zone) {
                    return _exports.format((this instanceof Date) ? this : this.valueOf(), format, zone);
                }
            });
        }
        else{
            Object.prototype.parseToDate=function (format, zone) {
                return _exports.parse((this instanceof Date) ? this : this.valueOf(), format, zone);
            }
            Object.prototype.formatToDateString=function (format, zone) {
                return _exports.format((this instanceof Date) ? this : this.valueOf(), format, zone);
            }
        }

    }
*/
module.exports = main;
