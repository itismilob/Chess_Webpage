const chess_board_E = document.querySelector(".chess_board");
const chess_board_img_E = document.querySelector(".chess_board_img");
const notation_table_E = document.querySelector(".notation_table");

const file_char =['a','b','c','d','e','f','g','h'];
const piece_code = ['','K','Q','B','N','R','P'];
const piece_img = [
    [
        "",
        "<img src='./Chess Image/white/King.png' alt='K'>",
        "<img src='./Chess Image/white/Queen.png' alt='Q'>",
        "<img src='./Chess Image/white/Bishop.png' alt='B'>",
        "<img src='./Chess Image/white/Knight.png' alt='N'>",
        "<img src='./Chess Image/white/Rook.png' alt='R'>",
        "<img src='./Chess Image/white/Pawn.png' alt='P'>",
    ],
    [
        "",
        "<img src='./Chess Image/black/King.png' alt='K'>",
        "<img src='./Chess Image/black/Queen.png' alt='Q'>",
        "<img src='./Chess Image/black/Bishop.png' alt='B'>",
        "<img src='./Chess Image/black/Knight.png' alt='N'>",
        "<img src='./Chess Image/black/Rook.png' alt='R'>",
        "<img src='./Chess Image/black/Pawn.png' alt='P'>",
    ]
];

let cells;
let notation = [];
let move = [];
let move_piece;
let turn = true;
let isMoved = [[false, false, false],[false, false, false]];
let castles = [[false, false], [false, false]];
let isCheck;
let isSelected = false;
let isGameEnd = false;
let select;
let selectedPath = [];
let last_move;

let game_board = [
    [15,14,13,12,11,13,14,15],
    [16,16,16,16,16,16,16,16],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [6,6,6,6,6,6,6,6],
    [5,4,3,2,1,3,4,5],
];

