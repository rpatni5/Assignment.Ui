export class JsonUtil{

    static tryParse<T>(val: string): T | null {
        try {
            return JSON.parse(val) as T;
        } catch (error) {
            return null;
        }
    }
    
    static deepCopy<T>(obj:T,defaultVal:any={}): T{
        if(!obj){
            obj=defaultVal;
        }
        return JsonUtil.clone(obj);
    } 
    static clone=(item:any)=> {
        if (!item) { return item; } // null, undefined values check
    
        var types = [ Number, String, Boolean ], 
            result: string | number | boolean | Date | never[] |undefined ;
    
        // normalizing primitives if someone did new String('aaa'), or new Number('444');
        types.forEach(function(type) {
            if (item instanceof type) {
                result = type( item );
            }
        });
    
        if (typeof result == "undefined")
            if (Object.prototype.toString.call( item ) === "[object Array]") {
                result = [];
                item.forEach(function(child: any, index: string | number, array: any) { 
                });
            } else if (typeof item == "object") {
                // testing that this is DOM
                if (item.nodeType && typeof item.cloneNode == "function") {
                    result = item.cloneNode( true );    
                } else if (!item.prototype) { // check that this is a literal
                    if (item instanceof Date) {
                        result = new Date(item);
                    } 
                } else {
                    // depending what you would like here,
                    // just keep the reference, or create new object
                    if (false && item.constructor) {
                        result = new item.constructor();
                    } else {
                        result = item;
                    }
                }
            } else {
                result = item;
            }
        }
    }
    
        