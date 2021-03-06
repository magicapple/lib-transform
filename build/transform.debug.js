;
(function(win, lib) {

    lib.transform = Transform;
    
    function Transform(matrix) {
        if(!matrix) 
            matrix = [
                [1, 0, 0 ],
                [0, 1, 0 ],
                [0, 0, 1 ]
            ];
        this.assign(matrix);
    }
    Transform.prototype[2] = [0, 0, 1];
    Transform.prototype.assign=function(matrix){
        if(!this[0]) this[0] = [];
        this[0][0] = matrix[0][0], this[0][1] = matrix[0][1], this[0][2] = matrix[0][2];
        if(!this[1]) this[1] = [];
        this[1][0] = matrix[1][0], this[1][1] = matrix[1][1], this[1][2] = matrix[1][2];
        return this;
    };
    Transform.prototype.mul = function(matrix) {
        this[0] = [this[0][0] * matrix[0][0] + this[0][1] * matrix[1][0] + this[0][2] * matrix[2][0],
            this[0][0] * matrix[0][1] + this[0][1] * matrix[1][1] + this[0][2] * matrix[2][1],
            this[0][0] * matrix[0][2] + this[0][1] * matrix[1][2] + this[0][2] * matrix[2][2]];

        this[1] = [this[1][0] * matrix[0][0] + this[1][1] * matrix[1][0] + this[1][2] * matrix[2][0],
            this[1][0] * matrix[0][1] + this[1][1] * matrix[1][1] + this[1][2] * matrix[2][1],
            this[1][0] * matrix[0][2] + this[1][1] * matrix[1][2] + this[1][2] * matrix[2][2]];
        return this;
    }
    Transform.prototype.rotate=function(rad){
        with(Math)
            this.mul([
                [cos(rad),-sin(rad),0],
                [sin(rad),cos(rad),0],
                [0,0,1]
            ]);
        return this;
    };
    Transform.prototype.scale=function(sx,sy){
        if(arguments.length === 1) {
            sy = sx;
        }
        this.mul([
            [sx,0,0],
            [0,sy,0],
            [0,0,1]
        ]);
        return this;
    };
    Transform.prototype.skew=function(sx,sy){
        with(Math)
            this.mul([
                [0,tan(sx),0],
                [tan(sy),0,0],
                [0,0,1]
            ]);
        return this;
    };
    Transform.prototype.translate=function(tx,ty){
        this.mul([
            [1,0,tx],
            [0,1,ty],
            [0,0,1]
        ]);
        return this;
    };
    Transform.prototype.at=function(x,y){
        var me = this;
        return {
            rotate:function(rad){
                me.translate(x,y);
                me.rotate(rad);
                me.translate(-x,-y);
                return me;
            },
            scale:function(sx,sy){
                me.translate(x,y);
                me.scale(sx,sy);
                me.translate(-x,-y);
                return me;
            },
            skew:function(sx,sy){
                me.translate(x,y);
                me.skew(sx,sy);
                me.translate(-x,-y);
                return me;
            },
            translate:function(tx,ty){
                me.mul([
                    [1,0,tx],
                    [0,1,ty],
                    [0,0,1]
                ]);
                return me;
            };
        }
    };
    Transform.prototype.toString=function(){
        return [
            [this[0][0],this[0][1],this[0][2]].join("\t"),
            [this[1][0],this[1][1],this[1][2]].join("\t"),
            [this[2][0],this[2][1],this[2][2]].join("\t")
        ].join("\n")
    };
    Transform.prototype.toTransformString=function(){
        return "matrix("+this[0][0].toFixed(6)+","+this[1][0].toFixed(6)+","+this[0][1].toFixed(6)+","+this[1][1].toFixed(6)+","+this[0][2].toFixed(3)+","+this[1][2].toFixed(3)+")";
    };
    Transform.prototype.parseTransformString = function(str){
        if(str=="none"){
            this.assign([
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ])
            return this;
        }
        var data = str.match(/matrix\( *([^ ,]+), *([^ ,]+), *([^ ,]+), *([^ ,]+), *([^ ,]+), *([^ ,]+)\)/);
        if(!data) {
            data = str.transform.match(/matrix3d\( *([^ ,]+), *([^ ,]+), *([^ ,]+), *([^ ,]+), *([^ ,]+), *([^ ,]+) *([^ ,]+), *([^ ,]+), *([^ ,]+), *([^ ,]+), *([^ ,]+), *([^ ,]+)\)/)
            if(!data) {
                throw new Error("wrong transform string format");
            }
            data = data.slice(1).map(function(s){ return parseFloat(s);});
            this.assign([
                [data[0],   data[4],    data[12]],
                [data[1],   data[5],    data[13]],
                [0,         0,          1]
            ])
        
        } else {
            data = data.slice(1).map(function(s){ return parseFloat(s);});
            this.assign([
                [data[0],   data[2],    data[4]],
                [data[1],   data[3],    data[5]],
                [0,         0,          1]
            ])
        }
        return this;
    }


})(window, window['lib'] || (window['lib'] = {}));
