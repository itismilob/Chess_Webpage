const chess_board_E = document.querySelector(".chess_board");
const notation_table_E = document.querySelector(".notation_table");
const move_input_E = document.querySelector(".move_input");
const move_btn_E = document.querySelector(".move_btn");
let cells;

const file_char =['a','b','c','d','e','f','g','h'];
const piece_code = ['','K','Q','B','N','R','P'];

let notation = [];
let move = [];
let move_piece;
let move_distance;
let move_direction = [];
let isKingMoved = [false, false];

let turn = true;
let isMoved = false;
let isTake = false;
let isCheck = false;
let isSelected = false;

// make this to class array
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
        this.piece = piece_code[value % 10];
        this.type = piece_type(this.piece);
        if(value > 10) this.color = "black";
        else if(value === 0) return;
        else this.color = "white";
        console.log(this.color);
    }
    get_path(){
        return this.type.get_path(this.x, this.y, this.color);
    }
    check_move(){
        return;
    }
}

class piece_Pawn{
    get_path(row, col, color){
        if(color === "white"){
            if(row === 6){
                return [[row-1,col],[row-2,col]];
            }else{
                return [[row-1,col]];
            }
        }else{
            if(row === 1){
                return [[row+1,col],[row+2,col]];
            }else{
                return [[row+1,col]];
            }
        }
    }
    check_move(){
        if(move_distance.mF !== 0) return true;
        if(turn){   //white
            if(move_direction.mR > 0 || move_distance.mR > 2) return true;
            if(move_distance.mR === 2 && move[0].mR !== 6 && game_board[5][move[0].mF] !== 0) return true;
        }else{      //black turn
            if(move_direction.mR < 0 || move_distance.mR > 2) return true;
            if(move_distance.mR === 2 && move[0].mR !== 1 && game_board[2][move[0].mF] !== 0) return true;
        }
        return false;
    }
}
class piece_Rook{
    check_move(){
        if(game_board[move[1].mR][move[1].mF] !== 0) return true;
        if(!(move_distance.mR === 0 || move_distance.mF === 0)) return true;
        if(move_distance.mR === 1 || move_distance.mF === 1) return false;

        if(move_distance.mR > move_distance.mF){    //rank move
            for(let i=1;i<move_distance.mR;i++){
                if(move_direction.mR < 0 && game_board[move[0].mR-i][move[0].mF] !== 0) return true;     //move up
                if(move_direction.mR > 0 && game_board[move[0].mR+i][move[0].mF] !== 0) return true;     //move down
            }
        }else{                                      //file move
            for(let i=1;i<move_distance.mF;i++){
                if(move_direction.mF < 0 && game_board[move[0].mR][move[0].mF-i] !== 0) return true;     //move left
                if(move_direction.mF > 0 && game_board[move[0].mR][move[0].mF+i] !== 0) return true;     //move right
            }
        }
        return false;
    }
}
class piece_Knight{
    check_move(){
    if(game_board[move[1].mR][move[1].mF] !== 0) return true;
    return !((move_distance.mR === 1 && move_distance.mF === 2) || (move_distance.mR === 2 && move_distance.mF === 1));
}

}
class piece_Bishop{
    check_move(){
        if(game_board[move[1].mR][move[1].mF] !== 0) return true;
        if(!(move_distance.mR === move_distance.mF)) return true;
        if(move_distance.mR === 1 && move_distance.mF === 1) return false;

        if(move_direction.mR < 0 && move_direction.mF < 0){     //move up left --
            for(let i=1;i<move_distance.mR;i++){
                if(game_board[move[0].mR-i][move[0].mF-i] !== 0) return true;
            }
        }
        if(move_direction.mR > 0 && move_direction.mF > 0){     //move down right ++
            for(let i=1;i<move_distance.mR;i++){
                if(game_board[move[0].mR+i][move[0].mF+i] !== 0) return true;
            }
        }
        if(move_direction.mR < 0 && move_direction.mF > 0){     //move up right -+
            for(let i=1;i<move_distance.mR;i++){
                if(game_board[move[0].mR-i][move[0].mF+i] !== 0) return true;
            }
        }
        if(move_direction.mR > 0 && move_direction.mF < 0){     //move down left +-
            for(let i=1;i<move_distance.mR;i++){
                if(game_board[move[0].mR+i][move[0].mF-i] !== 0) return true;
            }
        }
    }
}
class piece_Queen{
    check_move(){
        if(game_board[move[1].mR][move[1].mF] !== 0) return true;
        if(!(move_distance.mR === 0 || move_distance.mF === 0) && !(move_distance.mR === move_distance.mF)) return true;

        //rook move
        if(move_distance.mR === 0 || move_distance.mF === 0){
            if(move_distance.mR === 1 || move_distance.mF === 1) return false;
            if(move_distance.mR > move_distance.mF){    //rank move
                for(let i=1;i<move_distance.mR;i++){
                    if(move_direction.mR < 0 && game_board[move[0].mR-i][move[0].mF] !== 0) return true;     //move up
                    if(move_direction.mR > 0 && game_board[move[0].mR+i][move[0].mF] !== 0) return true;     //move down
                }
            }else{                                      //file move
                for(let i=1;i<move_distance.mF;i++){
                    if(move_direction.mF < 0 && game_board[move[0].mR][move[0].mF-i] !== 0) return true;     //move left
                    if(move_direction.mF > 0 && game_board[move[0].mR][move[0].mF+i] !== 0) return true;     //move right
                }
            }
        }

        //bishop move
        if(move_distance.mR === move_distance.mF){
            if(move_distance.mR === 1 && move_distance.mF === 1) return false;
            if(move_direction.mR < 0 && move_direction.mF < 0){     //move up left --
                for(let i=1;i<move_distance.mR;i++){
                    if(game_board[move[0].mR-i][move[0].mF-i] !== 0) return true;
                }
            }
            if(move_direction.mR > 0 && move_direction.mF > 0){     //move down right ++
                for(let i=1;i<move_distance.mR;i++){
                    if(game_board[move[0].mR+i][move[0].mF+i] !== 0) return true;
                }
            }
            if(move_direction.mR < 0 && move_direction.mF > 0){     //move up right -+
                for(let i=1;i<move_distance.mR;i++){
                    if(game_board[move[0].mR-i][move[0].mF+i] !== 0) return true;
                }
            }
            if(move_direction.mR > 0 && move_direction.mF < 0){     //move down left +-
                for(let i=1;i<move_distance.mR;i++){
                    if(game_board[move[0].mR+i][move[0].mF-i] !== 0) return true;
                }
            }
        }
        return false;
    }
}
class piece_King{
    check_move(){
        if(game_board[move[1].mR][move[1].mF] !== 0) return true;
        if(!(move_distance.mR <= 1 && move_distance.mF <= 1)) return true;

        //check can move
        let diagonal_distance = [];
        diagonal_distance.push(check_diagonal_distance(move[1].mR, move[1].mF));
        diagonal_distance.push(check_diagonal_distance(move[1].mR, 7-move[1].mF));
        diagonal_distance.push(check_diagonal_distance(7-move[1].mR, move[1].mF));
        diagonal_distance.push(check_diagonal_distance(7-move[1].mR, 7-move[1].mF));

        //  -king-
        if(turn){
            if(move[0].mR > 0 && move[0].mF > 0 && game_board[move[1].mR-1][move[1].mF-1] === 11) return true;
            if(move[0].mR > 0 && game_board[move[1].mR-1][move[1].mF] === 11) return true;
            if(move[0].mR > 0 && move[0].mF < 7 && game_board[move[1].mR-1][move[1].mF+1] === 11) return true;

            if(move[0].mF > 0 && game_board[move[1].mR][move[1].mF-1] === 11) return true;
            if(move[0].mR < 7 && game_board[move[1].mR][move[1].mF+1] === 11) return true;

            if(move[0].mR < 7 && move[0].mF > 0 && game_board[move[1].mR+1][move[1].mF-1] === 11) return true;
            if(move[0].mR < 7 && game_board[move[1].mR+1][move[1].mF] === 11) return true;
            if(move[0].mR < 7 && move[0].mF < 7 && game_board[move[1].mR+1][move[1].mF+1] === 11) return true;
        }else{
            if(move[0].mR > 0 && move[0].mF > 0 && game_board[move[1].mR-1][move[1].mF-1] === 1) return true;
            if(move[0].mR > 0 && game_board[move[1].mR-1][move[1].mF] === 1) return true;
            if(move[0].mR > 0 && move[0].mF < 7 && game_board[move[1].mR-1][move[1].mF+1] === 1) return true;

            if(move[0].mF > 0 && game_board[move[1].mR][move[1].mF-1] === 1) return true;
            if(move[0].mR < 7 && game_board[move[1].mR][move[1].mF+1] === 1) return true;

            if(move[0].mR < 7 && move[0].mF > 0 && game_board[move[1].mR+1][move[1].mF-1] === 1) return true;
            if(move[0].mR < 7 && game_board[move[1].mR+1][move[1].mF] === 1) return true;
            if(move[0].mR < 7 && move[0].mF < 7 && game_board[move[1].mR+1][move[1].mF+1] === 1) return true;
        }
        //  -king-

        //  -queen-
        //  queen rook
        //  up
        for(let i=1;i<=move[1].mR;i++){
            if(game_board[move[1].mR-i][move[1].mF] === 0) continue;
            if(turn && game_board[move[1].mR-i][move[1].mF] === 15) return true;
            else if(!turn && game_board[move[1].mR-i][move[1].mF] === 5) return true;
            else break;
        }
        //  down
        for(let i=1;i<8-move[1].mR;i++){
            if(game_board[move[1].mR+i][move[1].mF] === 0) continue;
            if(turn && game_board[move[1].mR+i][move[1].mF] === 15) return true;
            else if(!turn && game_board[move[1].mR+i][move[1].mF] === 5) return true;
            else break;
        }
        //  left
        for(let i=1;i<=move[1].mF;i++){
            if(game_board[move[1].mR][move[1].mF-i] === 0) continue;
            if(turn && game_board[move[1].mR][move[1].mF-i] === 15) return true;
            else if(!turn && game_board[move[1].mR][move[1].mF-i] === 5) return true;
            else break;
        }
        //  right
        for(let i=1;i<8-move[1].mF;i++){
            if(game_board[move[1].mR][move[1].mF+i] === 0) continue;
            if(turn && game_board[move[1].mR][move[1].mF+i] === 15) return true;
            else if(!turn && game_board[move[1].mR][move[1].mF+i] === 5) return true;
            else break;
        }
        //  queen rook

        //  queen bishop
        //  up left -1, -1
        for(let i=1;i<=diagonal_distance[0];i++){
            if(game_board[move[1].mR-i][move[1].mF-i] === 0) continue;
            if(turn && game_board[move[1].mR-i][move[1].mF-i] === 12) return true;
            else if(!turn && game_board[move[1].mR-i][move[1].mF-i] === 2) return true;
            else break;
        }
        //  up right -1, +1
        for(let i=1;i<=diagonal_distance[1];i++){
            if(game_board[move[1].mR-i][move[1].mF+i] === 0) continue;
            if(turn && game_board[move[1].mR-i][move[1].mF+i] === 12) return true;
            else if(!turn && game_board[move[1].mR-i][move[1].mF+i] === 2) return true;
            else break;
        }
        //  down left +1, -1
        for(let i=1;i<=diagonal_distance[2];i++){
            if(game_board[move[1].mR+i][move[1].mF-i] === 0) continue;
            if(turn && game_board[move[1].mR+i][move[1].mF-i] === 12) return true;
            else if(!turn && game_board[move[1].mR+i][move[1].mF-i] === 2) return true;
            else break;
        }
        //  down right +1, +1
        for(let i=1;i<=diagonal_distance[3];i++){
            if(game_board[move[1].mR+i][move[1].mF+i] === 0) continue;
            if(turn && game_board[move[1].mR+i][move[1].mF+i] === 12) return true;
            else if(!turn && game_board[move[1].mR+i][move[1].mF+i] === 2) return true;
            else break;
        }
        //  queen bishop
        //  -queen-

        //  -rook-
        //  up
        for(let i=1;i<=move[1].mR;i++){
            if(game_board[move[1].mR-i][move[1].mF] === 0) continue;
            if(turn && game_board[move[1].mR-i][move[1].mF] === 15) return true;
            else if(!turn && game_board[move[1].mR-i][move[1].mF] === 5) return true;
            else break;
        }
        //  down
        for(let i=1;i<8-move[1].mR;i++){
            if(game_board[move[1].mR+i][move[1].mF] === 0) continue;
            if(turn && game_board[move[1].mR+i][move[1].mF] === 15) return true;
            else if(!turn && game_board[move[1].mR+i][move[1].mF] === 5) return true;
            else break;
        }
        //  left
        for(let i=1;i<=move[1].mF;i++){
            if(game_board[move[1].mR][move[1].mF-i] === 0) continue;
            if(turn && game_board[move[1].mR][move[1].mF-i] === 15) return true;
            else if(!turn && game_board[move[1].mR][move[1].mF-i] === 5) return true;
            else break;
        }
        //  right
        for(let i=1;i<8-move[1].mF;i++){
            if(game_board[move[1].mR][move[1].mF+i] === 0) continue;
            if(turn && game_board[move[1].mR][move[1].mF+i] === 15) return true;
            else if(!turn && game_board[move[1].mR][move[1].mF+i] === 5) return true;
            else break;
        }
        //  -rook-

        //  -bishop-
        //  up left -1, -1
        for(let i=1;i<=diagonal_distance[0];i++){
            if(game_board[move[1].mR-i][move[1].mF-i] === 0) continue;
            if(turn && game_board[move[1].mR-i][move[1].mF-i] === 13) return true;
            else if(!turn && game_board[move[1].mR-i][move[1].mF-i] === 3) return true;
            else break;
        }
        //  up right -1, +1
        for(let i=1;i<=diagonal_distance[1];i++){
            if(game_board[move[1].mR-i][move[1].mF+i] === 0) continue;
            if(turn && game_board[move[1].mR-i][move[1].mF+i] === 13) return true;
            else if(!turn && game_board[move[1].mR-i][move[1].mF+i] === 3) return true;
            else break;
        }
        //  down left +1, -1
        for(let i=1;i<=diagonal_distance[2];i++){
            if(game_board[move[1].mR+i][move[1].mF-i] === 0) continue;
            if(turn && game_board[move[1].mR+i][move[1].mF-i] === 13) return true;
            else if(!turn && game_board[move[1].mR+i][move[1].mF-i] === 3) return true;
            else break;
        }
        //  down right +1, +1
        for(let i=1;i<=diagonal_distance[3];i++){
            if(game_board[move[1].mR+i][move[1].mF+i] === 0) continue;
            if(turn && game_board[move[1].mR+i][move[1].mF+i] === 13) return true;
            else if(!turn && game_board[move[1].mR+i][move[1].mF+i] === 3) return true;
            else break;
        }
        //  -bishop-

        //  -knight-
        if(turn){
            //top
            if(move[1].mR > 1 && move[1].mF > 0 && game_board[move[1].mR-2][move[1].mF-1] === 14) return true;
            if(move[1].mR > 1 && move[1].mF < 7 && game_board[move[1].mR-2][move[1].mF+1] === 14) return true;
            //left
            if(move[1].mR > 0 && move[1].mF > 1 && game_board[move[1].mR-1][move[1].mF-2] === 14) return true;
            if(move[1].mR < 7 && move[1].mF > 1 && game_board[move[1].mR+1][move[1].mF-2] === 14) return true;
            //right
            if(move[1].mR > 0 && move[1].mF < 6 && game_board[move[1].mR-1][move[1].mF+2] === 14) return true;
            if(move[1].mR > 7 && move[1].mF < 6 && game_board[move[1].mR+1][move[1].mF+2] === 14) return true;
            //bottom
            if(move[1].mR < 6 && move[1].mF > 0 && game_board[move[1].mR+2][move[1].mF-1] === 14) return true;
            if(move[1].mR < 6 && move[1].mF < 7 && game_board[move[1].mR+2][move[1].mF+1] === 14) return true;
        }else{
            //top
            if(move[1].mR > 1 && move[1].mF > 0 && game_board[move[1].mR-2][move[1].mF-1] === 4) return true;
            if(move[1].mR > 1 && move[1].mF < 7 && game_board[move[1].mR-2][move[1].mF+1] === 4) return true;
            //left
            if(move[1].mR > 0 && move[1].mF > 1 && game_board[move[1].mR-1][move[1].mF-2] === 4) return true;
            if(move[1].mR < 7 && move[1].mF > 1 && game_board[move[1].mR+1][move[1].mF-2] === 4) return true;
            //right
            if(move[1].mR > 0 && move[1].mF < 6 && game_board[move[1].mR-1][move[1].mF+2] === 4) return true;
            if(move[1].mR > 7 && move[1].mF < 6 && game_board[move[1].mR+1][move[1].mF+2] === 4) return true;
            //bottom
            if(move[1].mR < 6 && move[1].mF > 0 && game_board[move[1].mR+2][move[1].mF-1] === 4) return true;
            if(move[1].mR < 6 && move[1].mF < 7 && game_board[move[1].mR+2][move[1].mF+1] === 4) return true;
        }
        //  -knight-

        //  -pawn-
        if(turn){   //white
            if(game_board[move[1].mR-1][move[1].mF-1] === 16 || game_board[move[1].mR-1][move[1].mF+1] === 16) return true;
        }else{      //black
            if(game_board[move[1].mR+1][move[1].mF-1] === 6 || game_board[move[1].mR+1][move[1].mF+1] === 6) return true;
        }
        //  -pawn-
        return false;
    }
}