class board_cell{
    constructor(index, x, y, value) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.value = value;
        this.piece;
        this.type;
        this.image;
        this.update_cell();
    }
    update_cell(){
        this.piece = piece_code[this.value % 10];
        this.type = piece_type(this.piece);
        if(this.value === 0) {
            this.color = undefined;
        }else if(this.value > 10) {
            this.color = "black";
            this.image = piece_img[1][this.value - 10];
        }else{
            this.color = "white";
            this.image = piece_img[0][this.value];
        }
    }
    get_path(){
        return this.type.get_path(this.x, this.y, this.color);
    }
}
class piece_Pawn{
    get_path(x, y, color){
        let this_path = [];
        if(color === "white"){
            //move
            if(x === 6 && game_board[x-1][y].value === 0 && game_board[x-2][y].value === 0){
                this_path = [[x-1,y], [x-2,y]];
            }else if(game_board[x-1][y].value === 0){
                this_path = [[x-1,y]];
            }

            //take
            if(x > 0){
                if(y > 0 && game_board[x-1][y-1].value > 10){
                    this_path.push([x-1,y-1]);
                }
                if(y < 7 && game_board[x-1][y+1].value > 10){
                    this_path.push([x-1,y+1]);
                }
            }
            //en passant
            if(x === 3 && last_move[1].piece === 'P' && last_move[0].x === 1 && last_move[1].x === 3 && (last_move[1].y === y-1 || last_move[1].y === y+1)){
                this_path.push([x-1,last_move[1].y,[last_move[1].x, last_move[1].y]]);
            }

            if(isCheck){
                this_path = if_move_uncheck("white", 6, [x, y], this_path);
            }

        }else{
            if(x === 1 && game_board[x+1][y].value === 0 && game_board[x+2][y].value === 0){
                this_path = [[x+1,y], [x+2,y]];
            }else if(game_board[x+1][y].value === 0){
                this_path = [[x+1,y]];
            }

            //take
            if(x < 7){
                if(y > 0 && game_board[x+1][y-1].value < 10 && game_board[x+1][y-1].value !== 0){
                    this_path.push([x+1,y-1]);
                }
                if(y < 7 && game_board[x+1][y+1].value < 10 && game_board[x+1][y+1].value !== 0){
                    this_path.push([x+1,y+1]);
                }
            }
            //en passant
            if(x === 4 && last_move[1].piece === 'P' && last_move[0].x === 6 && last_move[1].x === 4 && (last_move[1].y === y-1 || last_move[1].y === y+1)){
                this_path.push([x+1,last_move[1].y,[last_move[1].x, last_move[1].y]]);
            }

            if(isCheck){
                this_path = if_move_uncheck("black", 16, [x, y], this_path);
            }
        }
        return this_path;
    }
}
class piece_Knight{
    get_path(x, y, color){
        let this_path = []

        if(color === "white"){
            //  top
            if(x > 1 && y > 0 && (game_board[x-2][y-1].value > 10 || game_board[x-2][y-1].value === 0)) {this_path.push([x-2,y-1]);}
            if(x > 1 && y < 7 && (game_board[x-2][y+1].value > 10 || game_board[x-2][y+1].value === 0)) {this_path.push([x-2,y+1]);}
            //  left
            if(x > 0 && y > 1 && (game_board[x-1][y-2].value > 10 || game_board[x-1][y-2].value === 0)) {this_path.push([x-1,y-2]);}
            if(x < 7 && y > 1 && (game_board[x+1][y-2].value > 10 || game_board[x+1][y-2].value === 0)) {this_path.push([x+1,y-2]);}
            //  right
            if(x > 0 && y < 6 && (game_board[x-1][y+2].value > 10 || game_board[x-1][y+2].value === 0)) {this_path.push([x-1,y+2]);}
            if(x < 7 && y < 6 && (game_board[x+1][y+2].value > 10 || game_board[x+1][y+2].value === 0)) {this_path.push([x+1,y+2]);}
            //  bottom
            if(x < 6 && y > 0 && (game_board[x+2][y-1].value > 10 || game_board[x+2][y-1].value === 0)) {this_path.push([x+2,y-1]);}
            if(x < 6 && y < 7 && (game_board[x+2][y+1].value > 10 || game_board[x+2][y+1].value === 0)) {this_path.push([x+2,y+1]);}

            if(isCheck){
                this_path = if_move_uncheck("white", 4, [x,y], this_path);
            }
        }else{
            //  top
            if(x > 1 && y > 0 && game_board[x-2][y-1].value < 10) {this_path.push([x-2,y-1]);}
            if(x > 1 && y < 7 && game_board[x-2][y+1].value < 10) {this_path.push([x-2,y+1]);}
            //  left
            if(x > 0 && y > 1 && game_board[x-1][y-2].value < 10) {this_path.push([x-1,y-2]);}
            if(x < 7 && y > 1 && game_board[x+1][y-2].value < 10) {this_path.push([x+1,y-2]);}
            //  right
            if(x > 0 && y < 6 && game_board[x-1][y+2].value < 10) {this_path.push([x-1,y+2]);}
            if(x < 7 && y < 6 && game_board[x+1][y+2].value < 10) {this_path.push([x+1,y+2]);}
            //  bottom
            if(x < 6 && y > 0 && game_board[x+2][y-1].value < 10) {this_path.push([x+2,y-1]);}
            if(x < 6 && y < 7 && game_board[x+2][y+1].value < 10) {this_path.push([x+2,y+1]);}

            if(isCheck){
                this_path = if_move_uncheck("black", 14, [x,y], this_path);
            }
        }

        return this_path;
    }
}
class piece_Rook{
    get_path(x, y, color){
        let this_path = [];
        // up
        if(x > 0){
            for(let i=1;i<=x;i++){
                if(game_board[x-i][y].value === 0){
                    this_path.push([x-i,y]);
                }else if(color === "white" && game_board[x-i][y].value > 10){
                    this_path.push([x-i,y]);
                    break;
                }else if(color === "black" && game_board[x-i][y].value < 10){
                    this_path.push([x-i,y]);
                    break;
                }
                if(game_board[x-i][y].value !== 0) break;
            }
        }
        // down
        if(x < 7){
            for(let i=1;i<=7-x;i++){
                if(game_board[x+i][y].value === 0){
                    this_path.push([x+i,y]);
                }else if(color === "white" && game_board[x+i][y].value > 10){
                    this_path.push([x+i,y]);
                    break;
                }else if(color === "black" && game_board[x+i][y].value < 10){
                    this_path.push([x+i,y]);
                    break;
                }
                if(game_board[x+i][y].value !== 0) break;
            }
        }
        // left
        if(y > 0){
            for(let i=1;i<=y;i++){
                if(game_board[x][y-i].value === 0){
                    this_path.push([x,y-i]);
                }else if(color === "white" && game_board[x][y-i].value > 10){
                    this_path.push([x,y-i]);
                    break;
                }else if(color === "black" && game_board[x][y-i].value < 10){
                    this_path.push([x,y-i]);
                    break;
                }
                if(game_board[x][y-i].value !== 0) break;
            }
        }
        // right
        if(y < 7){
            for(let i=1;i<=7-y;i++){
                if(game_board[x][y+i].value === 0){
                    this_path.push([x,y+i]);
                }else if(color === "white" && game_board[x][y+i].value > 10){
                    this_path.push([x,y+i]);
                    break;
                }else if(color === "black" && game_board[x][y+i].value < 10){
                    this_path.push([x,y+i]);
                    break;
                }
                if(game_board[x][y+i].value !== 0) break;
            }
        }
        if(color === "white" && isCheck){
            this_path = if_move_uncheck("white", 5, [x,y], this_path);
        }
        if(color === "black" && isCheck){
            this_path = if_move_uncheck("black", 15, [x,y], this_path);
        }
        return this_path;
    }
}
class piece_Bishop{
    get_path(x, y, color){
        let this_path = [];
        let diagonal_distance = [];
        diagonal_distance.push(check_diagonal_distance(x, y));
        diagonal_distance.push(check_diagonal_distance(x, 7-y));
        diagonal_distance.push(check_diagonal_distance(7-x, y));
        diagonal_distance.push(check_diagonal_distance(7-x, 7-y));

        //  up left -1, -1
        for(let i = 1; i <= diagonal_distance[0]; i++) {
            if(game_board[x-i][y-i].value === 0){
                this_path.push([x-i,y-i]);
            }else if(color === "white" && game_board[x-i][y-i].value > 10){
                this_path.push([x-i,y-i]);
                break;
            }else if(color === "black" && game_board[x-i][y-i].value < 10){
                this_path.push([x-i,y-i]);
                break;
            }
            if(game_board[x-i][y-i].value !== 0) break;
        }
        //  up right -1, +1
        for (let i = 1; i <= diagonal_distance[1]; i++) {
            if(game_board[x-i][y+i].value === 0){
                this_path.push([x-i,y+i]);
            }else if(color === "white" && game_board[x-i][y+i].value > 10){
                this_path.push([x-i,y+i]);
                break;
            }else if(color === "black" && game_board[x-i][y+i].value < 10){
                this_path.push([x-i,y+i]);
                break;
            }
            if(game_board[x-i][y+i].value !== 0) break;
        }
        //  down left +1, -1
        for (let i = 1; i <= diagonal_distance[2]; i++) {
            if(game_board[x+i][y-i].value === 0){
                this_path.push([x+i,y-i]);
            }else if(color === "white" && game_board[x+i][y-i].value > 10){
                this_path.push([x+i,y-i]);
                break;
            }else if(color === "black" && game_board[x+i][y-i].value < 10){
                this_path.push([x+i,y-i]);
                break;
            }
            if(game_board[x+i][y-i].value !== 0) break;
        }
        //  down right +1, +1
        for (let i = 1; i <= diagonal_distance[3]; i++) {
            if(game_board[x+i][y+i].value === 0){
                this_path.push([x+i,y+i]);
            }else if(color === "white" && game_board[x+i][y+i].value > 10){
                this_path.push([x+i,y+i]);
                break;
            }else if(color === "black" && game_board[x+i][y+i].value < 10){
                this_path.push([x+i,y+i]);
                break;
            }
            if(game_board[x+i][y+i].value !== 0) break;
        }
        if(color === "white" && isCheck){
            this_path = if_move_uncheck("white", 3, [x,y], this_path);
        }
        if(color === "black" && isCheck){
            this_path = if_move_uncheck("black", 13, [x,y], this_path);
        }
        return this_path;
    }
}
class piece_Queen{
    get_path(x, y, color){
        let this_path = [];let diagonal_distance = [];
        diagonal_distance.push(check_diagonal_distance(x, y));
        diagonal_distance.push(check_diagonal_distance(x, 7-y));
        diagonal_distance.push(check_diagonal_distance(7-x, y));
        diagonal_distance.push(check_diagonal_distance(7-x, 7-y));

        // Bishop move
        //  up left -1, -1
        for(let i = 1; i <= diagonal_distance[0]; i++) {
            if(game_board[x-i][y-i].value === 0){
                this_path.push([x-i,y-i]);
            }else if(color === "white" && game_board[x-i][y-i].value > 10){
                this_path.push([x-i,y-i]);
                break;
            }else if(color === "black" && game_board[x-i][y-i].value < 10){
                this_path.push([x-i,y-i]);
                break;
            }
            if(game_board[x-i][y-i].value !== 0) break;
        }
        //  up right -1, +1
        for (let i = 1; i <= diagonal_distance[1]; i++) {
            if(game_board[x-i][y+i].value === 0){
                this_path.push([x-i,y+i]);
            }else if(color === "white" && game_board[x-i][y+i].value > 10){
                this_path.push([x-i,y+i]);
                break;
            }else if(color === "black" && game_board[x-i][y+i].value < 10){
                this_path.push([x-i,y+i]);
                break;
            }
            if(game_board[x-i][y+i].value !== 0) break;
        }
        //  down left +1, -1
        for (let i = 1; i <= diagonal_distance[2]; i++) {
            if(game_board[x+i][y-i].value === 0){
                this_path.push([x+i,y-i]);
            }else if(color === "white" && game_board[x+i][y-i].value > 10){
                this_path.push([x+i,y-i]);
                break;
            }else if(color === "black" && game_board[x+i][y-i].value < 10){
                this_path.push([x+i,y-i]);
                break;
            }
            if(game_board[x+i][y-i].value !== 0) break;
        }
        //  down right +1, +1
        for (let i = 1; i <= diagonal_distance[3]; i++) {
            if(game_board[x+i][y+i].value === 0){
                this_path.push([x+i,y+i]);
            }else if(color === "white" && game_board[x+i][y+i].value > 10){
                this_path.push([x+i,y+i]);
                break;
            }else if(color === "black" && game_board[x+i][y+i].value < 10){
                this_path.push([x+i,y+i]);
                break;
            }
            if(game_board[x+i][y+i].value !== 0) break;
        }

        // Rook move
        //  up
        if(x > 0){
            for(let i=1;i<=x;i++){
                if(game_board[x-i][y].value === 0){
                    this_path.push([x-i,y]);
                }else if(color === "white" && game_board[x-i][y].value > 10){
                    this_path.push([x-i,y]);
                    break;
                }else if(color === "black" && game_board[x-i][y].value < 10){
                    this_path.push([x-i,y]);
                    break;
                }
                if(game_board[x-i][y].value !== 0) break;
            }
        }
        //  down
        if(x < 7){
            for(let i=1;i<=7-x;i++){
                if(game_board[x+i][y].value === 0){
                    this_path.push([x+i,y]);
                }else if(color === "white" && game_board[x+i][y].value > 10){
                    this_path.push([x+i,y]);
                    break;
                }else if(color === "black" && game_board[x+i][y].value < 10){
                    this_path.push([x+i,y]);
                    break;
                }
                if(game_board[x+i][y].value !== 0) break;
            }
        }
        //  left
        if(y > 0){
            for(let i=1;i<=y;i++){
                if(game_board[x][y-i].value === 0){
                    this_path.push([x,y-i]);
                }else if(color === "white" && game_board[x][y-i].value > 10){
                    this_path.push([x,y-i]);
                    break;
                }else if(color === "black" && game_board[x][y-i].value < 10){
                    this_path.push([x,y-i]);
                    break;
                }
                if(game_board[x][y-i].value !== 0) break;
            }
        }
        //  right
        if(y < 7){
            for(let i=1;i<=7-y;i++){
                if(game_board[x][y+i].value === 0){
                    this_path.push([x,y+i]);
                }else if(color === "white" && game_board[x][y+i].value > 10){
                    this_path.push([x,y+i]);
                    break;
                }else if(color === "black" && game_board[x][y+i].value < 10){
                    this_path.push([x,y+i]);
                    break;
                }
                if(game_board[x][y+i].value !== 0) break;
            }
        }
        if(color === "white" && isCheck){
            this_path = if_move_uncheck("white", 2, [x,y], this_path);
        }
        if(color === "black" && isCheck){
            this_path = if_move_uncheck("black", 12, [x,y], this_path);
        }
        return this_path;
    }
}
class piece_King{
    get_path(x, y, color){
        let this_path = [];
        let temp = false;

        if(color === "white"){
            // -1 -1
            if(x>0 && y>0 && (game_board[x-1][y-1].value > 10 || game_board[x-1][y-1].value === 0)){this_path.push([x-1,y-1]);}
            // -1 0
            if(x>0 && (game_board[x-1][y].value > 10 || game_board[x-1][y].value === 0)){this_path.push([x-1,y])}
            // -1 +1
            if(x>0 && y<7 && (game_board[x-1][y+1].value > 10 || game_board[x-1][y+1].value === 0)){this_path.push([x-1, y+1]);}
            // 0 -1
            if(y>0 && (game_board[x][y-1].value > 10 || game_board[x][y-1].value === 0)){this_path.push([x,y-1]);}
            // 0 +1
            if(y<7 && (game_board[x][y+1].value > 10 || game_board[x][y+1].value === 0)){this_path.push([x,y+1]);}
            // +1 -1
            if(x<7 && y>0 && (game_board[x+1][y-1].value > 10 || game_board[x+1][y-1].value === 0)){this_path.push([x+1, y-1]);}
            // +1 0
            if(x<7 && (game_board[x+1][y].value > 10 || game_board[x+1][y].value === 0)){this_path.push([x+1, y]);}
            // +1 +1
            if(x<7 && y<7 && (game_board[x+1][y+1].value > 10 || game_board[x+1][y+1].value === 0)){this_path.push([x+1, y+1]);}

            // Castling
            //  Queen side castle
            if(!isMoved[0][0] && !isMoved[0][1] && game_board[7][1].value === 0 && game_board[7][2].value === 0 && game_board[7][3].value === 0){
                game_board[7][1].value = 1;
                game_board[7][2].value = 1;
                game_board[7][3].value = 1;
                if(king_check("white")) {temp = true;}
                game_board[7][1].value = 0;
                game_board[7][2].value = 0;
                game_board[7][3].value = 0;

                if(!temp){
                    castles[0][0] = true;
                    this_path.push([7, 2]);
                    this_path.push([7, 0]);
                }
            }
            //  King side castle
            if(!isMoved[0][1] && !isMoved[0][2] && game_board[7][5].value === 0 && game_board[7][6].value === 0){
                game_board[7][5].value = 1;
                game_board[7][6].value = 1;
                if(king_check("white")) {temp = true;}
                game_board[7][5].value = 0;
                game_board[7][6].value = 0;

                if(!temp){
                    castles[0][1] = true;
                    this_path.push([7, 6]);
                    this_path.push([7, 7]);
                }
            }

            if(isCheck){
                this_path = if_move_uncheck("white", 1, [x,y], this_path);
            }
        }else{
            // -1 -1
            if(x>0 && y>0 && game_board[x-1][y-1].value < 10){this_path.push([x-1,y-1]);}
            // -1 0
            if(x>0 && game_board[x-1][y].value < 10){this_path.push([x-1,y])}
            // -1 +1
            if(x>0 && y<7 && game_board[x-1][y+1].value < 10){this_path.push([x-1, y+1]);}
            // 0 -1
            if(y>0 && game_board[x][y-1].value < 10){this_path.push([x,y-1]);}
            // 0 +1
            if(y<7 && game_board[x][y+1].value < 10){this_path.push([x,y+1]);}
            // +1 -1
            if(x<7 && y>0 && game_board[x+1][y-1].value < 10){this_path.push([x+1, y-1]);}
            // +1 0
            if(x<7 && game_board[x+1][y].value < 10){this_path.push([x+1, y]);}
            // +1 +1
            if(x<7 && y<7 && game_board[x+1][y+1].value < 10){this_path.push([x+1, y+1]);}

            // Castling
            //  Queen side castle
            if(!isMoved[1][0] && !isMoved[1][1] && game_board[0][1].value === 0 && game_board[0][2].value === 0 && game_board[0][3].value === 0){
                game_board[0][1].value = 11;
                game_board[0][2].value = 11;
                game_board[0][3].value = 11;
                if(king_check("black")) {temp = true;}
                game_board[0][1].value = 0;
                game_board[0][2].value = 0;
                game_board[0][3].value = 0;

                if(!temp){
                    castles[1][0] = true;
                    this_path.push([0, 2]);
                    this_path.push([0, 0]);
                }
            }
            //  King side castle
            if(!isMoved[1][1] && !isMoved[1][2] && game_board[0][5].value === 0 && game_board[0][6].value === 0){
                game_board[0][5].value = 11;
                game_board[0][6].value = 11;
                if(king_check("black")) {temp = true;}
                game_board[0][5].value = 0;
                game_board[0][6].value = 0;

                if(!temp) {
                    castles[1][1] = true;
                    this_path.push([0, 6]);
                    this_path.push([0, 7]);
                }
            }

            if(isCheck){
                this_path = if_move_uncheck("black", 11, [x,y], this_path);
            }
        }

        let temp_path = [];
        this_path.forEach((path)=>{
            let temp_value = game_board[path[0]][path[1]].value;
            game_board[x][y].value = 0;

            if(color === "white"){
                game_board[path[0]][path[1]].value = 1;
                if(!king_check("white")){
                    temp_path.push(path);
                }
                game_board[x][y].value = 1;
            }else{
                game_board[path[0]][path[1]].value = 11;
                if(!king_check("black")){
                    temp_path.push(path);
                }
                game_board[x][y].value = 11;
            }
            game_board[path[0]][path[1]].value = temp_value;
        });

        return temp_path;
    }
}

