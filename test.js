'use strict';

const gDateTime = require('./index');

//测试系统时间为 东8区

console.log(gDateTime.format(new Date(),'yyyy-MM-dd hh'));//2015-09-08 06
console.log(gDateTime.format(new Date(),'yyyy-MM-dd HH'));//2015-09-08 06


console.log(gDateTime.format('2015-09-08 06','yyyy-MM-dd h'));//2015-09-08 6
console.log(gDateTime.format('2015-09-08 06','yyyy-MM-dd hh'));//2015-09-08 06

//Date的输出时间 都按照 格林威治的 0 区的时间，例如Date:1999-01-01T05:00:00.000Z 对应展示的东8区时间为 1999-01-01T13:00:00.000Z

console.log(gDateTime.parse('1999-01-01 13'));//Date:1999-01-01T05:00:00.000Z
console.log(gDateTime.parse('01/01/1999 13','MM/dd/yyyy hh'));//Date:1999-01-01T05:00:00.000Z

console.log(gDateTime.parse('1999-01-01 8'));//Date:1999-01-01T00:00:00.000Z

//true 表示 返回以目标时区的时间为准，返回当前系统对应时间的时刻
//false 表示 返回以目标时区的时刻为准，返回当前系统对应时刻的时间

//返回 0时区的 1999-01-01 8 在当前系统时间下 对应的时刻
console.log(gDateTime.parse('1999-01-01 8',0,true));//Date:1999-01-01T08:00:00.000Z

//返回 0时区的 1999-01-01 8 在当前系统时间下 对应的时间
//不过以下没有意义，因为默认 1999-01-01 8 转换出来 就已经是 当前的系统时间 对应的时刻为 1999-01-01T00:00:00.000Z
//再将上述1999-01-01T00:00:00.000Z时刻 认为0时区的时间 在当前系统展示相对应时间，所对应的时刻的 为 1998-12-31T16:00:00.000Z 不过没有意义
console.log('wrong:',gDateTime.parse('1999-01-01 8',0,false));//wrong 1998-12-31T16:00:00.000Z 没有任何意义

//915120000000 东8区时间是 1999-01-01  0区时间为 1998-12-31 16
console.log(gDateTime.parse(915120000000,8));//Date:1998-12-31T16:00:00.000Z 对应当前系统展示为时间为 1999-01-01
console.log(gDateTime.parse(915120000000,0));//Date:1998-12-31T08:00:00.000Z 对应当前系统展示为时间为 1998-12-31 16


//915120000000 默认系统时间就是东8区 展示对应的时刻也默认不会变化 还是 915120000000,对应的展示时刻为 Date:1998-12-31T16:00:00.000Z 不过没有意义
console.log('wrong:',gDateTime.parse(915120000000,8,true));//wrong 1998-12-31T16:00:00.000Z 没有任何意义

//915120000000 已经为当前系统的时刻 Date:1998-12-31T16:00:00.000Z  当前系统展示时间为 1999-01-01
//将1999-01-01 认定为0时区时间，对应时刻为:Date:1999-01-01T00:00:00.000Z 不过最终这个在当前系统输出的时间1999-01-01 8点没有意义
console.log('wrong:',gDateTime.parse(915120000000,0,true));//wrong 1999-01-01T00:00:00.000Z 没有任何意义 因为 915120000000已经是东8区跟0区共同的时刻


//后续 有可能 会对new Date(Number) 以及 new Date(year,month,day) 两种创建时间的方法做一层判断
//gDateTime.parse(Number,false)、gDateTime.parse(Date(year,month,day),true) 后面的false跟true为不可更改的定义 目前阶段交由调用方自行判断 是否需要展示对应的时刻|时间


