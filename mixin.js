/**
 * Augments the Object prototype with a new method. Overwrites if already defined.
 * @param name string
 * @param code function
 */
Object.prototype.def = function(name,code) {
    this.prototype[name] = code;
};
/**
 * Checks whether certain function is defined in Object prototype
 * @param name
 * @return boolean
 */
Object.def('isDefined',function(name) {
        return ((typeof this[name]) !== 'undefined');
});
/**
 * Augments with a new method if not already there. Otherwise throws an exception
 * @param name string
 * @param code function
 */
Object.def('method',function(name,code)  {
    if(this.isDefined(name))
        throw { name:'Needs override', msg:'Method ' + name + ' is already defined in ' + this + '. Use override() instead.' };

    this.def(name,code);
});
/**
 * Overrides the already defined method. If not already there throws an exception
 * @param name string
 * @name code function
 */
Object.def('override', function(name,code)  {
    if(!this.isDefined(name))
        throw { name:'Overrides nothing', msg:'Method ' + name + ' overrides nothing in ' + this + '. Use method() instead.' };

    this.def(name,code)
});

Object.method('dump',function(){
   for(var p in this) {
       console.log( (this.hasOwnProperty(p) ? '    ' : '[+] ')+p+':'+(typeof this[p] === 'function' ? 'Function' : this[p]));
   }
});

Object.method('dumpOwn',function(){
   for(var p in this) if(this.hasOwnProperty(p)) {
       console.log(p+':'+(typeof this[p] === 'function' ? 'Function' : this[p]));
   }
});

Object.method('dumpInherited',function(){
    for(var p in this) if(!this.hasOwnProperty(p)) {
        console.log(p+':'+(typeof this[p] === 'function' ? 'Function' : this[p]));
    }
});

Object.method('dumpEx',function(log) {
    log = log || 'log';
    var logger=console[log];

    function dumpOwnEx(level) {
        var padding='';
        for(var i=0; i<=level; i++) padding+='>';
        if(this.constructor) logger(padding+' '+this.constructor.name+'()');
        for(var p in this) if(this.hasOwnProperty(p)) {
            logger(' '+p+':'+(typeof this[p] === 'function' ? 'function' : this[p]));
        }
    }
    logger('----[ start dump]----');
    var level=0;
    var that=this;
    dumpOwnEx.call(that,level++);
    while(that.__proto__) {
        that=that.__proto__;
        dumpOwnEx.call(that,level++);
    }
    logger('----[ end dump]----');
});
/**
 * Copies all own properties of `that` to `this`
 * @param that Object
 */
Object.method('copyFrom',function(that) {
        for (var p in that) if (that.hasOwnProperty(p)) this[p] = that[p];
});
/**
 * Extends `this` with `overrides` and returns the new object
 * @param overrides string
 * @return Object
 *
 * var b=a.extend(); --> b.__proto__ = a
 */
Object.method('extend',function(overrides){
    overrides=overrides || {};

    function Self(){}
    Self.prototype=this;
    var clone=new Self();
    this.copyFrom(overrides);
    return clone;
});
/**
 * Clones `this` with overrides and returns the new object
 * var b=a.clone(); --> b.__proto__ = a.__proto__
 */
Object.method('clone',function(overrides){
    overrides=overrides || {};
    var clone={};
    clone.copyFrom(this);
    clone.copyFrom(overrides);
    return clone;
});

Object.method('compose',function(/*...*/){
    var that={};
    for(var i=0; i<arguments.length; i++) {
        that.copyFrom(arguments[i]);
    }
    return that;
});

Object.method('mixin',function(mixin){
    return Object.compose(this,mixin(this));
});

Object.method('super',function(f){
    var a=[];
    for(var i=1; i<arguments.length; i++) a.push(arguments[i]);
    return f.apply(this,a);
});