function get_king_location(color){
    let king_cell;
    if(color === "white"){
        // white king loc
        game_board.forEach((line)=>{
            line.forEach((cell)=>{
                if(cell.value === 1) king_cell = cell;
            });
        });
    }else{
        // black king loc
        game_board.forEach((line) => {
            line.forEach((cell) => {
                if (cell.value === 11) king_cell = cell;
            });
        });
    }
    return king_cell;
}
function king_check(color){

    let diagonal_distance = [];
    let check_piece = [];
    let king_cell = get_king_location(color);

    diagonal_distance.push(check_diagonal_distance(king_cell.x, king_cell.y));
    diagonal_distance.push(check_diagonal_distance(king_cell.x, 7-king_cell.y));
    diagonal_distance.push(check_diagonal_distance(7-king_cell.x, king_cell.y));
    diagonal_distance.push(check_diagonal_distance(7-king_cell.x, 7-king_cell.y));

    // King check
    if(color === "white"){
        if(king_cell.x>0 && king_cell.y>0 && game_board[king_cell.x-1][king_cell.y-1].value === 11){check_piece.push("K");}
        if(king_cell.x>0 && game_board[king_cell.x-1][king_cell.y].value === 11){check_piece.push("K");}
        if(king_cell.x>0 && king_cell.y<7 && game_board[king_cell.x-1][king_cell.y+1].value === 11){check_piece.push("K");}
        if(king_cell.y>0 && game_board[king_cell.x][king_cell.y-1].value === 11){check_piece.push("K");}
        if(king_cell.y<7 && game_board[king_cell.x][king_cell.y+1].value === 11){check_piece.push("K");}
        if(king_cell.x<7 && king_cell.y>0 && game_board[king_cell.x+1][king_cell.y-1].value === 11){check_piece.push("K");}
        if(king_cell.x<7 && game_board[king_cell.x+1][king_cell.y].value === 11){check_piece.push("K");}
        if(king_cell.x<7 && king_cell.y<7 && game_board[king_cell.x+1][king_cell.y+1].value === 11){check_piece.push("K");}
    }else{
        if(king_cell.x>0 && king_cell.y>0 && game_board[king_cell.x-1][king_cell.y-1].value === 1){check_piece.push("K");}
        if(king_cell.x>0 && game_board[king_cell.x-1][king_cell.y].value === 1){check_piece.push("K");}
        if(king_cell.x>0 && king_cell.y<7 && game_board[king_cell.x-1][king_cell.y+1].value === 1){check_piece.push("K");}
        if(king_cell.y>0 && game_board[king_cell.x][king_cell.y-1].value === 1){check_piece.push("K");}
        if(king_cell.y<7 && game_board[king_cell.x][king_cell.y+1].value === 1){check_piece.push("K");}
        if(king_cell.x<7 && king_cell.y>0 && game_board[king_cell.x+1][king_cell.y-1].value === 1){check_piece.push("K");}
        if(king_cell.x<7 && game_board[king_cell.x+1][king_cell.y].value === 1){check_piece.push("K");}
        if(king_cell.x<7 && king_cell.y<7 && game_board[king_cell.x+1][king_cell.y+1].value === 1){check_piece.push("K");}
    }

    // Pawn check
    if(color === "white"){
        if (king_cell.x > 0 && king_cell.y > 0 && game_board[king_cell.x-1][king_cell.y-1].value === 16) {check_piece.push("P");}
        if (king_cell.x > 0 && king_cell.y < 7 && game_board[king_cell.x-1][king_cell.y+1].value === 16) {check_piece.push("P");}
    }else{
        if (king_cell.x < 7 && king_cell.y > 0 && game_board[king_cell.x+1][king_cell.y-1].value === 6) {check_piece.push("P");}
        if (king_cell.x < 7 && king_cell.y < 7 && game_board[king_cell.x+1][king_cell.y+1].value === 6) {check_piece.push("P");}
    }

    // Knight check
    //  top
    if (king_cell.x > 1 && king_cell.y > 0){
        if (color === "white" && game_board[king_cell.x-2][king_cell.y-1].value === 14) {check_piece.push("N");}
        if (color === "black" && game_board[king_cell.x-2][king_cell.y-1].value === 4) {check_piece.push("N");}
    }
    if (king_cell.x > 1 && king_cell.y < 7){
        if (color === "white" && game_board[king_cell.x-2][king_cell.y+1].value === 14) {check_piece.push("N");}
        if (color === "black" && game_board[king_cell.x-2][king_cell.y+1].value === 4) {check_piece.push("N");}
    }
    //  left
    if (king_cell.x > 0 && king_cell.y > 1){
        if(color === "white" && game_board[king_cell.x-1][king_cell.y-2].value === 14) {check_piece.push("N");}
        if(color === "black" && game_board[king_cell.x-1][king_cell.y-2].value === 4) {check_piece.push("N");}
    }
    if (king_cell.x < 7 && king_cell.y > 1){
        if(color === "white" && game_board[king_cell.x+1][king_cell.y-2].value === 14) {check_piece.push("N");}
        if(color === "black" && game_board[king_cell.x+1][king_cell.y-2].value === 4) {check_piece.push("N");}
    }
    //  right
    if (king_cell.x > 0 && king_cell.y < 6){
        if(color === "white" && game_board[king_cell.x-1][king_cell.y+2].value === 14) {check_piece.push("N");}
        if(color === "black" && game_board[king_cell.x-1][king_cell.y+2].value === 4) {check_piece.push("N");}
    }
    if (king_cell.x > 7 && king_cell.y < 6){
        if(color === "white" && game_board[king_cell.x+1][king_cell.y+2].value === 14) {check_piece.push("N");}
        if(color === "black" && game_board[king_cell.x+1][king_cell.y+2].value === 4) {check_piece.push("N");}
    }
    //  bottom
    if (king_cell.x < 6 && king_cell.y > 0){
        if(color === "white" && game_board[king_cell.x+2][king_cell.y-1].value === 14) {check_piece.push("N");}
        if(color === "black" && game_board[king_cell.x+2][king_cell.y-1].value === 4) {check_piece.push("N");}
    }
    if (king_cell.x < 6 && king_cell.y < 7){
        if(color === "white" && game_board[king_cell.x+2][king_cell.y+1].value === 14) {check_piece.push("N");}
        if(color === "black" && game_board[king_cell.x+2][king_cell.y+1].value === 4) {check_piece.push("N");}
    }

    // Bishop check
    //  up left -1, -1
    for (let i = 1; i <= diagonal_distance[0]; i++) {
        if (game_board[king_cell.x - i][king_cell.y - i].value === 0) continue;
        if (color === "white" && game_board[king_cell.x-i][king_cell.y-i].value === 13) {check_piece.push("B");}
        if (color === "black" && game_board[king_cell.x-i][king_cell.y-i].value === 3) {check_piece.push("B");}
        if (color === "white" && game_board[king_cell.x-i][king_cell.y-i].value === 12) {check_piece.push("Q");}
        if (color === "black" && game_board[king_cell.x-i][king_cell.y-i].value === 2) {check_piece.push("Q");}
        else break;
    }
    //  up right -1, +1
    for (let i = 1; i <= diagonal_distance[1]; i++) {
        if (game_board[king_cell.x - i][king_cell.y + i].value === 0) continue;
        if (color === "white" && game_board[king_cell.x - i][king_cell.y + i].value === 13) {check_piece.push("B");}
        if (color === "black" && game_board[king_cell.x - i][king_cell.y + i].value === 3) {check_piece.push("B");}
        if (color === "white" && game_board[king_cell.x - i][king_cell.y + i].value === 12) {check_piece.push("Q");}
        if (color === "black" && game_board[king_cell.x - i][king_cell.y + i].value === 2) {check_piece.push("Q");}
        else break;
    }
    //  down left +1, -1
    for (let i = 1; i <= diagonal_distance[2]; i++) {
        if (game_board[king_cell.x + i][king_cell.y - i].value === 0) continue;
        if (color === "white" && game_board[king_cell.x + i][king_cell.y - i].value === 13) {check_piece.push("B");}
        if (color === "black" && game_board[king_cell.x + i][king_cell.y - i].value === 3) {check_piece.push("B");}
        if (color === "white" && game_board[king_cell.x + i][king_cell.y - i].value === 12) {check_piece.push("Q");}
        if (color === "black" && game_board[king_cell.x + i][king_cell.y - i].value === 2) {check_piece.push("Q");}
        else break;
    }
    //  down right +1, +1
    for (let i = 1; i <= diagonal_distance[3]; i++) {
        if (game_board[king_cell.x + i][king_cell.y + i].value === 0) continue;
        if (color === "white" && game_board[king_cell.x + i][king_cell.y + i].value === 13) {check_piece.push("B");}
        if (color === "black" && game_board[king_cell.x + i][king_cell.y + i].value === 3) {check_piece.push("B");}
        if (color === "white" && game_board[king_cell.x + i][king_cell.y + i].value === 12) {check_piece.push("Q");}
        if (color === "black" && game_board[king_cell.x + i][king_cell.y + i].value === 2) {check_piece.push("Q");}
        else break;
    }

    // Rook check
    //  up
    for (let i = 1; i <= king_cell.x; i++) {
        if (game_board[king_cell.x - i][king_cell.y].value === 0) continue;
        if (color === "white" && game_board[king_cell.x - i][king_cell.y].value === 15) {check_piece.push("R");}
        if (color === "black" && game_board[king_cell.x - i][king_cell.y].value === 5) {check_piece.push("R");}
        if (color === "white" && game_board[king_cell.x - i][king_cell.y].value === 12) {check_piece.push("Q");}
        if (color === "black" && game_board[king_cell.x - i][king_cell.y].value === 2) {check_piece.push("Q");}
        else break;
    }
    //  down
    for (let i = 1; i < 8 - king_cell.x; i++) {
        if (game_board[king_cell.x + i][king_cell.y].value === 0) continue;
        if (color === "white" && game_board[king_cell.x + i][king_cell.y].value === 15) {check_piece.push("R");}
        if (color === "black" && game_board[king_cell.x + i][king_cell.y].value === 5) {check_piece.push("R");}
        if (color === "white" && game_board[king_cell.x + i][king_cell.y].value === 12) {check_piece.push("Q");}
        if (color === "black" && game_board[king_cell.x + i][king_cell.y].value === 2) {check_piece.push("Q");}
        else break;
    }
    //  left
    for (let i = 1; i <= king_cell.y; i++) {
        if (game_board[king_cell.x][king_cell.y - i].value === 0) continue;
        if (color === "white" && game_board[king_cell.x][king_cell.y - i].value === 15) {check_piece.push("R");}
        if (color === "black" && game_board[king_cell.x][king_cell.y - i].value === 5) {check_piece.push("R");}
        if (color === "white" && game_board[king_cell.x][king_cell.y - i].value === 12) {check_piece.push("Q");}
        if (color === "black" && game_board[king_cell.x][king_cell.y - i].value === 2) {check_piece.push("Q");}
        else break;
    }
    //  right
    for (let i = 1; i < 8 - king_cell.y; i++) {
        if (game_board[king_cell.x][king_cell.y + i].value === 0) continue;
        if (color === "white" && game_board[king_cell.x][king_cell.y + i].value === 15) {check_piece.push("R");}
        if (color === "black" && game_board[king_cell.x][king_cell.y + i].value === 5) {check_piece.push("R");}
        if (color === "white" && game_board[king_cell.x][king_cell.y + i].value === 12) {check_piece.push("Q");}
        if (color === "black" && game_board[king_cell.x][king_cell.y + i].value === 2) {check_piece.push("Q");}
        else break;
    }

    return check_piece[0] !== undefined;
}
function if_move_uncheck(color, piece, pos, path_list){
    let temp_list = [];
    let temp_value;
    path_list.forEach((path)=>{
        temp_value = game_board[path[0]][path[1]].value;
        game_board[path[0]][path[1]].value = piece;
        game_board[pos[0]][pos[1]].value = 0;
        if(!king_check(color)){
            temp_list.push(path);
        }
        game_board[path[0]][path[1]].value = temp_value;
        game_board[pos[0]][pos[1]].value = piece;
    });
    return temp_list;
}
function piece_type(piece){
    if (piece === 'K') {
        return new piece_King;
    } else if (piece === 'Q') {
        return new piece_Queen();
    } else if (piece === 'B') {
        return new piece_Bishop();
    } else if (piece === 'N') {
        return new piece_Knight();
    } else if (piece === 'R') {
        return new piece_Rook();
    } else if (piece === 'P') {
        return new piece_Pawn();
    }
}
function add_table() {
    // make board image
    let temp_table = "";
    let temp_color = true;

    for (let rows = 0; rows < 8; rows++) {
        let line = "<div class='line'>";
        for (let cols = 0; cols < 8; cols++) {
            if (temp_color) {
                line += "<div class='cell_img white'></div>";
            } else {
                line += "<div class='cell_img black'></div>";
            }
            temp_color = !temp_color;
        }
        temp_color = !temp_color;
        line += `<div class='rank'>${Math.abs(rows-8)}</div></div>`;
        temp_table += line;
    }
    let rank = "<div class='file_line'>";
    for (let i=0;i<8;i++) {
        rank += `<div class='file'>${file_char[i]}</div>`;
    }
    temp_table += rank + "</div>";
    chess_board_img_E.innerHTML = temp_table;

    temp_table = "";
    for (let rows = 0; rows < 8; rows++) {
        let line = "<div class='line'>";
        for (let cols = 0; cols < 8; cols++) {
                line += "<div class='cell' draggable='true'></div>";
        }
        temp_table += line + "</div>";
    }
    temp_table += "</div>";
    chess_board_E.innerHTML = temp_table;
    cells = document.querySelectorAll(".cell");
}
function update_notation_table(){
    notation_table_E.innerHTML = "";
    for(let i=0;i<notation.length;i++){

        let temp = `<tr>
        <td class="notation_count">${i+1}</td>
        <td class="notation_white">${notation[i][0]}</td>`;
        if(notation[i][1] === undefined){
            temp += `<td class="notation_black"></td></tr>`;
        }else{
            temp += `<td class="notation_black">${notation[i][1]}</td></tr>`;
        }

        notation_table_E.innerHTML += temp;
    }
}
function update_chess_board(){
    // if(board_turn){
    //
    // }else{
    //
    // }
    cells.forEach((cell,i)=> {
        let image = game_board[parseInt(i/8)][i%8].image;
        let color = game_board[parseInt(i/8)][i%8].color;

        cell.innerHTML = '';

        // change to image
        if(color === "white") {
            // cell.innerHTML = `${piece_code[index]}`;
            // cell.style.color = "white";
            cell.innerHTML = image;
        }else if(color === "black"){
            // cell.innerHTML = `${piece_code[index - 10]}`;
            // cell.style.color = "black";
            cell.innerHTML = image;
        }
    });

    // if(isCheck === "white"){
    //     cells[get_king_location("white").index].innerHTML = "<div class='king_check'>K</div>";
    // }else if(isCheck === "black"){
    //     cells[get_king_location("black").index].innerHTML = "<div class='king_check'>K</div>";
    // }

    if(isCheck === "white"){
        cells[get_king_location("white").index].innerHTML = `<div class='king_check'>${piece_img[0][1]}</div>`;
    }else if(isCheck === "black"){
        cells[get_king_location("black").index].innerHTML = `<div class='king_check'>${piece_img[1][1]}</div>`;
    }
}
function console_chess_board(){
    let show_arr = Array.from({length:8}).map(()=>{return []});
    game_board.forEach((line,i)=>{
        line.forEach((cell)=>{
            show_arr[i].push(cell.value);
        });
    });
    console.table(show_arr);
}
function show_path(path_list){
    path_list.forEach((path)=>{
        let cell = game_board[path[0]][path[1]];
        let image = game_board[path[0]][path[1]].image;
        if(game_board[path[0]][path[1]].value === 0){
            cells[cell.index].innerHTML = "<div class='path'></div>";
        }else{
            // cells[game_board[path[0]][path[1]].index].innerHTML = `<div class='take'>${game_board[path[0]][path[1]].piece}</div>`;
            if(cell.color === "white"){
                cells[cell.index].innerHTML = `<div class='take'>${image}</div>`;
            }else{
                cells[cell.index].innerHTML = `<div class='take'>${image}</div>`;
            }
        }
    });
}
function check_game_end(){
    let isEnd = true;
    if(turn){   // white checkmate black
        game_board.forEach((line)=>{
            line.forEach((cell)=>{
                if(cell.color === "black" && cell.get_path()[0] !== undefined){
                    isEnd = false;
                }
            });
        });
        if(isEnd){
            console.log("white win!");
            isGameEnd = true;
        }
    }else{      // black checkmate white
        game_board.forEach((line)=>{
            line.forEach((cell)=>{
                if(cell.color === "white" && cell.get_path()[0] !== undefined){
                    isEnd = false;
                }
            });
        });
        if(isEnd){
            console.log("black win!");
            isGameEnd = true;
        }
    }
}
function check_diagonal_distance(a,b){
    if(a < b) return a;
    else if(a > b) return b;
    else return a;
}
function first_click(){
    isSelected = true;

    move = [[parseInt(i/8), parseInt(i%8)]];
    select = game_board[parseInt(i/8)][parseInt(i%8)];

    if((select.color === "white" && !turn) || (select.color === "black" && turn)) {
        console.log("not your turn");
        isSelected = false;
        return;
    }

    if(select.value !== 0){
        move_piece = select.piece;
        selectedPath = select.get_path();
        if(!selectedPath){
            isSelected = false;
            return;
        }
        show_path(selectedPath);
    }else{
        isSelected = false;
    }
}
function second_click(){}
function add_piece_event(){
    cells.forEach((cell,i)=>{
        cell.addEventListener("click",()=>{
            update_chess_board();
            if(isGameEnd) return;
            if(!isSelected){
                isSelected = true;

                move = [[parseInt(i/8), parseInt(i%8)]];
                select = game_board[parseInt(i/8)][parseInt(i%8)];

                if((select.color === "white" && !turn) || (select.color === "black" && turn)) {
                    console.log("not your turn");
                    isSelected = false;
                    return;
                }

                if(select.value !== 0){
                    move_piece = select.piece;
                    selectedPath = select.get_path();
                    if(!selectedPath){
                        isSelected = false;
                        return;
                    }
                    show_path(selectedPath);
                }else{
                    isSelected = false;
                }

            }else{
                isSelected = false;
                move.push([parseInt(i/8), parseInt(i%8)]);

                selectedPath.forEach((path)=>{
                    if(path[0] === move[1][0] && path[1] === move[1][1]){
                        last_move = [game_board[move[0][0]][move[0][1]], game_board[move[1][0]][move[1][1]]];

                        // promotion
                        if((select.value === 6 && move[0][0] === 1) || (select.value === 16 && move[0][0] === 6)){
                            let promotion = parseInt(prompt("1:Queen 2:Rook 3:Bishop 4:Knight"));
                            let temp = true;

                            while(temp){
                                if(isNaN(promotion) || promotion > 4 || promotion < 1){
                                    promotion = parseInt(prompt("1:Queen 2:Rook 3:Bishop 4:Knight"));
                                }else{
                                    temp = false;
                                }
                            }
                            if(promotion === 1){            // Queen
                                select.value = 2;
                            }else if(promotion === 2){      // Rook
                                select.value = 5;
                            }else if(promotion === 3){      // Bishop
                                select.value = 3;
                            }else if(promotion === 4){      // Knight
                                select.value = 4;
                            }
                            if(!turn) select.value += 10;
                        }

                        // castling
                        if(!isMoved[0][1] && select.value === 1 && castles[0][0] && (move[1][1] === 2 || move[1][1] === 0)){
                            game_board[7][3].value = 5;
                            game_board[7][0].value = 0;
                            move[1][1] = 2;
                        }
                        if(!isMoved[0][1] && select.value === 1 && castles[0][1] && (move[1][1] === 6 || move[1][1] === 7)){
                            game_board[7][5].value = 5;
                            game_board[7][7].value = 0;
                            move[1][1] = 6;
                        }
                        if(!isMoved[1][1] && select.value === 11 && castles[1][0] && (move[1][1] === 2 || move[1][1] === 0)){
                            game_board[0][3].value = 15;
                            game_board[0][0].value = 0;
                            move[1][1] = 2;
                        }
                        if(!isMoved[1][1] && select.value === 11 && castles[1][1] && (move[1][1] === 6 || move[1][1] === 7)){
                            game_board[0][5].value = 15;
                            game_board[0][7].value = 0;
                            move[1][1] = 6;
                        }

                        if(move[0][0] === 7 && move[0][1] === 0){       // white left Rook
                            isMoved[0][0] = true;
                        }
                        if(move[0][0] === 7 && move[0][1] === 4){       // white King
                            isMoved[0][1] = true;
                        }
                        if(move[0][0] === 7 && move[0][1] === 7){       // white right Rook
                            isMoved[0][2] = true;
                        }
                        if(move[0][0] === 0 && move[0][1] === 0){       // black left Rook
                            isMoved[1][0] = true;
                        }
                        if(move[0][0] === 0 && move[0][1] === 4){       // black King
                            isMoved[1][1] = true;
                        }
                        if(move[0][0] === 0 && move[0][1] === 7){       // black right Rook
                            isMoved[1][2] = true;
                        }

                        // move
                        game_board[move[1][0]][move[1][1]].value = select.value;
                        game_board[move[0][0]][move[0][1]].value = 0;
                        if(path[2]){
                            game_board[path[2][0]][path[2][1]].value = 0;
                        }

                        game_board.forEach((line)=>{
                            line.forEach((cell)=>{
                                cell.update_cell();
                            });
                        });

                        if(king_check("white")) {
                            isCheck = "white";
                            check_game_end();
                        }else if(king_check("black")){
                            isCheck = "black";
                            check_game_end();
                        }else{
                            isCheck = false;
                        }

                        update_chess_board();
                        if(turn){
                            if(game_board[move[1][0]][move[1][1]].piece === 'P'){
                                notation.push([ file_char[move[1][1]] + (8-move[1][0]) ]);
                            }else{
                                notation.push([ game_board[move[1][0]][move[1][1]].piece + file_char[move[1][1]] + (8-move[1][0]) ]);
                            }
                        }else{
                            if(game_board[move[1][0]][move[1][1]].piece === 'P'){
                                notation[notation.length-1].push([ file_char[move[1][1]] + (8-move[1][0]) ]);
                            }else {
                                notation[notation.length-1].push( game_board[move[1][0]][move[1][1]].piece + file_char[move[1][1]] + (8-move[1][0]) );
                            }
                        }
                        update_notation_table();
                        turn = !turn;
                    }
                });
            }
        });

        cell.addEventListener("dragstart",()=>{
            // first click

            update_chess_board();
            if(isGameEnd) return;
            isSelected = true;

            move = [[parseInt(i/8), parseInt(i%8)]];
            select = game_board[parseInt(i/8)][parseInt(i%8)];

            if((select.color === "white" && !turn) || (select.color === "black" && turn)) {
                console.log("not your turn");
                isSelected = false;
                return;
            }

            if(select.value !== 0){
                move_piece = select.piece;
                selectedPath = select.get_path();
                if(!selectedPath){
                    isSelected = false;
                    return;
                }
                show_path(selectedPath);
            }else{
                isSelected = false;
            }
        });
        cell.addEventListener("dragover",(e)=>{
            e.preventDefault();
        });
        cell.addEventListener("drop",(e)=>{
            e.preventDefault();
            // second click

            update_chess_board();
            if(isGameEnd) return;
            isSelected = false;
            move.push([parseInt(i/8), parseInt(i%8)]);

            selectedPath.forEach((path)=>{
                if(path[0] === move[1][0] && path[1] === move[1][1]){
                    last_move = [game_board[move[0][0]][move[0][1]], game_board[move[1][0]][move[1][1]]];

                    // promotion
                    if((select.value === 6 && move[0][0] === 1) || (select.value === 16 && move[0][0] === 6)){
                        let promotion = parseInt(prompt("1:Queen 2:Rook 3:Bishop 4:Knight"));
                        let temp = true;

                        while(temp){
                            if(isNaN(promotion) || promotion > 4 || promotion < 1){
                                promotion = parseInt(prompt("1:Queen 2:Rook 3:Bishop 4:Knight"));
                            }else{
                                temp = false;
                            }
                        }
                        if(promotion === 1){            // Queen
                            select.value = 2;
                        }else if(promotion === 2){      // Rook
                            select.value = 5;
                        }else if(promotion === 3){      // Bishop
                            select.value = 3;
                        }else if(promotion === 4){      // Knight
                            select.value = 4;
                        }
                        if(!turn) select.value += 10;
                    }

                    // castling
                    if(!isMoved[0][1] && select.value === 1 && castles[0][0] && (move[1][1] === 2 || move[1][1] === 0)){
                        game_board[7][3].value = 5;
                        game_board[7][0].value = 0;
                        move[1][1] = 2;
                    }
                    if(!isMoved[0][1] && select.value === 1 && castles[0][1] && (move[1][1] === 6 || move[1][1] === 7)){
                        game_board[7][5].value = 5;
                        game_board[7][7].value = 0;
                        move[1][1] = 6;
                    }
                    if(!isMoved[1][1] && select.value === 11 && castles[1][0] && (move[1][1] === 2 || move[1][1] === 0)){
                        game_board[0][3].value = 15;
                        game_board[0][0].value = 0;
                        move[1][1] = 2;
                    }
                    if(!isMoved[1][1] && select.value === 11 && castles[1][1] && (move[1][1] === 6 || move[1][1] === 7)){
                        game_board[0][5].value = 15;
                        game_board[0][7].value = 0;
                        move[1][1] = 6;
                    }

                    if(move[0][0] === 7 && move[0][1] === 0){       // white left Rook
                        isMoved[0][0] = true;
                    }
                    if(move[0][0] === 7 && move[0][1] === 4){       // white King
                        isMoved[0][1] = true;
                    }
                    if(move[0][0] === 7 && move[0][1] === 7){       // white right Rook
                        isMoved[0][2] = true;
                    }
                    if(move[0][0] === 0 && move[0][1] === 0){       // black left Rook
                        isMoved[1][0] = true;
                    }
                    if(move[0][0] === 0 && move[0][1] === 4){       // black King
                        isMoved[1][1] = true;
                    }
                    if(move[0][0] === 0 && move[0][1] === 7){       // black right Rook
                        isMoved[1][2] = true;
                    }

                    // move
                    game_board[move[1][0]][move[1][1]].value = select.value;
                    game_board[move[0][0]][move[0][1]].value = 0;
                    if(path[2]){
                        game_board[path[2][0]][path[2][1]].value = 0;
                    }

                    game_board.forEach((line)=>{
                        line.forEach((cell)=>{
                            cell.update_cell();
                        });
                    });

                    if(king_check("white")) {
                        isCheck = "white";
                        check_game_end();
                    }else if(king_check("black")){
                        isCheck = "black";
                        check_game_end();
                    }else{
                        isCheck = false;
                    }

                    update_chess_board();
                    update_notation_table();
                    turn = !turn;
                }
            });
        });
    });
}

window.onload = ()=>{
    game_board.forEach((line,x)=>{
        line.forEach((cell,y)=>{
            game_board[x][y] = new board_cell(x*8+y, x, y, game_board[x][y]);
        });
    });

    add_table();
    update_chess_board();
    add_piece_event();

    console.log("window loaded");
};