function king_check(color){
    if(color === "white"){
        // white king loc
        let king_cell;
        game_board.forEach((line)=>{
            line.forEach((cell)=>{
                if(cell.value === 1) king_cell = cell;
            });
        });

        let diagonal_distance = [];
        diagonal_distance.push(check_diagonal_distance(king_cell.x, king_cell.y));
        diagonal_distance.push(check_diagonal_distance(king_cell.x, 7-king_cell.y));
        diagonal_distance.push(check_diagonal_distance(7-king_cell.x, king_cell.y));
        diagonal_distance.push(check_diagonal_distance(7-king_cell.x, 7-king_cell.y));

        // Pawn check
        if(king_cell.x > 0 && king_cell.y > 0 && game_board[king_cell.x-1][king_cell.y-1].value === 16) {console.log("P check"); return;}
        if(king_cell.x > 0 && king_cell.y < 7 && game_board[king_cell.x-1][king_cell.y+1].value === 16) {console.log("P check"); return;}

        // Knight check
        //  top
        if(king_cell.x > 1 && king_cell.y > 0 && game_board[king_cell.x-2][king_cell.y-1].value === 14) {console.log("N check"); return;}
        if(king_cell.x > 1 && king_cell.y < 7 && game_board[king_cell.x-2][king_cell.y+1].value === 14) {console.log("N check"); return;}
        //  left
        if(king_cell.x > 0 && king_cell.y > 1 && game_board[king_cell.x-1][king_cell.y-2].value === 14) {console.log("N check"); return;}
        if(king_cell.x < 7 && king_cell.y > 1 && game_board[king_cell.x+1][king_cell.y-2].value === 14) {console.log("N check"); return;}
        //  right
        if(king_cell.x > 0 && king_cell.y < 6 && game_board[king_cell.x-1][king_cell.y+2].value === 14) {console.log("N check"); return;}
        if(king_cell.x > 7 && king_cell.y < 6 && game_board[king_cell.x+1][king_cell.y+2].value === 14) {console.log("N check"); return;}
        //  bottom
        if(king_cell.x < 6 && king_cell.y > 0 && game_board[king_cell.x+2][king_cell.y-1].value === 14) {console.log("N check"); return;}
        if(king_cell.x < 6 && king_cell.y < 7 && game_board[king_cell.x+2][king_cell.y+1].value === 14) {console.log("N check"); return;}

        // Bishop check
        //  up left -1, -1
        for(let i=1;i<=diagonal_distance[0];i++){
            if(game_board[king_cell.x-i][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y-i].value === 13) {console.log("B check"); return;}
            else break;
        }
        //  up right -1, +1
        for(let i=1;i<=diagonal_distance[1];i++){
            if(game_board[king_cell.x-i][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y+i].value === 13) {console.log("B check"); return;}
            else break;
        }
        //  down left +1, -1
        for(let i=1;i<=diagonal_distance[2];i++){
            if(game_board[king_cell.x+i][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y-i].value === 13) {console.log("B check"); return;}
            else break;
        }
        //  down right +1, +1
        for(let i=1;i<=diagonal_distance[3];i++){
            if(game_board[king_cell.x+i][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y+i].value === 13) {console.log("B check"); return;}
            else break;
        }

        // Rook check
        //  up
        for(let i=1;i<=king_cell.x;i++){
            if(game_board[king_cell.x-i][king_cell.y].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y].value === 15) {console.log("R check"); return;}
            else break;
        }
        //  down
        for(let i=1;i<8-king_cell.x;i++){
            if(game_board[king_cell.x+i][king_cell.y].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y].value === 15) {console.log("R check"); return;}
            else break;
        }
        //  left
        for(let i=1;i<=king_cell.y;i++){
            if(game_board[king_cell.x][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x][king_cell.y-i].value === 15) {console.log("R check"); return;}
            else break;
        }
        //  right
        for(let i=1;i<8-king_cell.y;i++){
            if(game_board[king_cell.x][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x][king_cell.y+i].value === 15) {console.log("R check"); return;}
            else break;
        }

        // Queen check
        //  Queen - Bishop
        //  up left -1, -1
        for(let i=1;i<=diagonal_distance[0];i++){
            if(game_board[king_cell.x-i][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y-i].value === 12) {console.log("Q check"); return;}
            else break;
        }
        //  up right -1, +1
        for(let i=1;i<=diagonal_distance[1];i++){
            if(game_board[king_cell.x-i][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y+i].value === 12) {console.log("Q check"); return;}
            else break;
        }
        //  down left +1, -1
        for(let i=1;i<=diagonal_distance[2];i++){
            if(game_board[king_cell.x+i][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y-i].value === 12) {console.log("Q check"); return;}
            else break;
        }
        //  down right +1, +1
        for(let i=1;i<=diagonal_distance[3];i++){
            if(game_board[king_cell.x+i][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y+i].value === 12) {console.log("Q check"); return;}
            else break;
        }
        // Queen - Rook
        //  up
        for(let i=1;i<=king_cell.x;i++){
            if(game_board[king_cell.x-i][king_cell.y].value === 0) continue;
            if(game_board[king_cell.x-i][king_cell.y].value === 12) {console.log("Q check"); return;}
            else break;
        }
        //  down
        for(let i=1;i<8-king_cell.x;i++){
            if(game_board[king_cell.x+i][king_cell.y].value === 0) continue;
            if(game_board[king_cell.x+i][king_cell.y].value === 12) {console.log("Q check"); return;}
            else break;
        }
        //  left
        for(let i=1;i<=king_cell.y;i++){
            if(game_board[king_cell.x][king_cell.y-i].value === 0) continue;
            if(game_board[king_cell.x][king_cell.y-i].value === 12) {console.log("Q check"); return;}
            else break;
        }
        //  right
        for(let i=1;i<8-king_cell.y;i++){
            if(game_board[king_cell.x][king_cell.y+i].value === 0) continue;
            if(game_board[king_cell.x][king_cell.y+i].value === 12) {console.log("Q check"); return;}
            else break;
        }

    }else {
        // black king loc
        let king_cell;
        game_board.forEach((line) => {
            line.forEach((cell) => {
                if (cell.value === 11) king_cell = cell;
            });
        });

        let diagonal_distance = [];
        diagonal_distance.push(check_diagonal_distance(king_cell.x, king_cell.y));
        diagonal_distance.push(check_diagonal_distance(king_cell.x, 7 - king_cell.y));
        diagonal_distance.push(check_diagonal_distance(7 - king_cell.x, king_cell.y));
        diagonal_distance.push(check_diagonal_distance(7 - king_cell.x, 7 - king_cell.y));

        // Pawn check
        if (king_cell.x < 7 && king_cell.y > 0 && game_board[king_cell.x+1][king_cell.y-1].value === 6) {console.log("P check");return;}
        if (king_cell.x < 7 && king_cell.y < 7 && game_board[king_cell.x+1][king_cell.y+1].value === 6) {console.log("P check");return;}

        // Knight check
        //  top
        if (king_cell.x > 1 && king_cell.y > 0 && game_board[king_cell.x-2][king_cell.y-1].value === 4) {console.log("N check");return;}
        if (king_cell.x > 1 && king_cell.y < 7 && game_board[king_cell.x-2][king_cell.y+1].value === 4) {console.log("N check");return;}
        //  left
        if (king_cell.x > 0 && king_cell.y > 1 && game_board[king_cell.x-1][king_cell.y-2].value === 4) {console.log("N check");return;}
        if (king_cell.x < 7 && king_cell.y > 1 && game_board[king_cell.x+1][king_cell.y-2].value === 4) {console.log("N check");return;}
        //  right
        if (king_cell.x > 0 && king_cell.y < 6 && game_board[king_cell.x-1][king_cell.y+2].value === 4) {console.log("N check");return;}
        if (king_cell.x > 7 && king_cell.y < 6 && game_board[king_cell.x+1][king_cell.y+2].value === 4) {console.log("N check");return;}
        //  bottom
        if (king_cell.x < 6 && king_cell.y > 0 && game_board[king_cell.x+2][king_cell.y-1].value === 4) {console.log("N check");return;}
        if (king_cell.x < 6 && king_cell.y < 7 && game_board[king_cell.x+2][king_cell.y+1].value === 4) {console.log("N check");return;}

        // Bishop check
        //  up left -1, -1
        for (let i = 1; i <= diagonal_distance[0]; i++) {
            if (game_board[king_cell.x - i][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y - i].value === 3) {console.log("B check");return;}
            else break;
        }
        //  up right -1, +1
        for (let i = 1; i <= diagonal_distance[1]; i++) {
            if (game_board[king_cell.x - i][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y + i].value === 3) {console.log("B check");return;}
            else break;
        }
        //  down left +1, -1
        for (let i = 1; i <= diagonal_distance[2]; i++) {
            if (game_board[king_cell.x + i][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y - i].value === 3) {console.log("B check");return;}
            else break;
        }
        //  down right +1, +1
        for (let i = 1; i <= diagonal_distance[3]; i++) {
            if (game_board[king_cell.x + i][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y + i].value === 3) {console.log("B check");return;}
            else break;
        }

        // Rook check
        //  up
        for (let i = 1; i <= king_cell.x; i++) {
            if (game_board[king_cell.x - i][king_cell.y].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y].value === 5) {console.log("R check");return;}
            else break;
        }
        //  down
        for (let i = 1; i < 8 - king_cell.x; i++) {
            if (game_board[king_cell.x + i][king_cell.y].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y].value === 5) {console.log("R check");return;}
            else break;
        }
        //  left
        for (let i = 1; i <= king_cell.y; i++) {
            if (game_board[king_cell.x][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x][king_cell.y - i].value === 5) {console.log("R check");return;}
            else break;
        }
        //  right
        for (let i = 1; i < 8 - king_cell.y; i++) {
            if (game_board[king_cell.x][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x][king_cell.y + i].value === 5) {console.log("R check");return;}
            else break;
        }

        // Queen check
        //  Queen - Bishop
        //  up left -1, -1
        for (let i = 1; i <= diagonal_distance[0]; i++) {
            if (game_board[king_cell.x - i][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y - i].value === 2) {console.log("Q check");return;}
            else break;
        }
        //  up right -1, +1
        for (let i = 1; i <= diagonal_distance[1]; i++) {
            if (game_board[king_cell.x - i][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y + i].value === 2) {console.log("Q check");return;}
            else break;
        }
        //  down left +1, -1
        for (let i = 1; i <= diagonal_distance[2]; i++) {
            if (game_board[king_cell.x + i][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y - i].value === 2) {console.log("Q check");return;}
            else break;
        }
        //  down right +1, +1
        for (let i = 1; i <= diagonal_distance[3]; i++) {
            if (game_board[king_cell.x + i][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y + i].value === 2) {console.log("Q check");return;}
            else break;
        }
        // Queen - Rook
        //  up
        for (let i = 1; i <= king_cell.x; i++) {
            if (game_board[king_cell.x - i][king_cell.y].value === 0) continue;
            if (game_board[king_cell.x - i][king_cell.y].value === 2) {console.log("Q check");return;}
            else break;
        }
        //  down
        for (let i = 1; i < 8 - king_cell.x; i++) {
            if (game_board[king_cell.x + i][king_cell.y].value === 0) continue;
            if (game_board[king_cell.x + i][king_cell.y].value === 2) {console.log("Q check");return;}
            else break;
        }
        //  left
        for (let i = 1; i <= king_cell.y; i++) {
            if (game_board[king_cell.x][king_cell.y - i].value === 0) continue;
            if (game_board[king_cell.x][king_cell.y - i].value === 2) {console.log("Q check");return;}
            else break;
        }
        //  right
        for (let i = 1; i < 8 - king_cell.y; i++) {
            if (game_board[king_cell.x][king_cell.y + i].value === 0) continue;
            if (game_board[king_cell.x][king_cell.y + i].value === 2) {console.log("Q check");return;}
            else break;
        }
    }
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

