/**
 *
 *fun.js 0.1
 *
 *描述：实践型函数式函数库
 *  有考虑到效率的问题大部分都用迭代 而非递归 
 *  仅适用于前端
 *
 * Author:salars
 * Email:ruizhehuang@gmail.com
 *
 */
(function(root,fn){root.js_fun = fn(root);})(this,function(scope){

    var lib = function(base){
        var S   = function(){
            return lib.apply(this,arguments);
        };

        //过程
        var PROG_END    = S.PROG_END    = "FUNC_RPOG_END_FLAG";
        var EMPTY       = S.EMPTY       = [];
        var NULL        = S.NULL        = {};

        //ajax请求code
        var A_STAT_ERR  = S.A_STAT_ERR  = base.A_STAT_ERR   || 0;
        var A_STAT_WARN = S.A_STAT_WARN = base.A_STAT_WARN  || 1;
        var A_STAT_ING  = S.A_STAT_ING  = base.A_STAT_ING   || 2;
        var A_STAT_SUC  = S.A_STAT_SUC  = base.A_STAT_SUC   || 3;

        //反柯里化
        Function.prototype.uncurrying = function(){
            var __this = this;
            return function(){
                return Function.prototype.call.apply(__this,Array.prototype.slice.call(arguments));
            };
        };

        //别名
        var alias = S.alias = function(oname){
            var fn = function(nname){
                S[nname] = S[oname];
                return fn;
            };
            return fn.as = fn.is =fn;
        };

        var slice = S.slice = Array.prototype.slice.uncurrying();

        var join = S.join = Array.prototype.join.uncurrying();
        alias("join").as("implode");

        var split = S.split = String.prototype.split.uncurrying();
        alias("split").as("explode");





        //柯里化
        var _N = S._N = function(N,fn){
            var f = function(args){
                return function(){
                    var nargs = (args||[]).concat(slice(arguments));
                    if( nargs.length >= N ){
                        return fn.apply(this,nargs);
                    }else{
                        return f(nargs);
                    }
                };
            };
            return f([]);
        }
        alias('_N').as('curryN');

        var _ = S._ =function(fn){
            return _N(fn.length,fn);
        }
        alias('_').as('curry');

        var H = S.H = function(L){
            return L[0] || [];
        };
        alias("H").as("head");

        var T = S.T = function(L){
            return L.length ? L.slice(1) : [];
        };
        alias("T").as("tail");

        //迭代器
        var each = S.each = _(function(L,fn){
            for(var i=0,len=L.length;i<len;i++){
                fn(L[i]);
            }
        });
        alias("each").as("foreach").as("forEach");

        var _break = S.break = _(function(L,fn){
            for(var i = 0,len=L.length;i<len;i++){
                if(fn(L[i]) === true){
                    break;
                }
            }
        });

        //迭代对象
        var oeach = S.oeach = _(function(O,fn){
            for(var i in O){
                O.hasOwnProperty(i) && fn(i,O[i]);
            }
        });

        //归约
        var reduce = S.reduce =  _(function(L,acc,fn){
            var A = acc;
            each(L,function(item){
                A = fn(A,item);
            });
            return A;
        });
        alias("reduce").as("foldl");

        var reduce1 = S.reduce1 = _(function(L,fn){
            return reduce(T(L),H(L),fn);
        });
        alias("reduce1").as("foldl1");

        //TODO  容老夫考虑考虑
        var pipe = S.pipe = function(fns){
            return function(){
                return H(reduce(fns,slice(arguments),function(args,fn){
                    return [fn.apply(this,args)];
                }));
            };
        };

        //映射
        var map = S.map = _(function(L,fn){
            var NL = [];
            for(var i=0,len=L.length;i<len;i++){
                NL.push(fn(L[i]));
            }
            return NL;
        });

        var omap = S.omap = _(function(O,fn){
            var NO = {};
            oeach(O,function(K,V){
                NO[K] = fn(V);
            });
            return NO;
        });


        //滤波器
        var filter= S.filter = _(function(L,fn){
            var NL = [];
            for(var i=0,len=L.length;i<len;i++){
                fn(L[i]) && NL.push(L[i]);
            }
        });



        var keys = S.keys = function(O){
            var NO = {};
            oeach(O,function(K,V){
                NO.push(K);
            });
            return NO;
        };
        alias("keys").as("get_keys");

        var values = S.values = function(O){
            var NO = {};
            oeach(O,function(K,V){
                NO.push(V);
            });
            return NO;
        };
        alias("values").as("get_values");

        var fitem = S.fitem = function(O){
            var NO = {};
            for(var i in O){
                if(O.hasOwnProperty(i)){
                    NO[i] = O[i];
                    return NO;
                }
            }
        };
        alias("fitem").as("first_item").as("fItem");

        var fkey = S.fkey = function(O){
            for(var i in O){
                if(O.hasOwnProperty(i)){
                    return i;
                }
            }
        };
        alias("fkey").as("first_key").as("fKey");

        var fvalue = S.fvalue = function(O){
            for(var i in O){
                if(O.hasOwnProperty(i)){
                    return i;
                }
            }
        };
        alias("fvalue").as("first_value").as("fValue");


        //TODO 并非完全深复制  平时也用不到多层  ??
        var cp = S.cp = function(L){
            return map(L,function(item){
                return item;
            });
        };
        alias("cp").as("arr_cp");

        //TODO 并非完全深复制  平时也用不到多层  ??
        var ocp = S.ocp = function(O){
            return omap(O,function(K,V){
                return V;
            });
        };
        alias("ocp").as("obj_cp");

        var max = S.max = function(L){
            return reduce1(L,function(acc,item){
            	return acc<item ? item : acc;
            });
        };

        var min = S.min = function(L){
            return reduce1(L,function(acc,item){
                return acc>item?item:acc;
            });
        };


        var size_fix = S.size_fix = function(size){
            var s=['K','M','G','T'];
            for(var i = 0; i< s.length;i++){
                var val=size/Math.pow(1024,i+1);
                if(val<1024 && val >=0){
                    return val.toFixed(2)+s[i];
                }
            }
        }
        alias("size_fix").as("sizeFix").as("sfix");


        var in_arr = S.in_arr = _(function(L,item){
            for(var i = 0,len = L.length;i<len;i++){
                if(item == L[i]){
                    return true;
                }
            }
            return false;
        });
        alias("in_arr").as("in_array").as("inArray");

        var obj2arr = S.obj2arr = function(obj){
            var arr = [];
            for(var i in obj){
                var t = {};
                t[i]=obj[i];
                arr.push(t);
            }
            return arr;
        }
        alias("obj2arr").as("obj_to_array");


        var reverse = S.reverse = function (L){
            var NL = [];
            for(var i=L.length-1;i>=0;i--)
              NL.push(arr[i]);
            return L;
        }

        var flip = S.flip = function(O){
            var NO = {};
            oeach(O,function(K,V){
                NO[V] = K;
            });
            return NO;
        };

        var redo = S.redo = _(function(times,fn){
            for(var i = 0;i< times;i++){
                fn();
            };
        });
        alias("redo").as("repeat");

        var redo10 = S.redo10 = redo(10);
        alias("redo10").as("repeat10");

        var f2upper = S.f2upper =function(str){
            var str = str.toLowerCase();
            var reg = /\b(\w)|\s(\w)/g;
            return str.replace(reg,function(m){
                return m.toUpperCase();
            });
        };
        alias("f2upper").as("firstLetterToUpper").as("first_letter_to_upper");

        
        var readable = S.readable = function(str){
            return f2upper(str.replace(/[-_]/g,function(m){
                return ' ';
            }));
        };

        //异步定时器  需要在回调函数中再调用传给的钩子函数
        var loop_asyn = S.loop_asyn =  _(function(time,fn){
            (function(){
                var __fn= arguments.callee;
                fn(function(){
                    setTimeout(__fn,time);
                });
            })();
        });

        var loop1s_asyn = S.loop1s_asyn = loop_asyn(1000);

        var loop10s_asyn = S.loop10s_asyn = loop_asyn(10000);

        var loop = S.loop = _(function(time,fn){
            (function(){
                fn();
                setTimeout(arguments.callee,time);
            })();
        });
        alias("loop").as("loop_sync");

        var loop1s = S.loop1s = loop(1000);
        alias("loop1s").as("loop1s_sync");

        var loop10s = S.loop10s = loop(10000);
        alias("loop10s").as("loop10s_sync");

        var _p = S._p = function(param){
             var _t = typeof param;
             if(_t == "function"){
                 return param();
             }
             return param;
        };

        var _f = S._f = function(flag){
            var __f = _p(flag);
            if(__f === false ){
                return flag;
            }
            return true;
        }


        return S;
    };

    return lib((function(){
        return {
           A_STAT_SUC:200,
           A_STAT_ERR:300,
           A_STAT_WARN:400,
           A_STAT_ING:1100,
           error:function(msg){
               ajaxDone({"code":300,"msg":msg});
           },
           success:function(msg){
               ajaxDone({"code":200,"msg":msg});
           },
           warning:function(msg){
               ajaxDone({"code":400,"msg":msg});
           },
           confirm:function(msg,fn){
                $('.progressBar').TnControl('confirm_msg',{
                    'message_type' : 'warning',
                    'title_text' : '提示',
                    'message_text' : msg,
                    'ok_function':fn,
                    'cancel_function':function(){}
                });
           }
        };
    })());
});