game_board.forEach((line,x)=>{
    line.forEach((cell,y)=>{
        game_board[x][y] = new board_cell(x*8+y, x, y, game_board[x][y]);
    });
});

function add_table() {
    let temp_table = "";
    let temp_color = true;
    for (let rows = 0; rows < 8; rows++) {
        let line = "<div class='line'>";
        for (let cols = 0; cols < 8; cols++) {
            if (temp_color) {
                line += "<div class='cell white' draggable='true'></div>";
            } else {
                line += "<div class='cell black' draggable='true'></div>";
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
    chess_board_E.innerHTML = temp_table;
    cells = document.querySelectorAll(".cell");
}

function update_notation_table(){
    notation_table_E.innerHTML = "";
    for(let i=0;i<notation.length;i++){

        let temp = `<tr>
        <td class="notation_count">${i+1}</td>
        <td class="notation_white">${notation[i][0]}</td>
        <td class="notation_black">${notation[i][1]}</td>
        </tr>`;
        notation_table_E.innerHTML += temp;
    }
}

function find_cell_by_index(index){
    for(let i of game_board){
        for(let j of i){
            if(j.index === index) return j;
        }
    }
}

function update_chess_board(){
    cells.forEach((cell,i)=> {
        let index = find_cell_by_index(i).value;

        // change to image
        if (index > 10) {
            cell.innerHTML = `${piece_code[index - 10]}`;
            cell.style.color = "black";
        }else if(index === 0){
            cell.innerHTML = '';
        }else{
            cell.innerHTML = `${piece_code[index]}`;
            cell.style.color = "white";
        }
    });
}

function show_path(cell){
    let path_list = cell.get_path();
    path_list.forEach((path)=>{
        cells[game_board[path[0]][path[1]].index].innerHTML = "<div class='path'></div>";
    });

}

function add_piece_event(){
    cells.forEach((cell,i)=>{
        cell.addEventListener("click",()=>{
            if(isSelected){
                isSelected = false;
                move.push({mR:parseInt(i/8), mF:parseInt(i%8)});
                move_direction = {mR:move[1].mR - move[0].mR, mF:move[1].mF - move[0].mF};
                move_distance = {mR:Math.abs(move_direction.mR), mF:Math.abs(move_direction.mF)};

            }else{
                isSelected = true;
                update_chess_board();
                move = [{mR:parseInt(i/8), mF:parseInt(i%8)}];
                let select = game_board[move[0].mR][move[0].mF];
                move_piece = select.piece;
                show_path(select);
            }
        });

        cell.addEventListener("dragstart",()=>{
            move = [{mR:parseInt(i/8), mF:parseInt(i%8)}];
            move_piece = game_board[move[0].mR][move[0].mF].piece;
            isMoved = false;
        });

        cell.addEventListener("dragover",(e)=>{
            e.preventDefault();
        });
        cell.addEventListener("drop",(e)=>{
            e.preventDefault();

            if(isMoved)return;
            isMoved = true;
            isTake = false;

            move.push({mR:parseInt(i/8), mF:parseInt(i%8)});
            move_direction = {mR:move[1].mR - move[0].mR, mF:move[1].mF - move[0].mF};
            move_distance = {mR:Math.abs(move_direction.mR), mF:Math.abs(move_direction.mF)};

            // not piece
            if(move_piece === 0) return;
            // not turn
            if((turn && move_piece > 10) || (!turn && move_piece < 10)){
                console.log("it's not your turn");
                return;
            }
            // not move
            if(move[0].mR === move[1].mR && move[0].mF === move[1].mF) return;
            // not empty -> enemy take
            if(turn && game_board[move[1].mR][move[1].mF] > 10){    //white takes black
                isTake = true;
            }else if(!turn && game_board[move[1].mR][move[1].mF] < 10 && game_board[move[1].mR][move[1].mF] !== 0) {  //black takes white
                isTake = true;
            }

            //check can move
            switch(parseInt(move_piece%10)){
                case 1:     //K
                    //castling
                    if(turn){
                        if(!isCheck && !isKingMoved[0]){
                            //king side castling
                            if(move[1].mR === 7 && (move[1].mF === 6 || move[1].mF === 7) && game_board[7][5] === 0 && game_board[7][6] === 0 && game_board[7][7] === 5){
                                game_board[7][6] = 1;
                                game_board[7][5] = 5;
                                game_board[7][4] = 0;
                                game_board[7][7] = 0;
                                update_chess_board();
                                notation.push(["O-O",""]);
                                update_notation_table();
                                turn = !turn;
                                isKingMoved[0] = true;
                                return;
                            //queen side castling
                            }else if(move[1].mR === 7 && (move[1].mF === 0 || move[1].mF === 1 || move[1].mF === 2) && game_board[7][1] === 0 && game_board[7][2] === 0 && game_board[7][3] === 0){
                                game_board[7][2] = 1;
                                game_board[7][3] = 5;
                                game_board[7][0] = 0;
                                game_board[7][4] = 0;
                                update_chess_board();
                                notation.push(["O-O-O",""]);
                                update_notation_table();
                                turn = !turn;
                                isKingMoved[0] = true;
                                return;
                            }
                        }
                    }else{
                        if(!isCheck && !isKingMoved[1]){
                            //king side castling
                            if(move[1].mR === 0 && (move[1].mF === 6 || move[1].mF === 7) && game_board[0][5] === 0 && game_board[0][6] === 0 ){
                                game_board[0][6] = 11;
                                game_board[0][5] = 15;
                                game_board[0][4] = 0;
                                game_board[0][7] = 0;
                                update_chess_board();
                                notation[notation.length-1][1] = "O-O";
                                update_notation_table();
                                turn = !turn;
                                isKingMoved[1] = true;
                                return;
                                //queen side castling
                            }else if(move[1].mR === 0 && (move[1].mF === 0 || move[1].mF === 1 || move[1].mF === 2)&& game_board[0][1] === 0 && game_board[0][2] === 0 && game_board[0][3] === 0){
                                game_board[0][2] = 11;
                                game_board[0][3] = 15;
                                game_board[0][0] = 0;
                                game_board[0][4] = 0;
                                update_chess_board();
                                notation[notation.length-1][1] = "O-O-O";
                                update_notation_table();
                                turn = !turn;
                                isKingMoved[1] = true;
                                return;
                            }
                        }
                    }
                    if(check_king()) return;
                    if(turn) isKingMoved[0] = true;
                    else isKingMoved[1] = true;
                    break;
                case 2:     //Q
                    if(check_queen()) return;
                    break;
                case 3:     //B
                    if(check_bishop()) return;
                    break;
                case 4:     //N
                    if(check_knight()) return;
                    break;
                case 5:     //R
                    if(check_rook()) return;
                    break;
                case 6:     //P
                    if(check_pawn()) return;
                    break;
            }
            //check can move

            //move
            game_board[move[0].mR][move[0].mF] = 0;
            game_board[move[1].mR][move[1].mF] = move_piece;
            update_chess_board();
            //move

            //update notation
            let move_piece_code = piece_code[parseInt(move_piece%10)];
            let move_code;

            if(isTake){
                if(move_piece_code === piece_code[6]) move_piece_code = file_char[move[0].mF];
                move_code = move_piece_code + "x" + file_char[move[1].mF] + Math.abs(8 - move[1].mR);
            }else{
                if(move_piece_code === piece_code[6]) move_piece_code = '';
                move_code = move_piece_code + file_char[move[1].mF] + Math.abs(8 - move[1].mR);
            }

            if(turn){
                notation.push([move_code,""]);
            }else{
                notation[notation.length-1][1] = move_code;
            }
            update_notation_table();
            //update notation

            turn = !turn;
        });
    });
}

function check_diagonal_distance(a,b){
    if(a < b) return a;
    else if(a > b) return b;
    else return a;
}

window.onload = ()=>{
    add_table();
    update_chess_board();
    add_piece_event();

    move_btn_E.addEventListener("click", ()=>{
        let move_input = move_input_E.value;
        if(move_input){
            if(turn){
                notation.push([move_input,""]);
            }else{
                notation[notation.length-1][1] = move_input;
            }
            move_input_E.value = "";
            update_notation_table();
            turn = !turn;
        }
    });

    console.log("window loaded");
};